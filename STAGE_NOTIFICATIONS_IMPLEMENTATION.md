# Stage Notification System - Implementation Documentation

## Overview
A real-time notification system that tracks and displays stage progression for ideas in the VJ Startups platform. The "Recent Stages Unlocked" section on the home page now displays dynamic, real-time notifications from the backend instead of static data.

## Features Implemented

### 1. Backend Infrastructure

#### StageNotifications Model (`backend/models/StageNotifications.js`)
- Tracks stage changes for ideas with detailed information
- Stores: ideaId, ideaTitle, userEmail, userName, userAvatar, previous/new stage, stage name/type
- Automatic expiration after 30 days (TTL index)
- Optimized indexes for efficient querying

#### Notifications API (`backend/APIs/notifications-api.js`)
Endpoints:
- `GET /notification-api/stage-notifications/stats` - Get notification statistics with caching
  - Returns: recent notifications, top contributors, counts (today/week/total)
  - Implements server-side caching (1 minute TTL by default)
  
- `GET /notification-api/stage-notifications` - Get all notifications with pagination
  - Query params: limit, skip, userEmail
  
- `GET /notification-api/stage-notifications/idea/:ideaId` - Get notifications for specific idea

- `POST /notification-api/stage-notifications` - Create notification (internal use)

- `DELETE /notification-api/stage-notifications/cleanup` - Clean up old notifications

#### Updated Ideas API (`backend/APIs/ideas-api.js`)
- Automatically creates notifications when idea stage changes
- Prevents duplicate notifications (deletes recent ones for same idea/user)
- Only notifies on the **latest** stage change if multiple stages crossed at once

### 2. Frontend Updates

#### InteractiveLearningHub Component (`frontend/src/components/InteractiveLearningHub.tsx`)
- Fetches real notification data from backend API
- Automatic refresh based on environment variable (default 30 seconds)
- Loading states and error handling
- Manual refresh button
- Empty state display when no notifications exist
- Shows time ago for each notification (e.g., "5m ago", "2h ago")

### 3. Environment Configuration

#### Backend (.env)
```env
# Notification Settings
NOTIFICATION_REFRESH_RATE=30000      # Cache refresh rate in ms (30 seconds)
NOTIFICATION_CACHE_TTL=60000         # Cache TTL in ms (1 minute)
```

#### Frontend (.env)
```env
# Notification refresh rate in milliseconds (30 seconds)
VITE_NOTIFICATION_REFRESH_RATE=30000
```

## Performance Optimizations

### Backend
1. **Caching**: Stats endpoint uses in-memory cache with configurable TTL
2. **Deduplication**: Automatically removes duplicate notifications within 1 minute window
3. **Indexing**: MongoDB indexes on createdAt, userEmail, ideaId for fast queries
4. **TTL**: Automatic cleanup of notifications older than 30 days
5. **Pagination**: Support for efficient pagination on list endpoints

### Frontend
1. **Polling Interval**: Configurable refresh rate (default 30s) prevents excessive API calls
2. **Conditional Updates**: Only re-renders when data actually changes
3. **Loading States**: Prevents multiple simultaneous fetches
4. **Graceful Degradation**: Falls back to mock data on API errors

## How It Works

### Flow Diagram
```
1. User updates idea stage in Ideas page
   ↓
2. Frontend calls PUT /idea-api/idea/:ideaId with new stage
   ↓
3. Backend detects stage change
   ↓
4. Backend creates StageNotification record
   - Deletes any notifications from last minute (prevents spam)
   - Only keeps latest stage if multiple crossed
   ↓
5. Notification saved to MongoDB
   ↓
6. Home page polls /notification-api/stage-notifications/stats
   - Fetches from cache if available (< 1 minute old)
   - Otherwise queries DB and updates cache
   ↓
7. Frontend displays in "Recent Stages Unlocked" section
   - Shows user name, avatar, stage name
   - Displays time ago (5m, 2h, 1d, etc.)
   - Shows stage type badge (problem/idea/startup)
```

## Stage Mapping
```javascript
Stage 1: Ideation & Concept (idea)
Stage 2: Research & Feasibility (idea)
Stage 3: User Validation (idea)
Stage 4: Prototype Development (idea)
Stage 5: MVP Development (startup)
Stage 6: Pilot/Beta Testing (startup)
Stage 7: Launch & Go-to-Market (startup)
Stage 8: Scaling & Growth (startup)
```

