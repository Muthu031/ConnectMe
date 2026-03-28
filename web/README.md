# ConnectMe Web Application

Responsive web application for desktop, tablet, and mobile devices built with Next.js 14.

## 🎯 Features

### Responsive Design
- ✅ **Desktop**: Full-featured Instagram-like experience with sidebar
- ✅ **Tablet**: Optimized layout with adaptive navigation
- ✅ **Mobile**: Touch-optimized UI with bottom navigation
- ✅ **Progressive Web App (PWA)**: Install on any device

### Core Functionality
- ✅ Modern Next.js 14 App Router
- ✅ Server-Side Rendering (SSR)
- ✅ Static Site Generation (SSG)
- ✅ TypeScript for type safety
- ✅ Material-UI components
- ✅ Redux Toolkit state management
- ✅ Dark mode support
- ✅ Real-time updates with Socket.IO
- ✅ WebRTC video/voice calls
- ✅ Optimized images with Next.js Image
- ✅ Progressive image loading
- ✅ Infinite scroll feeds

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Access the app at: `http://localhost:3000`

## 📱 Responsive Breakpoints

```typescript
- Mobile: < 768px (Bottom navigation)
- Tablet: 768px - 1279px (Hybrid layout)
- Desktop: ≥ 1280px (Full sidebar layout)
```

## 🎨 Features by Screen Size

### Mobile (< 768px)
- Bottom navigation bar
- Single column feed
- Full-screen modals
- Touch-optimized gestures
- Swipe navigation for stories

### Tablet (768px - 1279px)
- Top navigation with search
- Two-column layout (optional)
- Sidebars for chat/profile
- Hybrid touch + mouse support

### Desktop (≥ 1280px)
- Full sidebar with suggestions
- Three-column layout
- Hover effects and tooltips
- Keyboard shortcuts
- Multi-window support

## 🛠️ Tech Stack

### Framework & Core
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Material-UI (MUI)**: Component library

### State Management
- **Redux Toolkit**: Global state
- **React Context**: Theme management
- **SWR**: Data fetching and caching

### Real-time Features
- **Socket.IO Client**: Real-time messaging
- **Simple Peer**: WebRTC connections
- **React Webcam**: Camera access

### Media & UI
- **Framer Motion**: Animations
- **React Player**: Video playback
- **Swiper**: Touch sliders
- **Emoji Picker React**: Emoji support
- **React Dropzone**: File uploads

### Forms & Validation
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Utilities
- **Axios**: HTTP client
- **date-fns**: Date formatting
- **React Hot Toast**: Notifications

## 📁 Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── feed/              # Main feed page
│   │   ├── profile/           # User profiles
│   │   ├── chat/              # Messaging
│   │   ├── reels/             # Short videos
│   │   └── layout.tsx         # Root layout
│   │
│   ├── components/            # Reusable components
│   │   ├── layouts/           # Layout components
│   │   ├── feed/              # Feed components
│   │   ├── chat/              # Chat components
│   │   ├── common/            # Shared components
│   │   └── ...
│   │
│   ├── redux/                 # State management
│   │   ├── store.ts
│   │   └── slices/
│   │
│   ├── lib/                   # Utilities & configs
│   │   ├── api.ts             # API client
│   │   ├── socket.ts          # Socket.IO client
│   │   └── webrtc.ts          # WebRTC utilities
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Helper functions
│   └── styles/                # Global styles
│
├── public/                    # Static assets
│   ├── icons/                 # App icons
│   └── manifest.json          # PWA manifest
│
├── next.config.js             # Next.js config
├── tsconfig.json              # TypeScript config
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

### PWA Configuration

Edit `public/manifest.json`:

```json
{
  "name": "ConnectMe",
  "short_name": "ConnectMe",
  "description": "Social Media & Couples Communication",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#E1306C",
  "background_color": "#FAFAFA"
}
```

## 🎯 Development Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Building
npm run build            # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
npm run format          # Format code with Prettier

# Testing
npm test                # Run tests
npm run test:watch      # Watch mode
```

## 📱 Progressive Web App (PWA)

The web app can be installed on any device:

### Desktop (Chrome/Edge)
1. Click install icon in address bar
2. Or: Menu → Install ConnectMe

### Mobile (iOS Safari)
1. Tap Share button
2. Select "Add to Home Screen"

### Mobile (Android Chrome)
1. Tap menu (⋮)
2. Select "Install App"

## 🎨 Theming

### Dark Mode
Automatically syncs with system preferences or manual toggle.

```typescript
import { useTheme } from '@/components/ThemeProvider'

const { theme, toggleTheme } = useTheme()
```

### Custom Colors

Edit `src/components/ThemeProvider.tsx`:

```typescript
primary: '#E1306C',      // Instagram pink
secondary: '#833AB4',    // Purple
```

## 🚀 Performance Optimizations

- ✅ Image optimization with Next.js Image
- ✅ Code splitting and lazy loading
- ✅ Server-side rendering
- ✅ Static page generation
- ✅ Incremental static regeneration
- ✅ React component memoization
- ✅ Virtual scrolling for long lists
- ✅ Service worker caching (PWA)

## 📊 Bundle Analysis

```bash
npm run build
# Check .next/build-manifest.json
```

## 🔒 Security

- ✅ CSRF protection
- ✅ XSS prevention
- ✅ Content Security Policy
- ✅ Secure headers
- ✅ JWT token management
- ✅ HTTPS enforcement

## 🌐 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: iOS 12+
- Chrome Android: Latest

## 📝 License

MIT

---

**Built with ❤️ using Next.js 14**
