const express = require('express');
const router = express.Router();
const StageNotification = require('../models/StageNotifications');
const Idea = require('../models/Ideas');

const User = require('../models/User');

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

    const latestDataByEmail = await Idea.aggregate([
      { $match: { addedByEmail: { $in: needsFallbackEmails } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$addedByEmail',
          ideaId: { $first: '$ideaId' },
          ideaTitle: { $first: '$title' },
          teamImage: { $first: '$team' }
        }
      }
    ]);

    const fallbackDataMap = new Map(
      latestDataByEmail.map((idea) => [
        String(idea._id).toLowerCase(),
        {
          ideaId: idea.ideaId,
          ideaTitle: idea.ideaTitle,
          imageUrl: idea.teamImage?.[0]?.image
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

// Get recent stage notifications with pagination
router.get('/stage-notifications', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    const userEmail = req.query.userEmail;

    let query = {};
    if (userEmail) {
      query.userEmail = userEmail;
    }

    const notifications = await StageNotification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    let notificationsWithFallback = await attachFallbackData(notifications);
    notificationsWithFallback = await enrichAvatarWithUserPicture(notificationsWithFallback);
    const total = await StageNotification.countDocuments(query);

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
    const userPictures = await User.find(
      { email: { $in: needsAvatarEmails } },
      { email: 1, picture: 1 }
    ).lean();

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

// Get notifications for a specific idea
router.get('/stage-notifications/idea/:ideaId', async (req, res) => {
  try {
    const notifications = await StageNotification.find({ ideaId: req.params.ideaId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(notifications);
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
      StageNotification.countDocuments({ createdAt: { $gte: today } }),
      StageNotification.countDocuments({ createdAt: { $gte: weekAgo } }),
      StageNotification.countDocuments(),
      StageNotification.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
    ]);

  let recentNotifications = await attachFallbackData(recentNotificationsRaw);
  recentNotifications = await enrichAvatarWithUserPicture(recentNotifications);
  const recentAvatarByEmail = new Map(
    recentNotifications
      .filter((notification) => notification.userEmail && notification.userAvatar)
      .map((notification) => [String(notification.userEmail).toLowerCase(), notification.userAvatar])
  );

    // Get top contributors (users with most stage changes)
    const topContributors = await StageNotification.aggregate([
      {
        $group: {
          _id: '$userEmail',
          userName: { $first: '$userName' },
          userAvatar: { $first: '$userAvatar' },
          stagesCompleted: { $max: '$previousStage' },
          latestStage: { $max: '$newStage' }
        }
      },
      { $sort: { stagesCompleted: -1 } },
      { $limit: 10 }
    ]);

    const contributorEmails = topContributors
      .map((contributor) => String(contributor._id || '').toLowerCase())
      .filter(Boolean);

    const contributorProfiles = await User.find(
      { email: { $in: contributorEmails } },
      { email: 1, picture: 1, _id: 0 }
    ).lean();

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
      topContributors: topContributors.map((contributor, index) => ({
        name: contributor.userName,
        email: contributor._id,
        avatar:
          contributor.userAvatar ||
          recentAvatarByEmail.get(String(contributor._id || '').toLowerCase()) ||
          contributorPictureMap.get(String(contributor._id || '').toLowerCase()) ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.userName || 'User')}&size=32`,
        stagesCompleted: contributor.stagesCompleted,
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
    const leaderboard = await StageNotification.aggregate([
      {
        $group: {
          _id: '$userEmail',
          userName: { $first: '$userName' },
          userAvatar: { $first: '$userAvatar' },
          stagesCompleted: { $max: '$previousStage' },
          lastActivityAt: { $max: '$createdAt' }
        }
      },
      { $sort: { stagesCompleted: -1, lastActivityAt: -1 } }
    ]);

    const leaderboardEmails = leaderboard
      .map((entry) => String(entry._id || '').toLowerCase())
      .filter(Boolean);

    const leaderboardProfiles = await User.find(
      { email: { $in: leaderboardEmails } },
      { email: 1, picture: 1, _id: 0 }
    ).lean();

    const leaderboardPictureMap = new Map(
      leaderboardProfiles.map((profile) => [String(profile.email).toLowerCase(), profile.picture])
    );

    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      email: entry._id,
      name: entry.userName || entry._id,
      avatar:
        entry.userAvatar ||
        leaderboardPictureMap.get(String(entry._id || '').toLowerCase()) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.userName || 'User')}&size=32`,
      stagesCompleted: entry.stagesCompleted,
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

      if (userName || userAvatar) {
        await User.findOneAndUpdate(
          { email: normalizedEmail },
          {
            email: normalizedEmail,
            ...(userName ? { name: userName } : {}),
            ...(userAvatar ? { picture: userAvatar } : {}),
            updatedAt: new Date()
          },
          { upsert: true }
        );
      }

      if (!resolvedUserAvatar) {
        const existingUser = await User.findOne(
          { email: normalizedEmail },
          { picture: 1, _id: 0 }
        ).lean();

        if (existingUser?.picture) {
          resolvedUserAvatar = existingUser.picture;
        }
      }
    }

    if (!resolvedIdeaId && userEmail) {
      const latestUserIdea = await Idea.findOne({ addedByEmail: userEmail })
        .sort({ createdAt: -1 })
        .select({ _id: 0, ideaId: 1, title: 1 })
        .lean();

      if (latestUserIdea?.ideaId) {
        resolvedIdeaId = latestUserIdea.ideaId;
        resolvedIdeaTitle = resolvedIdeaTitle || latestUserIdea.title;
      }
    }

    const dedupeQuery = {
      userEmail,
      createdAt: { $gte: new Date(Date.now() - 60000) } // Created in the last minute
    };

    if (resolvedIdeaId) {
      dedupeQuery.ideaId = resolvedIdeaId;
    } else if (stageName) {
      dedupeQuery.stageName = stageName;
    }

    // Keep only latest stage change in a short time window
    await StageNotification.deleteMany(dedupeQuery);

    const notificationPayload = {
      userEmail,
      userName,
      userAvatar: resolvedUserAvatar || '',
      previousStage,
      newStage,
      stageName,
      stageType
    };

    if (resolvedIdeaId) {
      notificationPayload.ideaId = resolvedIdeaId;
    }
    if (resolvedIdeaTitle) {
      notificationPayload.ideaTitle = resolvedIdeaTitle;
    }

    const notification = new StageNotification(notificationPayload);

    await notification.save();
    res.status(201).json(notification);
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

    const result = await StageNotification.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    res.json({
      message: `Deleted ${result.deletedCount} notifications older than ${daysOld} days`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('Error cleaning up notifications:', err);
    res.status(500).json({ message: "Error cleaning up notifications", error: err.message });
  }
});

module.exports = router;
