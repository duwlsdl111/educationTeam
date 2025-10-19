'use client';

import { useRef, useEffect, useState } from 'react';
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
            <div className={styles.mainImg}>
              <Image
                src={product.img}
                alt={product.name}
                fill
                className={styles.mainImage}
                priority
              />
            </div>

            <div className={styles.subImgs}>
              {(product.images ?? []).map((img, i) => (
                <div key={`${product.id}-sub-${i}`} className={styles.subImgBox}>
                  <Image
                    src={img}
                    alt={`${product.name} 서브이미지 ${i + 1}`}
                    fill
                    className={styles.subImg}
                  />
                </div>
              ))}
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
