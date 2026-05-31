import mongoose from 'mongoose';

const globalForMongoose = globalThis;

if (!globalForMongoose.__mongooseCache) {
  globalForMongoose.__mongooseCache = {
    conn: null,
    promise: null,
  };
}

const cached = globalForMongoose.__mongooseCache;

const connectDB = async () => {
  try {
    if (cached.conn && mongoose.connection.readyState === 1) {
      return cached.conn;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      }).then((conn) => conn);
    }

    cached.conn = await cached.promise;
    console.log(`✅ MongoDB connected: ${cached.conn.connection.host}`);
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
};

export default connectDB;
