# TrailGuard Frontend

React + Vite web dashboard for TrailGuard, built to match the Figma design
(file: https://www.figma.com/design/dqwL8kN61TI4V5wCrmdgt8) and to talk directly
to the existing `trailguard-backend` Express API + WebSocket channel.

## Setup

```bash
pnpm install
cp .env.example .env
```

Edit `.env` to point at your running backend:

```
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/live
```

Then run both servers side by side:

```bash
# terminal 1 — in trailguard-backend/
npm run dev

# terminal 2 — in trailguard-frontend/
pnpm run dev
```

The app runs on http://localhost:5173.

## What's wired up

Every screen from the Figma file is implemented and talks to a real backend endpoint —
see `src/lib/apiClient.js` for the full map (it mirrors Architecture.md §5 exactly).

| Page | Route | Backend calls |
|---|---|---|
| Login | `/login` | `POST /auth/login`, `GET /auth/google` |
| Register | `/register` | `POST /auth/register` |
| OAuth Success | `/oauth-success` | reads the `token`/`profileComplete` query params from the Google redirect |
| Complete Profile | `/complete-profile` | `PATCH /auth/complete-profile` |
| Dashboard | `/dashboard` | `GET /vitals\|environment\|location/latest`, `GET /falls`, plus live WebSocket updates |
| History | `/history` | `GET /vitals\|environment\|location/history`, `GET /falls` |
| Settings | `/settings` | `PATCH /auth/complete-profile` (used to edit safety info after signup too) |
| Fall/SOS Alert | (global overlay, not a route) | `PATCH /falls/:id`, triggered by the `fall_detected` WebSocket event from any page |

## Architecture notes

- **Auth**: JWT stored in `localStorage` (see the note in `rules.md` §6 — fine for
  this stage, should move to an httpOnly cookie before real production use).
- **Real-time**: `src/context/LiveDataContext.jsx` opens one WebSocket connection
  to `/live` for the whole app and fans out `vitals` / `environment` / `location` /
  `fall_detected` / `fall_status_update` messages. Auto-reconnects on drop.
- **Dashboard map**: the live location card now embeds a lightweight OpenStreetMap
  view centered on the latest real GPS point (`latitude`/`longitude`) from live data.
- **Fall/SOS modal is global**, not page-scoped — it renders from `App.jsx` so it
  interrupts whatever page the user is on, per design.md §4.6.
- **Design tokens**: `src/styles/theme.css` holds the full locked palette
  (Main/Secondary/Accent/Background/Text) as CSS variables. Don't hardcode hex
  values in components — reference these.
- **Known gap carried over from the backend** (see rules.md §5): sensor `GET`
  routes aren't authenticated server-side yet, though this frontend already sends
  the JWT on every request in anticipation of that being added.

## Not yet built

- Mobile-responsive polish (basic breakpoints exist on Dashboard/History/Settings
  but haven't been fully tuned).
- The real Twilio SMS send (backend-side, Phase 4 in phases.md) — the frontend's
  "Send SOS" button already calls the right endpoint, it's the backend that needs
  to actually send the text once that phase starts.
