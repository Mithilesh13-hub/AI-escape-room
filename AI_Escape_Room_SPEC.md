# AI Escape Room — Project Specification

**Document:** `SPEC.md`  
**Project:** AI Escape Room  
**Version:** 1.0  
**Status:** Ready for implementation  
**Last updated:** 31 October 2026

---

## 1. Project Overview

### 1.1 Product summary

AI Escape Room is a single-player, AI-powered browser game. A player chooses an adventure theme and difficulty, enters an illustrated escape-room environment, investigates objects, collects clues and inventory items, solves connected puzzles, unlocks rooms, and tries to escape before the countdown reaches zero.

Google Gemini generates the narrative and puzzle content. The application backend remains authoritative for game state, answer validation, room unlocking, hint usage, timer enforcement, and scoring. The browser receives only the information needed for the current stage of play; answers and unrevealed solutions must never be sent to the client.

### 1.2 Tagline

**Think. Investigate. Solve. Escape.**

### 1.3 Problem statement

Traditional escape-room games often provide fixed puzzles and stories. Once a player has completed an experience, replay value can be limited. AI Escape Room aims to provide replayable adventures by generating different narratives, rooms, objects, clues, and puzzles while preserving reliable game rules and answer validation.

### 1.4 Product vision

Deliver a polished, responsive escape-room game that feels like a real interactive adventure rather than a chatbot. AI should provide variety and narrative intelligence; deterministic application code should provide fair, consistent gameplay.

### 1.5 Primary objective

Build, test, and deploy a complete web application in which a player can generate an adventure, play through the rooms, solve puzzles, escape or time out, and view a saved result.

---

## 2. Goals, Non-Goals, and Success Measures

### 2.1 Goals

1. Let a guest player start an adventure without creating an account.
2. Offer multiple themes and a custom premise.
3. Generate a coherent adventure using Gemini.
4. Provide illustrated rooms with discoverable, clickable objects.
5. Support clues, inventory items, and several puzzle types.
6. Make puzzle answers and hints available only when the player is entitled to receive them.
7. Enforce room progression, hint limits, game deadlines, and scoring on the backend.
8. Save completed and expired adventures so a player can review recent history in the same browser.
9. Work on desktop, tablet, and mobile browsers.
10. Deploy the frontend, backend, database, and AI integration as a working website.

### 2.2 Non-goals for version 1.0

The following are explicitly outside the first release:

- Multiplayer or cooperative play.
- Real-time chat between players.
- User-to-user messaging or social profiles.
- Public leaderboards and global rankings.
- Payments, subscriptions, or in-game purchases.
- AI-generated images at runtime.
- Fully navigable 3D environments.
- Voice control or speech recognition.
- Native iOS or Android applications.
- User-created puzzle scripting or a public adventure marketplace.

These may be considered for later versions after the core game is reliable.

### 2.3 Success measures

The release is successful when:

- A player can generate and start an adventure at all three difficulty levels.
- A valid adventure contains the configured number of rooms and puzzles.
- Players can inspect objects, collect clues/items, request hints, and submit puzzle answers.
- Correct answers unlock the intended progression and incorrect answers do not.
- The server rejects actions that exceed the hint allowance or occur after the deadline.
- The client cannot retrieve unrevealed answers, solution explanations, or future hints.
- A player can reach either a successful escape result or a time-expired result.
- The final score is reproducible from server-side game events.
- The deployed application passes the acceptance tests in Section 19.

---

## 3. Target Users and User Experience

### 3.1 Target users

- Casual players who enjoy riddles, mystery, and adventure games.
- Students and young adults who enjoy logic and problem-solving challenges.
- Players looking for short, replayable browser games.
- Users curious about interactive experiences powered by generative AI.

### 3.2 User experience principles

1. **Immersion:** Use atmospheric room artwork, restrained sound, readable typography, and clear feedback.
2. **Clarity:** The player should always understand what can be inspected, what has been collected, and what must be solved next.
3. **Fairness:** Each puzzle must have a defensible answer supported by information available to the player.
4. **Progressive disclosure:** Do not reveal future rooms, complete solutions, or all hints at the beginning.
5. **Responsive design:** Gameplay must remain usable on narrow mobile screens.
6. **Low friction:** Guest play is the default; registration is not required in version 1.0.
7. **Resilience:** Refreshing the page must not silently reset a valid active game.

---

## 4. Core Product Configuration

### 4.1 Adventure themes

The initial release must provide these predefined themes:

1. Haunted Mansion — an abandoned mansion with concealed rooms and strange histories.
2. Ancient Temple — an old temple containing symbols, mechanisms, and forgotten chambers.
3. Secret Laboratory — a research facility with restricted doors and disrupted systems.
4. Pirate Ship — a ship containing maps, locked chests, and a captain's secret.
5. Space Station — a damaged station with power, access, and navigation systems to restore.
6. Cyber Vault — a digital-security-themed physical environment with codes and logic mechanisms.
7. Custom Adventure — the player supplies a short premise and the AI creates a suitable adventure.

Theme descriptions are fictional prompts, not real-world instructions. The generated content must remain appropriate for a general audience.

### 4.2 Difficulty configuration

| Setting | Easy | Medium | Hard |
|---|---:|---:|---:|
| Rooms | 3 | 4 | 5 |
| Puzzles per room | 2 | 2 | 2 |
| Total puzzles | 6 | 8 | 10 |
| Time limit | 30 minutes | 25 minutes | 20 minutes |
| Maximum hints | 5 | 4 | 3 |

Difficulty must affect reasoning complexity, not merely the number of rooms.

- **Easy:** Direct clues, familiar riddles, limited dependencies, and short codes.
- **Medium:** Multiple clues must be combined; some puzzles require an earlier discovery or inventory item.
- **Hard:** Multi-step reasoning, ciphers, cross-room dependencies, and less direct but fair clues.

Every difficulty must remain solvable using information that the player can discover in the adventure.

### 4.3 Default gameplay mode

Version 1.0 is single-player. Each adventure belongs to one anonymous guest session. A player may have one or more saved adventures, but only one adventure needs to be active at a time in the first release.

### 4.4 Timer behavior

The timer is mandatory in the initial release. It begins when the player explicitly starts the generated adventure, not while the AI is generating it or while the player is reading the setup screen.

The backend stores `startedAt` and `deadlineAt`. The client displays a countdown calculated from the server-provided deadline and periodically synchronizes with the server. The backend is the source of truth. When the deadline has passed, the game becomes `expired` and further gameplay actions are rejected.

### 4.5 Scoring rules

