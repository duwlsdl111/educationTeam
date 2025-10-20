import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ MONGODB_URI 환경변수가 없습니다.");
}

// 전역 캐시 (Hot Reload 대비)
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        // 필요에 따라 옵션
        // dbName: process.env.MONGODB_DB || undefined,
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => m.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
