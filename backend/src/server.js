import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    console.log('[Server] Initializing College Attendance Backend...');
    
    // Connect to MongoDB Atlas (or fallback to local data.json store)
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`[Server] Server is running on port ${env.PORT}`);
      console.log(`[Server] Environment: ${env.NODE_ENV}`);
      console.log(`[Server] API Base: http://localhost:${env.PORT}/api`);
    });

    // Graceful termination handling
    const shutdown = async () => {
      console.log('[Server] Gracefully shutting down...');
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('[Server] Fatal startup error:', error.message);
    process.exit(1);
  }
};

startServer();
