import { app, connectStore } from './app.js';
import { config } from './config.js';
await connectStore();
app.listen(config.port,()=>console.log(`AI Escape Room API listening on ${config.port}`));
