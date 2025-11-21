# Pokémon Manager

A modern, full-stack Pokémon management application built with Next.js, Express.js, tRPC, and SQLite.

## 🎯 Features

### Core Features
- ✅ Browse first 150 Pokémon with beautiful grid layout
- ✅ Detailed Pokémon view with abilities, types, stats, and evolution chains
- ✅ Add/remove favorites with persistent storage
- ✅ Filter by favorites, types, and search by name
- ✅ Real-time synchronization between UI and backend

### Advanced Features
- 🚀 **Type-safe API** with tRPC for end-to-end type safety
- 💾 **Intelligent caching** on both client and server
- 🎨 **Beautiful UI** with Tailwind CSS and Framer Motion animations
- 📱 **Responsive design** optimized for all devices
- ⚡ **Optimistic updates** for instant UI feedback
- 🔍 **Debounced search** for better performance
- 🎭 **Loading states** and error handling
- ♿ **Accessible** with keyboard navigation support

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Framer Motion
- tRPC Client
- React Query
- Zustand (state management)

**Backend:**
- Express.js
- tRPC Server
- SQLite with better-sqlite3
- Drizzle ORM
- Node Cache
- Helmet & CORS

**Shared:**
- TypeScript types package
- Zod validation schemas

### Project Structure

```
pokemon-manager/
├── apps/
│   ├── server/              # Express + tRPC backend
│   │   ├── src/
│   │   │   ├── database/    # Database schema & migrations
│   │   │   ├── routers/     # tRPC routers
│   │   │   ├── services/    # Business logic
│   │   │   ├── middleware/  # Express middleware
│   │   │   └── index.ts     # Server entry point
│   │   └── package.json
│   │
│   └── web/                 # Next.js frontend
│       ├── src/
│       │   ├── app/         # App router pages
│       │   ├── components/  # React components
│       │   ├── lib/         # Utilities & tRPC client
│       │   └── store/       # Zustand stores
│       └── package.json
│
├── packages/
│   └── types/               # Shared TypeScript types
│
├── package.json             # Root package.json
└── pnpm-workspace.yaml      # Workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pokemon-manager
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Backend (`apps/server/.env`):
```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=./data/pokemon.db
CACHE_TTL=3600
```

Frontend (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. **Run database migrations**
```bash
pnpm db:migrate
```

5. **Start development servers**
```bash
# Start both frontend and backend concurrently
pnpm dev

# Or start them separately:
# Terminal 1 - Backend
cd apps/server
pnpm dev

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

6. **Open your browser**
- Frontend: http://localhost:3000
- Backend Health: http://localhost:3001/health
- Cache Stats: http://localhost:3001/cache/stats

## 📝 API Endpoints

### tRPC Procedures

**Queries:**
- `getList({ limit, offset })` - Get paginated Pokémon list
- `getDetail({ id })` - Get detailed Pokémon information
- `getFavorites()` - Get all favorite Pokémon
- `isFavorite({ pokemonId })` - Check if Pokémon is favorited

**Mutations:**
- `addFavorite({ pokemonId, pokemonName, pokemonSprite })` - Add to favorites
- `removeFavorite({ pokemonId })` - Remove from favorites

### REST Endpoints

- `GET /health` - Health check with cache stats
- `GET /cache/stats` - Detailed cache statistics
- `POST /cache/clear` - Clear server cache

## 🎨 UI/UX Features

- **Smooth animations** using Framer Motion
- **Gradient backgrounds** for visual appeal
- **Type-based color coding** for Pokémon types
- **Hover effects** and transitions
- **Loading skeletons** for better perceived performance
- **Empty states** with helpful messaging
- **Modal dialogs** for detailed views
- **Responsive grid layouts** that adapt to screen size

## Retry Mechanism
- Applied exponential backoff with jitter for the API calls especially when the error is not a 5XX and it's not happening during the getLists call.

## Authorization
- Used automatically generated sessionID for each unique user to mark their favorites

## 🔧 Development

### Commands

```bash
# Development
pnpm dev              # Start all services
pnpm build            # Build all packages
pnpm type-check       # TypeScript type checking
pnpm lint             # Lint all packages

# Database
pnpm db:migrate       # Run database migrations

# Individual packages
pnpm --filter @pokemon/server dev
pnpm --filter @pokemon/web dev
```

### Code Quality

- **TypeScript strict mode** for maximum type safety
- **Consistent naming conventions** across the codebase
- **Modular architecture** with clear separation of concerns
- **Error handling** at all layers
- **Input validation** with Zod schemas

## 🚢 Production Deployment

### Backend

Recommended platforms: Railway, Render, Fly.io

```bash
cd apps/server
pnpm build
pnpm start
```

Environment variables needed:
- `NODE_ENV=production`
- `PORT=3001`
- `DATABASE_URL=/path/to/production/db`
- `CORS_ORIGIN=https://your-frontend-domain.com`

### Frontend

Recommended platforms: Vercel, Netlify

```bash
cd apps/web
pnpm build
```

Environment variables needed:
- `NEXT_PUBLIC_API_URL=https://your-backend-domain.com`

## 🎯 Design Decisions

### Why tRPC?
- End-to-end type safety eliminates entire classes of bugs
- No need to maintain separate API documentation
- Autocomplete and IntelliSense throughout the stack
- Automatic request/response validation

### Why Zustand?
- Simpler and more lightweight than Redux
- No boilerplate code required
- Great TypeScript support
- Perfect for this scale of application

### Why SQLite?
- Zero configuration required
- Perfect for single-server deployments
- Excellent performance for read-heavy workloads
- Easy to backup and migrate

### Why Server-Side Caching?
- Reduces load on PokéAPI
- Faster response times for users
- Configurable TTL for data freshness
- Statistics endpoint for monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing the Pokémon data
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

---

**Built with ❤️ by Oluwatobi Adedeji**