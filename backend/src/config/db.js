import mongoose from 'mongoose';
import { env } from './env.js';

let isMongoConnected = false;
let connectionPromise = null;

export const isDatabaseConnected = () => isMongoConnected && mongoose.connection.readyState === 1;

export const connectDB = async () => {
  if (!env.MONGODB_URI) {
    console.log('\x1b[33m%s\x1b[0m', '[Storage] MONGODB_URI is not set. Operating in Local JSON Storage Mode.');
    isMongoConnected = false;
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const conn = await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} / database: ${conn.connection.name}`);
      isMongoConnected = true;
      return conn;
    } catch (error) {
      console.warn(`[MongoDB] Atlas connection failed (${error.message}). Operating in Local JSON Storage Mode.`);
      isMongoConnected = false;
      return null;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
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
