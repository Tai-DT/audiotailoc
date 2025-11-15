# Notification Sounds

This directory contains audio files used for notification alerts.

## Required Files

### notification.mp3
- **Purpose**: Plays when new notifications arrive via WebSocket
- **Location**: `public/sounds/notification.mp3`
- **Used by**: `dashboard/hooks/use-notifications.ts`
- **Format**: MP3 audio file
- **Recommended**: Short, pleasant notification sound (1-2 seconds)

## How to Add

1. Find or create a notification sound file (MP3 format)
2. Name it `notification.mp3`
3. Place it in this directory: `dashboard/public/sounds/notification.mp3`
4. The sound will automatically play when:
   - A new notification arrives via WebSocket
   - Sound is enabled in notification settings
   - Browser audio is not blocked

## Free Sound Resources

You can find free notification sounds at:
- [FreeSound](https://freesound.org/) - Search for "notification" or "alert"
- [Zapsplat](https://www.zapsplat.com/sound-effect-category/notification-alerts/)
- [Mixkit](https://mixkit.co/free-sound-effects/notification/)

## Testing

To test the notification sound:
1. Go to `/dashboard/notifications`
2. Create a new test notification
3. The sound should play automatically if enabled
4. Check browser console for any audio playback errors

## Browser Permissions

Some browsers require user interaction before playing audio. The sound may not play on the first notification after page load until the user has interacted with the page.
