# ConnectMe - Architecture Document

## 📐 System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────┐
│                   Mobile App (React Native)              │
│  ┌───────────┐  ┌───────────┐  ┌──────────────────┐   │
│  │   Redux   │  │  Socket   │  │  React Navigation│   │
│  │   Store   │  │   Client  │  │                  │   │
│  └─────┬─────┘  └─────┬─────┘  └──────────────────┘   │
│        │              │                                  │
└────────┼──────────────┼──────────────────────────────────┘
         │ HTTP/REST    │ WebSocket
         │              │
┌────────▼──────────────▼──────────────────────────────────┐
│              Backend Server (Node.js/Express)            │
│  ┌──────────────────────────────────────────────────┐   │
│  │  REST API Endpoints  │  Socket.IO Server         │   │
│  ├──────────────────────┼───────────────────────────┤   │
│  │  Auth │ Posts │ Chat │  Real-time Chat & Calls   │   │
│  └──────────────────────┴───────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Business Logic & Controllers             │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Middleware (Auth, Upload, etc.)          │   │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────┬──────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼────────┐ ┌───▼────────┐ ┌───▼──────────┐
│  PostgreSQL   │ │ Cloudinary │ │   Firebase    │
│   (Database)   │ │  (Media)   │ │ (Push Notif.) │
└────────────────┘ └────────────┘ └───────────────┘
```

## 🗂️ Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # PostgreSQL connection (Sequelize)
│   │   ├── cloudinary.js # Media upload config
│   │   └── firebase.js   # Push notification config
│   │
│   ├── models/           # Sequelize models (PostgreSQL)
│   │   ├── User.model.js
│   │   ├── Post.model.js
│   │   ├── Story.model.js
│   │   ├── Reel.model.js
│   │   ├── Message.model.js
│   │   ├── Conversation.model.js
│   │   ├── Notification.model.js
│   │   └── Call.model.js
│   │
│   ├── routes/           # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   ├── story.routes.js
│   │   ├── reel.routes.js
│   │   ├── chat.routes.js
│   │   ├── message.routes.js
│   │   ├── notification.routes.js
│   │   └── search.routes.js
│   │
│   ├── controllers/      # Route controllers
│   │   └── auth.controller.js
│   │
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # JWT authentication
│   │   ├── upload.js     # File upload (Multer)
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   │
│   ├── utils/            # Helper functions
│   │   └── otp.js        # OTP generation/verification
│   │
│   ├── sockets/          # Socket.IO handlers
│   │   └── index.js      # Chat, calls, real-time
│   │
│   └── server.js         # Entry point
│
├── uploads/              # Temporary file storage
├── .env                  # Environment variables
├── .env.example          # Example env file
├── package.json
└── .gitignore
```

### Mobile App Structure
```
mobile/
├── src/
│   ├── navigation/       # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   │
│   ├── screens/          # App screens
│   │   ├── Auth/
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── Feed/
│   │   │   └── FeedScreen.tsx
│   │   ├── Profile/
│   │   │   └── ProfileScreen.tsx
│   │   ├── Chat/
│   │   │   ├── ChatListScreen.tsx
│   │   │   └── ChatScreen.tsx
│   │   ├── Reels/
│   │   │   └── ReelsScreen.tsx
│   │   └── Search/
│   │       └── SearchScreen.tsx
│   │
│   ├── components/       # Reusable components
│   │   ├── PostCard.tsx
│   │   ├── StoryList.tsx
│   │   ├── UserCard.tsx
│   │   └── Button.tsx
│   │
│   ├── redux/            # State management
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── feedSlice.ts
│   │       ├── chatSlice.ts
│   │       └── notificationSlice.ts
│   │
│   ├── services/         # API & Socket services
│   │   ├── api.ts        # Axios configuration
│   │   └── socket.ts     # Socket.IO client
│   │
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   │
│   ├── theme/            # Styling
│   │   └── index.ts      # Colors, fonts, spacing
│   │
│   ├── utils/            # Helper functions
│   ├── hooks/            # Custom React hooks
│   └── assets/           # Images, fonts, etc.
│
├── android/              # Android native code
├── ios/                  # iOS native code
├── App.tsx               # Root component
├── package.json
├── tsconfig.json
└── .gitignore
```

## 🔄 Data Flow

### Authentication Flow
```
1. User enters credentials in LoginScreen
2. LoginScreen dispatches login action
3. authSlice makes API call to /api/auth/login
4. Backend validates credentials
5. Backend returns JWT token + user data
6. Frontend stores token in AsyncStorage
7. Redux updates auth state
8. User redirected to MainNavigator
```

### Post Creation Flow
```
1. User selects images in CreatePostScreen
2. User writes caption and selects visibility
3. Frontend creates FormData with images
4. API call to POST /api/posts
5. Backend uploads images to Cloudinary
6. Backend creates Post record in PostgreSQL
7. Backend returns post data
8. Frontend updates feed with new post
9. Post appears in followers' feeds
```

### Real-time Chat Flow
```
1. User opens ChatScreen
2. Socket.IO connects to backend
3. Frontend emits 'join_conversation' event
4. User types message
5. Frontend emits 'send_message' event
6. Backend saves message to PostgreSQL
7. Backend emits 'message_received' to room
8. All participants receive message
9. Message appears in chat UI
10. Read receipts sent back via socket
```

