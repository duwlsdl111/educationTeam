import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return new Response(JSON.stringify({ message: "userId 없음" }), { status: 400 });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
}
