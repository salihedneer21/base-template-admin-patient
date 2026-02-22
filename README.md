# Base Template Admin Patient

Vite + React 19 + React Router + Tailwind CSS v4 + Convex + Better Auth

## Local Development Setup

### First Time Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start Convex (answer "No" to login prompt for local-only mode)
npx convex dev

# 3. In another terminal, set environment variables
npx convex env set BETTER_AUTH_SECRET "your-secret-key-must-be-at-least-32-characters-long"
npx convex env set SITE_URL "http://localhost:5173"

# 4. Create admin account
npx convex run seed/admin:seedAdmin

# 5. Frontend
pnpm dev:vite     # Start Vite only
```

Admin credentials: `admin1@gmail.com` / `adminadmin`

### Running After Initial Setup

```bash
pnpm dev
```

Opens at `http://localhost:5173`

## Commands

```bash
pnpm dev          # Start Convex + Vite dev servers
pnpm dev:vite     # Start Vite only
pnpm lint         # TypeScript check + ESLint
pnpm build        # Deploy Convex and build for production
```

## Convex CLI

```bash
npx convex dev                # Start dev server
npx convex env set KEY val    # Set environment variable
npx convex run seed/admin:seedAdmin  # Create admin user
npx convex logs               # View function logs
```

## Documentation

See `CLAUDE.md` for detailed architecture and development guidelines.