## 🔐 Security Architecture

### Authentication
- **JWT Tokens**: Used for stateless authentication
- **Refresh Tokens**: Long-lived tokens for renewing access tokens
- **Password Hashing**: bcrypt with salt rounds
- **OTP Verification**: For email/phone verification

### Authorization
- **Middleware**: `protect` middleware checks JWT validity
- **Role-based**: User permissions checked at route level
- **Resource ownership**: Users can only edit their own content

### Data Security
- **Input Validation**: express-validator for request validation
- **SQL Injection Protection**: Sequelize parameterized queries
- **Rate Limiting**: Prevents brute-force attacks
- **CORS**: Configured for specific origins
- **Helmet**: Sets security-related HTTP headers

## 📊 Database Schema

### Key Collections

#### Users
```javascript
{
  _id: ObjectId,
  username: String (unique, indexed),
  email: String (unique, indexed),
  password: String (hashed),
  profilePicture: String,
  followers: [ObjectId],
  following: [ObjectId],
  couplePartner: ObjectId,
  isOnline: Boolean,
  lastSeen: Date,
  createdAt: Date
}
```

#### Posts
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, indexed),
  media: [{ type, url, thumbnail }],
  caption: String,
  likes: [ObjectId],
  comments: [{ user, text, createdAt }],
  visibility: String (enum),
  createdAt: Date (indexed)
}
```

#### Messages
```javascript
{
  _id: ObjectId,
  conversation: ObjectId (ref: Conversation, indexed),
  sender: ObjectId (ref: User, indexed),
  messageType: String (enum),
  text: String,
  media: { url, thumbnail },
  status: String (enum: sent/delivered/read),
  createdAt: Date
}
```

### Indexes
```javascript
// Performance-critical indexes
db.users.createIndex({ username: 1 });
db.users.createIndex({ email: 1 });
db.posts.createIndex({ user: 1, createdAt: -1 });
db.posts.createIndex({ createdAt: -1 });
db.messages.createIndex({ conversation: 1, createdAt: -1 });
db.stories.createIndex({ expiresAt: 1 });
```

## 🚀 Real-time Features

### Socket.IO Events
```javascript
// Connection management
'user_online'          - User comes online
'user_offline'         - User goes offline
'user_status_changed'  - User status broadcast

// Chat
'join_conversation'    - Join chat room
'send_message'         - Send new message
'message_received'     - Receive message
'typing'               - Show typing indicator
'message_read'         - Mark as read

// Calls
'call_user'            - Initiate call
'incoming_call'        - Receive call
'call_accepted'        - Call accepted
'call_ended'           - Call ended
'ice_candidate'        - WebRTC ICE candidate
```

### WebRTC Architecture
```
Caller                  Signaling Server          Receiver
  │                            │                      │
  ├─ call_user ───────────────>│                      │
  │                            ├─ incoming_call ─────>│
  │                            │<──── call_accepted ──┤
  │<───────────────────────────┤                      │
  │                                                    │
  ├────────────── ICE Candidate Exchange ────────────>│
  │                                                    │
  │<══════════════ Direct P2P Connection ════════════>│
```

## 📈 Scalability Considerations

### Backend Scaling
- **Horizontal Scaling**: Deploy multiple server instances
- **Load Balancer**: Distribute requests across servers
- **Redis**: For session storage and Socket.IO scaling
- **PostgreSQL Replication**: For database high availability and read replicas
- **CDN**: Cloudinary for media delivery

### Performance Optimizations
- **Pagination**: All list endpoints support pagination
- **Lazy Loading**: Load images on demand
- **Image Compression**: Reduce image sizes before upload
- **Caching**: Redis cache for frequently accessed data
- **Database Indexes**: Optimized queries
- **Socket Connection Pooling**: Efficient real-time connections

## 🔍 Monitoring & Logging

### Logging Strategy
- **Winston/Morgan**: HTTP request logging
- **Error Tracking**: Log all errors with stack traces
- **User Actions**: Track important user actions
- **Performance Metrics**: Response times, database queries

### Health Checks
```javascript
GET /health  - Server health status
GET /api/health  - API health status
```

## 🧪 Testing Strategy

### Backend Tests
- **Unit Tests**: Test individual functions
- **Integration Tests**: Test API endpoints
- **Database Tests**: Test data operations
- **Socket Tests**: Test real-time events

### Mobile Tests
- **Component Tests**: Test UI components
- **Integration Tests**: Test screen flows
- **E2E Tests**: Full user journey tests
- **Snapshot Tests**: UI regression testing

## 📱 Mobile App State Management

### Redux Store Structure
```javascript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    isLoading: boolean
  },
  feed: {
    posts: Post[],
    page: number,
    hasMore: boolean,
    isLoading: boolean
  },
  chat: {
    conversations: Conversation[],
    currentConversation: Conversation | null,
    messages: Message[]
  },
  notification: {
    notifications: Notification[],
    unreadCount: number
  }
}
```

### Async Thunks
```javascript
// Redux Toolkit async actions
login()         - Authenticate user
register()      - Create new account
fetchFeed()     - Load posts
createPost()    - Create new post
likePost()      - Like/unlike post
loadConversations() - Load chat list
```

---

This architecture provides a scalable, maintainable foundation for the ConnectMe application with room for future enhancements and features.