| Event | Score change |
|---|---:|
| Successfully escape | +100 completion bonus |
| Solve a puzzle correctly | +10 per puzzle |
| Reveal one hint | -15 per hint |
| Each full minute remaining at escape | +1 |
| Minimum final score | 0 |

Formula:

`finalScore = max(0, completionBonus + (solvedPuzzleCount * 10) + timeBonus - (hintsUsed * 15))`

Where:

- `completionBonus` is 100 only when the player escapes; otherwise 0.
- `timeBonus` is the number of complete minutes remaining when the successful escape is recorded; otherwise 0.
- `solvedPuzzleCount` is counted from server-validated puzzle-solved events.
- `hintsUsed` is counted from server-validated hint-reveal events.

The backend calculates and stores the score exactly once when the game ends. The browser must not submit a score or determine whether a player escaped.

---

## 5. Complete User Journey

1. Player opens the home page.
2. Player reads the short introduction and selects **Start Adventure**.
3. Player chooses a theme and difficulty.
4. Player may enter a custom premise when Custom Adventure is selected.
5. Frontend validates the form and sends a generation request to the backend.
6. Backend creates a generation record and calls Gemini using a server-side API key.
7. Backend parses and validates Gemini's structured response, checks puzzle dependencies and answer consistency, and stores public and private adventure data separately.
8. Player sees the generated adventure summary and selects **Enter Room** or **Start Adventure**.
9. Backend sets the start timestamp and deadline.
10. Player explores the current room and inspects interactive objects.
11. The backend returns discovered information and adds eligible clues/items to the player's progress.
12. Player opens a puzzle, submits an answer, and receives correct/incorrect feedback.
13. A correct answer marks the puzzle solved and may unlock another object, puzzle, or room.
14. A player may request a progressive hint, subject to the difficulty's hint allowance and the applicable score penalty.
15. The process repeats until the final escape condition is met or the deadline expires.
16. Backend finalizes the result and score.
17. Results page displays escape status, score, elapsed time, puzzles solved, hints used, and a narrative summary.
18. Player may start a new adventure or open recent game history.

---

## 6. Functional Requirements

Requirements are identified so they can be referenced in implementation tasks and tests.

### 6.1 Home and adventure setup

- **FR-001:** The home page shall explain the game and display a clear Start Adventure action.
- **FR-002:** The setup page shall display all configured themes.
- **FR-003:** The player shall select Easy, Medium, or Hard.
- **FR-004:** Selecting Custom Adventure shall reveal a premise input.
- **FR-005:** The premise shall have a configurable maximum length; use 500 characters in version 1.0.
- **FR-006:** The backend shall validate theme, difficulty, and premise values independently of frontend validation.
- **FR-007:** The UI shall display a loading state while an adventure is being generated.
- **FR-008:** The player shall be able to retry generation after a recoverable error without creating duplicate active records unintentionally.

### 6.2 Adventure generation

- **FR-009:** Gemini shall generate the title, introduction, setting, room descriptions, objects, clues, puzzles, hints, and solution data.
- **FR-010:** The generated room and puzzle counts shall match the selected difficulty.
- **FR-011:** Every puzzle shall have a stable unique identifier within its adventure.
- **FR-012:** Every puzzle shall define answer validation metadata for backend use.
- **FR-013:** Every room shall contain at least one meaningful interaction and the configured number of puzzles.
- **FR-014:** Every required puzzle shall be reachable through the room/puzzle dependency graph.
- **FR-015:** The backend shall reject incomplete, malformed, duplicate, contradictory, or unsolvable generated adventures.
- **FR-016:** The backend may retry generation or use a controlled repair prompt when validation fails; retries must be capped.

### 6.3 Room exploration and object interaction

- **FR-017:** The game screen shall show the current room's title, description, illustration, and progress.
- **FR-018:** Interactive objects shall be identifiable by accessible controls, hotspots, or an object list.
- **FR-019:** Inspecting an object shall return its player-visible description and any clue or item that is legitimately discoverable.
- **FR-020:** The same clue or item shall not award duplicate collection or score events when inspected repeatedly.
- **FR-021:** The inventory shall display collected items and their descriptions.
- **FR-022:** Items may be required to unlock or interact with specific later objects if the generated adventure defines that dependency.
- **FR-023:** Room navigation shall be controlled by server-validated progression.

### 6.4 Puzzle gameplay

- **FR-024:** The puzzle interface shall display the puzzle title, type, instructions, and any clues already discovered that are relevant to the player.
- **FR-025:** The player shall submit an answer through a suitable input control.
- **FR-026:** The backend shall validate the answer and return a safe result message.
- **FR-027:** Incorrect answers shall not reveal the expected answer or a solution explanation.
- **FR-028:** Correct answers shall mark the puzzle as solved exactly once.
- **FR-029:** A solved puzzle shall not be solvable again for additional points.
- **FR-030:** The UI shall support appropriate puzzle types, including numeric codes, text answers, ciphers, sequences, and logic questions.
- **FR-031:** Puzzle answer matching shall be deterministic and defined per puzzle; it shall not rely on a fresh Gemini judgment for every answer attempt.

### 6.5 Hints

- **FR-032:** A player shall be able to request the next available hint for an unsolved puzzle.
- **FR-033:** Hints shall be progressive, with each hint giving more assistance than the previous one.
- **FR-034:** The backend shall enforce the total hint allowance for the chosen difficulty.
- **FR-035:** The backend shall reveal only the next hint requested, not all hints at once.
- **FR-036:** Each revealed hint shall create one scoring penalty event.
- **FR-037:** The UI shall communicate the remaining hint allowance and the score penalty before a hint is used.

### 6.6 Timer and game state

- **FR-038:** The game timer shall begin only after the player starts the adventure.
- **FR-039:** The backend shall calculate whether the deadline has passed on every gameplay mutation.
- **FR-040:** The frontend shall display the remaining time and visually warn the player when time is low.
- **FR-041:** Refreshing or reopening an active game shall restore its current state and original deadline.
- **FR-042:** A game that has reached its deadline shall transition to `expired` and reject further puzzle, hint, and interaction mutations.
- **FR-043:** A successful final escape shall transition the game to `escaped` and stop the timer.

### 6.7 Results and history

- **FR-044:** The results page shall show escaped or expired status.
- **FR-045:** The results page shall display score, time taken, puzzles solved, hints used, and the adventure title.
- **FR-046:** For an escaped game, the results page may reveal the full adventure explanation and solution after the game has ended.
- **FR-047:** The player shall be able to start another adventure.
- **FR-048:** The application shall provide a recent game history for the same guest session.
- **FR-049:** History shall not reveal private solution data for active games.

---

## 7. UI and Page Specifications

### 7.1 Visual direction

