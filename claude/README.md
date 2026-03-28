# ConnectMe - Social Media & Couples Communication App

A full-stack mobile application similar to Instagram with additional features for couples and friends communication.

## 🎯 Quick Commands

```bash
# Run all three platforms (backend + web + mobile)
npm run dev

# Run only backend + web
npm run dev:backend & npm run dev:web

# Install all dependencies
npm run install:all

# Run specific platforms
npm run web          # Web only (localhost:3000)
npm run ios          # Mobile iOS
npm run android      # Mobile Android
```

📖 See [COMMANDS.md](COMMANDS.md) for complete command reference.

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)** - PostgreSQL installation & setup ⭐
- **[SETUP.md](SETUP.md)** - Detailed setup instructions  
- **[COMMANDS.md](COMMANDS.md)** - All available commands
- **[API_DOCS.md](API_DOCS.md)** - API endpoint reference
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[MIGRATION_MONGODB_TO_POSTGRES.md](MIGRATION_MONGODB_TO_POSTGRES.md)** - Migration guide

## 🚀 Tech Stack

### Frontend - Mobile
- React Native (TypeScript)
- Redux Toolkit (State Management)
- React Navigation
- Socket.io Client (Real-time chat)
- WebRTC (Voice & Video calls)
- React Native Paper (UI Components)
- Axios (API calls)

### Frontend - Web (Desktop & Mobile Responsive)
- Next.js 14 (React Framework with App Router)
- TypeScript
- Material-UI (MUI) Components
- Redux Toolkit (State Management)
- Socket.io Client (Real-time features)
- WebRTC (Voice & Video calls)
- Framer Motion (Animations)
- Progressive Web App (PWA) support
- Responsive Design (Mobile, Tablet, Desktop)

### Backend
- Node.js with Express
- PostgreSQL with Sequelize ORM
- JWT Authentication
- Socket.io (Real-time features)
- WebRTC Signaling Server
- AWS S3 / Cloudinary (Media storage)
- Firebase Admin (Push notifications)
- Multer (File uploads)

## 📁 Project Structure

```
ConnectMe/
├── backend/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── models/         # Database models
│   web/                    # Next.js Web App (Responsive)
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components
│   │   │   ├── layouts/   # Layout components
│   │   │   ├── feed/      # Feed components
│   │   │   ├── chat/      # Chat components
│   │   │   └── common/    # Shared components
│   │   ├── redux/         # Redux store & slices
│   │   ├── lib/           # API client, Socket.io
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Helper functions
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   ├── .env.example
│   ├── next.config.js
│   └── package.json
│
├── │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   ├── sockets/        # Socket.io handlers
│   │   └── server.js       # Entry point
│   ├── uploads/            # Temporary file storage
│   ├── .env.example
│   └── package.json
│
├── mobile/                 # React Native App
│   ├── src/
│   │   ├── navigation/     # Navigation setup
│   │   ├── screens/        # App screens
│   │   ├── components/     # Reusable components
│   │   ├── redux/          # Redux store & slices
│   │   ├── services/       # API services
│   │   ├── utils/          # Helper functions
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   ├── assets/         # Images, fonts, etc.
│   │   └── theme/          # Colors, fonts, styles
│   ├── App.tsx
│   ├── .env.example
│   └── package.json
│
├── package.json            # Root package with unified commands
├── COMMANDS.md             # 📖 Complete command reference guide
├── README.md               # This file
├── QUICKSTART.md           # Quick setup guide
├── SETUP.md                # Detailed setup instructions
├── API_DOCS.md             # API documentation
├── ARCHITECTURE.md         # Architecture overview
└── PROJECT_OVERVIEW.md     # Project overview
```

## ✨ Core Features

### 1. Authentication
- ✅ Email/Phone signup with OTP verification
- ✅ JWT-based authentication
- ✅ Profile creation and management
- ✅ Follow/Unfollow system

### 2. Feed (Instagram-like)
- ✅ Image/Video post uploads
- ✅ Like, comment, share functionality
- ✅ Infinite scrolling
- ✅ Save posts (bookmarks)

### 3. Stories
- ✅ 24-hour auto-delete stories
- ✅ Image/Video stories
- ✅ View insights (views count)

### 4. Chat System
- ✅ One-to-one messaging
- ✅ Special "Couple Chat" feature 💑
- ✅ Text, images, audio messages
- ✅ Message status (sent, delivered, seen)
- ✅ Real-time messaging with Socket.io

