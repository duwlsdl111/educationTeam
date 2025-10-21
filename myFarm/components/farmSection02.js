"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./farmSection02.module.css";

export default function FarmSection02() {
  const DEBUG = true;
  const SHOW_ALL = true;
  const TOTAL = 30;

  // 한국시간 오늘
  const now = useMemo(() => {
    const kst = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    return { year: kst.getFullYear(), month: kst.getMonth() + 1, day: kst.getDate() };
  }, []);

  // 이미지
  const FILLED_IMG = `${process.env.NEXT_PUBLIC_BASE_URL}/images/oneGrape.png`;
  const BASE_IMG = `${process.env.NEXT_PUBLIC_BASE_URL}/images/p_grape.png`;
  const CHARACTER_IMG = `${process.env.NEXT_PUBLIC_BASE_URL}/images/before31.png`;
  const RIGHT_CHAR_IMG = `${process.env.NEXT_PUBLIC_BASE_URL}/images/chatbotCharater.png`;

  const images = [
    { src: `${process.env.NEXT_PUBLIC_BASE_URL}/images/menu01.png`, label: "씨앗 구매" },
    { src: `${process.env.NEXT_PUBLIC_BASE_URL}/images/menu02.png`, label: "모종 구매" },
    { src: `${process.env.NEXT_PUBLIC_BASE_URL}/images/menu03.png`, label: "미니 게임" },
    { src: `${process.env.NEXT_PUBLIC_BASE_URL}/images/menu04.png`, label: "농장 예약" },
  ];

  const STORAGE_KEY = `grapeCheck_${now.year}-${String(now.month).padStart(2, "0")}_v1`;

  // 로컬스토리지
  const [grapes, setGrapes] = useState(() => {
    if (typeof window === "undefined") return Array(TOTAL).fill(false);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : Array(TOTAL).fill(false);
    } catch {
      return Array(TOTAL).fill(false);
    }
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grapes));
  }, [grapes, STORAGE_KEY]);

  // 반응형 플래그
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTiny, setIsTiny] = useState(false);
  const [showBoard, setShowBoard] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const tiny = w >= 320 && w <= 400;
      const mobile = w > 400 && w <= 550;
      const tablet = !tiny && !mobile && w <= 1023;
      setIsTiny(tiny);
      setIsMobile(mobile);
      setIsTablet(tablet);
      if (!tiny) setShowBoard(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 🍇 포도알 위치 (전부 유지)
  const POSITIONS_PC = useMemo(
    () => [
      { top: 6.5, left: 18 }, { top: 6.5, left: 32.5 }, { top: 6.5, left: 46.5 }, { top: 6.5, left: 60.5 },
      { top: 17.5, left: 11 }, { top: 17.5, left: 25 }, { top: 17.5, left: 39.5 }, { top: 17.5, left: 53.5 }, { top: 17.5, left: 68 },
      { top: 28.5, left: 3.5 }, { top: 28.5, left: 18 }, { top: 28.5, left: 32 }, { top: 28.5, left: 46.5 }, { top: 28.5, left: 60.5 }, { top: 28.5, left: 75 },
      { top: 39.5, left: 10.5 }, { top: 39.5, left: 25 }, { top: 39.5, left: 39.5 }, { top: 39.5, left: 54 }, { top: 39.5, left: 68 },
      { top: 50.5, left: 19 }, { top: 50.5, left: 33 }, { top: 50.5, left: 48 }, { top: 50.5, left: 62 },
      { top: 61.5, left: 25 }, { top: 61.5, left: 40 }, { top: 61.5, left: 54 },
      { top: 72, left: 32 }, { top: 72, left: 46.5 },
      { top: 83, left: 39 },
    ],
    []
  );
  const POSITIONS_TABLET = useMemo(
    () => [
      { top: 7, left: 17.5 }, { top: 7, left: 32.5 }, { top: 7, left: 47 }, { top: 7, left: 61 },
      { top: 18, left: 10 }, { top: 18, left: 24.5 }, { top: 18, left: 39 }, { top: 18, left: 53.5 }, { top: 18, left: 68 },
      { top: 29, left: 3 }, { top: 29, left: 18 }, { top: 29, left: 32 }, { top: 29, left: 47 }, { top: 29, left: 61.5 }, { top: 29, left: 76 },
      { top: 40, left: 10.5 }, { top: 40, left: 25 }, { top: 40, left: 39 }, { top: 40, left: 54.5 }, { top: 40, left: 68.5 },
      { top: 51, left: 18 }, { top: 51, left: 33.5 }, { top: 51, left: 48 }, { top: 51, left: 62.5 },
      { top: 62, left: 25 }, { top: 62, left: 40 }, { top: 62, left: 54.5 },
      { top: 73, left: 32.5 }, { top: 73, left: 47 },
      { top: 84, left: 39.5 },
    ],
    []
  );
  const POSITIONS_MOBILE = useMemo(
    () => [
      { top: 7, left: 25.5 }, { top: 7, left: 37 }, { top: 7, left: 47.5 }, { top: 7, left: 59 },
      { top: 18, left: 20 }, { top: 18, left: 31 }, { top: 18, left: 42.5 }, { top: 18, left: 53 }, { top: 18, left: 64 },
      { top: 29, left: 14 }, { top: 29, left: 25 }, { top: 29, left: 37.5 }, { top: 29, left: 48 }, { top: 29, left: 59.1 }, { top: 29, left: 70.5 },
      { top: 40, left: 20 }, { top: 40, left: 31.5 }, { top: 40, left: 42 }, { top: 40, left: 53 }, { top: 40, left: 65 },
      { top: 51, left: 26 }, { top: 51, left: 38 }, { top: 51, left: 48.5 }, { top: 51, left: 60 },
      { top: 62, left: 31.5 }, { top: 62, left: 43 }, { top: 62, left: 54 },
      { top: 73, left: 37 }, { top: 73, left: 47.5 },
      { top: 84, left: 42 },
    ],
    []
  );
  const POSITIONS_TINY = useMemo(
    () => [
      { top: 8, left: 12.5 }, { top: 8, left: 29 }, { top: 8, left: 46 }, { top: 8, left: 60 },
      { top: 18, left: 6 }, { top: 18, left: 21 }, { top: 18, left: 38 }, { top: 18, left: 52 }, { top: 18, left: 69 },
      { top: 29, left: -2.5 }, { top: 29, left: 14 }, { top: 29, left: 30 }, { top: 29, left: 46 }, { top: 29, left: 62 }, { top: 29, left: 77 },
      { top: 40, left: 5 }, { top: 40, left: 21 }, { top: 40, left: 38 }, { top: 40, left: 54 }, { top: 40, left: 70.4 },
      { top: 51, left: 14 }, { top: 51, left: 30 }, { top: 51, left: 47 }, { top: 51, left: 63 },
      { top: 62, left: 21 }, { top: 62, left: 37 }, { top: 62, left: 53 },
      { top: 72, left: 29.5 }, { top: 72, left: 45.5 },
      { top: 83, left: 37 },
    ],
    []
  );

  const POSITIONS =
    isTiny ? POSITIONS_TINY :
      isMobile ? POSITIONS_MOBILE :
        isTablet ? POSITIONS_TABLET :
          POSITIONS_PC;

  // 출석 처리
  const handleAttendClick = () => {
    const index = now.day - 1;
    if (index < 0 || index >= TOTAL) return alert("이번 달 출석체크는 30일까지예요!");
    if (grapes[index]) return alert("오늘은 이미 출석했어요 🍇");
    const updated = [...grapes];
    updated[index] = true;
    setGrapes(updated);
    alert("✅ 오늘 출석 완료! 포도 한 알이 채워졌어요!");
  };

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.leftBoxWrapper}>

        {/* 400px 이하: 캐릭터 → 보드 열기, '출석하기' 버튼으로만 체크 */}
        {isTiny ? (
          !showBoard ? (
            <div className={styles.mobileIntro}>
              <img
                src={CHARACTER_IMG}
                alt="농부 캐릭터"
                className={styles.characterCenter}
                onClick={() => setShowBoard(true)}
              />
              <p className={styles.grapeClick}>Click</p>
            </div>
          ) : (
            <div className={`${styles.attendanceBox} ${styles.isBoard}`}>
              <button className={styles.closeBtn} onClick={() => setShowBoard(false)}>✖</button>

              <div className={styles.titleArea}>
                <p><span className={styles.orangeText}>유저연결</span> 의</p>
                <h2 className={styles.greenText}>출석체크</h2>
              </div>

              <div className={styles.grapeArea}>
                <img src={BASE_IMG} alt="포도 송이" className={styles.grapeImg} />
                {Array.from({ length: TOTAL }, (_, i) => {
                  const pos = POSITIONS[i];
                  const filled = grapes[i];
                  const dayNum = i + 1;
                  if (!filled && !SHOW_ALL) return null;
                  return (
                    <div
                      key={i}
                      className={styles.grapeSlot}
                      style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                    >
                      <img src={FILLED_IMG} alt={`${dayNum}일 출석`} className={styles.grapeDot} />
                      {(DEBUG || SHOW_ALL) && <span className={styles.slotIndex}>{dayNum}</span>}
                    </div>
                  );
                })}
              </div>

              {/* ⬇︎ 버튼으로만 출석 */}
              <button className={styles.attendBtn} onClick={handleAttendClick}>출석하기</button>
            </div>
          )
        ) : (
          /* 401px 이상: 캐릭터만 클릭하면 출석 (버튼 X) */
          <div className={styles.attendanceBox}>
            <div className={styles.titleArea}>
              <p><span className={styles.orangeText}>유저연결</span> 의</p>
              <h2 className={styles.greenText}>출석체크</h2>
            </div>

            <div className={styles.grapeArea}>
              <img src={BASE_IMG} alt="포도 송이" className={styles.grapeImg} />
              {/* 포도알 표시(디버그/채운 날 표시) */}
              {Array.from({ length: TOTAL }, (_, i) => {
                const pos = POSITIONS[i];
                const filled = grapes[i];
                const dayNum = i + 1;
                if (!filled && !SHOW_ALL) return null;
                return (
                  <div
                    key={i}
                    className={styles.grapeSlot}
                    style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                  >
                    <img src={FILLED_IMG} alt={`${dayNum}일 출석`} className={styles.grapeDot} />
                    {(DEBUG || SHOW_ALL) && <span className={styles.slotIndex}>{dayNum}</span>}
                  </div>
                );
              })}

              {/* ⬇︎ 캐릭터만 클릭 시 출석 */}
              <img
                src={CHARACTER_IMG}
                alt="농부 캐릭터"
                className={styles.characterleft}
                onClick={handleAttendClick}
              />
            </div>
          </div>
        )}
      </div>

      {/* 오른쪽 메뉴: 컴포넌트는 항상 렌더(320~400은 CSS로 숨김) */}
      <div className={styles.rightBoxWrapper}>
        <div className={styles.rightBox}>
          <div className={styles.imageGrid}>
            {images.map((item, i) => (
              <a key={i} href="#" className={styles.imageItem}>
                <img src={item.src} alt={item.label} className={styles.optionImg} />
                <p>{item.label}</p>
              </a>
            ))}
          </div>
          <div className={styles.characterArea}>
            <img src={RIGHT_CHAR_IMG} alt="챗봇" className={styles.characterRight} />
          </div>
        </div>
      </div>
    </div>
  );
}
