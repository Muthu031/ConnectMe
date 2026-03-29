# ConnectMe Mock Data Layer

This folder powers realistic development data for ConnectMe when core social features are still being wired to the main database models.

## Free Public APIs Used

- `https://dummyjson.com/users?limit=30`
  - Seeds user identities (name, username, email, avatar)
- `https://dummyjson.com/posts?limit=80`
  - Seeds post captions, tags, and content text
- `https://picsum.photos/seed/<seed>/...`
  - Deterministic image URLs for post/story/reel thumbnails
- `https://samplelib.com/lib/preview/mp4/...`
  - Demo reel video URLs

## Fallback Behavior

If external API calls fail or timeout, the store falls back to static local mock users/posts so local development still works fully offline.

## Exposed App Endpoints

The mock routes are mounted under `/api` and implement the mobile/web expected endpoints:

- Users: `/users/:userId`, `/users/:userId/follow`, `/users/:userId/followers`, ...
- Feed: `/posts`, `/posts/:postId`, `/posts/:postId/like`, ...
- Stories: `/stories`, `/stories/:storyId/view`
- Reels: `/reels`, `/reels/:reelId/like`, ...
- Chat: `/chats`, `/messages/:conversationId`
- Notifications: `/notifications`, `/notifications/:notificationId/read`
- Search: `/search/users`, `/search/posts`

## Notes

- Data is cached in memory for 15 minutes.
- This layer is intended for development/demo mode and can be replaced route-by-route with repository/service/database-backed implementations.