### 5. Calling Features
- ✅ Voice calls (WebRTC)
- ✅ Video calls (WebRTC)
- ✅ Call history tracking

### 6. Reels / Short Videos
- ✅ Upload short videos
- ✅ Vertical scroll UI
- ✅ Like, comment, share

### 7. Notifications
- ✅ Real-time notifications
- ✅ Push notifications (Firebase)

### 8. Search & Explore
- ✅ User search
- ✅ Trending posts/reels
- ✅ Explore page

### 9. Privacy Features
- ✅ Private account option
- ✅ Block/Unblock users
- ✅ Close friends lists
- ✅ Couples-only content

### 10. Bonus Features
- ✅ Couple anniversary tracker ❤️
- ✅ Shared gallery for couples
- ✅ Voice notes in chat
- ✅ Online/offline status

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- React Native development environment
- Xcode (for iOS) / Android Studio (for Android)
- AWS S3 or Cloudinary account
- Firebase project (for push notifications)

### Quick Setup (Run Both API & UI)

From the root `ConnectMe` directory:

1. Install all dependencies (backend + mobile):
```bash
npm run install:all
```

2. Run both backend and mobile app together:
```bash
npm run dev
```

This will start both the API server and mobile app with a single command! 🚀

### Individual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/connectme
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=connectme-media

# Cloudinary (Alternative to S3)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# OTP Service (Twilio/AWS SNS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number

# Email Service (SendGrid/AWS SES)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@connectme.com

# Client URL
CLIENT_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS pods (macOS only):
```bash
cd ios && pod install && cd ..
```

4. 

### Web App Setup

1. Navigate to web directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

4. Start development server:
```bash
npm run dev
```
ackend + web + mobile together ⭐
- `npm run dev:backend` - Start only backend server
- `npm run dev:web` - Start only web app (port 3000)
- `npm run dev:mobile` - Start only mobile app
- `npm run dev:full` - Alias for running all three
- `npm start` - Alias for `npm run dev`

### Installation
- `npm run install:all` - Install dependencies for all projects

### Platform Specific
- `npm run web` - Run web app only
- `npm run ios` - Run mobile app on iOS simulator
- `npm run android` - Run mobile app on Android emulator

### Testing
- `npm test` - Run tests for all projects
- `npm run test:backend` - Run backend tests only
- `npm run test:web` - Run web tests only
- `npm run test:mobile` - Run mobile tests only

### Linting
- `npm run lint` - Lint all projects
- `npm run lint:backend` - Lint backend code
- `npm run lint:web` - Lint web code
- `npm run lint:mobile` - Lint mobile code

### Production
- `npm run build` - Build all projects for production
- `npm run start:backend` - Start backend in production mode
- `npm run start:web` - Start web app in production mode
- `npm run start:mobile` - Start mobile app in production mode

### Cleanup
- `npm run clean` - Remove node_modules from all projects
- `npm run clean:backend` - Clean backend dependencies
- `npm run clean:web` - Clean web dependencies and build

## 🎯 Available Commands (Root Level)

Run these commands from the `ConnectMe` root directory:

### Development
- `npm run dev` - Start both backend and mobile app together
- `npm run dev:backend` - Start only backend server
- `npm run dev:mobile` - Start only mobile app
- `npm start` - Alias for `npm run dev`

### Installation
- `npm run install:all` - Install dependencies for both projects

### Mobile Specific
- `npm run ios` - Run mobile app on iOS simulator
- `npm run android` - Run mobile app on Android emulator

### Testing
- `npm test` - Run tests for both backend and mobile
- `npm run test:backend` - Run backend tests only
- `npm run test:mobile` - Run mobile tests only

### Linting
- `npm run lint` - Lint both projects
- `npm run lint:backend` - Lint backend code
- `npm run lint:mobile` - Lint mobile code

### Production
- `npm run build` - Build both projects for production
- `npm run start:backend` - Start backend in production mode
- `npm run start:mobile` - Start mobile app in production mode

### Cleanup
- `npm run clean` - Remove node_modules from both projects
- `npm run clean:backend` - Clean backend dependencies
- `npm run clean:mobile` - Clean mobile dependencies and build cache

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/refresh-token` - Refresh JWT token
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/unfollow` - Unfollow user
- `GET /api/users/:id/followers` - Get followers
- `GET /api/users/:id/following` - Get following
- `POST /api/users/:id/block` - Block user
- `DELETE /api/users/:id/unblock` - Unblock user