Use a cinematic, dark adventure aesthetic without sacrificing readability. Suggested palette: charcoal/near-black backgrounds, warm amber or brass accents, muted stone tones, and one clear accent color for interactive states. Avoid excessive glow, clutter, or low-contrast text.

Use consistent spacing, clear typography, and restrained transitions. Any sound must be optional, start only after a user interaction, and include a visible mute control.

### 7.2 Screen 1 — Home

**Purpose:** Introduce the game and invite the player to begin.

Required elements:
- Project name and tagline.
- Short explanation of the gameplay loop.
- Primary Start Adventure button.
- Theme teaser cards or visual preview.
- Brief explanation of timer and hints.
- Link to recent adventures/history when available.
- Footer with project information.

States:
- First visit with no history.
- Returning guest with recent games.
- Loading history.
- History retrieval failed.

### 7.3 Screen 2 — Create Adventure

**Purpose:** Collect the adventure configuration.

Required elements:
- Theme selector with all seven options.
- Difficulty selector with clear room count, time limit, and hint allowance.
- Custom premise textarea shown only for Custom Adventure.
- Character count and validation messages.
- Generate Adventure button.
- Loading state with progress copy while generation is running.
- Retry action for recoverable generation errors.

Do not imply exact AI generation progress unless the backend provides actual progress events. Use a neutral loading message such as "Creating your adventure...".

### 7.4 Screen 3 — Escape Room

**Purpose:** Main gameplay environment.

Desktop layout recommendation:
- Main room illustration with interactive hotspots.
- Room title and short setting description.
- Timer and game status in a persistent header.
- Clue notebook and inventory panel.
- Current room/puzzle progress indicator.
- Controls for available hints and room navigation.

Mobile layout recommendation:
- Room illustration scales to the screen width.
- Interactive objects remain large enough to tap.
- Inventory and clues open in drawer, tab, or accordion panels.
- Timer and primary actions remain visible without obscuring the room.
- No interaction depends solely on hover.

Interactive object requirements:
- Each hotspot must have a visible/focusable equivalent control in an object list.
- Use semantic buttons with accessible labels.
- Hotspot positions should be stored as relative percentages to remain responsive.
- The UI must communicate discovered, locked, and already-inspected states.

### 7.5 Screen 4 — Puzzle Interface

The puzzle can appear as a modal, side panel, or dedicated mobile sheet.

Required elements:
- Puzzle title and type.
- Instructions and known relevant clues.
- Input field(s) or controls appropriate to the puzzle type.
- Submit button.
- Correct/incorrect feedback.
- Request Hint button with hint allowance and penalty information.
- Close/back action that does not reset puzzle state.

Input behavior:
- Trim accidental leading/trailing whitespace.
- Do not transform answers in ways that change intended meaning.
- Provide clear validation for empty submissions and malformed input.
- Disable repeated submissions while a request is pending.

### 7.6 Screen 5 — Results

Required elements:
- Escape success or time-expired status.
- Final score.
- Total time taken and, when relevant, remaining time bonus.
- Puzzles solved / total puzzles.
- Hints used.
- Adventure title and theme.
- Short AI-generated ending or recap.
- Full explanation/solution only after game completion.
- Play Again and Return Home actions.

### 7.7 Shared UI states

Every screen that calls the backend shall handle:
- Initial loading.
- Empty state.
- Recoverable network error.
- Validation error.
- Unauthorized/expired guest session.
- Not found.
- Rate-limited response.
- Server error.

Use concise, actionable messages. Do not expose stack traces, secret prompts, internal IDs, or raw provider errors to players.

---

## 8. Puzzle Types and Game Content

### 8.1 Supported puzzle types for version 1.0

1. **Numeric combination:** A number or sequence opens a lock.
2. **Text riddle:** A short phrase or word is the answer.
3. **Cipher:** The player decodes a message using a stated or discoverable rule.
4. **Sequence:** The player identifies the next item in a pattern.
5. **Logic puzzle:** The player draws a conclusion from a small set of facts.
6. **Object interaction:** The player uses an inventory item or activates objects in a required order.

Do not implement image recognition, arbitrary free-form puzzle interfaces, or external web searches as part of puzzle solving in version 1.0.

### 8.2 Puzzle design rules

Each puzzle must:
- Have one clearly defined primary solution or a finite list of accepted equivalent answers.
- Provide enough information for a careful player to solve it.
- Avoid relying on obscure trivia or facts not introduced in the adventure.
- Include a short explanation of why the answer is correct.
- Have one to three progressive hints, subject to the difficulty's total hint allowance.
- Define prerequisites and the game state required for access.
- Be appropriate for its selected difficulty.
- Be solvable without guessing hidden information that has not been exposed.

### 8.3 Dependencies

Puzzles may depend on:
- A previous puzzle being solved.
- A clue being discovered.
- An inventory item being collected.
- An object being inspected or activated.
- Another room being unlocked.

The generator must produce an acyclic progression graph. Circular prerequisites are invalid. There must be at least one valid path from the first room to the final escape action.

---

## 9. Gemini AI Integration

### 9.1 Gemini responsibilities

Gemini is responsible for generating:
- Adventure title and narrative premise.
- Room names and descriptions.
- Object names and player-visible inspection descriptions.
- Discoverable clues and inventory items.
- Puzzle titles, instructions, types, and content.
- Private answer keys and answer explanations.
- Progressive hints.
- Room unlock requirements and final escape requirements.
- A short ending/recap for the results page.

### 9.2 Backend responsibilities

The backend is responsible for:
- Validating player input before calling Gemini.
- Building the AI prompt from trusted server templates.
- Calling Gemini with the API key held only on the server.
- Parsing and validating structured output.
- Checking counts, IDs, dependency integrity, answer availability, and solvability constraints.
- Splitting player-visible content from private solution data.
- Persisting the adventure.
- Enforcing all gameplay rules and score calculations.
- Controlling when hints, clues, rooms, and explanations are revealed.

### 9.3 Generation contract

The backend must request strict JSON output. Do not rely on parsing free-form prose or Markdown fences. The provider response must be parsed as JSON and validated against an application schema (for example, Zod or an equivalent runtime validator).

Suggested top-level structure:

```json
{
  "title": "The Clockmaker's Last Secret",
  "theme": "haunted_mansion",
  "difficulty": "easy",
  "premise": "A player enters an abandoned mansion...",
  "intro": "The front door closes behind you...",
  "rooms": [],
  "escapeCondition": {},
  "ending": "You discover the truth and escape..."
}
```

Suggested room structure:

