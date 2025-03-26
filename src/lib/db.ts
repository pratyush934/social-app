import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error("Please add valid MONGODB_URL and be sciencer");
}

let cache = global.mongoose;

if (!cache) {
  cache = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };
    cache.promise = mongoose
      .connect(MONGODB_URL, opts)
      .then(() => mongoose.connection);
  }

  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    throw e;
  }

  return cache.conn;
}
