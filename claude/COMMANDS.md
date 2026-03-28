# ConnectMe - Command Reference 🚀

This document lists all available commands to run the ConnectMe application.

## 📍 Root Level Commands

Run these from the `ConnectMe` root directory:

### 🎯 Most Used Commands

```bash
# Start all three platforms (backend + web + mobile) together (recommended for development)
npm run dev

# Install dependencies for all projects
npm run install:all

# Run web app (opens at http://localhost:3000)
npm run web

# Run mobile on iOS simulator
npm run ios

# Run mobile on Android emulator
npm run android
```

---

## 📋 Complete Command List

### Development & Starting Services

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 **Start backend + web + mobile together** (with colored logs) |
| `npm run dev:full` | Same as `npm run dev` (all three platforms) |
| `npm start` | Alias for `npm run dev` |
| `npm run dev:backend` | Start only backend server (http://localhost:5000) |
| `npm run dev:web` | Start only web app (http://localhost:3000) |
| `npm run dev:mobile` | Start only mobile Metro bundler |

### Installation

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies for backend, web, and mobile |
| `npm install` | Install root-level dependencies (concurrently) |

### Platform Specific

| Command | Description |
|---------|-------------|
| `npm run web` | Run web app only (http://localhost:3000) |
| `npm run ios` | Run mobile app on iOS simulator |
| `npm run android` | Run mobile app on Android emulator/device |

### Testing

| Command | Description |
|---------|-------------|
| `npm test` | Run tests for all projects (backend, web, mobile) |
| `npm run test:backend` | Run backend tests only |
| `npm run test:web` | Run web tests only |
| `npm run test:mobile` | Run mobile tests only |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Lint all projects (backend, web, mobile) |
| `npm run lint:backend` | Lint backend code only |
| `npm run lint:web` | Lint web code only |
| `npm run lint:mobile` | Lint mobile code only |

### Production

| Command | Description |
|---------|-------------|
| `npm run build` | Build all projects for production |
| `npm run start:backend` | Start backend in production mode |
| `npm run start:web` | Start web in production mode |
| `npm run start:mobile` | Start mobile in production mode |

### Cleanup

| Command | Description |
|---------|-------------|
| `npm run clean` | Remove node_modules from all projects |
| `npm run clean:backend` | Clean backend dependencies |
| `npm run clean:web` | Clean web dependencies and .next folder |
| `npm run clean:mobile` | Clean mobile dependencies and build cache |

---

## 🔧 Individual Project Commands

### Backend Commands (from `backend/` directory)

### Backend Commands (from `backend/` directory)

```bash
cd backend

npm install          # Install dependencies
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start in production mode
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Web Commands (from `web/` directory)

```bash
cd web

npm install          # Install dependencies
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run lint         # Lint code
npm run type-check   # TypeScript type checking
```

### Mobile Commands (from `mobile/` directory)

```bash
cd mobile

npm install          # Install dependencies
npm start            # Start Metro bundler
npm run ios          # Run on iOS
npm run android      # Run on Android
npm test             # Run tests
npm run lint         # Lint code
```

---

## 💡 Common Workflows

### First Time Setup
```bash
# 1. Install all dependencies
npm run install:all

# 2. Set up environment files
cd backend && copy .env.example .env && cd ..
cd web && copy .env.example .env.local && cd ..
cd mobile && copy .env.example .env && cd ..

# 3. Configure .env files (add API keys, database URLs, etc.)

# 4. Start MongoDB
mongod

# 5. Run all services
npm run dev
```

### Daily Development
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Run all three (backend + web + mobile)
npm run dev
```

### Running Only Web App
```bash
# Start backend
npm run dev:backend

# In another terminal, run web
npm run web
# Open http://localhost:3000 in browser
```

### Running on iOS Device
```bash
# Start backend
npm run dev:backend

# In another terminal, run iOS
npm run ios
```

### Running on Android Device
```bash
# Make sure backend .env has correct IP
# Edit mobile/.env: API_URL=http://10.0.2.2:5000/api

# Start backend
npm run dev:backend

# In another terminal, run Android
npm run android
```

### Web App on Different Devices
```bash
# 1. Find your local IP address
# Windows: ipconfig
# Mac/Linux: ifconfig

# 2. Update web/.env.local with your IP
# NEXT_PUBLIC_API_URL=http://192.168.1.100:5000/api
 [API]** = Backend/API logs
- 🟢 **Green [WEB]** = Web app logs
- 🟣 **Magenta [MOBILE]vices
npm run dev

# 4. Access from any device on same network:
# http://192.168.1.100:3000
```

### Testing Everything
```bash
npm test
```

### Clean Install (when having issues)
```bash
# Clean everything
npm run clean

# Reinstall
npm run install:all
```

---

## 🎨 Command Output Colors

When using `npm run dev`, you'll see colored output:
- 🔵 **Blue** = Backend/API logs
- 🟣 **Magenta** = Mobile/UI logs

This makes it easy to see which service is logging what!

---

## ⚠️ Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Metro Bundler Issues
```bash
cd mobile
npm start -- --reset-cache
```

### iOS Pod Issues
```bash
cd mobile/ios
pod deintegrate
pod install
```

### Android Build Issues
```bash
cd mobile/android
gradlew clean
cd ../..
npm run android
```

---

## 📝 Notes

- Always ensure MongoDB is running before starting the backend
- For Android, use `10.0.2.2` instead of `localhost` to access the backend from emulator
- For iOS, `localhost` works fine in the simulator
- Use `npm run dev` for the best development experience - it runs both services together!

---

**Happy Coding! 🚀**
