# ConnectMe - Project Overview

## 🎯 Project Summary

**ConnectMe** is a full-stack mobile social media application similar to Instagram with enhanced features for couples and friends communication. The application combines the best features of modern social media platforms with specialized tools for intimate connections.

## ✨ Core Features Implemented

### ✅ Authentication & User Management
- JWT-based authentication with refresh tokens
- Email/Phone signup with OTP verification
- Secure password hashing (bcrypt)
- Profile management (bio, profile picture, cover picture)
- Follow/Unfollow system
- Public/Private account options
- Block/Unblock users

### ✅ Social Features
- **Feed**: Instagram-like post feed with infinite scrolling
- **Stories**: 24-hour auto-expiring stories
- **Reels**: Vertical short-form video content
- **Posts**: Image/video posts with captions, hashtags, location
- **Likes & Comments**: Interactive engagement system
- **Save Posts**: Bookmark favorite content
- **Share**: Share posts with others

### ✅ Real-Time Communication
- **Socket.IO Integration**: Real-time messaging and updates
- **One-to-One Chat**: Direct messaging with typing indicators
- **Message Status**: Sent, Delivered, Read indicators
- **Media Messages**: Send images, videos, audio files
- **Message Reactions**: React to messages with emojis
- **Online/Offline Status**: Real-time presence indicators

### ✅ Voice & Video Calls
- **WebRTC Integration**: Peer-to-peer calling
- **Audio Calls**: High-quality voice calls
- **Video Calls**: Face-to-face video communication
- **Call History**: Track past calls
- **Call Notifications**: Incoming call alerts

### ✅ Couples Features 💑
- **Couple Partner**: Link accounts as a couple
- **Anniversary Tracker**: Remember special dates
- **Couples-Only Content**: Private posts for partners only
- **Special Couple Chat**: Designated couple chat with 💑 emoji

### ✅ Discovery & Search
- **User Search**: Find users by username or name
- **Hashtag Search**: Discover posts by hashtags
- **Trending Content**: Explore popular posts and reels
- **Suggested Users**: Friend recommendations

### ✅ Notifications
- **Real-time Notifications**: Instant updates
- **Push Notifications**: Firebase Cloud Messaging
- **Notification Types**:
  - New follower
  - Post likes and comments
  - New messages
  - Story views
  - Call notifications
  - Anniversary reminders

### ✅ Privacy & Security
- **Private Accounts**: Control who can see your content
- **Close Friends List**: Share with select people
- **Content Visibility**: Public, Followers, Close Friends, Couples Only
- **Block Users**: Prevent unwanted interactions
- **Report System**: Report inappropriate content
- **Rate Limiting**: Prevent spam and abuse

## 🏗️ Technical Architecture

### Backend Technologies
- **Node.js** with **Express.js**: REST API server
- **PostgreSQL** with **Sequelize ORM**: Relational database
- **Socket.IO**: Real-time bidirectional communication
- **JWT**: Stateless authentication
- **Cloudinary**: Media storage and CDN
- **Firebase Admin**: Push notifications
- **Bcrypt**: Password hashing
- **Multer**: File upload handling

### Frontend Technologies
- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe JavaScript
- **Redux Toolkit**: State management
- **React Navigation**: Navigation solution
- **Axios**: HTTP client
- **Socket.IO Client**: Real-time communication
- **React Native WebRTC**: Video calling
- **AsyncStorage**: Local data persistence
- **React Native Vector Icons**: Icon library
- **React Native Fast Image**: Optimized images

### Development Tools
- **Nodemon**: Auto-restart server on changes
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework

## 📂 Project Structure

```
ConnectMe/
├── README.md                 # Main documentation
├── SETUP.md                  # Setup instructions
├── API_DOCS.md              # API documentation
├── ARCHITECTURE.md          # Architecture details
├── .gitignore               # Git ignore rules
│
├── backend/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── models/         # Database models (8 models)
│   │   ├── routes/         # API routes (9 route files)
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, upload, error handling
│   │   ├── utils/          # Helper functions
│   │   ├── sockets/        # Socket.IO handlers
│   │   └── server.js       # Entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── mobile/                  # React Native App
    ├── src/
    │   ├── navigation/     # Navigation setup (3 navigators)
    │   ├── screens/        # App screens (15+ screens)
    │   ├── components/     # Reusable components
    │   ├── redux/          # Redux store and slices (5 slices)
    │   ├── services/       # API and Socket services
    │   ├── types/          # TypeScript definitions
    │   ├── theme/          # Styling constants
    │   ├── hooks/          # Custom hooks
    │   └── utils/          # Helper functions
    ├── android/            # Android native code
    ├── ios/                # iOS native code
    ├── App.tsx             # Root component
    ├── package.json
    ├── tsconfig.json
    └── .gitignore
```

## 📊 Database Models

1. **User**: User accounts and profiles
2. **Post**: Feed posts with media
3. **Story**: 24-hour temporary stories
4. **Reel**: Short-form videos
5. **Message**: Chat messages
6. **Conversation**: Chat conversations
7. **Notification**: User notifications
8. **Call**: Call history

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/unfollow` - Unfollow user

### Posts
- `GET /api/posts` - Get feed
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/comment` - Comment on post

