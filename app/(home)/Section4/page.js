"use client";
import { useRef } from "react";
import Link from "next/link";
import styles from "./section4.module.css";

export default function Section4() {
  const scrollRef = useRef(null);
  const pos = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const handlePointerDown = (e) => {
    const slider = scrollRef.current;
    pos.current.isDown = true;
    pos.current.startX =
      e.type === "touchstart"
        ? e.touches[0].clientX - slider.getBoundingClientRect().left
        : e.clientX - slider.getBoundingClientRect().left;
    pos.current.scrollLeft = slider.scrollLeft;
  };

  const handlePointerMove = (e) => {
    if (!pos.current.isDown) return;
    const slider = scrollRef.current;
    e.preventDefault();
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const x = clientX - slider.getBoundingClientRect().left;
    const walk = x - pos.current.startX;
    slider.scrollLeft = pos.current.scrollLeft - walk;
  };

  const handlePointerUp = () => {
    pos.current.isDown = false;
  };

  // ✅ 썸네일 배열 (3개를 두 번 반복)
  const thumbnails = [
    "/images/thumbnail1.png",
    "/images/thumbnail2.png",
    "/images/thumbnail3.png",
    "/images/thumbnail1.png",
    "/images/thumbnail2.png",
    "/images/thumbnail3.png",
  ];

  return (
    <div className={styles.sec4}>
      <div className={styles.sec4title}>
        <h2>영상으로 배우자</h2>
      </div>
      <div className={styles.sec4content}>
        <ul>
          <li className={styles.contenttitle}>
            <img src="/images/littlefarmerci.png" alt="farmer" />
          </li>
          <li
            className={styles.contentwrap}
            ref={scrollRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          >
            {thumbnails.map((src, i) => (
              <div key={i} className={styles.contentbox}>
                <div className={styles.contentvideo}>
                  {/* ✅ 썸네일 이미지 추가 */}
                  <img
                    src={src}
                    alt={`thumbnail${i + 1}`}
                    className={styles.thumbnailImg}
                  />
                </div>
                <ul>
                  <li>
                    <p>영상 제목</p>
                    <div>
                      <p>흙의 종류와 색</p>
                    </div>
                  </li>
                  <li>
                    <p>소요시간</p>
                    <div>
                      <p>04분 01초</p>
                    </div>
                  </li>
                  <li
                    className={styles.contentsubmit}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Link href="/edudetail">
                      <p style={{ margin: "-15px",color:"#fff", fontSize:"22.5px"}}>영상 보러가기</p>
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </li>
        </ul>
      </div>
    </div>
  );
}
