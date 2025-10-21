"use client";
import { useEffect, useState } from "react";
import styles from "./DiarySection.module.css";

export default function DiarySection() {
  const today = new Date();

  // ✅ 상태
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [diaries, setDiaries] = useState({});
  const [draftKey, setDraftKey] = useState(null);
  const [loaded, setLoaded] = useState(false); // ✅ 로드 완료 여부

  const [title, setTitle] = useState("");
  const [region, setRegion] = useState("서울");
  const [weather, setWeather] = useState("맑음");
  const [content, setContent] = useState("");

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  // ✅ localStorage 로드
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" && localStorage.getItem("myFarmDiaries");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setDiaries(parsed);
        }
      }
    } catch (e) {
      console.error("Load diaries failed:", e);
    } finally {
      setLoaded(true); // 로드 끝난 뒤 저장 허용
    }
  }, []);

  // ✅ localStorage 저장 (로드 완료 후에만)
  useEffect(() => {
    if (!loaded) return; // 처음 렌더 때 저장 금지
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("myFarmDiaries", JSON.stringify(diaries));
      }
    } catch (e) {
      console.error("Save diaries failed:", e);
    }
  }, [diaries, loaded]);

  // ✅ 달력 데이터
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
    setIsWriting(false);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
    setSelectedDate(null);
    setIsWriting(false);
  };

  // ✅ 파일을 DataURL로 변환 (새로고침해도 유지)
  const fileToDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ✅ 이미지 업로드
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    const slots = Math.max(0, 2 - selectedImages.length);
    const pick = files.slice(0, slots);
    const dataUrls = await Promise.all(pick.map(fileToDataURL));
    setSelectedImages((prev) => [...prev, ...dataUrls].slice(0, 2));
  };

  // ✅ 이미지 삭제
  const handleDeleteImage = (i) => {
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  // ✅ 저장
  const handleSave = () => {
    if (!title.trim()) {
      alert("제목을 입력하세요!");
      return;
    }

    const todayKey = `${year}-${month + 1}-${today.getDate()}`;
    const saveKey =
      (selectedDate && diaries[selectedDate] ? selectedDate : null) ||
      draftKey ||
      todayKey;

    const newDiary = { title, region, weather, content, images: selectedImages };
    setDiaries((prev) => ({ ...prev, [saveKey]: newDiary }));

    setIsWriting(false);
    setSelectedDate(null);
    setDraftKey(null);
    setTitle("");
    setContent("");
    setSelectedImages([]);
  };

  // ✅ 날짜 클릭
  const handleDayClick = (day) => {
    if (!day) return;
    const key = `${year}-${month + 1}-${day}`;
    const diary = diaries[key];
    if (diary) {
      setSelectedDate(key);
      setIsWriting(false);
      setDraftKey(null);
    } else {
      setDraftKey(key);
      setSelectedDate(null);
      setIsWriting(true);
      setTitle("");
      setRegion("서울");
      setWeather("맑음");
      setContent("");
      setSelectedImages([]);
    }
  };

  // ✅ 수정
  const handleEdit = () => {
    if (!selectedDate || !diaries[selectedDate]) return;
    const d = diaries[selectedDate];
    setTitle(d.title);
    setRegion(d.region);
    setWeather(d.weather);
    setContent(d.content);
    setSelectedImages(d.images || []);
    setIsWriting(true);
  };

  // ✅ 오늘 바로 글쓰기 (수정된 부분)
  const startWriteToday = () => {
    const todayKey = `${year}-${month + 1}-${today.getDate()}`;

    // 🚫 이미 작성된 일기가 있을 때
    if (diaries[todayKey]) {
      alert("이미 작성된 일기가 있습니다! 해당 날짜를 클릭하면 내용을 볼 수 있어요 😊");
      return;
    }

    setDraftKey(todayKey);
    setSelectedDate(null);
    setIsWriting(true);
    setTitle("");
    setRegion("서울");
    setWeather("맑음");
    setContent("");
    setSelectedImages([]);
  };

  // ✅ 삭제
  const handleDelete = () => {
    if (!selectedDate) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const copy = { ...diaries };
    delete copy[selectedDate];
    setDiaries(copy);
    setSelectedDate(null);
    setIsWriting(false);
    alert("삭제되었습니다!");
  };

  // ✅ 렌더
  return (
    <div className={styles.calendarContainer}>
      {/* 상단 헤더 */}
      <div className={styles.monthHeader}>
        <div className={styles.monthTitleWrap}>
          {!isWriting && !selectedDate && (
            <button onClick={prevMonth} className={styles.arrowBtn}>◀</button>
          )}

          <h2>{year}년 {monthNames[month]}</h2>

          {!isWriting && !selectedDate && (
            <button onClick={nextMonth} className={styles.arrowBtn}>▶</button>
          )}
        </div>

        {/* 우측 버튼 */}
        {!isWriting && !selectedDate && (
          <button className={styles.writeBtn} onClick={startWriteToday}>글쓰기</button>
        )}

        {selectedDate && !isWriting && (
          <div className={styles.viewBtnWrap}>
            <button className={styles.viewDeleteBtn} onClick={handleDelete}>삭제하기</button>
            <button className={styles.backBtn} onClick={() => setSelectedDate(null)}>목록으로</button>
          </div>
        )}
      </div>

      <div className={styles.innerFrame}>
        {/* ✅ 달력 보기 */}
        {!selectedDate && !isWriting && (
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
                    const diary = key ? diaries[key] : null;
                    return (
                      <td
                        key={j}
                        onClick={() => handleDayClick(day)}
                        className={j === 0 ? styles.sun : j === 6 ? styles.sat : ""}
                      >
                        <div className={styles.dayNumber}>{day}</div>
                        {diary && (
                          <div className={styles.diaryTitle}>
                            {diary.title.length > 8 ? diary.title.slice(0, 8) + "..." : diary.title}
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

        {/* ✅ 글쓰기 */}
        {isWriting && (
          <div className={styles.writeForm}>
            <div className={styles.writeHeader}>
              <div className={styles.writeDate}>
                {(() => {
                  // ✅ 글쓰기 모드에서도 draftKey를 우선 사용
                  const key = draftKey || selectedDate || `${year}-${month + 1}-${today.getDate()}`;
                  if (!key) return null;

                  const [y, m, d] = key.split("-");
                  const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
                  const dow = ["일", "월", "화", "수", "목", "금", "토"][dateObj.getDay()];
                  return (
                    <>
                      <span className={styles.dateYear}>{y}년 </span>
                      {m}월 {d}일 {dow}요일
                    </>
                  );
                })()}
              </div>


              <div className={styles.writeTitle}>
                <label>제목:</label>
                <input
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className={styles.region}>
                <label>지역:</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                  {["서울", "경기", "인천", "강원", "충청남도", "충청북도", "전라남도", "전라북도", "경상남도", "경상북도", "제주"]
                    .map((r) => (<option key={r}>{r}</option>))}
                </select>
              </div>

              <div className={styles.weather}>
                <label>날씨:</label>
                <select value={weather} onChange={(e) => setWeather(e.target.value)}>
                  {["맑음", "흐림", "비", "눈"].map((w) => (<option key={w}>{w}</option>))}
                </select>
              </div>
            </div>

            <textarea
              className={styles.writeContent}
              placeholder="오늘의 하루를 기록해보세요!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className={styles.writeFooter}>
              <div className={styles.photoUpload}><label>사진첨부</label></div>
              <div className={styles.photoFile}>
                {selectedImages.map((img, i) => (
                  <div key={i} className={styles.previewBox}>
                    <img src={img} alt={`첨부 ${i + 1}`} />
                    <button className={styles.deleteBtn} onClick={() => handleDeleteImage(i)}>×</button>
                  </div>
                ))}
                {selectedImages.length < 2 && (
                  <input className={styles.imgInput} type="file" multiple onChange={handleFileChange} />
                )}
              </div>

              <button className={styles.saveBtn} onClick={handleSave}>저장</button>
            </div>
          </div>
        )}

        {/* ✅ 보기 */}
        {selectedDate && diaries[selectedDate] && !isWriting && (
          <div className={styles.writeForm}>
            <div className={styles.writeHeader}>
              <div className={styles.writeDate}>
                {(() => {
                  const [y, m, d] = selectedDate.split("-");
                  const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
                  const dow = ["일", "월", "화", "수", "목", "금", "토"][dateObj.getDay()];
                  return (
                    <>
                      <span className={styles.dateYear}>{y}년 </span>
                      {m}월 {d}일 {dow}요일
                    </>
                  );
                })()}
              </div>

              <div className={styles.writeTitle}>
                <label>제목:</label>
                <input type="text" value={diaries[selectedDate].title} readOnly />
              </div>

              <div className={styles.region}>
                <label>지역:</label>
                <select value={diaries[selectedDate].region} disabled>
                  <option>{diaries[selectedDate].region}</option>
                </select>
              </div>

              <div className={styles.weather}>
                <label>날씨:</label>
                <select value={diaries[selectedDate].weather} disabled>
                  <option>{diaries[selectedDate].weather}</option>
                </select>
              </div>
            </div>

            <div className={styles.writeContent}>
              {diaries[selectedDate].content}
            </div>

            <div className={styles.writeFooter}>
              <div className={styles.photoUpload}><label>사진첨부</label></div>
              <div className={styles.photoFile}>
                {diaries[selectedDate].images?.length > 0 ? (
                  diaries[selectedDate].images.map((img, i) => (
                    <div key={i} className={styles.previewBox}>
                      <img src={img} alt={`이미지 ${i + 1}`} />
                    </div>
                  ))
                ) : (
                  <span>등록된 사진이 없습니다.</span>
                )}
              </div>

              <button className={`${styles.saveBtn} ${styles.green}`} onClick={handleEdit}>
                수정하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