```json
{
  "id": "room_1",
  "order": 1,
  "name": "The Entrance Hall",
  "description": "A large hall with a stopped clock...",
  "artworkKey": "haunted_mansion_hall",
  "objects": [
    {
      "id": "object_clock",
      "name": "Grandfather Clock",
      "description": "An old clock stands near the staircase.",
      "hotspot": { "x": 45, "y": 38 },
      "inspectText": "The clock face has several unusual markings.",
      "discoverableClueIds": ["clue_clock_marks"],
      "discoverableItemIds": [],
      "prerequisites": []
    }
  ],
  "puzzles": [
    {
      "id": "puzzle_clock_code",
      "type": "numeric_combination",
      "title": "The Clock Lock",
      "instructions": "Enter the four-digit code suggested by the clues.",
      "playerVisibleContent": "The lock has four number wheels.",
      "prerequisites": [],
      "requiredClueIds": ["clue_clock_marks"],
      "requiredItemIds": [],
      "hintIds": ["hint_clock_1", "hint_clock_2"],
      "solutionId": "solution_clock_code"
    }
  ],
  "unlockRequirements": {
    "requiredPuzzleIds": ["puzzle_clock_code"]
  }
}
```

Suggested private solution record:

```json
{
  "id": "solution_clock_code",
  "puzzleId": "puzzle_clock_code",
  "acceptedAnswers": ["1842"],
  "normalization": "numeric_string",
  "explanation": "The markings indicate the four digits in order.",
  "hints": [
    { "id": "hint_clock_1", "text": "Look closely at the markings around the clock." },
    { "id": "hint_clock_2", "text": "Read the marked positions in clockwise order." }
  ]
}
```

The sample values are illustrative only. Gemini must generate content that is internally consistent for each adventure.

### 9.4 Validation requirements

Before saving a generated adventure, verify:

- The theme and difficulty match the request.
- Room count matches difficulty.
- Each room contains exactly two required puzzles.
- Total puzzle count matches difficulty.
- All IDs are unique within the adventure.
- All referenced clue, item, hint, puzzle, object, and solution IDs exist.
- Every puzzle has at least one accepted answer and a defined normalization rule.
- Every puzzle has an explanation and progressive hints.
- Hint references are valid and ordered.
- Required clues/items can be discovered before they are required.
- All prerequisites are valid and have no cycles.
- The final escape condition is achievable.
- Content is not empty, contradictory, or inappropriate.
- Player-visible fields do not contain the solution in disguise (for example, answer text embedded in an object description).

Validation should be deterministic and performed in application code. A second Gemini call may be used to repair a failed generation, but it must not replace deterministic validation. Limit repair attempts (recommended maximum: two) and show a useful error if the generated content remains invalid.

### 9.5 Prompt security

Treat custom premises and all generated text as untrusted content. The system prompt must explicitly state that player-provided text is story input, not an instruction to reveal secrets, change rules, ignore the schema, or override system behavior. Never place API keys, database credentials, or internal secrets in prompts.

### 9.6 AI output safety and reliability

- Render generated text as text, not executable HTML.
- Sanitize any supported rich text before display.
- Reject unsupported HTML, scripts, event handlers, or unsafe URLs.
- Set request timeouts and provider retry limits.
- Handle provider quota, unavailable model, malformed output, and content rejection errors.
- Do not tell the player that an adventure was created until persistence has succeeded.

---

## 10. Backend Game Engine and State Model

### 10.1 Game states

An adventure session shall use these states:

- `generating` — AI content is being created and validated.
- `ready` — Adventure generated; timer has not started.
- `active` — Player has started and may play.
- `escaped` — Player completed the final escape condition.
- `expired` — Deadline passed before successful escape.
- `failed` — Generation or a terminal system failure prevented play.

Allowed transitions:

```text
generating -> ready
  | generating -> failed
ready -> active
active -> escaped
active -> expired
```

Terminal states (`escaped`, `expired`, `failed`) cannot transition back to active. A retry creates a new adventure session rather than reopening a finished session.

### 10.2 Server-authoritative actions

Every state-changing action must be processed by the backend. Examples include:
- Starting an adventure.
- Inspecting an object and discovering its contents.
- Collecting a clue or inventory item.
- Submitting a puzzle answer.
- Requesting a hint.
- Moving into an unlocked room.
- Completing the final escape condition.

The backend checks session ownership, session status, deadline, action prerequisites, and whether the action has already been completed before applying a mutation.

### 10.3 Idempotency and duplicate requests

Client requests may be retried due to poor network connectivity. State-changing endpoints should accept an `Idempotency-Key` header or equivalent request ID where practical. Repeating a successful inspect, puzzle-solve, or hint request must not duplicate points or consume another hint unintentionally.

### 10.4 Game event ledger

Record relevant events on the server, for example:
- `adventure_started`
- `object_inspected`
- `clue_discovered`
- `item_collected`
- `puzzle_attempted`
- `puzzle_solved`
- `hint_revealed`
- `room_unlocked`
- `adventure_escaped`
- `adventure_expired`

The event ledger supports score auditing, debugging, and history display. Do not store the player's raw sensitive data; the game does not require it.

---

## 11. Database Design — MongoDB and Mongoose

### 11.1 Data model overview

Use separate public and private collections so private solutions do not accidentally appear in ordinary adventure responses.

Recommended collections:

1. `guest_sessions`
2. `adventures`
3. `adventure_secrets`
4. `game_events`

### 11.2 GuestSession model

Purpose: identify an anonymous player across requests and retrieve their adventure history.

Suggested fields:

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `tokenHash` | String | Hash of random guest token; never store raw token |
| `createdAt` | Date | Created timestamp |
| `lastSeenAt` | Date | Last activity |
| `expiresAt` | Date | Session expiry; add TTL index if appropriate |

Use a cryptographically secure random token. Send it in a Secure, HttpOnly, SameSite cookie in production. Do not expose the raw token in application logs.

### 11.3 Adventure model (public/gameplay data)

Suggested fields:

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Adventure ID |
| `guestSessionId` | ObjectId | Owner guest session |
| `title` | String | Generated title |
| `theme` | String | Valid theme enum |
| `difficulty` | String | easy / medium / hard |
| `premise` | String | User premise or selected theme prompt |
| `intro` | String | Player-visible intro |
| `rooms` | Array | Public room/object/puzzle content only |
| `status` | String | State enum |
| `currentRoomId` | String | Current unlocked room |
| `discoveredClueIds` | Array of String | Clues discovered by player |
| `collectedItemIds` | Array of String | Items collected |
| `solvedPuzzleIds` | Array of String | Server-validated solved puzzles |
| `revealedHintIds` | Array of String | Hints already revealed |
| `hintsUsed` | Number | Server-calculated count |
| `startedAt` | Date/null | Timer start |
| `deadlineAt` | Date/null | Authoritative deadline |
| `endedAt` | Date/null | Completion/expiry timestamp |
| `elapsedSeconds` | Number | Calculated by backend |
| `finalScore` | Number/null | Calculated once on completion |
| `resultSummary` | String/null | Safe ending summary |
| `createdAt` | Date | Creation time |
| `updatedAt` | Date | Last update |