## API Response Examples

### GET /notification-api/stage-notifications/stats
```json
{
  "todayCount": 5,
  "weekCount": 23,
  "totalCount": 847,
  "recentNotifications": [
    {
      "userName": "Karthik",
      "userAvatar": "https://...",
      "stageName": "User Validation",
      "stageType": "idea",
      "completedAt": "2024-03-06T10:30:00.000Z",
      "ideaTitle": "AI-Powered Study Assistant",
      "ideaId": "idea-123"
    }
  ],
  "topContributors": [
    {
      "name": "Anirudh",
      "email": "anirudh@example.com",
      "avatar": "https://...",
      "stagesCompleted": 7,
      "badgeType": "founder"
    }
  ],
  "cached": false,
  "cacheTTL": 60000
}
```

## Configuration Options

### Refresh Rate Tuning
Adjust `VITE_NOTIFICATION_REFRESH_RATE` based on your needs:
- **High activity**: 15000 (15 seconds) - more real-time but more API calls
- **Normal activity**: 30000 (30 seconds) - balanced (default)
- **Low activity**: 60000 (60 seconds) - fewer API calls, less real-time

### Cache TTL Tuning
Adjust `NOTIFICATION_CACHE_TTL` based on your needs:
- **High activity**: 30000 (30 seconds) - fresher data but more DB queries
- **Normal activity**: 60000 (60 seconds) - balanced (default)
- **Low activity**: 120000 (2 minutes) - fewer DB queries

## Testing

### Manual Testing Steps
1. **Create/Update an Idea**: Go to Ideas page, update an idea's stage
2. **Check Notification Created**: `curl http://localhost:6220/notification-api/stage-notifications/stats`
3. **Verify Home Page**: Go to home page, scroll to "Recent Stages Unlocked"
4. **Test Refresh**: Click the refresh button to manually fetch latest data
5. **Test Multiple Changes**: Quickly change stages multiple times, verify only latest shows

### Database Queries
```javascript
// Check notifications in MongoDB
db.stagenotifications.find().sort({createdAt: -1}).limit(10)

// Check notification counts
db.stagenotifications.count()

// Check specific user's notifications
db.stagenotifications.find({userEmail: "user@example.com"})
```

## Troubleshooting

### Problem: Notifications not appearing
- Check backend server is running: `lsof -i :6220`
- Verify API responds: `curl http://localhost:6220/notification-api/stage-notifications/stats`
- Check browser console for fetch errors
- Verify VITE_API_BASE_URL in frontend .env

### Problem: Old notifications not cleaning up
- Check TTL index exists: `db.stagenotifications.getIndexes()`
- Manually run cleanup: `curl -X DELETE http://localhost:6220/notification-api/stage-notifications/cleanup?days=30`

### Problem: Too many database queries
- Increase NOTIFICATION_CACHE_TTL
- Increase VITE_NOTIFICATION_REFRESH_RATE
- Check cache is working: Look for "cached": true in API response

### Problem: Duplicate notifications
- System prevents duplicates within 1 minute window
- Check deletion logic in ideas-api.js createStageNotification function
- Clear duplicates manually: `db.stagenotifications.aggregate([...])`

## Future Enhancements

Potential improvements:
1. **WebSocket Support**: Real-time push notifications instead of polling
2. **User Preferences**: Let users set their own refresh rate
3. **Notification Filtering**: Filter by stage type, time range, etc.
4. **Achievement Badges**: Award badges for milestone completions
5. **Email Notifications**: Send email digest of stage changes
6. **Analytics Dashboard**: Track stage progression trends
7. **Notification Read Status**: Mark notifications as read/unread

## Security Considerations

- All notifications are public (no sensitive data exposed)
- User avatars use secure HTTPS URLs or default avatars
- No authentication required for reading notifications (public data)
- Stage updates require authentication (existing auth middleware)

## Performance Metrics

Expected performance:
- **API Response Time**: < 100ms (cached), < 500ms (DB query)
- **Frontend Render Time**: < 50ms
- **Database Query Time**: < 200ms with indexes
- **Memory Usage**: ~1-5MB for cache (depending on activity)
- **Network Traffic**: ~5KB per refresh cycle

## Support

For issues or questions:
1. Check this documentation
2. Review code comments in implementation files
3. Check browser console and server logs
4. Test API endpoints directly with curl

---

**Implementation Date**: March 6, 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
