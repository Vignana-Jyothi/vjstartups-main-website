const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

router.use(express.json());

const attachFallbackData = async (notifications) => {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return notifications;
  }

  try {
    const existingAvatarByEmail = new Map(
      notifications
        .filter((notification) => notification.userEmail && notification.userAvatar)
        .map((notification) => [String(notification.userEmail).toLowerCase(), notification.userAvatar])
    );

    const needsFallbackEmails = [...new Set(
      notifications
        .filter((notification) => notification.userEmail && (!notification.ideaId || !notification.userAvatar))
        .map((notification) => notification.userEmail)
    )];

    if (needsFallbackEmails.length === 0) {
      return notifications;
    }

    // Get latest idea data for fallback using raw SQL for complex aggregation
    const latestDataByEmail = await prisma.$queryRaw`
      SELECT DISTINCT ON (i."addedByEmail")
        i."addedByEmail" as email,
        i."ideaId",
        i.title as "ideaTitle",
        (
          SELECT json_build_object('image', itm.image)
          FROM idea_team_members itm
          WHERE itm."ideaId" = i.id
          ORDER BY itm."createdAt" ASC
          LIMIT 1
        ) as "teamImage"
      FROM ideas i
      WHERE i."addedByEmail" = ANY(${needsFallbackEmails})
      ORDER BY i."addedByEmail", i."createdAt" DESC
    `;

    const fallbackDataMap = new Map(
      latestDataByEmail.map((idea) => [
        String(idea.email).toLowerCase(),
        {
          ideaId: idea.ideaId,
          ideaTitle: idea.ideaTitle,
          imageUrl: idea.teamImage?.image
        }
      ])
    );

    return notifications.map((notification) => {
      const emailKey = String(notification.userEmail || '').toLowerCase();
      const fallbackData = fallbackDataMap.get(emailKey);
      const finalAvatar =
        notification.userAvatar ||
        existingAvatarByEmail.get(emailKey) ||
        fallbackData?.imageUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.userName || 'User')}&size=32`;
      
      if (!fallbackData) {
        return {
          ...notification,
          userAvatar: finalAvatar
        };
      }

      return {
        ...notification,
        ideaId: notification.ideaId || fallbackData.ideaId,
        ideaTitle: notification.ideaTitle || fallbackData.ideaTitle || 'Untitled Idea',
        userAvatar: finalAvatar
      };
    });
  } catch (error) {
    console.error('Error attaching fallback data:', error);
    return notifications;
  }
};

const enrichAvatarWithUserPicture = async (notifications) => {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return notifications;
  }

  try {
    // Find emails needing avatar enrichment
    const needsAvatarEmails = [...new Set(
      notifications
        .filter((notif) => notif.userEmail && !notif.userAvatar)
        .map((notif) => String(notif.userEmail).toLowerCase())
    )];

    if (needsAvatarEmails.length === 0) {
      return notifications;
    }

    // Query User collection for stored Google pictures
    const userPictures = await prisma.user.findMany({
      where: {
        email: { in: needsAvatarEmails }
      },
      select: { email: true, picture: true }
    });

    const pictureMap = new Map(userPictures.map((u) => [String(u.email).toLowerCase(), u.picture]));

    // Update notifications with user pictures
    return notifications.map((notif) => {
      if (notif.userAvatar) {
        return notif;
      }
      const userPicture = pictureMap.get(String(notif.userEmail || '').toLowerCase());
      if (userPicture) {
        return {
          ...notif,
          userAvatar: userPicture
        };
      }
      return notif;
    });
  } catch (error) {
    console.error('Error enriching avatar with user picture:', error);
    return notifications;
  }
};

// Get recent stage notifications with pagination
router.get('/stage-notifications', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    const userEmail = req.query.userEmail;

    const where = {};
    if (userEmail) {
      where.userEmail = userEmail;
    }

    const [notifications, total] = await Promise.all([
      prisma.stageNotification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip
      }),
      prisma.stageNotification.count({ where })
    ]);

    // Convert to plain objects and lowercase enums
    let notificationsPlain = notifications.map(n => ({
      ...n,
      stageType: n.stageType.toLowerCase()
    }));

    let notificationsWithFallback = await attachFallbackData(notificationsPlain);
    notificationsWithFallback = await enrichAvatarWithUserPicture(notificationsWithFallback);

    res.json({
      notifications: notificationsWithFallback,
      total,
      hasMore: total > skip + notifications.length
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: "Error fetching notifications", error: err.message });
  }
});

// Get notifications for a specific idea
router.get('/stage-notifications/idea/:ideaId', async (req, res) => {
  try {
    const notifications = await prisma.stageNotification.findMany({
      where: { ideaId: req.params.ideaId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Convert enums to lowercase for frontend
    const notificationsResponse = notifications.map(n => ({
      ...n,
      stageType: n.stageType.toLowerCase()
    }));

    res.json(notificationsResponse);
  } catch (err) {
    console.error('Error fetching idea notifications:', err);
    res.status(500).json({ message: "Error fetching idea notifications", error: err.message });
  }
});

// Get notification statistics
router.get('/stage-notifications/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [todayCount, weekCount, totalCount, recentNotificationsRaw] = await Promise.all([
      prisma.stageNotification.count({ where: { createdAt: { gte: today } } }),
      prisma.stageNotification.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.stageNotification.count(),
      prisma.stageNotification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    let recentNotifications = recentNotificationsRaw.map(n => ({
      ...n,
      stageType: n.stageType.toLowerCase()
    }));

    recentNotifications = await attachFallbackData(recentNotifications);
    recentNotifications = await enrichAvatarWithUserPicture(recentNotifications);
    
    const recentAvatarByEmail = new Map(
      recentNotifications
        .filter((notification) => notification.userEmail && notification.userAvatar)
        .map((notification) => [String(notification.userEmail).toLowerCase(), notification.userAvatar])
    );

    // Get top contributors using groupBy
    const topContributorsRaw = await prisma.$queryRaw`
      SELECT 
        "userEmail" as email,
        "userName",
        "userAvatar",
        MAX("previousStage") as "stagesCompleted",
        MAX("newStage") as "latestStage"
      FROM stage_notifications
      GROUP BY "userEmail", "userName", "userAvatar"
      ORDER BY "stagesCompleted" DESC
      LIMIT 10
    `;

    const contributorEmails = topContributorsRaw
      .map((contributor) => String(contributor.email || '').toLowerCase())
      .filter(Boolean);

    const contributorProfiles = await prisma.user.findMany({
      where: { email: { in: contributorEmails } },
      select: { email: true, picture: true }
    });

    const contributorPictureMap = new Map(
      contributorProfiles.map((profile) => [String(profile.email).toLowerCase(), profile.picture])
    );

    res.json({
      todayCount,
      weekCount,
      totalCount,
      recentNotifications: recentNotifications.map(notif => ({
        userName: notif.userName,
        userAvatar: notif.userAvatar,
        stageName: notif.stageName,
        stageType: notif.stageType,
        completedAt: notif.createdAt,
        ideaTitle: notif.ideaTitle,
        ideaId: notif.ideaId
      })),
      topContributors: topContributorsRaw.map((contributor, index) => ({
        name: contributor.userName,
        email: contributor.email,
        avatar:
          contributor.userAvatar ||
          recentAvatarByEmail.get(String(contributor.email || '').toLowerCase()) ||
          contributorPictureMap.get(String(contributor.email || '').toLowerCase()) ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.userName || 'User')}&size=32`,
        stagesCompleted: Number(contributor.stagesCompleted),
        badgeType: index === 0 ? 'founder' : index < 3 ? 'innovator' : 'pioneer'
      }))
    });
  } catch (err) {
    console.error('Error fetching notification stats:', err);
    res.status(500).json({ message: "Error fetching notification stats", error: err.message });
  }
});

