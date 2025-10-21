import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI 환경변수가 설정되지 않았습니다.");
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                dbName: "littlefarmer", // ✅ DB 이름 (네 프로젝트 이름과 일치시킴)
                bufferCommands: false,
            })
            .then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
