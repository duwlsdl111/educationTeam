import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return Response.json({ success: false, message: "userId 없음" }, { status: 400 });
        }

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        return Response.json({ success: true, orders });
    } catch (err) {
        console.error("❌ 주문 조회 중 에러:", err);
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}
