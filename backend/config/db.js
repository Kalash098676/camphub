import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });
dotenv.config();

export const connectDB = async () => {
  mongoose.set('bufferCommands', false);
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campushub';
    console.log('🔄 Attempting MongoDB connection...');
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Notice: ${error.message}`);
    console.log(`ℹ️ Server running in fallback mode for endpoints without active DB connection`);
  }
};

