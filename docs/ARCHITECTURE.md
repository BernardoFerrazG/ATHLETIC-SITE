# Architecture

This document describes how the Athletic Club Platform is organised and why. For setup instructions see the [main README](../README.md).

## High-level view

```
┌───────────────────────────── Browser (React SPA) ─────────────────────────────┐
│                                                                               │
│  App.tsx ── AuthProvider ── CartProvider ── AppRoutes (lazy pages + guards)   │
│                                   │                                           │
│              features/*/pages ─── features/*/hooks ─── features/*/services    │
│                                                               │               │
└───────────────────────────────────────────────────────────────┼───────────────┘
                                                                │ Firebase JS SDK
                                         ┌──────────────────────┴──────────────┐
                                         │  Firebase Auth   │  Cloud Firestore  │
                                         └─────────────────────────────────────┘
```

The app is a single-page application with no custom backend: authentication and persistence are delegated to Firebase. All business logic lives in the client, organised by feature.

## Folder structure

```
src/
├── app/
│   ├── App.tsx          # Providers (router, auth, cart)
│   └── routes.tsx       # Route table: public, private and admin routes
├── components/          # Shared UI used across features (Sidebar)
├── contexts/            # Cross-feature state (shopping cart)
├── features/
│   └── <feature>/
│       ├── pages/       # Route-level components
│       ├── components/  # Feature-specific UI pieces
│       ├── hooks/       # Data-fetching / form hooks
│       ├── services/    # Firestore and Auth access
│       ├── styles/      # Feature CSS
│       └── types/       # Domain types
├── lib/firebase.ts      # Firebase app, auth and db singletons
└── pages/Landing.tsx    # Public landing page
```

| Feature | Responsibility |
| --- | --- |
| `auth` | Sign up / sign in / password reset, `AuthContext`, route guards |
| `users` | Profile read and update |
| `home` | Fan home page, admin dashboard and sales reports |
| `games` | Fixture list, details and admin management |
| `news` | News feed, article page, publishing |
| `ingressos` | Ticketed matches and ticket sales data |
| `loja` | Store catalogue, cart, product admin, purchase history |
| `orders` | Checkout, payment step, order admin and reporting |

## Conventions

- **Feature-first organisation.** A feature should be deletable by removing its folder and its routes.
- **Service layer.** Pages and hooks call functions in `services/`; they don't build Firestore queries inline. Services convert Firestore documents into typed domain objects.
- **Typed domain.** Each feature exports its types from `types/`; `any` is disallowed by the lint config.
- **Configuration via environment.** Every key (Firebase, EmailJS) is read from `import.meta.env` and documented in `.env.example`; `.env` is never committed.

## Authentication and authorisation

1. `AuthProvider` subscribes to `onAuthStateChanged`. When a user signs in, it loads their profile from `users/{uid}` and exposes `{ user, loading }` where `user.role` is `torcedor` (fan) or `administrador` (admin).
2. While the profile is loading, `loading` is `true`, so guards render nothing instead of redirecting prematurely.
3. `PrivateRoute` redirects anonymous visitors to `/login`.
4. `AdminRoute` additionally redirects non-admins to `/home`. Every `/admin/*` route is wrapped in it.

> Client-side guards control navigation only. Data access must also be restricted with **Firestore security rules** that check the caller's role — see the roadmap in the README.

## Routing and performance

`routes.tsx` declares routes as data (`[path, Page]` lists for private and admin routes) and loads every page with `React.lazy`. Vite emits one chunk per page, so a visitor downloads only the shell plus the page they open. The initial bundle is ~230 kB (~75 kB gzipped).

## State

| State | Where | Persistence |
| --- | --- | --- |
| Authenticated user + role | `AuthContext` | Firebase Auth session |
| Shopping cart | `CartContext` | `localStorage` (`@AthleticClub:cart`) |
| Domain data (products, orders, news…) | Component / hook state | Firestore |

## Data model

| Collection | Written by | Read by |
| --- | --- | --- |
| `users` | Sign-up, profile page | `AuthContext`, profile |
| `games` | Admin (fixtures) | Fixtures, tickets |
| `news` | Admin (publishing) | News feed and article page |
| `products` | Admin (catalogue, stock) | Store, cart, checkout |
| `orders` | Checkout; admin status updates | Order tracking, history, admin, reports |
| `ingressos_comprados` | Ticket checkout | Purchase history, ticket QR page, reports |

## Quality gates

GitHub Actions (`.github/workflows/ci.yml`) runs on every push to `main`/`develop` and on every pull request:

1. `npm ci`
2. `npm run lint` — ESLint with typescript-eslint and React Hooks rules
3. `npm run build` — strict TypeScript check and production build
