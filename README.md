# AI Escape Room

A guest-first escape room game built with React, Vite, Express, MongoDB, and Gemini. The server owns puzzle answers, progression, hints, the timer, and scoring.

## Deploy with Render and MongoDB Atlas

This repository includes a `render.yaml` Blueprint. Render serves the built website and API from the same origin, so the guest-session cookie works without cross-site cookie settings. MongoDB Atlas stores sessions and adventures; Gemini is called only by the server.

### 1. Push the project to GitHub

Create a GitHub repository and push this project. Confirm that `.env` files are not committed. The root `.gitignore` excludes them.

### 2. Create a MongoDB Atlas database

1. Sign in to MongoDB Atlas and create a project and cluster.
2. Under **Database Access**, create a database user for this app. Save its username and password.
3. Under **Network Access**, allow connections from your Render service. In the Render dashboard, open the service and copy its region-specific outbound IP ranges from **Connect → Outbound**. Add those ranges to the Atlas IP access list. Render uses shared regional ranges unless your plan includes dedicated outbound IPs.
4. Choose **Connect â†’ Drivers**, copy the connection string, and replace the password placeholder. URL-encode special characters in the password.

### 3. Create a Gemini API key

Create a key in Google AI Studio. The Blueprint selects `gemini-3.8-flash` by default. Keep the key private; enter it into Render's secret field, never into client code or Git.

### 4. Create the Render service

1. Sign in to Render and choose **New â†’ Blueprint**.
2. Connect the GitHub repository and select its branch.
3. Render reads `render.yaml`. When prompted, enter the Atlas connection string for `MONGODB_URI` and your Gemini key for `GEMINI_API_KEY`. Render generates `SESSION_TOKEN_SECRET`.
4. Review the service plan before applying. The Blueprint uses Render's free plan for a low-cost demo. Free services can sleep after inactivity and take about a minute to wake, so choose an always-on plan for a smoother public game experience.
5. Apply the Blueprint and wait for the build and deploy to finish.

The build command is `npm ci --include=dev && npm run build`; the start command is `npm start`. Render checks `/api/health`. When deployment is ready, open the service's `onrender.com` URL. The game and `/api` routes use that same origin.

### 5. Check the deployment

1. Open `https://YOUR-SERVICE.onrender.com/api/health`. The response should report `status: "ok"` and `database: "connected"`.
2. Open the main service URL and create an adventure.
3. Start the game, inspect an object, solve a puzzle, request a hint, and refresh the page to confirm progress resumes.
4. Check Render logs if startup fails. Production startup intentionally stops if MongoDB or required secrets are missing; it will not silently use temporary in-memory storage.

### 6. Optional custom domain

Add a domain in Render's service settings and follow Render's DNS instructions. The site and API remain on one origin, so no frontend API URL or CORS domain needs to be changed.

## Run locally

1. Install Node.js 22 or newer and MongoDB, or use an Atlas connection string.
2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, `SESSION_TOKEN_SECRET`, and optionally `GEMINI_API_KEY`.
3. From the project root, run `npm install` and `npm run dev`.
4. Open http://localhost:5173. Vite proxies `/api` requests to the server at port 5000.

Without a Gemini key, local development uses curated adventures. Without MongoDB, local development uses temporary in-memory data that resets when the server restarts. Production requires MongoDB and a session secret.

## Scripts

- `npm run dev` â€” run client and server locally.
- `npm run build` â€” build the client for deployment.
- `npm start` â€” run the production server; it serves both the API and `client/dist`.

## Project structure

- `client/` â€” React interface and Vite configuration.
- `server/` â€” Express API, game engine, persistence, and Gemini integration.
- `render.yaml` â€” Render Blueprint configuration.
- `AI_Escape_Room_SPEC.md` â€” product requirements.
