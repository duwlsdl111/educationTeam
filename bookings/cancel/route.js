import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Booking } from "@/models/Booking";

// 자정 정규화
function normalizeDate(dateStrOrObj) {
  const d = new Date(dateStrOrObj);
  if (isNaN(d)) throw new Error("Invalid date format");
  d.setHours(0, 0, 0, 0);
  return d;
}

// KST 일자(YYYY-MM-DD)를 createdAt 범위로 변환 (UTC 기준)
function kstDayToCreatedAtRange(kstYmd) {
  // KST 00:00 → UTC -9h
  const startKST = new Date(`${kstYmd}T00:00:00+09:00`);
  const endKST = new Date(startKST.getTime() + 24 * 60 * 60 * 1000);
  // 몽고에는 UTC로 저장되어 있으므로 UTC 그대로 비교
  return { $gte: startKST, $lt: endKST };
}

/** ✅ POST /api/bookings/cancel
 * body 예시(권장): { bookingId, userId }
 * 백업1: { userId, createdAtDayKST: '2025-10-22', name }
 * 백업2: { userId, visitDate: '2025-11-08', name }
 */
export async function POST(req) {
  try {
    await dbConnect();
    const payload = await req.json();
    const { bookingId, userId, createdAtDayKST, visitDate, name } = payload || {};

    // 1) ✅ bookingId로 바로 삭제 (가장 안전)
    if (bookingId && userId) {
      const result = await Booking.findOneAndDelete({ _id: bookingId, userId });
      if (!result) {
        return NextResponse.json({ ok: false, error: "예약을 찾을 수 없습니다." }, { status: 404 });
      }
      return NextResponse.json({ ok: true });
    }

    // 2) 백업 경로 A: createdAt(KST 일자)로 찾기
    // 달력 셀을 '오늘' 기준으로 눌러 취소하는 UX일 때 유용
    if (createdAtDayKST && userId && name) {
      const range = kstDayToCreatedAtRange(createdAtDayKST);
      const result = await Booking.findOneAndDelete({
        userId,
        name,
        createdAt: range,
      });
      if (!result) {
        return NextResponse.json({ ok: false, error: "예약을 찾을 수 없습니다." }, { status: 404 });
      }
      return NextResponse.json({ ok: true });
    }

    // 3) 백업 경로 B: 체험일(visitDate)로 삭제
    if (visitDate && userId && name) {
      const normalized = normalizeDate(visitDate);
      const result = await Booking.findOneAndDelete({
        userId,
        name,
        date: normalized,
      });
      if (!result) {
        return NextResponse.json({ ok: false, error: "예약을 찾을 수 없습니다." }, { status: 404 });
      }
      return NextResponse.json({ ok: true });
    }

    // 요청 형식 불충분
    return NextResponse.json(
      { ok: false, error: "필수 정보 누락 (bookingId+userId 권장)" },
      { status: 400 }
    );
  } catch (err) {
    console.error("❌ [/api/bookings/cancel] Error:", err);
    return NextResponse.json({ ok: false, error: "서버 오류" }, { status: 500 });
  }
}