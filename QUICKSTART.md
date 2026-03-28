# ConnectMe - Quick Start Guide ⚡

Get ConnectMe up and running in under 10 minutes!

## 🎯 EASIEST WAY - Run All Three Platforms with One Command!

```bash
# 1. Go to root ConnectMe folder
cd ConnectMe

# 2. Install dependencies for backend, web, and mobile
npm run install:all

# 3. Create environment files
cd backend && cp .env.example .env && cd ..
cd web && cp .env.example .env.local && cd ..
cd mobile && cp .env.example .env && cd ..

# 4. Edit backend/.env with minimum required values:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/connectme
JWT_SECRET=my_super_secret_key_change_this_in_production_min_32_chars
JWT_REFRESH_SECRET=my_refresh_secret_key_change_in_production_also_32

# 5. Start MongoDB (in another terminal)
mongod

# 6. Run ALL THREE (backend + web + mobile) together! 🚀
npm run dev
```

That's it! All three platforms will start together in one terminal with color-coded logs:
- 🔵 Blue = Backend API
- 🟢 Green = Web App
- 🟣 Magenta = Mobile App

**Access Points:**
- Backend API: http://localhost:5000
- Web App: http://localhost:3000
- Mobile: Will open in simulator/emulator

---

## 🌐 Run Only Web App (Fastest for Testing!)

```bash
# 1. From root
cd ConnectMe

# 2. Install dependencies
npm run install:all

# 3. Set up environment
cd backend && cp .env.example .env && cd ..
cd web && cp .env.example .env.local && cd ..

# 4. Setup PostgreSQL (see POSTGRESQL_SETUP.md for detailed guide)
# Create database: psql -U postgres -c "CREATE DATABASE connectme;"
cd backend
node init-db.js

# 5. Start backend API
npm run dev:backend

# 6. In another terminal, start web
npm run web
```

Open http://localhost:3000 in your browser! 🎉

---

## 📱 Run Mobile on Device

From the root ConnectMe folder:

```bash
# For iOS
npm run ios

# For Android
npm run android
```

---

## ⚡ Super Quick Setup

### Prerequisites Check ✓
```bash
node --version    # Should be v16+
npm --version     # Should be 8+
psql --version    # PostgreSQL installed
```

## 🚀 5-Minute Backend Setup (Alternative - Manual)

```bash
# 1. Go to backend
cd ConnectMe/backend

# 2. Install dependencies (2-3 minutes)
npm install

# 3. Create .env file
cp .env.example .env

# 4. Edit .env - MINIMUM REQUIRED:
# Just copy these two lines:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/connectme
JWT_SECRET=my_super_secret_key_change_this_in_production_min_32_chars
JWT_REFRESH_SECRET=my_refresh_secret_key_change_in_production_also_32

# 5. Start MongoDB (in another terminal)
mongod

# 6. Start backend
npm run dev
```

✅ **Backend running!** Visit http://localhost:5000/health

---

## 🌐 5-Minute Web Setup

### Fastest Way to See the App!

```bash
# 1. Go to web folder
cd ConnectMe/web

# 2. Install dependencies (2-3 minutes)
npm install

# 3. Create .env.local
cp .env.example .env.local

# Default values work perfectly:
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# 4. Start the web app
npm run dev
```

✅ **Web app running!** Visit http://localhost:3000

**Features:**
- 🖥️ Desktop: Full sidebar layout
- 📱 Mobile: Touch-optimized with bottom navigation
- 💻 Tablet: Hybrid responsive design
- 🌙 Dark mode support
- 📲 Can be installed as PWA

---

## 📱 5-Minute Mobile Setup

### For iOS (macOS only):
```bash
# 1. Go to mobile folder
cd ConnectMe/mobile

# 2. Install dependencies (3-4 minutes)
npm install

# 3. Install iOS pods
cd ios && pod install && cd ..

# 4. Create .env
cp .env.example .env
# No need to edit - defaults work for iOS simulator

# 5. Run the app
npm run ios
```

### For Android:
```bash
# 1. Go to mobile folder
cd ConnectMe/mobile

# 2. Install dependencies (3-4 minutes)
npm install

# 3. Create .env and edit for Android
cp .env.example .env

# Edit .env:
API_URL=http://10.0.2.2:5000/api
SOCKET_URL=http://10.0.2.2:5000

# 4. Start Android emulator or connect device

# 5. Run the app
npm run android
```

