'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import BackBtn from '../../../components/BackBtn';
import InfoPanel from './InfoPanel';
import InfoTabs from './InfoTabs';
import RelatedRail from './RelatedRail';
import styles from './detail.module.css';

export default function ProductClient({ product, related }) {
  // 페이지 레벨 토스트
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const showToast = (payload, ms = 5000) => {
    setToast(payload);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), ms);
  };
  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

  // ✅ 메인 이미지/참조
  const mainRef = useRef(null);
  const thumbs = useMemo(
    () => Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.img],
    [product.images, product.img]
  );
  const [mainSrc, setMainSrc] = useState(product.img);

  // 썸네일 클릭 → 메인 변경 + 메인 위치로 스크롤
  const onPickThumb = (img) => {
    setMainSrc(img);
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.noticeBar}>
          <Image
            src="/images/shop-hero2.png"
            alt="리틀파머 상세"
            fill
            className={styles.noticeImg}
            priority
          />
          <p className={styles.noticeText}>“ 리틀파머에서 판매하고 있는 모든 상품은 무료 배송입니다 ”</p>
        </div>
        <h1 className={styles.title}>{product.name}</h1>
      </div>

      <section className={styles.top}>
        <div className={styles.topInner}>
          <div className={styles.gallery}>
            {/* ✅ 메인이미지 */}
            <div className={styles.mainImg} ref={mainRef}>
              <Image
                src={mainSrc}
                alt={product.name}
                fill
                className={styles.mainImage}
                priority
              />
            </div>

            {/* ✅ 썸네일들 (클릭/키보드 가능) */}
            <div className={styles.subImgs} role="listbox" aria-label="이미지 선택">
              {thumbs.map((img, i) => {
                const selected = img === mainSrc;
                return (
                  <button
                    type="button"
                    key={`${product.id}-sub-${i}`}
                    className={`${styles.subImgBox} ${selected ? styles.selected : ''}`}
                    onClick={() => onPickThumb(img)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPickThumb(img)}
                    aria-selected={selected}
                    aria-label={`이미지 ${i + 1} 보기`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} 서브이미지 ${i + 1}`}
                      fill
                      className={styles.subImg}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ✅ InfoPanel에 페이지 토스트 콜백 전달 */}
          <InfoPanel product={product} onToast={showToast} />
        </div>

        <InfoTabs details={product.details} />
      </section>

      {/* 뒤로가기 */}
      <div className={styles.backRow}>
        &lt; <BackBtn fallback="/shop" />
      </div>

      {/* 함께 보면 좋은 상품 */}
      {related.length > 0 && (
        <section className={styles.related}>
          <h3 className={styles.relatedTitle} style={{ fontSize: '1.4rem', fontWeight: '600' }}>
            함께 보면 좋은 상품
          </h3>
          <div className={styles.relatedBox}>
            <RelatedRail items={related} />
          </div>
        </section>
      )}

      {/* ✅ 페이지 레벨 토스트 */}
      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">
          <p>{toast.message}</p>
          <div className={styles.toastBtns}>
            {toast.action && (
              <button onClick={toast.action} className={styles.yes}>예</button>
            )}
            <button onClick={() => setToast(null)} className={styles.no}>닫기</button>
          </div>
        </div>
      )}
    </main>
  );
}
