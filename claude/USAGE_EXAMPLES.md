# Usage Examples 🎯

This guide shows practical examples of using ConnectMe commands.

## 🚀 Example 1: First Time Setup

```powershell
# Step 1: Navigate to project
cd C:\Users\USER\Desktop\ConnectMe

# Step 2: Install all dependencies at once
PS C:\Users\USER\Desktop\ConnectMe> npm run install:all

> connectme@1.0.0 install:all
> npm install && cd backend && npm install && cd ../web && npm install && cd ../mobile && npm install

# ... installs root dependencies
# ... installs backend dependencies
# ... installs web dependencies  
# ... installs mobile dependencies

✅ All dependencies installed!

# Step 3: Configure environment files
cd backend
copy .env.example .env
cd ..\web
copy .env.example .env.local
cd ..\mobile
copy .env.example .env
cd ..

# Step 4: Start MongoDB (separate terminal)
mongod

# Step 5: Run everything with one command!
npm run dev
```

---

## 🎨 Example 2: Development Mode Output (All Three Platforms)

When you run `npm run dev`, you'll see output like this:

```
PS C:\Users\USER\Desktop\ConnectMe> npm run dev

> connectme@1.0.0 dev
> concurrently "npm run dev:backend" "npm run dev:web" "npm run dev:mobile" --names "API,WEB,MOBILE" --prefix-colors "blue,green,magenta"

[API] > connectme-backend@1.0.0 dev
[WEB] > connectme-web@1.0.0 dev
[MOBILE] > connectme-mobile@1.0.0 start

[API] > nodemon src/server.js
[WEB] > next dev
[MOBILE] > expo start
[API] > nodemon src/server.js
[UI]  > ConnectMeMobile@1.0.0 start
[UI]  > react-native start

[API] [nodemon] 3.0.1
[API] [nodemon] to restart at any time, enter `rs`
[API] [nodemon] watching path(s): *.*
[API] [nodemon] watching extensions: js,mjs,cjs,json
[API] [nodemon] starting `node src/server.js`
[UI]  
[UI]                  ######                ######               
[UI]                ##      ##            ##      ##            
[UI]              ##          ##        ##          ##          
[UI]              ##            ##    ##            ##          
[UI]              ##            ##    ##            ##          
[UI]              ##          ##        ##          ##          
[UI]                ##      ##            ##      ##            
[UI]                  ######                ######               
[UI]  
[API] 🚀 Server running on port 5000
[API] ✅ Database connected successfully
[API] ✅ Socket.IO initialized
[UI]  │  Welcome to Metro v0.73.2
[UI]  │  Fast - Scalable - Integrated
[UI]  │  
[UI]  │  
[UI]  │  To reload the app press "r"
[UI]  │  To open developer menu press "d"
[API] 📱 API ready: http://localhost:5000
[UI]  📱 Metro bundler ready on http://localhost:8081
```

**Color Legend:**
- 🔵 `[API]` - Backend logs (blue)
- � `[WEB]` - Web app logs (green)
- 🟣 `[MOBILE]` - Mobile logs (magenta)

---

## 🌐 Example 3: Running Web App Only (Fastest!)

```powershell
PS C:\Users\USER\Desktop\ConnectMe> npm run web

> connectme@1.0.0 web
> cd web && npm run dev

> connectme-web@1.0.0 dev
> next dev

  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.100:3000

 ✓ Ready in 2.3s
 ○ Compiling / ...
 ✓ Compiled / in 1.2s (537 modules)
 
🌐 Web app ready!
   - Desktop: http://localhost:3000
   - Mobile: http://192.168.1.100:3000 (same network)
   - Features: Responsive design, PWA, Dark mode
```

**What you get:**
- 🖥️ Full Instagram-like experience on desktop
- 📱 Touch-optimized mobile web version
- 💻 Perfect tablet layout
- 🌙 Auto dark mode support
- 📲 Can install as Progressive Web App

---

## 📱 Example 4: Running on iOS

```powershell
PS C:\Users\USER\Desktop\ConnectMe> npm run ios

> connectme@1.0.0 ios
> cd mobile && npm run ios

> ConnectMeMobile@1.0.0 ios
> react-native run-ios

info Found Xcode workspace "ConnectMeMobile.xcworkspace"
info Building (using "xcodebuild -workspace ConnectMeMobile.xcworkspace ...")
success Successfully built the app
info Installing "/Users/USER/Library/Developer/Xcode/DerivedData/..."
info Launching "org.connectme.ConnectMeMobile"

success Successfully launched the app on the simulator
```

---

## 🤖 Example 5: Running on Android

```powershell
PS C:\Users\USER\Desktop\ConnectMe> npm run android

> connectme@1.0.0 android
> cd mobile && npm run android

> ConnectMeMobile@1.0.0 android
> react-native run-android

info Running jetifier to migrate libraries to AndroidX.
info Starting JS server...
info Launching emulator...
info Successfully launched emulator.
info Installing the app...

> Task :app:installDebug
Installing APK 'app-debug.apk' on 'Pixel_5_API_31(AVD)' for :app:debug
Installed on 1 device.

BUILD SUCCESSFUL in 1m 23s

info Connecting to the development server...
info Starting the app on "emulator-5554"...
success Successfully launched the app on the emulator
```

---

## 🧪 Example 6: Running Tests

