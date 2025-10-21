import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Booking } from "@/models/Booking";

// ✅ 날짜를 자정(로컬)으로 정규화
function normalizeDate(dateStrOrObj) {
  const d = new Date(dateStrOrObj);
  if (isNaN(d)) {
    console.error("❌ Invalid date input:", dateStrOrObj);
    throw new Error("Invalid date format");
  }
  d.setHours(0, 0, 0, 0);
  return d;
}

// ✅ UTC → KST(+9h) YYYY-MM-DD 변환
function toKSTYYYYMMDD(utcDate) {
  if (!utcDate) return null;
  const t = new Date(utcDate).getTime() + 9 * 60 * 60 * 1000;
  return new Date(t).toISOString().slice(0, 10);
}

/** ✅ GET /api/bookings
 *  - farmId: 해당 농장의 예약 불가 날짜 목록
 *  - userId: 사용자 예약 목록
 */
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const farmId = searchParams.get("farmId");
  const userId = searchParams.get("userId");

  // ✅ case 1: 농장 예약 불가 날짜
  if (farmId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const docs = await Booking.find({ farmId, date: { $gte: today } })
      .select({ date: 1, _id: 0 })
      .lean();

    const disabled = docs.map((d) =>
      new Date(d.date).toISOString().slice(0, 10)
    );
    return NextResponse.json({ ok: true, disabledDates: disabled });
  }

  // ✅ case 2: 사용자 예약 목록
  if (userId) {
    const docs = await Booking.find({ userId }).lean();

    const formatted = docs.map((d) => ({
      bookingId: String(d._id),             // ✅ 예약취소용 ID
      farmId: d.farmId,
      farmName: d.farmName || "",
      name: d.name,
      date: new Date(d.date).toISOString().slice(0, 10), // 체험일
      adults: d.adults,
      kids: d.kids,
      memo: d.memo,
      createdAt: toKSTYYYYMMDD(d.createdAt), // ✅ 예약 등록일 (오늘날짜 표시용)
    }));

    return NextResponse.json({ ok: true, bookings: formatted });
  }

  // ✅ 필수 쿼리 누락
  return NextResponse.json(
    { ok: false, error: "Missing farmId or userId" },
    { status: 400 }
  );
}

/** ✅ POST /api/bookings
 *  body: { farmId, farmName, date, name, phone, adults, kids, memo, userId }
 */
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const {
      farmId,
      farmName = "",
      date,
      name,
      phone,
      adults = 0,
      kids = 0,
      memo = "",
      userId = "",
    } = body || {};

    if (!farmId || !date || !name || !phone) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalized = normalizeDate(date);

    const doc = await Booking.create({
      farmId,
      farmName,
      date: normalized, // 체험일은 자정 기준 저장
      name,
      phone,
      adults,
      kids,
      memo,
      userId,
    });

    return NextResponse.json({ ok: true, bookingId: String(doc._id) });
  } catch (err) {
    if (err?.code === 11000) {
      return NextResponse.json(
        { ok: false, error: "이미 예약된 날짜입니다." },
        { status: 409 }
      );
    }
    console.error("[/api/bookings] error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

/** ✅ DELETE /api/bookings
 * body: { bookingId, userId }
 * → 예약 취소 기능
 */
export async function DELETE(req) {
  await dbConnect();
  try {
    const { bookingId, userId } = await req.json();

    if (!bookingId || !userId) {
      return NextResponse.json(
        { ok: false, error: "필수 정보 누락 (bookingId + userId 필요)" },
        { status: 400 }
      );
    }

    const result = await Booking.findOneAndDelete({
      _id: bookingId,
      userId,
    });

    if (!result) {
      return NextResponse.json(
        { ok: false, error: "예약을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ [/api/bookings DELETE] error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "서버 오류" },
      { status: 500 }
    );
  }
}
