# AI Escape Room

A single-player, guest-first escape room game built with React, Vite, Express, MongoDB/Mongoose, and optional Gemini generation. The API is authoritative for timers, progression, hints, scoring, and answer validation. Public adventure records do not contain answer keys or unrevealed hints.

## Quick start

1. Install Node.js 20+ and MongoDB (or configure a MongoDB Atlas URI).
2. Copy `server/.env.example` to `server/.env`; optionally copy `client/.env.example` to `client/.env`.
3. Set `MONGODB_URI`, `SESSION_TOKEN_SECRET`, and optionally `GEMINI_API_KEY` in the server environment.
4. From the repository root, run `npm install`, then `npm run dev`.
5. Open http://localhost:5173. The server is at http://localhost:5000/api/health.

Without a Gemini key, adventure creation uses curated deterministic content suitable for local play. The Gemini integration is server-only. Without MongoDB, the server uses in-memory storage for a local demo; that data resets when the server restarts. MongoDB is required for durable sessions and history.

## Scripts

- `npm run dev` — run client and server.
- `npm run build` — build the client.
- `npm start` — start the API server.

## Structure

- `client/` — responsive React game UI.
- `server/` — Express API, session handling, generation, validation, and game engine.
- `AI_Escape_Room_SPEC.md` — product requirements.

Production deployment requires a MongoDB database, server-side Gemini key, HTTPS, secure cookie settings, and deployed frontend/backend origins. Configure those values in the hosting provider; never put server secrets in the client.
