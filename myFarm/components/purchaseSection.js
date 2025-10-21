"use client";
import { useEffect, useState } from "react";
import styles from "./purchaseSection.module.css";

export default function PurchaseSection() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState(null);
    const [purchases, setPurchases] = useState({}); // ✅ DB에서 불러온 구매내역 저장용

    const monthNames = [
        "1월", "2월", "3월", "4월", "5월", "6월",
        "7월", "8월", "9월", "10월", "11월", "12월"
    ];

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const userId = localStorage.getItem("userId");
                console.log("🟡 [STEP1] userId:", userId);

                if (!userId) return;

                const res = await fetch(`/api/order/list?userId=${userId}`);
                console.log("🟡 [STEP2] 응답 상태:", res.status);
                const data = await res.json();
                console.log("🟡 [STEP3] data:", data);

                if (!data.success) {
                    console.error("❌ 구매내역 불러오기 실패:", data.message);
                    return;
                }

                const grouped = {};
                data.orders.forEach(order => {
                    const date = new Date(order.createdAt);
                    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

                    grouped[key] = (grouped[key] || []).concat(
                        order.items.map(item => ({
                            // ✅ 짧은 주문번호
                            orderId: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`,
                            // ✅ 상품명 우선순위 수정
                            item: item.item || item.name || "상품",
                            quantity: item.qty || 1,
                            price: item.price || 0,
                            status: order.status || "결제완료",
                            date: `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} 완료`,
                            image: item.img || `${process.env.NEXT_PUBLIC_BASE_URL}/img/placeholder.png`,
                        }))
                    );
                });

                console.log("🟢 [STEP4] grouped:", grouped);
                setPurchases(grouped);
            } catch (err) {
                console.error("❌ DB 요청 오류:", err);
            }
        };

        fetchPurchases();
    }, []);

    // ✅ 달력 생성
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push("");
    for (let d = 1; d <= lastDate; d++) days.push(d);
    while (days.length < 42) days.push("");
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

    const prevMonth = () => {
        if (month === 0) {
            setYear((y) => y - 1);
            setMonth(11);
        } else setMonth((m) => m - 1);
        setSelectedDate(null);
    };

    const nextMonth = () => {
        if (month === 11) {
            setYear((y) => y + 1);
            setMonth(0);
        } else setMonth((m) => m + 1);
        setSelectedDate(null);
    };

    const handleDayClick = (day) => {
        if (!day) return;
        const key = `${year}-${month + 1}-${day}`;
        setSelectedDate(key);
    };

    const handleBack = () => {
        setSelectedDate(null);
    };

    return (
        <div className={styles.calendarContainer}>
            {/* 상단 헤더 */}
            <div className={styles.monthHeader}>
                <div className={styles.monthTitleWrap}>
                    {!selectedDate && (
                        <>
                            <button onClick={prevMonth} className={styles.arrowBtn}>◀</button>
                            <h2>{year}년 {monthNames[month]}</h2>
                            <button onClick={nextMonth} className={styles.arrowBtn}>▶</button>
                        </>
                    )}
                    {selectedDate && <h2>{year}년 {monthNames[month]}</h2>}
                </div>

                {selectedDate && (
                    <button className={styles.backBtn} onClick={handleBack}>
                        목록으로
                    </button>
                )}
            </div>

            <div className={styles.innerFrame}>
                {/* ✅ 달력 보기 */}
                {!selectedDate && (
                    <table className={styles.calendar}>
                        <thead>
                            <tr>
                                <th className={styles.sun}>일</th>
                                <th>월</th><th>화</th><th>수</th>
                                <th>목</th><th>금</th><th className={styles.sat}>토</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weeks.map((week, i) => (
                                <tr key={i}>
                                    {week.map((day, j) => {
                                        const key = day ? `${year}-${month + 1}-${day}` : null;
                                        const dailyPurchase = key ? purchases[key] : null;

                                        return (
                                            <td
                                                key={j}
                                                onClick={() => handleDayClick(day)}
                                                className={j === 0 ? styles.sun : j === 6 ? styles.sat : ""}
                                            >
                                                <div className={styles.dayNumber}>{day}</div>

                                                {dailyPurchase && (
                                                    <div className={styles.purchaseTitle}>
                                                        {(() => {
                                                            const firstName = dailyPurchase[0].item || "상품";
                                                            const extraCount = dailyPurchase.length - 1;
                                                            let text = extraCount > 0
                                                                ? `${firstName} 외${extraCount}건`
                                                                : firstName;

                                                            // 🔹 전체 5자 초과 시 "..." 처리
                                                            if (text.length > 5) text = text.slice(0, 5) + "...";
                                                            return text;
                                                        })()}
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* ✅ 구매내역 상세보기 */}
                {selectedDate && (
                    <div className={styles.writeForm}>
                        <div className={styles.purchaseHeader}>
                            <div>주문번호</div>
                            <div>제품사진</div>
                            <div>구매 내역</div>
                            <div>진행상태</div>
                        </div>

                        <div className={styles.purchaseBody}>
                            {purchases[selectedDate]?.map((item, i) => (
                                <div className={styles.purchaseRow} key={i}>
                                    <div className={styles.orderId}>{item.orderId}</div>
                                    <div className={styles.imageBox}>
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.item}
                                                className={styles.productImage}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.purchaseDetail}>
                                        <p>{item.item}</p>
                                        <p>수량: {item.quantity}개</p>
                                        <p>가격: {item.price.toLocaleString()}원</p>
                                    </div>
                                    <div className={styles.statusBox}>
                                        <p>{item.status}</p>
                                        <p>{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ✅ 합계 */}
                        <div className={styles.totalRow}>
                            구매 합계:{" "}
                            {purchases[selectedDate]
                                ?.reduce((sum, item) => sum + item.price, 0)
                                .toLocaleString()}원
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