### Chat
- `GET /api/chats` - Get conversations
- `POST /api/chats` - Create conversation
- `GET /api/messages/:conversationId` - Get messages

### Search
- `GET /api/search/users?q=query` - Search users
- `GET /api/search/posts?q=query` - Search posts

## 🎨 UI/UX Features

### Design Philosophy
- **Instagram-Inspired**: Familiar, intuitive interface
- **Modern Aesthetics**: Clean, contemporary design
- **Responsive**: Adapts to different screen sizes
- **Smooth Animations**: Polished user experience
- **Dark Mode Ready**: Theme support built-in

### Navigation
- **Bottom Tab Navigation**: 5 main tabs
  - Home (Feed)
  - Search (Explore)
  - Reels (Videos)
  - Messages (Chat)
  - Profile (User)

### Color Scheme
- **Primary**: Pink/Red gradient (#FF3366)
- **Secondary**: Purple (#6B4EFF)
- **Couple Theme**: Deep Pink (#FF1493)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)

## 🚀 Performance Optimizations

1. **Lazy Loading**: Images load on demand
2. **Pagination**: Infinite scroll with page-based loading
3. **Image Compression**: Reduced file sizes
4. **Memoization**: React components optimized
5. **Virtual Lists**: Efficient rendering of long lists
6. **CDN Delivery**: Fast media loading via Cloudinary
7. **Database Indexing**: Optimized queries
8. **Connection Pooling**: Efficient socket connections

## 🔒 Security Features

1. **Password Hashing**: Bcrypt with salt
2. **JWT Tokens**: Secure authentication
3. **Input Validation**: Prevent injection attacks
4. **Rate Limiting**: Prevent abuse
5. **CORS Configuration**: Controlled access
6. **Helmet.js**: Security headers
7. **Data Sanitization**: NoSQL injection protection

## 📱 Supported Platforms

- **iOS**: iOS 12.4 or later
- **Android**: Android 6.0 (API 23) or later

## 🔮 Future Enhancements

### Planned Features
- [ ] Group Chats (3+ participants)
- [ ] Live Streaming
- [ ] Story Highlights
- [ ] Filters & Effects for photos
- [ ] Advanced Video Editing
- [ ] Voice Messages in posts
- [ ] Story Polls & Questions
- [ ] Location-based discovery
- [ ] In-app Purchases
- [ ] AR Filters
- [ ] Scheduled Posts
- [ ] Analytics Dashboard
- [ ] Multiple Account Support
- [ ] Story Mentions
- [ ] Post Insights
- [ ] Shared Albums (Couples)
- [ ] Relationship Milestones Timeline

### Technical Improvements
- [ ] Redis Caching
- [ ] Elasticsearch for search
- [ ] GraphQL API option
- [ ] Microservices architecture
- [ ] CI/CD Pipeline
- [ ] Automated Testing
- [ ] Load Balancing
- [ ] Database Sharding
- [ ] Image lazy loading optimization
- [ ] Offline mode support

## 📦 Dependencies Summary

### Backend (Key Dependencies)
- express: ^4.18.2
- sequelize: ^6.35.2
- pg: ^8.11.3
- pg-hstore: ^2.3.4
- socket.io: ^4.7.2
- jsonwebtoken: ^9.0.2
- bcryptjs: ^2.4.3
- cloudinary: ^1.40.0
- firebase-admin: ^11.11.0
- multer: ^1.4.5

### Mobile (Key Dependencies)
- react: 18.2.0
- react-native: 0.73.2
- @react-navigation/native: ^6.1.9
- @reduxjs/toolkit: ^2.0.1
- axios: ^1.6.5
- socket.io-client: ^4.7.2
- react-native-webrtc: ^118.0.0

## 🎓 Learning Resources

This project demonstrates:
- Full-stack mobile app development
- REST API design and implementation
- Real-time communication with WebSockets
- State management with Redux
- Authentication and authorization
- File upload and media handling
- Database design and optimization
- Mobile app navigation patterns
- TypeScript in React Native
- WebRTC video calling implementation

## 👥 Development Team Recommendations

### Backend Team (2-3 developers)
- Focus on API development
- Database optimization
- Socket.IO implementation
- Third-party integrations

### Mobile Team (2-3 developers)
- UI/UX implementation
- Redux state management
- WebRTC integration
- Platform-specific optimizations

### DevOps (1 developer)
- Server deployment
- CI/CD setup
- Monitoring and logging
- Performance optimization

## 📝 License

This project is created for educational and portfolio purposes.

## 🙏 Acknowledgments

- Instagram for design inspiration
- React Native community
- Socket.IO team
- MongoDB team
- Open-source contributors

---

**ConnectMe** - Connecting people, one moment at a time 💑📱

For detailed setup instructions, see [SETUP.md](SETUP.md)
For API documentation, see [API_DOCS.md](API_DOCS.md)
For architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md)