```powershell
PS C:\Users\USER\Desktop\ConnectMe> npm test

> connectme@1.0.0 test
> concurrently "npm run test:backend" "npm run test:mobile" --names "API,UI"

[API] > connectme-backend@1.0.0 test
[API] > jest --watchAll=false
[UI]  > ConnectMeMobile@1.0.0 test
[UI]  > jest

[API] PASS  src/__tests__/auth.test.js
[API]   Auth Controller
[API]     ✓ should register a new user (145ms)
[API]     ✓ should login a user (89ms)
[API]     ✓ should verify OTP (67ms)
[UI]  PASS  src/__tests__/components/PostCard.test.tsx
[UI]    PostCard Component
[UI]      ✓ renders correctly (42ms)
[UI]      ✓ handles like button press (35ms)

[API] Test Suites: 8 passed, 8 total
[API] Tests:       45 passed, 45 total
[UI]  Test Suites: 12 passed, 12 total
[UI]  Tests:       67 passed, 67 total

✅ All tests passed!
```

---

## 🧹 Example 7: Cleaning Dependencies

```powershell
PS C:\Users\USER\Desktop\ConnectMe> npm run clean

> connectme@1.0.0 clean
> npm run clean:backend && npm run clean:mobile

> connectme@1.0.0 clean:backend
> cd backend && if exist node_modules rmdir /s /q node_modules ...

> connectme@1.0.0 clean:mobile
> cd mobile && if exist node_modules rmdir /s /q node_modules ...

✅ Cleaned backend dependencies
✅ Cleaned mobile dependencies
✅ Cleaned iOS pods
✅ All clean! Run 'npm run install:all' to reinstall.
```

---

## 🔧 Example 8: Backend Only Development

```powershell
PS C:\Users\USER\Desktop\ConnectMe> npm run dev:backend

> connectme@1.0.0 dev:backend
> cd backend && npm run dev

> connectme-backend@1.0.0 dev
> nodemon src/server.js

[nodemon] 3.0.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/server.js`

🚀 Server running on port 5000
✅ Database connected successfully
✅ Socket.IO initialized on port 5000
📡 WebRTC signaling server ready
📱 API Endpoints:
   - Health Check: http://localhost:5000/health
   - Auth: http://localhost:5000/api/auth
   - Users: http://localhost:5000/api/users
   - Posts: http://localhost:5000/api/posts
```

---

## 📊 Example 9: Build for Production

```powershell
PS C:\Users\USER\Desktop\ConnectMe> npm run build

> connectme@1.0.0 build
> npm run build:backend && npm run build:web && npm run build:mobile

> connectme@1.0.0 build:backend
> cd backend && echo Backend build completed - no build step needed for Node.js

Backend build completed - no build step needed for Node.js

> connectme@1.0.0 build:web
> cd web && npm run build

> connectme-web@1.0.0 build
> next build

   ▲ Next.js 14.1.0

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (15/15)
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         85 kB
├ ○ /auth/login                          8.1 kB         93 kB
├ ○ /feed                                12 kB          97 kB
└ ○ /profile/[id]                        7.8 kB         92 kB

> connectme@1.0.0 build:mobile
> cd mobile && npm run build

> Building Android Release APK...
> Building iOS Archive...

✅ Build completed!
  📦 Android: mobile/android/app/build/outputs/apk/release/app-release.apk
  📦 iOS: mobile/ios/build/ConnectMeMobile.xcarchive
```

---

## 💡 Pro Tips

### Tip 1: Keep Services Running
Run `npm run dev` in one terminal and keep it running while you develop in your code editor.

### Tip 2: Check Backend API
While backend is running, visit:
- http://localhost:5000/health - Health check
- http://localhost:5000/api/auth/test - Test endpoint

### Tip 3: Metro Bundler Commands
When Metro is running, press:
- `r` - Reload app
- `d` - Open developer menu

### Tip 4: Restart Services
In the terminal running `npm run dev`:
- Press `Ctrl+C` to stop both services
- Run `npm run dev` again to restart

### Tip 5: Individual Service Control
```powershell
# Terminal 1 - Backend only
npm run dev:backend

# Terminal 2 - Mobile only
npm run dev:mobile
```

### Tip 6: Quick Backend Test
```powershell
# Start backend
npm run dev:backend

# In another terminal, test API
curl http://localhost:5000/health
```

---

## 🐛 Troubleshooting Examples

### Issue: Port 5000 Already in Use

```powershell
# Check what's using port 5000
PS C:\Users\USER\Desktop\ConnectMe> netstat -ano | findstr :5000

  TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING       12345

# Kill the process
PS C:\Users\USER\Desktop\ConnectMe> taskkill /PID 12345 /F

SUCCESS: The process with PID 12345 has been terminated.

# Now restart
npm run dev
```

### Issue: Metro Bundler Cache Problems

```powershell
# Stop services (Ctrl+C)

# Clear Metro cache
cd mobile
npm start -- --reset-cache
```

### Issue: iOS Pod Installation Failed

```powershell
cd mobile/ios
pod deintegrate
pod cache clean --all
pod install
cd ../..
npm run ios
```

---

## 📝 Daily Development Workflow

```powershell
# Morning - Start development
cd C:\Users\USER\Desktop\ConnectMe

# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start both services
npm run dev

# Code in VS Code...
# Both services auto-reload on changes!

# Afternoon - Test on device
# Stop dev (Ctrl+C)
npm run android  # or npm run ios

# Evening - Run tests before committing
npm test

# Commit your changes
git add .
git commit -m "Feature: Added new functionality"
git push
```

---

**Happy Coding! 🚀**
