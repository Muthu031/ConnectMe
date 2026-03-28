# ConnectMe API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📝 Auth Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully. Please verify your OTP.",
  "data": {
    "user": {
      "id": "65abc123...",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "profilePicture": ""
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65abc123...",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "profilePicture": "",
      "bio": "",
      "isVerified": false,
      "followersCount": 0,
      "followingCount": 0,
      "postsCount": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "65abc123...",
      "username": "johndoe",
      ...
    }
  }
}
```

### Verify OTP
```http
POST /api/auth/verify-otp
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "123456"
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

## 👤 User Endpoints

### Get User Profile
```http
GET /api/users/:userId
```

### Update Profile
```http
PUT /api/users/:userId
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "fullName": "John Updated",
  "bio": "New bio",
  "file": <image_file>
}
```

### Follow User
```http
POST /api/users/:userId/follow
Authorization: Bearer <token>
```

### Unfollow User
```http
DELETE /api/users/:userId/unfollow
Authorization: Bearer <token>
```

### Get Followers
```http
GET /api/users/:userId/followers
```

### Get Following
```http
GET /api/users/:userId/following
```

---

## 📸 Post Endpoints

### Get Feed
```http
GET /api/posts?page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "posts": [
      {
        "_id": "65abc123...",
        "user": {
          "username": "johndoe",
          "profilePicture": "...",
          "isVerified": false
        },
        "caption": "Beautiful sunset!",
        "media": [
          {
            "type": "image",
            "url": "https://..."
          }
        ],
        "likesCount": 42,
        "commentsCount": 5,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Create Post
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "caption": "My new post!",
  "files": [<image_or_video_files>],
  "visibility": "public",
  "location": "{\"name\": \"New York\", \"coordinates\": {\"latitude\": 40.7128, \"longitude\": -74.0060}}",
  "hashtags": "[\"travel\", \"photography\"]"
}
```

### Like Post
```http
POST /api/posts/:postId/like
Authorization: Bearer <token>
```

### Unlike Post
```http
DELETE /api/posts/:postId/unlike
Authorization: Bearer <token>
```

### Comment on Post
```http
POST /api/posts/:postId/comment
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Great photo!"
}
```

### Save Post
```http
POST /api/posts/:postId/save
Authorization: Bearer <token>
```

---

## 📖 Story Endpoints

### Get Stories
```http
GET /api/stories
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "stories": [
      {
        "user": {
          "username": "johndoe",
          "profilePicture": "..."
        },
        "stories": [
          {
            "_id": "65abc123...",
            "media": {
              "type": "image",
              "url": "https://..."
            },
            "viewsCount": 15,
            "expiresAt": "2024-01-16T10:30:00.000Z",
            "createdAt": "2024-01-15T10:30:00.000Z"
          }
        ]
      }
    ]
  }
}
```

### Create Story
```http
POST /api/stories
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": <image_or_video_file>,
  "caption": "Check this out!",
  "visibility": "public"
}
```

### View Story
```http
POST /api/stories/:storyId/view
Authorization: Bearer <token>
```

---

## 🎬 Reel Endpoints

### Get Reels
```http
GET /api/reels?page=1
Authorization: Bearer <token>
```

### Create Reel
```http
POST /api/reels
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": <video_file>,
  "caption": "My awesome reel!",
  "hashtags": "[\"dance\", \"viral\"]"
}
```

### Like Reel
```http
POST /api/reels/:reelId/like
Authorization: Bearer <token>
```

---

## 💬 Chat Endpoints

### Get Conversations
```http
GET /api/chats
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "conversations": [
      {
        "_id": "65abc123...",
        "participants": [
          {
            "username": "johndoe",
            "profilePicture": "...",
            "isOnline": true
          }
        ],
        "isCouple": false,
        "lastMessage": {
          "text": "Hey there!",
          "createdAt": "2024-01-15T10:30:00.000Z"
        },
        "lastMessageAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### Create Conversation
```http
POST /api/chats
Authorization: Bearer <token>
Content-Type: application/json

{
  "participantId": "65abc456...",
  "isCouple": false
}
```

### Get Messages
```http
GET /api/messages/:conversationId?page=1&limit=50
Authorization: Bearer <token>
```

---

## 🔔 Notification Endpoints

### Get Notifications
```http
GET /api/notifications?page=1&limit=20
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "notifications": [
      {
        "_id": "65abc123...",
        "sender": {
          "username": "janedoe",
          "profilePicture": "..."
        },
        "type": "like_post",
        "post": {
          "_id": "65abc456...",
          "media": [{"url": "..."}]
        },
        "isRead": false,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "unreadCount": 5
  }
}
```

### Mark as Read
```http
PUT /api/notifications/:notificationId/read
Authorization: Bearer <token>
```

---

## 🔍 Search Endpoints

### Search Users
```http
GET /api/search/users?q=john
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "username": "johndoe",
        "fullName": "John Doe",
        "profilePicture": "...",
        "bio": "...",
        "isVerified": false,
        "followersCount": 150
      }
    ]
  }
}
```

### Search Posts
```http
GET /api/search/posts?q=sunset
```

---

## 🌐 Socket.IO Events

### Connection
```javascript
// Client connects
socket.emit('user_online', userId);

// User status changed
socket.on('user_status_changed', ({ userId, isOnline }) => {
  // Handle user status update
});
```

### Chat Events
```javascript
// Join conversation
socket.emit('join_conversation', conversationId);

// Send message
socket.emit('send_message', {
  conversationId,
  senderId,
  text: 'Hello!',
  messageType: 'text',
  tempId: 'temp_123'
});

// Receive message
socket.on('message_received', (message) => {
  // Display message
});

// Typing indicator
socket.emit('typing', { conversationId, userId });
socket.on('user_typing', ({ conversationId, userId }) => {
  // Show typing indicator
});
```

### Call Events
```javascript
// Initiate call
socket.emit('call_user', {
  callerId,
  receiverId,
  callType: 'video',
  offer: rtcOffer
});

// Incoming call
socket.on('incoming_call', ({ callId, callerId, callType, offer }) => {
  // Show call screen
});

// Accept call
socket.emit('call_accepted', { callId, answer: rtcAnswer });

// End call
socket.emit('call_ended', { callId });
```

---

## 🎯 Error Responses

All error responses follow this format:

```json
{
  "status": "error",
  "message": "Error description here"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## 🔒 Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **OTP requests**: 3 requests per hour

---

## 📦 Sample Postman Collection

Import this collection for easy testing:
```json
{
  "info": {
    "name": "ConnectMe API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```

Save this as `ConnectMe.postman_collection.json` and import into Postman.
