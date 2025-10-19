"use client";

import { useEffect, useRef } from "react";
import styles from "./section5.module.css";

export default function Section5() {
  const seedRef = useRef(null);
  const goodsRef = useRef(null);

  const seedHoverRef = useRef(false);
  const goodsHoverRef = useRef(false);

  const seedImages = [
    "/images/seed1.png",
    "/images/seed2.png",
    "/images/seed3.png",
    "/images/seed4.png",
    "/images/seed5.png",
    "/images/seed6.png",
    "/images/seed1.png",
    "/images/seed2.png",
    "/images/seed3.png",
    "/images/seed4.png",
    "/images/seed5.png",
    "/images/seed6.png",
  ];

  const goodsImages = [
    "/images/goods1.png",
    "/images/goods2.png",
    "/images/goods3.png",
    "/images/goods4.png",
    "/images/goods1.png",
    "/images/goods2.png",
    "/images/goods1.png",
    "/images/goods2.png",
    "/images/goods3.png",
    "/images/goods4.png",
    "/images/goods1.png",
    "/images/goods2.png",
  ];

  useEffect(() => {
    const seedUl = seedRef.current;
    const goodsUl = goodsRef.current;

    let seedScroll = 0;
    let goodsScroll = 0;
    const speed = 0.5;

    const animate = () => {
      // 왼쪽 스크롤
      if (!seedHoverRef.current) {
        seedScroll += speed;
        if (seedScroll >= seedUl.scrollWidth / 2) seedScroll = 0;
        seedUl.scrollLeft = seedScroll;
      }

      // 오른쪽 스크롤
      if (!goodsHoverRef.current) {
        goodsScroll -= speed;
        if (goodsScroll <= 0) goodsScroll = goodsUl.scrollWidth / 2;
        goodsUl.scrollLeft = goodsScroll;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className={styles.sec5}>
      <div className={styles.sec5title}>
        <h2>씨앗 & 굿즈</h2>
      </div>
      <div className={styles.sec5content}>
        {/* 왼쪽으로 스크롤 */}
        <ul
          ref={seedRef}
          onMouseEnter={() => (seedHoverRef.current = true)}
          onMouseLeave={() => (seedHoverRef.current = false)}
        >
          {[...seedImages, ...seedImages].map((src, i) => (
            <li key={i}>
              <img src={src} alt={`seed-${i}`} />
            </li>
          ))}
        </ul>

        {/* 오른쪽으로 스크롤 */}
        <ul
          ref={goodsRef}
          onMouseEnter={() => (goodsHoverRef.current = true)}
          onMouseLeave={() => (goodsHoverRef.current = false)}
        >
          {[...goodsImages, ...goodsImages].map((src, i) => (
            <li key={i}>
              <img src={src} alt={`goods-${i}`} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