---

## 🎉 Test Your Setup

### Test 1: Backend Health Check
Open browser: `http://localhost:5000/health`

Should see:
```json
{
  "status": "success",
  "message": "Server is running"
}
```

### Test 2: Create Account in App
1. Open the app (should see Welcome screen)
2. Click "Create Account"
3. Fill in:
   - Username: `testuser`
   - Email: `test@test.com`
   - Password: `password123`
4. Click "Create Account"
5. You should be logged in! 🎉

---

## 🐛 Quick Fixes

### "MongoDB not running"
```bash
# Start MongoDB
mongod

# Or on macOS with Homebrew:
brew services start mongodb-community
```

### "Port 5000 already in use"
```bash
# Kill process on port 5000
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Metro bundler not starting"
```bash
# Clear cache
npm start -- --reset-cache
```

### "Android can't connect to backend"
Make sure .env has:
```
API_URL=http://10.0.2.2:5000/api
SOCKET_URL=http://10.0.2.2:5000
```

### "iOS build failed"
```bash
cd ios
rm -rf Pods build
pod install
cd ..
npm run ios
```

---

## 📂 Project File Overview

```
ConnectMe/
├── README.md           ← Start here  
├── SETUP.md            ← Full setup guide
├── API_DOCS.md         ← API reference
├── ARCHITECTURE.md     ← System design
├── PROJECT_OVERVIEW.md ← Feature list
│
├── backend/            ← Node.js backend
│   ├── src/
│   │   ├── server.js   ← Entry point
│   │   ├── models/     ← Database models
│   │   ├── routes/     ← API endpoints
│   │   └── sockets/    ← Real-time chat
│   ├── .env.example    ← Copy to .env
│   └── package.json
│
└── mobile/             ← React Native app
    ├── App.tsx         ← Root component
    ├── src/
    │   ├── screens/    ← App screens
    │   ├── navigation/ ← Navigation setup
    │   ├── redux/      ← State management
    │   └── services/   ← API & Socket
    ├── .env.example    ← Copy to .env
    └── package.json
```

---

## 🎯 What's Working Right Now

✅ **Authentication**
- Login/Register
- JWT tokens
- User profiles

✅ **Feed**
- View posts
- Infinite scroll
- Stories section

✅ **Profile**
- View profile
- User stats
- Logout

✅ **Navigation**
- 5 bottom tabs
- Screen transitions

✅ **Backend API**
- All REST endpoints
- Socket.IO ready
- Database models

---

## 🚧 What Needs Implementation

These features have the structure but need content:

- [ ] Create Post (screen exists, needs image picker)
- [ ] Story upload
- [ ] Reels feed
- [ ] Chat messages (Socket.IO ready)
- [ ] Video calls (WebRTC setup done)
- [ ] Search functionality
- [ ] Notifications UI
- [ ] Media upload to Cloudinary

---

## 📚 Next Steps

1. **Test the basic flow** - Register → Login → View Feed
2. **Read SETUP.md** - For detailed configuration
3. **Check API_DOCS.md** - For API endpoints
4. **Implement features** - Start with post creation
5. **Configure Cloudinary** - For image uploads
6. **Set up Firebase** - For push notifications

---

## 💡 Pro Tips

1. **Use MongoDB Compass** to view your database visually
2. **Use Postman** to test API endpoints
3. **Use React Native Debugger** for mobile debugging
4. **Check backend console** for API logs
5. **Use Redux DevTools** for state debugging

---

## 🆘 Need Help?

1. Check error messages in terminal
2. Look at backend logs
3. Check if MongoDB is running
4. Verify .env files are configured
5. Try clearing caches and reinstalling

---

## 🎊 You're All Set!

Your development environment is ready. Time to build awesome features! 🚀

**Happy Coding! 👨‍💻👩‍💻**

---

Quick Links:
- [Full Setup Guide](SETUP.md)
- [API Documentation](API_DOCS.md)
- [Architecture Details](ARCHITECTURE.md)
- [Project Overview](PROJECT_OVERVIEW.md)
