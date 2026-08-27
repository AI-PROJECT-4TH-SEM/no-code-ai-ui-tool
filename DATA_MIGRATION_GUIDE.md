# MongoDB Data Migration Guide

## Overview
This guide explains how all locally stored data (sessionStorage, localStorage) has been migrated to MongoDB database for persistent storage.

## What Was Migrated

### 1. Theme Preferences
- **Before**: Stored in `sessionStorage` under key `current_theme_session`
- **After**: Stored in MongoDB in two places for redundancy:
  - `Theme` model (primary) - `selectedTheme` field
  - `User` model (backup) - `preferredTheme` field
- **API Endpoint**: `PATCH /api/theme`

### 2. Session Data
- **Before**: Stored in `sessionStorage` as HTML modifications
- **After**: Stored in MongoDB `Session` model with full session history
- **Includes**: Original HTML, current HTML, changes array, suppressed elements

### 3. User Preferences
- **Before**: Scattered across sessionStorage and browser cache
- **After**: Centralized in MongoDB `User` model:
  - Theme preference
  - Custom display settings (font scale, 3D effects, animation speed, contrast mode)
  - Last theme update timestamp

## How It Works

### For Authenticated Users
1. When a user logs in, their access token is provided to the frontend
2. Any data-saving operations (e.g., theme selection) automatically use the API
3. Data is stored in MongoDB with their userId as the reference
4. Data persists across sessions and devices

### For Anonymous Users
1. No access token available
2. Data is stored in sessionStorage (temporary, browser-based)
3. Data is lost on page reload (as before)
4. When user logs in, they can migrate their local data to the database

## API Endpoints

### GET /api/theme
**Purpose**: Retrieve user's saved theme preference
**Authentication**: Required (Bearer token)
**Response**: `{ theme: "Theme Name" }`

### PATCH /api/theme
**Purpose**: Save/update user's theme preference
**Authentication**: Required (Bearer token)
**Body**: `{ themeName: "Theme Name" }`
**Response**: `{ success: true, selectedTheme: "Theme Name" }`

### POST /api/migrate-local-data
**Purpose**: Migrate locally stored data to MongoDB
**Authentication**: Required (Bearer token)
**Body**:
```json
{
  "themeData": {
    "name": "Theme Name",
    "customSettings": { ... }
  },
  "sessionData": {
    "html": "...",
    "originalHtml": "...",
    "changes": [ ... ]
  }
}
```
**Response**: `{ success: true, migrations: { theme: true, session: true } }`

### GET /api/migrate-local-data
**Purpose**: Check migration status
**Authentication**: Required (Bearer token)
**Response**:
```json
{
  "migrationStatus": {
    "hasThemeData": true,
    "sessionCount": 5,
    "lastThemeUpdate": "2024-01-01T00:00:00Z"
  }
}
```

## Implementation Details

### Theme Manager (`app/src/lib/themeManager.js`)
Updated with new async methods that:
- Check if access token is available
- For authenticated users: Use API endpoints
- For anonymous users: Fall back to sessionStorage
- Handle errors gracefully with automatic fallback

```javascript
// Save theme (works with or without authentication)
await themeManager.saveActiveTheme(theme, accessToken)

// Get theme (works with or without authentication)
const theme = await themeManager.getActiveTheme(accessToken)

// Clear theme
await themeManager.clearActiveTheme(accessToken)
```

### Database Models

#### Theme Model
```javascript
{
  userId: ObjectId (unique index),
  selectedTheme: String,
  customSettings: {
    fontScale: Number,
    is3D: Boolean,
    animationSpeed: Number,
    contrastMode: Boolean
  },
  lastUpdated: Date
}
```

#### User Model (Updated)
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String,
  // ... existing fields
  preferredTheme: String,
  customSettings: Object,
  lastThemeUpdate: Date
}
```

#### Session Model (Existing)
```javascript
{
  userId: ObjectId,
  label: String,
  originalHtml: String,
  currentHtml: String,
  changes: Array,
  suppressedIds: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## Migration Steps

### For Existing Users
1. Users with sessionStorage data can manually migrate by:
   - Logging in with their account
   - Visiting the themes page
   - Selecting their preferred theme
   - System automatically saves to database

2. Or they can use the migration API:
   - Extract sessionStorage data
   - Call POST /api/migrate-local-data
   - System moves data to MongoDB

### For New Users
- Theme selections are automatically stored in MongoDB upon login
- No manual migration needed

## Error Handling

### Graceful Degradation
- If MongoDB is unavailable, authenticated users fall back to sessionStorage
- Anonymous users continue to work with sessionStorage
- No data loss occurs due to automatic fallback mechanism

### Automatic Retry
- Failed saves are logged but don't block user actions
- User can retry by simply selecting the theme again
- Exponential backoff prevents overwhelming the server

## Data Persistence

### Cross-Device Sync
When user logs in on a different device:
1. Theme preference is loaded from MongoDB
2. All session history is available
3. Custom settings are synchronized

### Data Recovery
If sessionStorage is accidentally cleared:
- Authenticated users can still recover their preferences from MongoDB
- Anonymous users will lose their preferences (session-only by design)

## Configuration

### Environment Variables
```env
MONGO_URI=mongodb+srv://...
```

The theme manager automatically:
- Detects MongoDB availability
- Uses appropriate storage mechanism
- Handles connection pooling
- Manages error states

## Testing the Migration

### Test 1: Anonymous User
1. Open incognito/private window
2. Select a theme
3. Refresh page
4. Verify theme resets (session-only storage)

### Test 2: Authenticated User
1. Log in with test account
2. Select a theme
3. Refresh page
4. Verify theme persists (from MongoDB)

### Test 3: Theme Fallback
1. Disable MongoDB connection
2. Log in and select theme
3. Verify fallback to sessionStorage works
4. Restore MongoDB connection

### Test 4: Data Migration
1. Store data in sessionStorage (anonymous)
2. Log in to account
3. Call POST /api/migrate-local-data with local data
4. Verify data now appears in MongoDB

## Performance Impact

- **Session Storage Lookups**: ~1ms (in-memory)
- **Database Queries**: ~50-100ms (with network overhead)
- **Caching**: Theme is cached during session to minimize API calls
- **Optimization**: Only first theme load hits database per session

## Future Enhancements

1. **Offline Support**: Add service worker for offline theme management
2. **Sync Queue**: Implement sync queue for unreliable connections
3. **Conflict Resolution**: Handle concurrent theme changes
4. **Analytics**: Track theme usage patterns
5. **Recommendations**: Suggest themes based on user behavior

## Support

For issues with data migration:
1. Check browser console for error messages
2. Verify MongoDB connection string in .env
3. Ensure user is authenticated (valid JWT token)
4. Check API endpoint responses in Network tab
5. Review server logs for detailed error information
