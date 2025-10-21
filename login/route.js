import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User"; // ✅ 이미 쓰고 있는 모델

export async function POST(req) {
    try {
        const { userId, password } = await req.json();

        // ✅ MongoDB 연결
        await dbConnect();

        // ✅ DB에서 해당 아이디 찾기
        const user = await User.findOne({ userId });

        if (!user) {
            return NextResponse.json({ message: "존재하지 않는 아이디입니다." }, { status: 400 });
        }

        // ✅ 비밀번호 검증 (지금은 암호화 안했으므로 단순 문자열 비교)
        if (user.password !== password) {
            return NextResponse.json({ message: "비밀번호가 올바르지 않습니다." }, { status: 400 });
        }

        // ✅ 로그인 성공
        return NextResponse.json({ message: "로그인 성공", userId: user.userId }, { status: 200 });
    } catch (error) {
        console.error("로그인 오류:", error);
        return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
