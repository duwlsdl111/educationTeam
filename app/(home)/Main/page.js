"use client";

import styles from "./main.module.css";

import Section1 from "../Section1/page";
import Section2 from "../Section2/page";
import Section3 from "../Section3/page";
import Section4 from "../Section4/page";
import Section5 from "../Section5/page";

export default function Main() {
  return (
    <div className={styles.home}>
      {/* 첫 번째 섹션 */}
      <section className={`${styles.snapSection} ${styles.main1}`}>
        <div className={styles.contentWrap}>
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
        </div>
      </section>

      {/* 두 번째 섹션 */}
      <section className={styles.snapSection}>
        <div className={styles.contentWrap}>
          <Section1 />
        </div>
      </section>

      {/* 세 번째 섹션 */}
      <section className={styles.snapSection}>
        <div className={styles.contentWrap}>
          <Section2 />
        </div>
      </section>

      {/* 네 번째 섹션 */}
      <section className={styles.snapSection}>
        <div className={styles.contentWrap}>
          <Section3 />
        </div>
      </section>

      {/* 다섯 번째 섹션 */}
      <section className={styles.snapSection}>
        <div className={styles.contentWrap}>
          <Section4 />
        </div>
      </section>

      {/* 여섯 번째 섹션 */}
      <section className={styles.snapSection}>
        <div className={styles.contentWrap}>
          <Section5 />
        </div>
      </section>
    </div>
  );
}