Do not include answer keys, accepted answers, hidden explanations, or unrevealed hint text in the public `rooms` object.

### 11.4 AdventureSecret model (private data)

Suggested fields:

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `adventureId` | ObjectId | Unique reference to adventure |
| `puzzleSolutions` | Array | Accepted answers, normalization rules, explanations |
| `hintContent` | Array | Progressive hint text keyed by hint ID |
| `escapeSolution` | Object | Private final escape condition details |
| `createdAt` | Date | Creation time |

Apply a unique index on `adventureId`. This collection must only be queried by internal server services and must never be serialized directly to an API response.

### 11.5 GameEvent model

Suggested fields:

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Event ID |
| `adventureId` | ObjectId | Related adventure |
| `guestSessionId` | ObjectId | Owner |
| `eventType` | String | Enum of supported event types |
| `entityId` | String/null | Object, clue, item, or puzzle ID |
| `metadata` | Object | Small, non-sensitive event details |
| `createdAt` | Date | Server timestamp |

Avoid storing raw accepted answers in ordinary event metadata. Record whether an attempt was correct and the puzzle ID, not the answer string, unless a short-lived debug mode is explicitly enabled in a safe development environment.

### 11.6 Indexes and retention

- Index `guestSessionId` and `createdAt` on adventures for history queries.
- Index `adventureId` and `createdAt` on game events.
- Enforce unique `adventureId` on `adventure_secrets`.
- Add TTL cleanup for expired guest sessions and associated data according to the chosen retention policy.
- Define cleanup behavior so an active adventure is not removed before its deadline.

---

## 12. API Design

Base path: `/api`

All endpoints return JSON. Use consistent error responses and standard HTTP status codes. Every adventure endpoint must verify that the adventure belongs to the current guest session.

### 12.1 Standard success response

```json
{
  "success": true,
  "data": {},
  "message": "Request completed."
}
```

### 12.2 Standard error response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please select a valid difficulty."
  }
}
```

Never include stack traces, provider credentials, private solution fields, or raw database errors in public responses.

### 12.3 Endpoint summary

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/guest/session` | Create or initialize guest session |
| `POST` | `/api/adventures` | Generate a new adventure |
| `GET` | `/api/adventures/:id` | Retrieve safe adventure state |
| `POST` | `/api/adventures/:id/start` | Start timer and game |
| `POST` | `/api/adventures/:id/objects/:objectId/inspect` | Inspect an object |
| `POST` | `/api/adventures/:id/puzzles/:puzzleId/attempt` | Submit a puzzle answer |
| `POST` | `/api/adventures/:id/puzzles/:puzzleId/hints` | Reveal next available hint |
| `POST` | `/api/adventures/:id/rooms/:roomId/enter` | Enter an unlocked room |
| `POST` | `/api/adventures/:id/escape` | Attempt final escape |
| `GET` | `/api/adventures/:id/result` | Retrieve completed result |
| `GET` | `/api/history` | List recent guest adventures |

### 12.4 POST `/api/guest/session`

Creates a guest session if one does not already exist. In production, the server sets the HttpOnly cookie.

Response example:

```json
{
  "success": true,
  "data": {
    "guestSession": { "created": true }
  }
}
```

### 12.5 POST `/api/adventures`

Request:

```json
{
  "theme": "haunted_mansion",
  "difficulty": "easy",
  "customPremise": "A player is trapped in an abandoned mansion."
}
```

Validation:
- `theme` must be one of the supported theme identifiers.
- `difficulty` must be `easy`, `medium`, or `hard`.
- `customPremise` is required only for `custom_adventure` and must not exceed 500 characters.
- Reject unsupported or excessive input.

Recommended response: `202 Accepted` when generation is asynchronous, or `201 Created` if generation is completed within the request. For reliable deployment, prefer asynchronous generation with a generation status record.

Example:

```json
{
  "success": true,
  "data": {
    "adventureId": "GENERATED_OBJECT_ID",
    "status": "generating"
  },
  "message": "Your adventure is being created."
}
```

The frontend can poll `GET /api/adventures/:id` at a reasonable interval while status is `generating`. Stop polling when the adventure is `ready` or `failed`.

### 12.6 GET `/api/adventures/:id`

Returns the safe adventure projection. The response may include:
- Adventure title, theme, difficulty, intro, status.
- Current room and unlocked room summaries.
- Public object and puzzle descriptions allowed at the current progression stage.
- Discovered clues and collected items.
- Solved puzzle IDs and progress counts.
- Timer timestamps and server-computed remaining seconds.
- Remaining hint allowance.

Must not include:
- Accepted answers.
- Private answer explanations while active.
- All unrevealed hint text.
- Future room secrets not yet unlocked.
- Internal AI prompts or provider metadata.

### 12.7 POST `/api/adventures/:id/start`

Starts a `ready` adventure. The backend sets `startedAt`, `deadlineAt`, and `status = active`. Repeated start requests should return the existing start information without resetting the timer.

Response example:

```json
{
  "success": true,
  "data": {
    "status": "active",
    "startedAt": "2026-10-31T10:00:00.000Z",
    "deadlineAt": "2026-10-31T10:30:00.000Z",
    "remainingSeconds": 1800
  }
}
```

### 12.8 POST `/api/adventures/:id/objects/:objectId/inspect`

Inspects an object if it is available and the required prerequisites are satisfied.

Response example:

```json
{
  "success": true,
  "data": {
    "objectId": "object_clock",
    "inspectionText": "The clock face has several unusual markings.",
    "newClues": [
      { "id": "clue_clock_marks", "title": "Clock markings", "text": "Four symbols appear in a sequence." }
    ],
    "newItems": [],
    "alreadyInspected": false
  }
}
```

The backend must not reveal an object that is still locked. Repeated inspection must not duplicate clue, item, or score changes.

### 12.9 POST `/api/adventures/:id/puzzles/:puzzleId/attempt`

Request:

```json
{
  "answer": "1842"
}
```

Correct response:

```json
{
  "success": true,
  "data": {
    "correct": true,
    "puzzleSolved": true,
    "message": "The lock clicks open.",
    "newlyUnlocked": ["room_2"],
    "progress": { "solved": 1, "total": 6 }
  }
}
```

Incorrect response:

