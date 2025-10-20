"use client";

import { useState, useLayoutEffect, useRef, useEffect } from "react";
import styles from "./main.module.css";

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

  // 👉 따라다니는 박스용 ref
  const followRef = useRef(null);
  const targetY = useRef(20); // 초기 위치 (스크롤 기준 + offset)
  const currentY = useRef(200);

  // 무한루프용 복제
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

  // 초기 위치 1번(복제 고려)
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

    const onEnd = () => {
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

    slidesRef.current.addEventListener("transitionend", onEnd);
    return () => slidesRef.current?.removeEventListener("transitionend", onEnd);
  }, [current, totalSlides]);

  // ✅ 스크롤 따라다니는 박스
  useEffect(() => {
  const main2 = document.querySelector(`.${styles.main2}`);
  const h2 = main2?.querySelector("h2");
  const section5 = document.querySelector(`.${styles.section5}`);

  if (!main2 || !h2 || !section5) return;

  let h2Top = 0;
  let section5Top = 0;
  const boxHeight = followRef.current?.offsetHeight || 600; // 박스 높이

  const setInitialPosition = () => {
    requestAnimationFrame(() => {
      h2Top = h2.getBoundingClientRect().top + window.scrollY;
      section5Top = section5.getBoundingClientRect().top + window.scrollY;

      targetY.current = h2Top;
      currentY.current = h2Top;

      if (followRef.current) {
        followRef.current.style.transform = `translateY(${h2Top}px)`;
        followRef.current.style.opacity = "1";
      }
    });
  };

  const handleScroll = () => {
    const scrollY = window.scrollY;
    let newY;

    if (scrollY < h2Top) newY = h2Top;
    else if (scrollY + 100 + boxHeight < section5Top) newY = scrollY + 100;
    else newY = section5Top - boxHeight;

    targetY.current = newY;
  };

  const follow = () => {
    currentY.current += (targetY.current - currentY.current) * 0.1;
    if (followRef.current) {
      followRef.current.style.transform = `translateY(${currentY.current}px)`;
    }
    requestAnimationFrame(follow);
  };

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", setInitialPosition);

  setInitialPosition();
  follow();

  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", setInitialPosition);
  };
}, []);


  return (
    <div className={styles.home}>
      {/* 섹션1: 헤더 바로 밑에서 시작 */}
      <section className={styles.main1}>
        <img className={styles.text} src="/images/section1text.png" alt="" />

        <div className={styles.videoWrap}>
          <video
            src="/videos/bannerVideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={styles.video}
          />
        </div>

        <img
          className={styles.character}
          src="/images/section1img.png"
          alt=""
        />

        {/* 👉 따라다니는 박스 */}
        <div className={styles.movingbox} ref={followRef}>
          <img src="/images/movingboxtitle.png" />
          <ul className={styles.boxList}>
            <li>
              <img src="/images/chatbotitem1.png" />
              <p>씨앗 구매</p>
            </li>
            <li>
              <img src="/images/chatbotitem2.png" />
              <p>모종 구매</p>
            </li>
          </ul>
          <ul className={styles.boxList}>
            <li>
              <img src="/images/chatbotitem3.png" />
              <p>미니 게임</p>
            </li>
            <li>
              <img src="/images/chatbotitem4.png" />
              <p>농장 예약</p>
            </li>
          </ul>
          <div
            style={{
              width: "267px",
              height: "2px",
              backgroundColor: "#E47C14",
            }}
          ></div>
          <div className={styles.chatfarmdu}>
            <img src="/images/chatfarmdu.png" />
          </div>
        </div>
      </section>
      {/* 섹션2: 슬라이더 */}
      <section className={styles.main2}>
        <div className="container">
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
      {/* 나머지 섹션 */}
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
    </div>
  );
}
