# ConnectMe - Complete Setup Guide

This guide will walk you through setting up the entire ConnectMe application from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

### For Mobile Development
- **React Native CLI** - `npm install -g react-native-cli`
- **Watchman** (macOS only) - `brew install watchman`

#### For iOS Development (macOS only)
- **Xcode** 12 or higher - [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **CocoaPods** - `sudo gem install cocoapods`

#### For Android Development
- **Android Studio** - [Download](https://developer.android.com/studio)
- **JDK** 11 or higher
- **Android SDK** (comes with Android Studio)
- Set up Android environment variables (ANDROID_HOME, PATH)

### External Services (Optional but Recommended)
- **Cloudinary Account** - For media storage [Sign up](https://cloudinary.com/)
- **Firebase Account** - For push notifications [Sign up](https://firebase.google.com/)
- **Twilio Account** - For SMS/OTP [Sign up](https://www.twilio.com/)
- **SendGrid Account** - For emails [Sign up](https://sendgrid.com/)

---

## 🚀 Part 1: Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd ConnectMe/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/connectme
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/connectme

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_min_32_characters
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary (for media storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase (for push notifications)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Key Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# Twilio (for SMS/OTP)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid (for emails)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@connectme.com

# Client URL
CLIENT_URL=http://localhost:3000
```

### Step 4: Start MongoDB
If using local MongoDB:
```bash
# macOS/Linux
mongod

# Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

If using MongoDB Atlas, skip this step.

### Step 5: Start the Backend Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server should start on `http://localhost:5000`

### Step 6: Verify Backend is Running
Open your browser or Postman and visit:
```
http://localhost:5000/health
```

You should see:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

---

## 📱 Part 2: Mobile App Setup

### Step 1: Navigate to Mobile Directory
```bash
cd ConnectMe/mobile
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the mobile directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# For local development
API_URL=http://localhost:5000/api
SOCKET_URL=http://localhost:5000

# For Android emulator, use:
# API_URL=http://10.0.2.2:5000/api
# SOCKET_URL=http://10.0.2.2:5000

# For iOS simulator, use:
# API_URL=http://localhost:5000/api
# SOCKET_URL=http://localhost:5000

# For physical device on same network
# API_URL=http://192.168.1.XXX:5000/api (replace XXX with your IP)
# SOCKET_URL=http://192.168.1.XXX:5000
```

### Step 4: iOS Setup (macOS only)

#### Install iOS Dependencies
```bash
cd ios
pod install
cd ..
```

#### Run on iOS Simulator
```bash
npm run ios

# Or specify a device
npm run ios -- --simulator="iPhone 14 Pro"
```

### Step 5: Android Setup

#### Open Android Studio
1. Open Android Studio
2. Open the `android` folder from the mobile directory
3. Let Android Studio download all necessary dependencies
4. Wait for Gradle to finish syncing

#### Start Android Emulator
1. In Android Studio, go to Tools > Device Manager
2. Create a new virtual device or start an existing one
3. Or use a physical device connected via USB (enable USB debugging)

#### Run on Android
```bash
npm run android
```

### Step 6: Start Metro Bundler (if not auto-started)
```bash
npm start

# Or with cache reset
npm start -- --reset-cache
```

---

## 🔧 Troubleshooting

### Backend Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running. Start it with `mongod` or check MongoDB Atlas connection string.

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** 
```bash
# Find process using port 5000
# macOS/Linux
lsof -i :5000
# Windows
netstat -ano | findstr :5000

# Kill the process or change PORT in .env
```

### Mobile App Issues

#### Metro Bundler Error
```bash
# Clear cache and reinstall
npm start -- --reset-cache
rm -rf node_modules
npm install
```

#### iOS Build Errors
```bash
# Clean build
cd ios
rm -rf build
rm -rf Pods
pod install
cd ..
npm run ios
```

#### Android Build Errors
```bash
# Clean Gradle cache
cd android
./gradlew clean
cd ..
npm run android
```

#### React Native Version Mismatch
```bash
# Clear watchman
watchman watch-del-all

# Clear React Native cache
rm -rf $TMPDIR/react-*

# Reset Metro bundler
npm start -- --reset-cache
```

---

## 🧪 Testing the Application

### 1. Create a Test Account
1. Open the mobile app
2. Click "Create Account"
3. Fill in the registration form:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
4. Click "Create Account"

### 2. Test Authentication
- You should be automatically logged in
- Check if the token is stored in AsyncStorage

### 3. Test Feed
- The feed should load (empty initially)
- Try creating a post (placeholder screen)

### 4. Test Profile
- Navigate to Profile tab
- You should see your username and stats

---

## 📊 Database Management

### View Database Contents (MongoDB Compass)
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Select `connectme` database
4. Browse collections: users, posts, stories, messages, etc.

### Useful MongoDB Commands
```javascript
// Connect to MongoDB shell
mongo

// Show databases
show dbs

// Use ConnectMe database
use connectme

// Show collections
show collections

// Find all users
db.users.find().pretty()

// Count documents
db.posts.countDocuments()

// Delete all data (caution!)
db.dropDatabase()
```

---

## 🎨 Cloudinary Setup (Media Storage)

### Step 1: Create Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Note your Cloud Name, API Key, and API Secret

### Step 2: Configure Backend
Add to backend `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3: Test Upload
The image/video uploads will automatically use Cloudinary when configured.

---

## 🔔 Firebase Push Notifications Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Add both iOS and Android apps

### Step 2: Download Configuration Files

#### For Android
1. Download `google-services.json`
2. Place in `mobile/android/app/`

#### For iOS
1. Download `GoogleService-Info.plist`
2. Place in `mobile/ios/`

### Step 3: Get Service Account Key (Backend)
1. In Firebase Console, go to Project Settings > Service Accounts
2. Click "Generate New private Key"
3. Download the JSON file
4. Extract the values and add to backend `.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

---

## 📞 Twilio SMS Setup (Optional)

### Step 1: Create Account
1. Go to [Twilio](https://www.twilio.com/)
2. Sign up and verify your phone number
3. Get a Twilio phone number

### Step 2: Get Credentials
1. From Twilio Console, copy:
   - Account SID
   - Auth Token
   - Your Twilio phone number

### Step 3: Configure Backend
Add to `.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 📧 SendGrid Email Setup (Optional)

### Step 1: Create Account
1. Go to [SendGrid](https://sendgrid.com/)
2. Sign up for free account

### Step 2: Generate API Key
1. Go to Settings > API Keys
2. Create a new API key
3. Copy the key

### Step 3: Configure Backend
Add to `.env`:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
FROM_EMAIL=noreply@connectme.com
```

---

## 🚢 Production Deployment

### Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create connectme-api

# Set environment variables
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set JWT_SECRET=your_secret
# ... set all other env vars

# Deploy
git push heroku main

# Open app
heroku open
```

### Mobile App Deployment

#### iOS (App Store)
1. Open Xcode
2. Configure signing & capabilities
3. Archive the app
4. Upload to App Store Connect
5. Submit for review

#### Android (Google Play)
1. Generate signed APK/AAB in Android Studio
2. Upload to Google Play Console
3. Fill in store listing
4. Submit for review

---

## 📚 Additional Resources

### Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Socket.IO Docs](https://socket.io/docs/v4/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)

### Video Tutorials
- React Native Setup: [YouTube](https://www.youtube.com/results?search_query=react+native+setup)
- Node.js Express API: [YouTube](https://www.youtube.com/results?search_query=nodejs+express+api)

---

## 🤝 Getting Help

If you encounter issues:

1. Check the error message carefully
2. Search for the error on Google/Stack Overflow
3. Check GitHub Issues (if applicable)
4. Ensure all dependencies are correctly installed
5. Verify environment variables are set correctly

---

## ✅ Next Steps

Once everything is set up:

1. ✅ Test all authentication flows
2. ✅ Create sample posts
3. ✅ Test real-time chat
4. ✅ Implement remaining features
5. ✅ Add tests
6. ✅ Optimize performance
7. ✅ Prepare for production

---

**Congratulations! Your ConnectMe app is now set up and ready for development! 🎉**