```json
{
  "success": true,
  "data": {
    "correct": false,
    "puzzleSolved": false,
    "message": "That combination does not work. Re-examine the clues."
  }
}
```

The response must never contain the expected answer or private explanation while the adventure is active.

### 12.10 POST `/api/adventures/:id/puzzles/:puzzleId/hints`

Request:

```json
{}
```

Response example:

```json
{
  "success": true,
  "data": {
    "hintNumber": 1,
    "hintText": "Pay attention to the symbols around the clock face.",
    "hintsRemaining": 4,
    "scorePenalty": 15
  }
}
```

Reject the request if the puzzle is solved, the game is not active, the deadline has passed, or the global hint allowance is exhausted. Repeating the same request must not reveal or charge the same hint twice.

### 12.11 POST `/api/adventures/:id/rooms/:roomId/enter`

Enters a room only if its unlock requirements have been met. The server updates `currentRoomId` and returns the room's player-visible content.

### 12.12 POST `/api/adventures/:id/escape`

Checks the final escape condition. The backend verifies all required puzzles, objects, and items. If the condition is satisfied and the deadline has not passed, the backend changes status to `escaped`, calculates elapsed time and score, and stores the result. If requirements are incomplete, return a safe message describing the missing public objective without exposing hidden answers.

### 12.13 GET `/api/adventures/:id/result`

Available only for terminal game states (`escaped` or `expired`). Returns the score breakdown and, after completion, the full explanation/solution content appropriate for the result screen.

### 12.14 GET `/api/history`

Returns a paginated or limited list of the current guest session's recent adventures. Do not expose other guest sessions or secret data for active adventures.

---

## 13. Security and Privacy Requirements

### 13.1 Protecting answers and hints

This is a critical requirement.

- Store answer keys and solution explanations in a private collection, separate from the public adventure document.
- Never send private solution records to the browser while a game is active.
- Reveal one hint only when the player requests it and the backend verifies eligibility.
- Do not send future hint text in the initial adventure response.
- Do not expose unlocked-later rooms or their secrets before progression allows them.
- Do not place answer keys in HTML, JavaScript bundles, source maps, browser storage, or frontend state.
- Do not use hidden DOM elements as a security mechanism.
- After the game ends, the result endpoint may reveal the solution because the game is no longer active.

### 13.2 Guest session security

- Generate guest tokens using a cryptographically secure random generator.
- Store only a hash of the token in MongoDB.
- Use Secure, HttpOnly, SameSite cookies in production.
- Restrict CORS to the deployed frontend origin.
- Verify adventure ownership on every adventure endpoint.
- Use CSRF protection if cookie-based authentication and deployment topology require it.
- Rotate or expire guest sessions according to the retention policy.

### 13.3 API and application security

- Keep Gemini and MongoDB credentials in backend environment variables.
- Never prefix private secrets with a frontend-exposed variable prefix such as `VITE_`.
- Validate and length-limit all incoming values.
- Rate-limit generation, answer attempts, and hint requests.
- Use parameterized Mongoose operations and avoid unsafe dynamic query construction.
- Prevent mass assignment by mapping accepted input fields explicitly.
- Escape or safely render AI-generated text.
- Use HTTPS in production.
- Avoid logging cookies, tokens, API keys, or private answers.
- Apply secure HTTP headers, including an appropriate Content Security Policy where practical.

### 13.4 Fairness and abuse prevention

The backend must not trust client-supplied values for:
- Score.
- Remaining time.
- Number of solved puzzles.
- Hint count.
- Current room.
- Inventory contents.
- Adventure status.

All such values must be derived from persisted server state and validated server events.

---

## 14. Non-Functional Requirements

### 14.1 Performance

- Initial page should load quickly on a typical modern broadband/mobile connection.
- Avoid sending all room artwork and history data in the initial payload.
- Use appropriately sized compressed images and lazy loading where useful.
- Keep game action API responses small.
- Set a timeout for Gemini generation and provide a visible failure/retry state.
- Do not block the game interface while unrelated components load.

### 14.2 Reliability

- Persist important game actions before returning success.
- Refreshing the browser must restore the current server state.
- Use atomic or otherwise concurrency-safe updates for puzzle solving, hint usage, and game completion.
- Ensure a puzzle cannot grant points twice under concurrent requests.
- Ensure a game can be finalized only once.

### 14.3 Accessibility

- Use semantic headings, buttons, labels, and form controls.
- Support keyboard navigation and visible focus states.
- Provide text alternatives for room artwork.
- Do not rely on color alone to communicate status.
- Ensure adequate contrast and readable font sizes.
- Provide accessible object-list controls as an alternative to image hotspots.
- Respect reduced-motion preferences.

### 14.4 Compatibility

Support current stable versions of major desktop and mobile browsers, including Chrome, Edge, Firefox, and Safari. The application must remain functional at common mobile widths.

### 14.5 Maintainability

- Separate frontend, backend, AI integration, game engine, and database layers.
- Keep game rules out of React presentation components.
- Use shared enums/constants for difficulty, themes, statuses, and puzzle types.
- Validate API input and AI output using reusable schemas.
- Add meaningful logs and automated tests for critical state transitions.

---

## 15. Error Handling and Edge Cases

The implementation must handle at least the following cases:

1. Gemini is unavailable or times out.
2. Gemini returns invalid JSON.
3. Gemini returns the wrong number of rooms or puzzles.
4. Generated puzzle references are broken.
5. Generated prerequisites contain a cycle.
6. A puzzle has no valid answer.
7. A player refreshes during generation.
8. A player refreshes during an active game.
9. A guest cookie is missing or expired.
10. A player tries to access another guest's adventure ID.
11. A player submits an empty answer.
12. A player submits an answer while the previous request is pending.
13. A player repeatedly submits incorrect answers.
14. A player tries to solve a puzzle twice.
15. A player requests a hint after using the allowance.
16. A player requests a hint for a solved or locked puzzle.
17. A player tries to enter a locked room.
18. A player sends a request after the deadline.
19. Two requests race to solve the same puzzle.
20. Two requests race to finalize the same adventure.
21. The network disconnects after the server saves an action but before the client receives the response.
22. A user opens an old or malformed adventure URL.
23. A room image fails to load.
24. The browser tab is inactive or suspended while the timer continues.

For all failures, the backend state must remain consistent. Client messages should tell the player what can be done next without revealing protected information.

---

## 16. Frontend Architecture

### 16.1 Recommended structure

