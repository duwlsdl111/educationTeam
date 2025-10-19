// /lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI 환경 변수가 설정되지 않았습니다.");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        console.log("⚡ 이미 연결된 MongoDB 재사용 중");
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("🟡 MongoDB 최초 연결 시도 중...");
        cached.promise = mongoose
            .connect(MONGODB_URI, { bufferCommands: false })
            .then((mongoose) => {
                console.log("✅ MongoDB 연결 성공");
                return mongoose;
            })
            .catch((err) => {
                console.error("❌ MongoDB 연결 실패:", err.message);
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
