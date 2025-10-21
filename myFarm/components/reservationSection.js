"use client";
import { useState, useEffect } from "react";
import styles from "./reservationSection.module.css";

export default function ReservationSection() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [reservations, setReservations] = useState({}); // ✅ DB 예약 데이터

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  // ✅ DB에서 예약내역 불러오기
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await fetch(`/api/bookings?userId=${userId}`);
        const data = await res.json();

        if (!data.ok) throw new Error(data.error || "예약 불러오기 실패");

        const grouped = {};
        data.bookings.forEach((b) => {
          // ✅ 달력에는 예약한 날짜(createdAt) 기준으로 표시
          const key = new Date(b.createdAt).toISOString().slice(0, 10);

          if (!grouped[key]) grouped[key] = [];

          grouped[key].push({
            bookingId: b.bookingId, // ✅ 취소용 id
            farmName: b.farmName || b.farmId.replace("farm-", ""), 
            name: b.name,
            location: b.memo || "위치 미등록",
            members: `대인${b.adults}명, 소인${b.kids}명`,
            farmReserve: new Date(b.date).toISOString().slice(0, 10).replaceAll("-", "."),
          });
        });

        setReservations(grouped);
        console.log("🟢 예약내역 불러옴:", grouped);
      } catch (err) {
        console.error("❌ 예약 불러오기 실패:", err);
      }
    };

    fetchReservations();
  }, []);

  // ✅ 달력 데이터 생성
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push("");
  for (let d = 1; d <= lastDate; d++) days.push(d);
  while (days.length < 42) days.push("");
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  // ✅ 월 이동
  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
    setSelectedDate(null);
    setSelectedRow(null);
    setIsSelecting(false);
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
    setSelectedDate(null);
    setSelectedRow(null);
    setIsSelecting(false);
  };

  // ✅ 날짜 클릭 → 상세보기
  const handleDayClick = (day) => {
    if (!day) return;
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(key);
    setSelectedRow(null);
    setIsSelecting(false);
  };

  // ✅ 목록으로 돌아가기
  const handleBack = () => {
    setSelectedDate(null);
    setSelectedRow(null);
    setIsSelecting(false);
  };

  // ✅ 행 클릭 (선택/해제)
  const handleRowSelect = (index) => {
    if (!isSelecting) return;
    setSelectedRow(index === selectedRow ? null : index);
  };

  // ✅ 예약취소
  const handleCancel = async () => {
    if (!selectedDate || selectedRow === null) {
      alert("취소할 예약을 먼저 선택하세요!");
      return;
    }

    const confirmDelete = window.confirm("정말 이 예약을 취소하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const userId = localStorage.getItem("userId");
      const target = reservations[selectedDate][selectedRow];

      const res = await fetch(`/api/bookings/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: target.bookingId, // ✅ 이제 이걸로 삭제
          userId,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        const updated = { ...reservations };
        updated[selectedDate].splice(selectedRow, 1);
        if (updated[selectedDate].length === 0) delete updated[selectedDate];
        setReservations(updated);
        setSelectedRow(null);
        setIsSelecting(false);
        alert("예약이 취소되었습니다.");
      } else {
        alert(data.error || "취소 실패");
      }
    } catch (err) {
      console.error("❌ 예약취소 오류:", err);
    }
  };

  return (
    <div className={styles.calendarContainer}>
      {/* 상단 헤더 */}
      <div className={styles.monthHeader}>
        <div className={styles.monthTitleWrap}>
          {!selectedDate ? (
            <>
              <button onClick={prevMonth} className={styles.arrowBtn}>◀</button>
              <h2>{year}년 {monthNames[month]}</h2>
              <button onClick={nextMonth} className={styles.arrowBtn}>▶</button>
            </>
          ) : (
            <h2>{year}년 {monthNames[month]}</h2>
          )}
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
                    const key = day
                      ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                      : null;
                    const daily = key ? reservations[key] : null;
                    return (
                      <td
                        key={j}
                        onClick={() => handleDayClick(day)}
                        className={j === 0 ? styles.sun : j === 6 ? styles.sat : ""}
                      >
                        <div className={styles.dayNumber}>{day}</div>
                        {daily && (
                          <div className={styles.reservationTitle}>
                            {daily[0].farmName.length > 6
                              ? daily[0].farmName.slice(0, 6) + "..."
                              : daily[0].farmName}
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

        {/* ✅ 예약 상세보기 */}
        {selectedDate && (
          <div className={styles.writeForm}>
            <div className={styles.reservationHeader}>
              <div>농장명</div>
              <div>예약자명</div>
              <div>농장 위치</div>
              <div>예약정보</div>
            </div>

            <div className={styles.reservationBody}>
              {reservations[selectedDate]?.map((item, i) => (
                <div
                  key={i}
                  className={`${styles.reservationRow} ${selectedRow === i ? styles.selectedRow : ""}`}
                  onClick={() => handleRowSelect(i)}
                >
                  <div>{item.farmName}</div>
                  <div>{item.name}</div>
                  <div className={styles.location}>{item.location}</div>
                  <div className={styles.infoBox}>
                    <p>인원: {item.members}</p>
                    <p>예약날짜: {item.farmReserve}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ 버튼 영역 */}
            <div className={styles.selectBox}>
              {!isSelecting ? (
                <button
                  className={styles.selectBtn}
                  onClick={() => setIsSelecting(true)}
                >
                  선택
                </button>
              ) : (
                <>
                  <button
                    className={styles.deselectBtn}
                    onClick={() => {
                      setIsSelecting(false);
                      setSelectedRow(null);
                    }}
                  >
                    선택해제
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancel}>
                    예약취소
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
