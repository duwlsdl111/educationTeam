"use client";
import { useState } from "react";
import styles from "./myFarm.module.css";
import DiarySection from "./components/DiarySection.js";
import PurchaseSection from "./components/purchaseSection";
import ReservationSection from "./components/reservationSection.js";
import DownloadSection from "./components/videoSection.js"; // ✅ 추가
import FarmSection02 from "./components/farmSection02.js"

export default function MYFARM() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [activeTab, setActiveTab] = useState("calendar"); // ✅ 탭만 관리

  // ✅ 달력 데이터 (부모: 달력 탭용)
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push("");
  for (let d = 1; d <= lastDate; d++) days.push(d);
  while (days.length < 42) days.push("");
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  return (
    <div className={styles.myFarmWrapper}>
      <div className={styles.sketchContainer}>
        {/* 사이드 메뉴 */}
        <div className={styles.sideMenu}>
          {[
            { id: "calendar", color: "orange", label: "달력", icon: "orangePolygon.png" },
            { id: "diary", color: "blue", label: "하루일기", icon: "bluePolygon.png" },
            { id: "purchase", color: "green", label: "구매내역", icon: "greenPolygon.png" },
            { id: "reservation", color: "orange", label: "예약정보", icon: "orangePolygon.png" },
            { id: "video", color: "blue", label: "나의영상", icon: "bluePolygon.png" },
          ].map((item) => (
            <div className={styles.pass} key={item.id}>
              <img
                className={styles.menuIcon}
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/${item.icon}`}
                alt={item.label}
              />
              <button
                onClick={() => setActiveTab(item.id)}
                className={`${styles.menuItem} ${styles[item.color]} ${activeTab === item.id ? styles.active : ""
                  }`}
              >
                <span className={styles.pill}>{item.label}</span>
              </button>
            </div>
          ))}
        </div>

        {/* 스케치북 */}
        <div className={styles.sketchBookWrapper}>
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/spring.png`}
            alt="스프링"
            className={styles.springImg}
          />

          {/* ✅ 달력 탭 */}
          {activeTab === "calendar" && (
            <div className={styles.calendarContainer}>
              <div className={styles.monthHeader}>
                <div className={styles.monthTitleWrap}>
                  <button onClick={prevMonth} className={styles.arrowBtn}>◀</button>
                  <h2>{year}년 {monthNames[month]}</h2>
                  <button onClick={nextMonth} className={styles.arrowBtn}>▶</button>
                </div>
              </div>

              <div className={styles.innerFrame}>
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
                        {week.map((day, j) => (
                          <td key={j} className={j === 0 ? styles.sun : j === 6 ? styles.sat : ""}>
                            {day}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ✅ 하루일기 탭 */}
          {activeTab === "diary" && <DiarySection />}

          {/* ✅ 구매내역 탭 */}
          {activeTab === "purchase" && <PurchaseSection />}

          {/* ✅ 예약정보 탭 */}
          {activeTab === "reservation" && <ReservationSection />}

          {/* ✅ 영상내역 (다운로드 내역) */}
          {activeTab === "video" && <DownloadSection />}
        </div>
      </div>
      <FarmSection02 />
    </div>
  );
}
