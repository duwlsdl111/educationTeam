"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./videoSection.module.css";

export default function VideoSection() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  // ✅ 임시 다운로드 데이터
  const [downloads, setDownloads] = useState([
    {
      id: 1,
      thumbnail: `${process.env.NEXT_PUBLIC_BASE_URL}/img/goods1.png`,
      date: "2025-10-01",
      title: "흙과 햇빛",
      subtitle: "흙과 어쩌구",
      duration: "1분 40초",
    },
    {
      id: 2,
      thumbnail: `${process.env.NEXT_PUBLIC_BASE_URL}/img/goods2.png`,
      date: "2025-09-28",
      title: "농장의 하루",
      subtitle: "우리 밭의 이야기",
      duration: "2분 05초",
    },
  ]);

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  return (
    <div className={styles.calendarContainer}>
      {/* 상단 헤더 */}
      <div className={styles.monthHeader}>
        <div className={styles.monthTitleWrap}>
          <button onClick={prevMonth} className={styles.arrowBtn}>◀</button>
          <h2>{year}년 {monthNames[month]}</h2>
          <button onClick={nextMonth} className={styles.arrowBtn}>▶</button>
        </div>
      </div>

      {/* ✅ 영상 다운로드 표 */}
      <div className={styles.innerFrame}>
        <div className={styles.writeForm}>
          {/* 헤더 */}
          <div className={styles.videoHeaderRow}>
            <div>No</div>
            <div>영상</div>
            <div>다운 일시</div>
            <div>비고</div>
          </div>

          {/* 본문 */}
          <div className={styles.videoBody}>
            {downloads.length > 0 ? (
              downloads.map((file, i) => (
                <Link
                  key={file.id}
                  href={`/myFarm/video/${file.id}`} // ✅ 나중에 페이지 만들면 여기로 이동
                  className={styles.videoLink}
                >
                  <div className={styles.videoRow}>
                    <div>{i + 1}</div>
                    <div className={styles.videoBox}>
                      <img
                        src={file.thumbnail}
                        alt={file.title}
                        className={styles.videoThumb}
                      />
                    </div>
                    <div>{file.date}</div>
                    <div className={styles.noteBox}>
                      <p>라이틀 : {file.title}</p>
                      <p>제목 : {file.subtitle}</p>
                      <p>시간 : {file.duration}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className={styles.emptyMsg}>다운로드된 영상이 없습니다.</p>
            )}
          </div>

          {/* ✅ 합계 */}
          <div className={styles.totalRow}>
            총 {downloads.length}개의 영상
          </div>
        </div>
      </div>
    </div>
  );
}
