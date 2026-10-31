import mongoose from 'mongoose';
import { config } from './config.js';

const memory = { sessions: new Map(), adventures: new Map(), secrets: new Map(), events: [] };
let connected = false;
const schemas = () => {
  const sessionSchema = new mongoose.Schema({ _id: String, tokenHash: { type: String, unique: true }, createdAt: Date, lastSeenAt: Date, expiresAt: { type: Date, index: { expires: 0 } } });
  const adventureSchema = new mongoose.Schema({ _id: String, guestSessionId: String, title: String, theme: String, generationMode: String, difficulty: String, premise: String, intro: String, rooms: Array, clues: Array, items: Array, ending: String, status: String, currentRoomId: String, discoveredClueIds: [String], collectedItemIds: [String], inspectedObjectIds: [String], solvedPuzzleIds: [String], revealedHintIds: [String], hintsUsed: Number, startedAt: Date, deadlineAt: Date, endedAt: Date, elapsedSeconds: Number, finalScore: Number, resultSummary: String, createdAt: Date, updatedAt: Date });
  const secretSchema = new mongoose.Schema({ adventureId: { type: String, unique: true }, puzzleSolutions: Array, escapeSolution: Object });
  const eventSchema = new mongoose.Schema({ adventureId: String, guestSessionId: String, eventType: String, entityId: String, metadata: Object, createdAt: Date });
  return { Session: mongoose.models.GuestSession || mongoose.model('GuestSession', sessionSchema), Adventure: mongoose.models.Adventure || mongoose.model('Adventure', adventureSchema), Secret: mongoose.models.AdventureSecret || mongoose.model('AdventureSecret', secretSchema), Event: mongoose.models.GameEvent || mongoose.model('GameEvent', eventSchema) };
};
let models;
export async function connectStore() {
  if (!config.mongoUri) return false;
  try { await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 4000 }); models = schemas(); connected = true; console.log('MongoDB connected'); }
  catch (error) { console.warn(`MongoDB unavailable; using demo memory store (${error.message})`); }
  return connected;
}
export const isDurable = () => connected;
export async function putSession(session) {
  if (connected) return models.Session.findOneAndUpdate({ tokenHash: session.tokenHash }, session, { upsert: true, new: true });
  memory.sessions.set(session.tokenHash, session); return session;
}
export async function getSession(hash) { return connected ? models.Session.findOne({ tokenHash: hash }).lean() : memory.sessions.get(hash); }
export async function saveAdventure(a, secret) {
  if (connected) { await models.Adventure.findByIdAndUpdate(a._id, a, { upsert: true }); await models.Secret.findOneAndUpdate({ adventureId: a._id }, { adventureId: a._id, ...secret }, { upsert: true }); return; }
  memory.adventures.set(a._id, structuredClone(a)); if (secret) memory.secrets.set(a._id, structuredClone(secret));
}
export async function getAdventure(id, owner) {
  if (connected) { const a = await models.Adventure.findOne({ _id: id, guestSessionId: owner }).lean(); return a; }
  const a = memory.adventures.get(id); return a?.guestSessionId === owner ? structuredClone(a) : null;
}
export async function getSecret(id) { return connected ? models.Secret.findOne({ adventureId: id }).lean() : memory.secrets.get(id); }
export async function listAdventures(owner) {
  if (connected) return models.Adventure.find({ guestSessionId: owner }).sort({ createdAt: -1 }).limit(20).lean();
  return [...memory.adventures.values()].filter(a => a.guestSessionId === owner).sort((a,b) => b.createdAt - a.createdAt).slice(0,20).map(a => structuredClone(a));
}
export async function event(e) { if (connected) return models.Event.create(e); memory.events.push(e); }
