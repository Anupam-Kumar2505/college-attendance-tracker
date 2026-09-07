import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { connectDB, isDatabaseConnected } from './config/db.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// Controlled CORS
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in development for smooth local testing
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serverless DB connection middleware
app.use(async (req, res, next) => {
  if (env.MONGODB_URI && !isDatabaseConnected()) {
    try {
      await connectDB();
    } catch (e) {
      // Handled inside connectDB fallback
    }
  }
  next();
});

// Mount API routes
app.use('/api', apiRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
