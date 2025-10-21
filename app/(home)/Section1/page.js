"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import styles from "./section1.module.css";

export default function Section1() {
  // ✅ 이미지 배열 정의
  const images = [
    "/images/main2img1.png",
    "/images/main2img2.png",
    "/images/main2img3.png",
  ];

  // ✅ 상태 & ref 선언
  const [current, setCurrent] = useState(1);
  const slidesRef = useRef(null);
  const intervalRef = useRef(null);

  // ✅ 무한 루프용 슬라이드 배열
  const slides = [images[images.length - 1], ...images, images[0]];
  const totalSlides = slides.length;

  // ✅ 슬라이드 이동 함수
  const moveSlide = (index) => {
    if (!slidesRef.current) return;
    slidesRef.current.style.transition = "transform 0.8s ease-in-out";
    slidesRef.current.style.transform = `translateX(-${index * 100}%)`;
  };

  // ✅ 자동 슬라이드 시작 / 정지
  const startSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setCurrent((p) => p + 1), 3000);
  };

  const stopSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // ✅ 초기 설정
  useEffect(() => {
    if (slidesRef.current) {
      slidesRef.current.style.transition = "none";
      slidesRef.current.style.transform = "translateX(-100%)";
    }
    startSlide();
    return () => stopSlide();
  }, []);

  // ✅ 슬라이드 무한 루프 처리
  useLayoutEffect(() => {
    if (!slidesRef.current) return;

    moveSlide(current);

    const handleTransitionEnd = () => {
      if (current === totalSlides - 1) {
        slidesRef.current.style.transition = "none";
        slidesRef.current.style.transform = "translateX(-100%)";
        setCurrent(1);
      } else if (current === 0) {
        slidesRef.current.style.transition = "none";
        slidesRef.current.style.transform = `translateX(-${
          (totalSlides - 2) * 100
        }%)`;
        setCurrent(totalSlides - 2);
      }
    };

    slidesRef.current.addEventListener("transitionend", handleTransitionEnd);
    return () =>
      slidesRef.current.removeEventListener(
        "transitionend",
        handleTransitionEnd
      );
  }, [current, totalSlides]);

  // ✅ 렌더링
  return (
    <section className={styles.section1}>
      <div className={styles.container}>
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
                    <h3>
                      씨앗에서 식탁까지{" "}
                      {index === 0
                        ? 3
                        : index === slides.length - 1
                        ? 1
                        : index}
                      장
                    </h3>
                    <p>
                      {index === 0
                        ? "“작은 손이 키운 정성, 맛있는 추억이 되다”"
                        : index === 1
                        ? "“씨앗을 심고 정성껏 키운 농작물이 맛있는 요리로 변했어요”"
                        : index === 2
                        ? "“아이들이 정성껏 키운 작물로 차린 특별한 식탁”"
                        : "“씨앗을 심고 정성껏 키운 농작물이 맛있는 요리로 변했어요”"}
                    </p>
                    <button className={styles.main2btn}>자세히보기</button>
                  </div>
                </div>
              ))}
            </div>

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
    </section>
  );
}
