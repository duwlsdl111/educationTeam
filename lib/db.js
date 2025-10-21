import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

let cached = global.mongoose;
if (!cached) cached = (global.mongoose = { conn: null, promise: null });

if (!MONGODB_URI) {
  throw new Error("⚠️ MONGODB_URI 환경변수가 없습니다.");
}

// 전역 캐시 (Hot Reload 대비)


export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        dbName: "littlefarmer",
        maxPoolSize: 5,
      })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
