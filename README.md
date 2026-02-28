# Base Template: Admin & Patient Portal

A production-ready starter template for building **role-based healthcare applications** with separate admin and patient dashboards. Built with React 19, Convex (real-time backend), Better Auth, and Tailwind CSS v4.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Seed the Admin Account](#seed-the-admin-account)
  - [Running the App](#running-the-app)
- [Architecture](#architecture)
  - [Authentication Flow](#authentication-flow)
  - [Role-Based Access Control](#role-based-access-control)
  - [Database Schema](#database-schema)
  - [Routing](#routing)
- [Backend (Convex)](#backend-convex)
  - [API Reference](#api-reference)
  - [Admin API](#admin-api)
  - [Seed Scripts](#seed-scripts)
- [Frontend](#frontend)
  - [Pages](#pages)
  - [Components](#components)
  - [Hooks](#hooks)
  - [Utilities](#utilities)
- [Email Service](#email-service)
- [HIPAA Compliance Banner](#hipaa-compliance-banner)
- [Deployment](#deployment)
  - [Vercel](#vercel)
  - [Convex Production](#convex-production)
- [Available Scripts](#available-scripts)
- [Convex CLI Reference](#convex-cli-reference)
- [Contributing](#contributing)

---

## Features

- **Role-Based Dashboards** -- Separate admin and patient portals with automatic redirection based on user role.
- **Complete Auth System** -- Email/password sign-up, sign-in, forgot password with OTP verification, and sign-out.
- **Admin User Management** -- List all users, toggle roles (admin/patient), activate/deactivate accounts, and delete users.
- **Real-Time Data** -- Powered by Convex for automatic UI updates when data changes.
- **Cross-Domain Auth** -- Built-in support for cross-domain authentication (useful for WebContainers, Vercel previews, etc.).
- **HIPAA Compliance Banner** -- Configurable warning banner for non-production environments.
- **Password Policy** -- Enforces minimum 8 characters with uppercase, lowercase, numbers, and special characters.
- **Account Activation** -- Inactive users are redirected to a dedicated "account inactive" page.
- **Auto User Creation** -- New users who sign up are automatically assigned the "patient" role.
- **Responsive UI** -- Tailwind CSS v4 with shadcn/ui-style components.

---

## Tech Stack

| Layer         | Technology                                                                 |
| ------------- | -------------------------------------------------------------------------- |
| Framework     | [React 19](https://react.dev/) + [Vite 7](https://vite.dev/)              |
| Routing       | [React Router v7](https://reactrouter.com/)                               |
| Styling       | [Tailwind CSS v4](https://tailwindcss.com/) + [tw-animate-css](https://github.com/magicuidesign/tw-animate-css) |
| Backend       | [Convex](https://convex.dev/) (real-time serverless backend)               |
| Auth          | [Better Auth](https://www.better-auth.com/) via [@convex-dev/better-auth](https://www.npmjs.com/package/@convex-dev/better-auth) |
| Email         | [Resend](https://resend.com/) (optional, logs to console in dev)           |
| UI Components | [Radix UI](https://www.radix-ui.com/) primitives (checkbox, dropdown, label) |
| Icons         | [Lucide React](https://lucide.dev/)                                        |
| Notifications | [react-hot-toast](https://react-hot-toast.com/)                            |
| Package Mgr   | [pnpm](https://pnpm.io/)                                                  |

---

## Project Structure

```
base-template-admin-patient/
├── convex/                          # Backend (Convex functions)
│   ├── _generated/                  # Auto-generated types & API (do not edit)
│   ├── admin/
│   │   └── users.ts                 # Admin user management (list, role, activate, delete)
│   ├── seed/
│   │   ├── admin.ts                 # Admin seeding action
│   │   └── helpers.ts               # Internal seed helper queries/mutations
│   ├── auth.config.ts               # Convex auth provider config
│   ├── auth.ts                      # Better Auth server setup & OTP email plugin
│   ├── convex.config.ts             # Convex app config (registers Better Auth component)
│   ├── email.ts                     # Email service (Resend or console fallback)
│   ├── http.ts                      # HTTP router (registers auth endpoints)
│   ├── schema.ts                    # Database schema definition
│   └── users.ts                     # User queries & mutations (CRUD)
├── public/
│   ├── favicon.png
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AdminRoute.tsx       # Route guard: admin-only access
│   │   │   ├── AuthenticatedRoute.tsx # Route guard: any authenticated user
│   │   │   ├── AuthForm.tsx         # Shared sign-in/sign-up form
│   │   │   ├── GuestRoute.tsx       # Route guard: unauthenticated users only
│   │   │   ├── PatientRoute.tsx     # Route guard: patient-only access
│   │   │   ├── RequestResetForm.tsx # Forgot password: email input step
│   │   │   └── ResetPasswordForm.tsx # Forgot password: OTP + new password step
│   │   ├── layout/
│   │   │   ├── AuthHeader.tsx       # Minimal header for auth pages
│   │   │   ├── Footer.tsx           # Site footer
│   │   │   ├── Header.tsx           # Main header with nav, user menu, sign-out
│   │   │   ├── HIPAABanner.tsx      # HIPAA compliance warning banner
│   │   │   └── SpecodeIframeTracker.tsx # Iframe integration tracker
│   │   └── ui/
│   │       ├── button.tsx           # Button component (CVA variants)
│   │       ├── checkbox.tsx         # Checkbox component (Radix)
│   │       ├── dropdown-menu.tsx    # Dropdown menu component (Radix)
│   │       ├── FullPageSpinner.tsx  # Full-page loading spinner
│   │       ├── input.tsx            # Input component
│   │       └── label.tsx            # Label component (Radix)
│   ├── lib/
│   │   ├── auth-client.ts          # Better Auth client setup
│   │   ├── auth-hydration.ts       # Auth hydration hook (prevents flash)
│   │   ├── convex.ts               # Convex client initialization
│   │   ├── cross-domain-client.ts  # Cross-domain cookie handling plugin
│   │   ├── useCurrentUser.ts       # Current user hook + role helpers
│   │   └── utils.ts                # Utility functions (cn)
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx   # Admin dashboard with user management table
│   │   ├── auth/
│   │   │   ├── AccountInactive.tsx  # Inactive account notice page
│   │   │   ├── ForgotPassword.tsx   # Password reset page
│   │   │   ├── Login.tsx            # Login page
│   │   │   └── Register.tsx         # Registration page
│   │   ├── patient/
│   │   │   └── PatientDashboard.tsx # Patient dashboard
│   │   ├── Error.tsx                # Error/404 page
│   │   └── Home.tsx                 # Landing page (redirects if authenticated)
│   ├── App.tsx                      # Root layout (header, footer, toaster)
│   ├── index.css                    # Global styles (Tailwind)
│   ├── main.tsx                     # App entry point (providers)
│   ├── router.tsx                   # Route definitions
│   └── vite-env.d.ts               # Vite type declarations
├── .env.example                     # Example environment variables
├── .gitignore
├── CLAUDE.md                        # AI assistant development guidelines
├── components.json                  # shadcn/ui component config
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML entry point
├── package.json
├── pnpm-lock.yaml
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json                      # Vercel SPA rewrite config
└── vite.config.ts                   # Vite configuration
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v8+

### Installation

```bash
# Clone the repository
git clone https://github.com/salihedneer21/base-template-admin-patient.git
cd base-template-admin-patient

# Install dependencies
pnpm install
```

### Environment Variables

#### Client-Side (`.env.local`)

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable                | Description                                        | Example                                     |
| ----------------------- | -------------------------------------------------- | ------------------------------------------- |
| `VITE_CONVEX_URL`       | Convex deployment URL                              | `https://your-project-123.convex.cloud`     |
| `CONVEX_DEPLOY_KEY`     | Convex deploy key (for CI/production builds)       | `prod:your-project-123\|eyJ2...`            |
| `VITE_HIDE_HIPAA_BANNER`| Set to `true` to hide the HIPAA warning banner     | `false`                                     |
| `VITE_CONVEX_SITE_URL`  | (Optional) Explicit Convex site URL override       | `https://your-project-123.convex.site`      |

#### Server-Side (Convex Environment Variables)

These are set via the Convex CLI and are **never exposed to the browser**:

```bash
npx convex env set BETTER_AUTH_SECRET "your-secret-key-must-be-at-least-32-characters-long"
npx convex env set SITE_URL "http://localhost:5173"

# Optional: for sending real emails (otherwise OTPs are logged to the console)
npx convex env set RESEND_API_KEY "re_xxxxxxxxxxxx"
npx convex env set AUTH_EMAIL "noreply@yourdomain.com"
npx convex env set AUTH_EMAIL_NAME "Your App Name"

# Optional: for cross-domain or custom domain setups
npx convex env set BETTER_AUTH_TRUSTED_ORIGINS "https://your-production-domain.com"
```

### Seed the Admin Account

After setting up environment variables, create the initial admin user:

```bash
npx convex run seed/admin:seedAdmin
```

This creates an admin account with:
- **Email:** `admin1@gmail.com`
- **Password:** `adminadmin`

> The seed script is idempotent -- running it again will not create a duplicate.

### Running the App

```bash
# Start both Convex and Vite dev servers concurrently
pnpm dev

# Or start them individually:
npx convex dev     # Terminal 1: Convex dev server
pnpm dev:vite      # Terminal 2: Vite dev server
```

The app opens at **http://localhost:5173**.

---

## Architecture

### Authentication Flow

This template uses [Better Auth](https://www.better-auth.com/) integrated with Convex via the `@convex-dev/better-auth` component:

1. **Client:** `authClient` (in `src/lib/auth-client.ts`) communicates with the Better Auth server running on Convex HTTP endpoints.
2. **Server:** `convex/auth.ts` configures Better Auth with email/password authentication, email OTP for password resets, and cross-domain support.
3. **HTTP Routes:** `convex/http.ts` registers all Better Auth routes (sign-in, sign-up, session, etc.) with CORS enabled.
4. **Session Management:** The `ConvexBetterAuthProvider` in `src/main.tsx` wraps the app and provides authentication context.
5. **Cross-Domain:** The custom `crossDomainClient` plugin (in `src/lib/cross-domain-client.ts`) handles cookie storage in `localStorage` for cross-domain scenarios (WebContainers, Vercel previews).

```
Browser                  Convex HTTP              Convex DB
  |                          |                        |
  |-- signUp/signIn -------->|                        |
  |                          |-- create user -------->|
  |<-- session cookie -------|                        |
  |                          |                        |
  |-- useCurrentUser() ----->|-- query by authId ---->|
  |<-- user data ------------|<-- user document ------|
```

### Role-Based Access Control

The app implements two roles:

| Role      | Access                                         | Auto-Assigned |
| --------- | ---------------------------------------------- | ------------- |
| `admin`   | Admin dashboard, user management               | No (seeded)   |
| `patient` | Patient dashboard                              | Yes (on sign-up) |

**How it works:**

1. When a new user signs up, the `useCurrentUser` hook calls `getOrCreateUser`, which creates a user record with `role: "patient"`.
2. Admin accounts are created via the seed script and can promote/demote users via the admin dashboard.
3. Route guards (`AdminRoute`, `PatientRoute`, `GuestRoute`, `AuthenticatedRoute`) enforce access based on authentication state, user role, and active status.

**Route guard behavior:**

| Guard                | Requires Auth | Checks Role | Checks Active | Redirects To            |
| -------------------- | ------------- | ----------- | ------------- | ----------------------- |
| `GuestRoute`         | No (guest)    | No          | No            | `/` (if authenticated)  |
| `AuthenticatedRoute` | Yes           | No          | No            | `/login`                |
| `AdminRoute`         | Yes           | Admin       | Yes           | `/login`, `/account-inactive`, or `/patient` |
| `PatientRoute`       | Yes           | Patient     | Yes           | `/login`, `/account-inactive`, or `/admin`   |

### Database Schema

Defined in `convex/schema.ts`:

**`users` table:**

| Field              | Type                          | Description                          |
| ------------------ | ----------------------------- | ------------------------------------ |
| `betterAuthUserId` | `string`                      | Links to Better Auth's internal user |
| `email`            | `string`                      | User's email address                 |
| `name`             | `string` (optional)           | User's display name                  |
| `role`             | `"admin"` \| `"patient"`      | User role                            |
| `isActive`         | `boolean`                     | Whether the account is active        |
| `createdAt`        | `number`                      | Timestamp of creation                |
| `updatedAt`        | `number`                      | Timestamp of last update             |

**Indexes:**

| Index Name              | Fields               | Purpose                          |
| ----------------------- | -------------------- | -------------------------------- |
| `by_betterAuthUserId`   | `betterAuthUserId`   | Look up user by auth provider ID |
| `by_email`              | `email`              | Look up user by email            |
| `by_role`               | `role`               | Filter users by role             |

> Better Auth also manages its own internal tables (`user`, `account`, `session`) via the `@convex-dev/better-auth` component. These are separate from the `users` table above.

### Routing

Defined in `src/router.tsx`:

| Path                | Page                | Guard              | Description                       |
| ------------------- | ------------------- | ------------------ | --------------------------------- |
| `/`                 | `Home`              | None               | Landing page / auto-redirect      |
| `/login`            | `Login`             | `GuestRoute`       | Sign-in form                      |
| `/register`         | `Register`          | `GuestRoute`       | Sign-up form with terms checkbox  |
| `/forgot-password`  | `ForgotPassword`    | `GuestRoute`       | Password reset (OTP flow)         |
| `/account-inactive` | `AccountInactive`   | `AuthenticatedRoute` | Shown to deactivated users      |
| `/admin`            | `AdminDashboard`    | `AdminRoute`       | Admin user management             |
| `/patient`          | `PatientDashboard`  | `PatientRoute`     | Patient dashboard                 |
| `*`                 | `ErrorPage`         | None               | 404 / error page                  |

---

## Backend (Convex)

### API Reference

**`convex/users.ts`** -- Public user functions:

| Function          | Type     | Description                                          |
| ----------------- | -------- | ---------------------------------------------------- |
| `getCurrentUser`  | Query    | Get user by Better Auth user ID                      |
| `getById`         | Query    | Get user by Convex document ID                       |
| `getOrCreateUser` | Mutation | Find existing user or create a new patient           |
| `updateProfile`   | Mutation | Update user name                                     |

### Admin API

**`convex/admin/users.ts`** -- Admin user management functions:

| Function        | Type     | Description                                |
| --------------- | -------- | ------------------------------------------ |
| `listAll`       | Query    | List all users                             |
| `listByRole`    | Query    | List users filtered by role                |
| `updateRole`    | Mutation | Change a user's role (admin/patient)       |
| `toggleActive`  | Mutation | Toggle a user's active/inactive status     |
| `deleteUser`    | Mutation | Permanently delete a user                  |

### Seed Scripts

**`convex/seed/admin.ts`:**
- `seedAdmin` -- Action that creates the initial admin user in both Better Auth and the `users` table. Uses Node.js runtime (`"use node"`) for password hashing.

**`convex/seed/helpers.ts`:**
- `checkAdminExists` -- Internal query to check if admin exists.
- `getBetterAuthUser` -- Internal query to get Better Auth user by email.
- `createAdminInUsersTable` -- Internal mutation to insert admin into the `users` table.

---

## Frontend

### Pages

| Page                | File                                      | Description                                                             |
| ------------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| **Home**            | `src/pages/Home.tsx`                      | Landing page for guests; redirects authenticated users to their dashboard |
| **Login**           | `src/pages/auth/Login.tsx`                | Email/password sign-in with "forgot password" link                       |
| **Register**        | `src/pages/auth/Register.tsx`             | Email/password sign-up with terms & conditions checkbox                  |
| **Forgot Password** | `src/pages/auth/ForgotPassword.tsx`       | Two-step password reset: request OTP, then set new password              |
| **Account Inactive**| `src/pages/auth/AccountInactive.tsx`      | Notice page for deactivated accounts                                     |
| **Admin Dashboard** | `src/pages/admin/AdminDashboard.tsx`      | Stats cards + user management table with role/status/delete actions       |
| **Patient Dashboard**| `src/pages/patient/PatientDashboard.tsx`  | Patient welcome page (extend with patient-specific features)              |
| **Error**           | `src/pages/Error.tsx`                     | 404 / error boundary page                                                |

### Components

#### Auth Components (`src/components/auth/`)

| Component             | Description                                                                      |
| --------------------- | -------------------------------------------------------------------------------- |
| `AuthForm`            | Reusable form for sign-in and sign-up with password validation                   |
| `AdminRoute`          | Route guard: requires admin role + active status                                 |
| `PatientRoute`        | Route guard: requires patient role + active status                               |
| `GuestRoute`          | Route guard: redirects authenticated users away                                  |
| `AuthenticatedRoute`  | Route guard: requires authentication (no role/active check)                      |
| `RequestResetForm`    | Email input form for initiating password reset                                   |
| `ResetPasswordForm`   | OTP verification + new password form for completing password reset               |

#### Layout Components (`src/components/layout/`)

| Component              | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| `Header`               | Main navigation header with dashboard link, user avatar, dropdown menu, and sign-out |
| `AuthHeader`           | Minimal header (logo only) used on auth pages                        |
| `Footer`               | Site footer with branding                                            |
| `HIPAABanner`          | Dismissable HIPAA compliance warning banner                          |
| `SpecodeIframeTracker` | Tracks iframe embedding for Specode platform integration             |

#### UI Components (`src/components/ui/`)

Built on [Radix UI](https://www.radix-ui.com/) primitives with [class-variance-authority](https://cva.style/) for variants:

| Component        | Base Library         |
| ---------------- | -------------------- |
| `Button`         | CVA variants         |
| `Input`          | Native HTML          |
| `Label`          | Radix UI Label       |
| `Checkbox`       | Radix UI Checkbox    |
| `DropdownMenu`   | Radix UI Dropdown    |
| `FullPageSpinner`| Custom               |

### Hooks

| Hook                | File                          | Description                                              |
| ------------------- | ----------------------------- | -------------------------------------------------------- |
| `useCurrentUser()`  | `src/lib/useCurrentUser.ts`   | Returns current user data, loading state, and auth status. Auto-creates patient record on first sign-up. |
| `useIsAdmin()`      | `src/lib/useCurrentUser.ts`   | Convenience hook: returns `{ isAdmin, isLoading }`.       |
| `useIsPatient()`    | `src/lib/useCurrentUser.ts`   | Convenience hook: returns `{ isPatient, isLoading }`.     |
| `useAuthHydration()`| `src/lib/auth-hydration.ts`   | Prevents auth loading flash on initial page load.         |

### Utilities

| File                           | Exports                                                      |
| ------------------------------ | ------------------------------------------------------------ |
| `src/lib/convex.ts`            | `convex` (ConvexReactClient), `isConvexConfigured`           |
| `src/lib/auth-client.ts`       | `authClient` (Better Auth client with plugins)               |
| `src/lib/cross-domain-client.ts` | `crossDomainClient` plugin, `parseSetCookieHeader`, `getSetCookie`, `getCookie` |
| `src/lib/utils.ts`             | `cn()` -- Tailwind class merge utility                       |

---

## Email Service

The email service (`convex/email.ts`) supports two modes:

### Development Mode (No API Key)

When `RESEND_API_KEY` is not set, OTP codes and password reset links are **logged to the Convex console**:

```
========================================
PASSWORD RESET CODE for user@example.com: 123456
========================================
(Set RESEND_API_KEY to send real emails)
```

View these logs with:
```bash
npx convex logs
```

### Production Mode

Set the following Convex environment variables to enable real email delivery via [Resend](https://resend.com/):

```bash
npx convex env set RESEND_API_KEY "re_xxxxxxxxxxxx"
npx convex env set AUTH_EMAIL "noreply@yourdomain.com"
npx convex env set AUTH_EMAIL_NAME "Your App Name"  # Optional sender name
```

---

## HIPAA Compliance Banner

A yellow warning banner is displayed at the top of the page by default:

> "This preview is not HIPAA compliant. Do not enter or store real patient data or PHI."

To hide it, set the environment variable:
```bash
VITE_HIDE_HIPAA_BANNER=true
```

---

## Deployment

### Vercel

The project includes a `vercel.json` configuration for SPA routing:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

1. Connect your repository to [Vercel](https://vercel.com/).
2. Set environment variables in the Vercel dashboard:
   - `VITE_CONVEX_URL` -- Your Convex production deployment URL
   - `CONVEX_DEPLOY_KEY` -- Your Convex deploy key
3. The build command (`pnpm build`) will automatically deploy Convex functions and build the frontend.

### Convex Production

```bash
# Deploy Convex functions to production
npx convex deploy

# Set production environment variables
npx convex env set BETTER_AUTH_SECRET "your-production-secret" --prod
npx convex env set SITE_URL "https://your-production-domain.com" --prod
npx convex env set RESEND_API_KEY "re_xxxxxxxxxxxx" --prod
npx convex env set AUTH_EMAIL "noreply@yourdomain.com" --prod
```

**Trusted Origins:** For production deployments with custom domains, set:
```bash
npx convex env set BETTER_AUTH_TRUSTED_ORIGINS "https://your-domain.com,https://www.your-domain.com" --prod
```

The auth server automatically trusts:
- Configured `SITE_URL`
- All `localhost` origins (any port)
- `*.local-corp.webcontainer-api.io` (WebContainers)
- `*.vercel.app` (Vercel deployments)

---

## Available Scripts

| Command         | Description                                          |
| --------------- | ---------------------------------------------------- |
| `pnpm dev`      | Start Convex + Vite dev servers concurrently         |
| `pnpm dev:vite` | Start Vite dev server only                           |
| `pnpm build`    | Deploy Convex functions and build frontend for production |
| `pnpm lint`     | Run TypeScript type checking + ESLint                |
| `pnpm preview`  | Preview production build locally                     |

## Convex CLI Reference

| Command                              | Description                              |
| ------------------------------------ | ---------------------------------------- |
| `npx convex dev`                     | Start dev server (syncs functions, generates types) |
| `npx convex deploy`                  | Deploy functions to production           |
| `npx convex codegen`                 | Regenerate TypeScript types manually     |
| `npx convex env set KEY val`         | Set a server-side environment variable   |
| `npx convex env list`                | List all environment variables           |
| `npx convex env unset KEY`           | Remove an environment variable           |
| `npx convex logs`                    | View function logs (useful for OTP codes in dev) |
| `npx convex run seed/admin:seedAdmin`| Create the initial admin user            |

---

## Contributing

1. Create a feature branch from `main`.
2. Follow existing code conventions (see `CLAUDE.md` for detailed guidelines).
3. Use the `@/` path alias for imports from `src/`.
4. Always include argument and return validators for Convex functions.
5. Use `withIndex` instead of `filter` for database queries.
6. Run `pnpm lint` before submitting.
7. Open a pull request with a clear description of changes.