// Get full leaderboard (all users ordered by stages completed)
router.get('/stage-notifications/leaderboard', async (req, res) => {
  try {
    const leaderboardRaw = await prisma.$queryRaw`
      SELECT 
        "userEmail" as email,
        "userName",
        "userAvatar",
        MAX("previousStage") as "stagesCompleted",
        MAX("createdAt") as "lastActivityAt"
      FROM stage_notifications
      GROUP BY "userEmail", "userName", "userAvatar"
      ORDER BY "stagesCompleted" DESC, "lastActivityAt" DESC
    `;

    const leaderboardEmails = leaderboardRaw
      .map((entry) => String(entry.email || '').toLowerCase())
      .filter(Boolean);

    const leaderboardProfiles = await prisma.user.findMany({
      where: { email: { in: leaderboardEmails } },
      select: { email: true, picture: true }
    });

    const leaderboardPictureMap = new Map(
      leaderboardProfiles.map((profile) => [String(profile.email).toLowerCase(), profile.picture])
    );

    const rankedLeaderboard = leaderboardRaw.map((entry, index) => ({
      rank: index + 1,
      email: entry.email,
      name: entry.userName || entry.email,
      avatar:
        entry.userAvatar ||
        leaderboardPictureMap.get(String(entry.email || '').toLowerCase()) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.userName || 'User')}&size=32`,
      stagesCompleted: Number(entry.stagesCompleted),
      lastActivityAt: entry.lastActivityAt,
      badgeType: index === 0 ? 'founder' : index < 3 ? 'innovator' : 'pioneer'
    }));

    res.json({ leaderboard: rankedLeaderboard, totalUsers: rankedLeaderboard.length });
  } catch (err) {
    console.error('Error fetching full leaderboard:', err);
    res.status(500).json({ message: 'Error fetching leaderboard', error: err.message });
  }
});

// Create a stage notification (internal use)
router.post('/stage-notifications', async (req, res) => {
  try {
    const {
      ideaId,
      ideaTitle,
      userEmail,
      userName,
      userAvatar,
      previousStage,
      newStage,
      stageName,
      stageType
    } = req.body;

    let resolvedIdeaId = ideaId;
    let resolvedIdeaTitle = ideaTitle;
    let resolvedUserAvatar = userAvatar;

    if (userEmail) {
      const normalizedEmail = String(userEmail).toLowerCase();

      // Upsert user data if provided
      if (userName || userAvatar) {
        await prisma.user.upsert({
          where: { email: normalizedEmail },
          update: {
            ...(userName ? { name: userName } : {}),
            ...(userAvatar ? { picture: userAvatar } : {}),
            updatedAt: new Date()
          },
          create: {
            email: normalizedEmail,
            name: userName || null,
            picture: userAvatar || null
          }
        });
      }

      // Get user avatar if not provided
      if (!resolvedUserAvatar) {
        const existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          select: { picture: true }
        });

        if (existingUser?.picture) {
          resolvedUserAvatar = existingUser.picture;
        }
      }
    }

    // Resolve ideaId from user's latest idea if not provided
    if (!resolvedIdeaId && userEmail) {
      const latestUserIdea = await prisma.idea.findFirst({
        where: { addedByEmail: userEmail },
        orderBy: { createdAt: 'desc' },
        select: { ideaId: true, title: true }
      });

      if (latestUserIdea?.ideaId) {
        resolvedIdeaId = latestUserIdea.ideaId;
        resolvedIdeaTitle = resolvedIdeaTitle || latestUserIdea.title;
      }
    }

    // Set expiry date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Deduplicate: delete recent notifications for same user/idea/stage
    const oneMinuteAgo = new Date(Date.now() - 60000);
    
    const dedupeWhere = {
      userEmail,
      createdAt: { gte: oneMinuteAgo }
    };

    if (resolvedIdeaId) {
      dedupeWhere.ideaId = resolvedIdeaId;
    } else if (stageName) {
      dedupeWhere.stageName = stageName;
    }

    await prisma.stageNotification.deleteMany({
      where: dedupeWhere
    });

    // Create notification
    const notificationData = {
      userEmail,
      userName,
      userAvatar: resolvedUserAvatar || '',
      previousStage,
      newStage,
      stageName,
      stageType: (stageType || 'idea').toUpperCase(), // Convert to enum format
      expiresAt
    };

    if (resolvedIdeaId) {
      notificationData.ideaId = resolvedIdeaId;
    }
    if (resolvedIdeaTitle) {
      notificationData.ideaTitle = resolvedIdeaTitle;
    }

    const notification = await prisma.stageNotification.create({
      data: notificationData
    });

    // Convert enum to lowercase for response
    const notificationResponse = {
      ...notification,
      stageType: notification.stageType.toLowerCase()
    };

    res.status(201).json(notificationResponse);
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ message: "Error creating notification", error: err.message });
  }
});

// Delete old notifications (cleanup endpoint)
router.delete('/stage-notifications/cleanup', async (req, res) => {
  try {
    const daysOld = parseInt(req.query.days) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.stageNotification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    });

    res.json({
      message: `Deleted ${result.count} notifications older than ${daysOld} days`,
      deletedCount: result.count
    });
  } catch (err) {
    console.error('Error cleaning up notifications:', err);
    res.status(500).json({ message: "Error cleaning up notifications", error: err.message });
  }
});

module.exports = router;
