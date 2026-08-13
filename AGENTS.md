# AGENTS.md

Guidance for AI coding agents working in this LMS monorepo. Prioritize backend MongoDB workflows and avoid cross-app regressions.

## Project Map

- Backend API (Express + Mongoose): [backend/server.js](backend/server.js)
- MongoDB connection bootstrap: [backend/config/db.js](backend/config/db.js)
- Data models: [backend/models/courseModel.js](backend/models/courseModel.js), [backend/models/bookingModel.js](backend/models/bookingModel.js)
- Backend routes: [backend/routes/courseRouter.js](backend/routes/courseRouter.js), [backend/routes/bookingRouter.js](backend/routes/bookingRouter.js)
- Frontend app (Vite + React): [frontend/package.json](frontend/package.json)
- Admin app (Vite + React): [admin/package.json](admin/package.json)

## Run And Verify

- Backend dev server:
  - `cd backend`
  - `npm install`
  - `npm start`
- Frontend dev server:
  - `cd frontend`
  - `npm install`
  - `npm run dev`
- Admin dev server:
  - `cd admin`
  - `npm install`
  - `npm run dev`

Note: Backend static uploads use `process.cwd()` in [backend/server.js](backend/server.js). Run backend commands from the `backend` folder so uploads resolve to `backend/uploads`.

## MongoDB Conventions

- Connection string is read from `MONGODB_URI`, with `MONGO_URI` fallback in [backend/config/db.js](backend/config/db.js).
- Backend startup fails fast when MongoDB URI is missing; keep that behavior.
- Models follow `mongoose.models.Name || mongoose.model(...)` to prevent overwrite in hot reload.
- Booking status values are constrained enums in [backend/models/bookingModel.js](backend/models/bookingModel.js); keep exact casing aligned with controller checks.
- Course durations and lecture/chapter totals are normalized in model hooks in [backend/models/courseModel.js](backend/models/courseModel.js). Preserve this normalization when changing schema fields.

## API Patterns To Preserve

- Routes are thin and delegate to controllers.
- Controller responses generally use `{ success: boolean, ...payload }` JSON shapes.
- Course images are stored as relative paths and converted to absolute URLs at read time in [backend/controllers/courseController.js](backend/controllers/courseController.js).
- Booking payment flow relies on Stripe session metadata and `sessionId` reconciliation in [backend/controllers/bookingController.js](backend/controllers/bookingController.js).

## Guardrails For Agent Changes

- Keep edits scoped to the target app (`backend`, `frontend`, or `admin`); avoid mixing unrelated refactors.
- When changing MongoDB schema fields or enums, update all dependent query/filter logic in controllers and any affected UI usage.
- Prefer additive migrations and backward-compatible reads over destructive schema changes.
- Never hardcode or expose secrets in code, docs, test data, or logs. Use environment variables.

## Documentation Links

- Root project overview: [README.md](README.md)
- Frontend scaffold notes: [frontend/README.md](frontend/README.md)
- Admin scaffold notes: [admin/README.md](admin/README.md)

## Optional Next Customizations

- Add backend-only file instructions at `.github/instructions/backend.instructions.md` with `applyTo: "backend/**/*.js"` for stricter MongoDB/controller rules.
- Add a custom prompt for safe MongoDB schema edits (checklist + required impact scan).
- Add a small skill for "trace API request path" (route -> controller -> model) to speed debugging.