### Posts
- `GET /api/posts` - Get feed posts (paginated)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `DELETE /api/posts/:id/unlike` - Unlike post
- `POST /api/posts/:id/comment` - Add comment
- `DELETE /api/posts/:id/comment/:commentId` - Delete comment
- `POST /api/posts/:id/save` - Save post
- `DELETE /api/posts/:id/unsave` - Unsave post

### Stories
- `GET /api/stories` - Get active stories
- `GET /api/stories/:id` - Get single story
- `POST /api/stories` - Create story
- `DELETE /api/stories/:id` - Delete story
- `POST /api/stories/:id/view` - Mark story as viewed

### Reels
- `GET /api/reels` - Get reels (paginated)
- `GET /api/reels/:id` - Get single reel
- `POST /api/reels` - Upload reel
- `DELETE /api/reels/:id` - Delete reel
- `POST /api/reels/:id/like` - Like reel
- `POST /api/reels/:id/comment` - Comment on reel

### Chat
- `GET /api/chats` - Get all conversations
- `GET /api/chats/:id` - Get single conversation
- `POST /api/chats` - Create new conversation
- `GET /api/chats/:id/messages` - Get messages (paginated)
- `POST /api/chats/:id/messages` - Send message
- `PUT /api/messages/:id/read` - Mark message as read
- `POST /api/chats/:id/couple` - Mark chat as couple chat

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Search
- `GET /api/search/users?q=query` - Search users
- `GET /api/search/posts?q=query` - Search posts
- `GET /api/explore` - Get explore page content

## 🔌 Socket Events

### Connection
- `connection` - User connects
- `disconnect` - User disconnects

### Chat
- `join_chat` - Join conversation room
- `send_message` - Send message
- `message_received` - Receive message
- `typing` - User typing indicator
- `message_read` - Message read status

### Call
- `call_user` - Initiate call
- `call_accepted` - Call accepted
- `call_rejected` - Call rejected
- `call_ended` - Call ended
- `webrtc_offer` - WebRTC offer
- `webrtc_answer` - WebRTC answer
- `webrtc_ice_candidate` - ICE candidate

### Status
- `user_online` - User came online
- `user_offline` - User went offline

## 📦 Database Models

### User
```javascript
{
  username: String,
  email: String,
  phone: String,
  password: String (hashed),
  profilePicture: String,
  bio: String,
  isPrivate: Boolean,
  isVerified: Boolean,
  followers: [ObjectId],
  following: [ObjectId],
  blockedUsers: [ObjectId],
  closeFriends: [ObjectId],
  couplePartner: ObjectId,
  anniversaryDate: Date,
  deviceTokens: [String],
  isOnline: Boolean,
  lastSeen: Date,
  createdAt: Date
}
```

### Post
```javascript
{
  user: ObjectId,
  caption: String,
  media: [{
    type: String, // 'image' or 'video'
    url: String,
    thumbnail: String
  }],
  likes: [ObjectId],
  comments: [{
    user: ObjectId,
    text: String,
    createdAt: Date
  }],
  saves: [ObjectId],
  location: String,
  visibility: String, // 'public', 'followers', 'close-friends', 'couples'
  createdAt: Date
}
```

### Story
```javascript
{
  user: ObjectId,
  media: {
    type: String,
    url: String
  },
  views: [ObjectId],
  expiresAt: Date,
  createdAt: Date
}
```

### Message
```javascript
{
  conversation: ObjectId,
  sender: ObjectId,
  text: String,
  media: {
    type: String,
    url: String
  },
  status: String, // 'sent', 'delivered', 'read'
  createdAt: Date
}
```

### Conversation
```javascript
{
  participants: [ObjectId],
  isCouple: Boolean,
  lastMessage: ObjectId,
  updatedAt: Date
}
```

## 🎨 UI/UX Features
- Modern Instagram-inspired design
- Bottom tab navigation
- Dark mode support
- Smooth animations
- Lazy loading for images/videos
- Pull-to-refresh
- Optimistic UI updates

## 🚀 Performance Optimizations
- Image/video compression before upload
- Lazy loading and pagination
- Redis caching (optional)
- CDN for media delivery
- WebSocket connection pooling
- Memoized React components
- Virtualized lists for feeds

## 🔒 Security Features
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on APIs
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- File upload restrictions

## 📱 Push Notifications
- New follower
- Post likes and comments
- New messages
- Call notifications
- Story views

## 🧪 Testing
```bash
# Backend tests
cd backend && npm test

# Mobile tests
cd mobile && npm test
```

## 📝 License
MIT

## 👥 Contributors
Your team here

## 📞 Support
For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for connecting people**
