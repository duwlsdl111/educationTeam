// app/(home)/Main/page.jsx  (경로는 사용중인 구조에 맞춰 주세요)
"use client";

import { useState, useLayoutEffect, useRef, useEffect } from "react";
import styles from "./main.module.css";

// ⬇️ 섹션 import 경로 수정 (Section4/5가 Section3로 잘못되어 있었음)
import Section2 from "../Section2/page";
import Section3 from "../Section3/page";
import Section4 from "../Section4/page";
import Section5 from "../Section5/page";

const images = [
  "/images/main2img1.png",
  "/images/main2img2.png",
  "/images/main2img3.png",
];

export default function Main() {
  const [current, setCurrent] = useState(1);
  const slidesRef = useRef(null);
  const intervalRef = useRef(null);

  // 양끝에 복제 슬라이드 추가(무한루프용)
  const slides = [images[images.length - 1], ...images, images[0]];
  const totalSlides = slides.length;

  const moveSlide = (index) => {
    if (!slidesRef.current) return;
    slidesRef.current.style.transition = "transform 0.8s ease-in-out";
    slidesRef.current.style.transform = `translateX(-${index * 100}%)`;
  };

  const startSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setCurrent((p) => p + 1), 3000);
  };

  const stopSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // ⬇️ 마운트 시 처음 위치를 1번으로 고정(깜빡임/미표시 방지)
  useEffect(() => {
    if (slidesRef.current) {
      slidesRef.current.style.transition = "none";
      slidesRef.current.style.transform = "translateX(-100%)";
    }
    startSlide();
    return () => stopSlide();
  }, []);

  useLayoutEffect(() => {
    if (!slidesRef.current) return;

    moveSlide(current);

    const handleTransitionEnd = () => {
      if (current === totalSlides - 1) {
        // 마지막 가짜 → 진짜 1번으로 점프
        slidesRef.current.style.transition = "none";
        slidesRef.current.style.transform = "translateX(-100%)";
        setCurrent(1);
      } else if (current === 0) {
        // 첫 가짜 → 진짜 마지막으로 점프
        slidesRef.current.style.transition = "none";
        slidesRef.current.style.transform = `translateX(-${
          (totalSlides - 2) * 100
        }%)`;
        setCurrent(totalSlides - 2);
      }
    };

    slidesRef.current.addEventListener("transitionend", handleTransitionEnd);
    return () =>
      slidesRef.current?.removeEventListener(
        "transitionend",
        handleTransitionEnd
      );
  }, [current, totalSlides]);

  return (
    <div>
      {/* 섹션1 */}
      <div className={styles.main1}>
        <img className={styles.text} src="/images/section1text.png" alt="" />

        <div className={styles.videoWrap}>
          <video
            src="/videos/bannerVideo.mp4"
            autoPlay
            loop
            muted
            playsInline    // ✅ React는 webkit-playsinline 속성 대신 이걸 사용
            className={styles.video}
          />
        </div>

        <img className={styles.character} src="/images/section1img.png" alt="" />
      </div>

      {/* 섹션2: 슬라이더 */}
      <div className={styles.main2}>
        <div className={styles.seedtotable}>
          <h2>씨앗에서 식탁까지</h2>

          <div
            className={styles.banner}
            onMouseEnter={stopSlide}
            onMouseLeave={startSlide}
          >
            <div className={styles.slides} ref={slidesRef}>
              {slides.map((img, index) => (
                <div className={styles.slideItem} key={index}>
                  <img src={img} alt={`banner-${index}`} />
                  <div className={styles.slideText}>
                    <h2>
                      씨앗에서 식탁까지{" "}
                      {index === 0 ? 3 : index === slides.length - 1 ? 1 : index}
                      장
                    </h2>
                    <p>
                      {index === 0
                        ? "“작은 손이 키운 정성, 맛있는 추억이 되다”"
                        : index === 1
                        ? "“씨앗을 심고 정성껏 키운 농작물이 맛있는 요리로 변했어요”"
                        : index === 2
                        ? "“아이들이 정성껏 키운 작물로 차린 특별한 식탁”"
                        : index === 3
                        ? "“작은 손이 키운 정성, 맛있는 추억이 되다”"
                        : "“씨앗을 심고 정성껏 키운 농작물이 맛있는 요리로 변했어요”"}
                    </p>
                    <button className={styles.main2btn} type="button">
                      자세히보기
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 슬라이드 컨트롤러 */}
            <div className={styles.slideController}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.controlBox} ${
                    current === idx + 1 ? styles.activeBox : ""
                  }`}
                  onClick={() => setCurrent(idx + 1)}
                  aria-label={`${idx + 1}번 슬라이드로 이동`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 나머지 섹션 */}
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
    </div>
  );
}
