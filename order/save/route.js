import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order"; // 모델은 밑에서 설명할게

export async function POST(req) {
    await dbConnect(); // ✅ 이미 연결된 mongoose 사용

    const body = await req.json();
    const { userId, items, payment, form } = body;

    if (!userId || !items?.length) {
        return new Response(JSON.stringify({ message: "잘못된 요청" }), { status: 400 });
    }

    const order = new Order({
        userId,
        items,
        payment,
        form,
        status: "결제완료",
        createdAt: new Date(),
    });

    await order.save();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
