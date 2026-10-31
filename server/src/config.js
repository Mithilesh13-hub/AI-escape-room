import 'dotenv/config';
export const config = {
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  geminiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  sessionSecret: process.env.SESSION_TOKEN_SECRET || 'local-demo-change-this-secret',
  sessionTtlDays: Number(process.env.SESSION_TTL_DAYS || 30),
  production: process.env.NODE_ENV === 'production'
};