```text
client/
  public/
    images/
      rooms/
    sounds/
  src/
    app/
      App.jsx
      routes.jsx
    assets/
    components/
      common/
      layout/
      adventure/
      room/
      puzzle/
      inventory/
      timer/
      results/
    pages/
      HomePage.jsx
      CreateAdventurePage.jsx
      GamePage.jsx
      ResultsPage.jsx
      HistoryPage.jsx
    hooks/
      useAdventure.js
      useGameTimer.js
    services/
      api.js
      adventureService.js
    context/
      AdventureContext.jsx
    utils/
      formatTime.js
      errorMessages.js
    styles/
    main.jsx
```

### 16.2 Frontend responsibilities

- Render pages and reusable components.
- Collect player choices and inputs.
- Call backend APIs.
- Display server-authoritative game state.
- Provide local interaction feedback and loading states.
- Maintain transient UI state such as open panels and selected tabs.
- Never store private puzzle answers or calculate authoritative scores.

### 16.3 State management

A lightweight context or a state library may be used. The game state must be refreshed from the backend after mutations. Do not treat local React state as the source of truth for score, timer deadline, solved puzzles, inventory, or room unlocks.

### 16.4 Timer display

The frontend may calculate a visual countdown from the server-provided deadline for smooth display. It must periodically resynchronize using server time/remaining seconds and must not decide that the game is successfully completed or expired on its own.

---

## 17. Backend Architecture

### 17.1 Recommended structure

```text
server/
  src/
    config/
      db.js
      env.js
    controllers/
      guestController.js
      adventureController.js
      gameController.js
      historyController.js
    middleware/
      requireGuestSession.js
      rateLimiter.js
      validateRequest.js
      errorHandler.js
    models/
      GuestSession.js
      Adventure.js
      AdventureSecret.js
      GameEvent.js
    routes/
      healthRoutes.js
      guestRoutes.js
      adventureRoutes.js
      historyRoutes.js
    services/
      geminiService.js
      adventureGenerationService.js
      adventureValidationService.js
      gameEngineService.js
      scoringService.js
      timerService.js
      historyService.js
    schemas/
      adventureRequest.schema.js
      generatedAdventure.schema.js
    prompts/
      generateAdventure.prompt.js
      repairAdventure.prompt.js
    utils/
      answerNormalization.js
      asyncHandler.js
      apiError.js
    app.js
    server.js
```

### 17.2 Backend layers

- **Routes:** Map HTTP methods and paths to controllers.
- **Middleware:** Handle guest authentication, validation, rate limits, and errors.
- **Controllers:** Translate HTTP requests into service calls and safe responses.
- **Services:** Implement generation, game rules, scoring, timers, and history.
- **Models:** Define MongoDB schemas and indexes.
- **Schemas:** Validate untrusted request and AI response payloads.

Controllers should remain thin. Business rules belong in services, not route handlers.

---

## 18. Suggested Implementation Plan

Build in small, testable phases. Do not start by integrating every feature at once.

### Phase 1 — Repository and project foundation

Tasks:
- Create the repository with `client` and `server` folders.
- Configure React + Vite.
- Configure Tailwind CSS.
- Configure Express and a basic health endpoint.
- Connect MongoDB.
- Add environment variable validation.
- Add a root README and `.gitignore`.

Exit criteria:
- Frontend and backend start locally.
- Backend can connect to MongoDB.
- `/api/health` returns a successful response.

### Phase 2 — Static UI and navigation

Tasks:
- Build Home page.
- Build Create Adventure page.
- Build the room/game layout using mock adventure data.
- Build puzzle modal/panel.
- Build Results page.
- Add responsive layouts and accessible controls.

Exit criteria:
- A complete mock adventure can be navigated from start to result without Gemini.

### Phase 3 — Deterministic game engine

Tasks:
- Implement game states and legal state transitions.
- Implement room/object inspection.
- Implement clue and inventory collection.
- Implement puzzle answer normalization and validation.
- Implement puzzle prerequisites and room unlocking.
- Implement hint allowance and progressive hint reveal.
- Implement backend timer enforcement.
- Implement score calculation and event logging.

Exit criteria:
- A seeded adventure can be played to success or expiry.
- Backend tests verify all critical rules.

### Phase 4 — Gemini adventure generation

Tasks:
- Add server-side Gemini client.
- Create structured generation prompt.
- Define runtime schema for model output.
- Implement deterministic validation.
- Store public and private data separately.
- Add bounded repair/retry behavior.
- Add generation loading and error UI.

Exit criteria:
- Gemini can generate valid adventures at all three difficulty levels.
- Invalid outputs are rejected safely.
- Private solutions are never included in normal API responses.

### Phase 5 — Persistence and history

Tasks:
- Add guest session management.
- Persist active game progress.
- Restore active games after refresh.
- Save terminal results.
- Add recent history screen/panel.

Exit criteria:
- A guest can close and reopen the browser and resume an unexpired game using the same session cookie.

### Phase 6 — Polish and quality

Tasks:
- Add curated room artwork and responsive hotspots.
- Add optional sound toggle and lightweight animations.
- Add loading skeletons and useful error states.
- Review accessibility and mobile usability.
- Add rate limits, security headers, and logs.

Exit criteria:
- Game is usable on desktop and mobile and passes the test plan.

### Phase 7 — Deployment

Tasks:
- Create production MongoDB database.
- Deploy backend API.
- Configure production secrets.
- Deploy frontend and set API base URL.
- Configure CORS, cookies, HTTPS, and allowed origins.
- Run smoke tests on the public website.

Exit criteria:
- A player can complete a generated game on the deployed website.

---

## 19. Testing Strategy and Acceptance Criteria

### 19.1 Unit tests

Test:
- Difficulty configuration values.
- Answer normalization for each supported puzzle type.
- Accepted answer matching.
- Score formula and minimum score.
- Remaining time calculation.
- Hint allowance enforcement.
- Dependency graph validation and cycle detection.
- State transition rules.

### 19.2 Integration tests

Test:
- Guest session creation and ownership checks.
- Adventure creation and generation status.
- Gemini output parsing and validation.
- Public/private data separation.
- Object inspection and clue collection.
- Puzzle answer submission.
- Hint reveal and penalty recording.
- Room unlocking.
- Escape and expiry finalization.
- History retrieval.

### 19.3 End-to-end tests

At minimum, automate these flows:

**Flow A — Successful Easy adventure**
1. Create a guest session.
2. Generate an Easy adventure.
3. Start the game.
4. Inspect objects and collect required clues.
5. Solve all required puzzles.
6. Unlock all rooms.
7. Escape successfully.
8. Verify final score and result page.

**Flow B — Hint penalty**
1. Start an adventure.
2. Request a hint.
3. Verify one hint is revealed.
4. Verify the hint counter increases and score calculation includes the penalty.
5. Attempt to exceed the hint allowance and verify rejection.

