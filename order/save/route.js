import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        const { userId, items, payment, form } = body;

        if (!userId || !items?.length) {
            return Response.json({ success: false, message: "필수 데이터 누락" }, { status: 400 });
        }

        const order = await Order.create({
            userId,
            items: items.map(it => ({
                id: it.id,
                name: it.name,
                qty: it.qty,
                price: it.price,
                img: it.img,
                status: "결제완료",
            })),
            payment,
            form,
        });

        return Response.json({ success: true, order });
    } catch (err) {
        console.error("❌ 주문 저장 중 에러:", err);
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}
