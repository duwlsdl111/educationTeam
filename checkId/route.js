import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { userId } = await req.json(); // ✅ userId로 받음
        await dbConnect();

        const user = await User.findOne({ userId }); // ✅ userId로 검색
        return NextResponse.json({ exists: !!user });
    } catch (error) {
        console.error("중복확인 오류:", error);
        return NextResponse.json({ message: "서버 오류" }, { status: 500 });
    }
}