**Flow C — Timer expiry**
1. Start an adventure with a short test deadline.
2. Advance or mock server time in the test environment.
3. Attempt a gameplay action after the deadline.
4. Verify the adventure becomes expired and no further action is accepted.

**Flow D — Secret protection**
1. Generate an adventure.
2. Inspect every normal API response while the game is active.
3. Verify no accepted answers, private explanations, unrevealed hints, or future room secrets are present.
4. Complete the game.
5. Verify solution information is available only from the terminal result endpoint.

**Flow E — Cross-session access**
1. Create two guest sessions.
2. Generate an adventure under the first session.
3. Attempt to access it with the second session.
4. Verify the server rejects the request without disclosing whether private data exists.

### 19.4 Acceptance criteria

The project is accepted for version 1.0 when all of the following are true:

- [ ] Home and adventure setup screens work.
- [ ] All seven theme options are supported.
- [ ] Easy, Medium, and Hard configurations match Section 4.
- [ ] Custom premise input is validated and incorporated into generation.
- [ ] Gemini-generated content is schema-validated before persistence.
- [ ] Generated adventure contains the correct number of rooms and puzzles.
- [ ] Every puzzle has a valid deterministic answer check.
- [ ] Player can inspect objects and collect clues/items.
- [ ] Inventory and clue notebook show collected content.
- [ ] Player can solve all supported puzzle types included in the generated game.
- [ ] Correct answers unlock the required progression.
- [ ] Incorrect answers do not reveal solutions.
- [ ] Progressive hints work and are limited by difficulty.
- [ ] Timer begins only when the game starts.
- [ ] Backend rejects gameplay actions after expiry.
- [ ] Backend calculates the final score according to Section 4.5.
- [ ] Refreshing restores active progress.
- [ ] Guest session ownership is enforced.
- [ ] Active API responses do not contain private answers or unrevealed hints.
- [ ] Results page displays accurate completion status and score breakdown.
- [ ] Recent history shows only the current guest's adventures.
- [ ] Mobile and desktop layouts are usable.
- [ ] Production website passes smoke tests.

---

## 20. Deployment and Environment Configuration

### 20.1 Suggested deployment options

A practical deployment setup is:
- **Frontend:** Vercel or Netlify.
- **Backend:** Render, Railway, or another Node.js hosting service.
- **Database:** MongoDB Atlas.
- **AI provider:** Gemini API accessed only by the backend.

Choose services based on current pricing, free-tier availability, region, and deployment constraints at implementation time.

### 20.2 Environment variables

Backend `.env` example:

```env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/ai_escape_room
GEMINI_API_KEY=replace_with_server_secret
GEMINI_MODEL=replace_with_supported_model_name
SESSION_TOKEN_SECRET=replace_with_long_random_secret
SESSION_TTL_DAYS=30
```

Frontend `.env` example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Rules:
- Never commit `.env` files.
- Provide `.env.example` with placeholders only.
- Do not put Gemini or session secrets in frontend environment variables.
- Validate required environment values at server startup.
- Use the current supported Gemini model identifier configured for the deployment; do not hard-code an obsolete model name throughout the codebase.

### 20.3 Production checklist

- [ ] Production MongoDB credentials are configured securely.
- [ ] Gemini key is stored in backend secret configuration.
- [ ] Frontend points to the production API.
- [ ] Backend CORS allows only the production frontend origin.
- [ ] HTTPS is enabled.
- [ ] Session cookies use Secure and HttpOnly settings.
- [ ] Health endpoint is reachable by the hosting platform.
- [ ] Logs do not contain secrets or solution answers.
- [ ] Rate limits are enabled.
- [ ] Database backups/retention are considered.
- [ ] A full game has been completed on the deployed website.

---

## 21. Deliverables

The final project submission must include:

1. Complete source code for frontend and backend.
2. `SPEC.md` containing the approved project requirements.
3. `README.md` with project description, setup instructions, scripts, and deployment links.
4. `.env.example` files for frontend and backend.
5. MongoDB/Mongoose models and indexes.
6. Gemini prompt templates and output validation schemas.
7. Automated tests for game rules, API behavior, and secret protection.
8. Screenshots of the main screens.
9. A deployed website URL.
10. A short demonstration showing adventure creation, room exploration, puzzle solving, hint usage, and final results.

---

## 22. Development Rules for AI Coding Assistants

When an AI coding assistant (such as Codex) implements this project, it must follow these rules:

1. Read this entire `SPEC.md` before changing code.
2. Inspect the existing repository before creating or overwriting files.
3. Implement in the phases defined in Section 18.
4. Do not skip directly to a large, untested implementation.
5. Keep frontend and backend responsibilities separated.
6. Keep Gemini calls on the backend only.
7. Never expose answers, private explanations, or unrevealed hint content to the browser during an active game.
8. Never trust client-provided score, time, inventory, progress, or game status.
9. Validate all user input and all Gemini output.
10. Add or update tests for every important gameplay rule.
11. Use clear, reusable components and services.
12. Keep secrets out of source control and logs.
13. Do not introduce unrelated features without updating the specification.
14. After each phase, run relevant tests and report what passed, what failed, and what remains.
15. If a requirement cannot be implemented as written, explain the constraint and propose the smallest safe adjustment before changing the behavior.

### Definition of done for each implementation task

A task is complete only when:
- The code is implemented in the correct layer.
- Relevant validation and error handling are present.
- Tests are added or updated.
- Existing tests continue to pass.
- The user-facing behavior matches this specification.
- No secrets or private game solutions are exposed.
- The implementation summary identifies changed files and any known limitations.

---

## 23. Future Enhancements (Not Required for Version 1.0)

Potential later additions include:

- Optional player registration and profiles.
- Multiplayer cooperative rooms.
- Public leaderboards and achievements.
- AI-generated room illustrations.
- More puzzle types, including audio and visual pattern puzzles.
- 3D room exploration.
- Voice narration and sound effects packs.
- Community-created adventures with moderation.
- Daily or seasonal challenge rooms.
- Multiple languages.

These enhancements must not delay delivery of the core single-player experience.

---

## 24. Final Product Definition

AI Escape Room version 1.0 is a deployed, responsive, single-player web game in which a guest can choose one of seven adventure themes, select a difficulty, generate an adventure with Gemini, explore illustrated clickable rooms, discover clues and items, solve interconnected puzzles, request limited progressive hints, and escape before the server-enforced deadline.

The backend is authoritative for all game state, answer validation, timers, room progression, hints, and scoring. Private solutions remain server-side until the adventure reaches a terminal state. The experience is complete when the player can finish or time out, see an accurate result, and start another adventure.

**End of specification.**
