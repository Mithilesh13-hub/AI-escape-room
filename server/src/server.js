import { app, connectStore } from './app.js';
import { config } from './config.js';
if (config.production) {
  const missing = ['MONGODB_URI','GEMINI_API_KEY','SESSION_TOKEN_SECRET'].filter(name => !process.env[name]);
  if (missing.length) throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  if (config.sessionSecret.length < 32) throw new Error('SESSION_TOKEN_SECRET must contain at least 32 characters.');
}
await connectStore();
const server=app.listen(config.port,'0.0.0.0',()=>console.log(`AI Escape Room listening on port ${config.port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
