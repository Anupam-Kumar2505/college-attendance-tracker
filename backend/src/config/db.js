import mongoose from 'mongoose';
import { env } from './env.js';

let isMongoConnected = false;

export const isDatabaseConnected = () => isMongoConnected;

export const connectDB = async () => {
  if (!env.MONGODB_URI) {
    console.log('\x1b[33m%s\x1b[0m', '[Storage] MONGODB_URI is not set. Operating in Local JSON Storage Mode (backend/src/data/data.json).');
    isMongoConnected = false;
    return null;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} / database: ${conn.connection.name}`);
    isMongoConnected = true;
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Atlas connection failed (${error.message}). Falling back to Local JSON Storage Mode.`);
    isMongoConnected = false;
    return null;
  }
};

export const disconnectDB = async () => {
  if (isMongoConnected) {
    try {
      await mongoose.disconnect();
      isMongoConnected = false;
      console.log('[MongoDB] Disconnected successfully');
    } catch (error) {
      console.error(`[MongoDB] Disconnection error: ${error.message}`);
    }
  }
};
