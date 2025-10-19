'use client';

import { useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './detail.module.css';

// 접두사 추출: "seed-01" → "seed"
const getPrefix = (id = '') => id.split('-')[0];

export default function RelatedRail({ items = [], baseId = '' }) {
  const railRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const movedRef = useRef(false);

  // ✅ 접두사가 같은 상품들만 (자기 자신은 제외)
  const relatedItems = useMemo(() => {
    if (!Array.isArray(items) || !baseId) return [];
    const prefix = getPrefix(baseId); // ex. "seed"
    return items.filter(
      (it) => it?.id && it.id !== baseId && it.id.startsWith(`${prefix}-`)
    );
  }, [items, baseId]);

  // === 드래그 스크롤 ===
  const getClientX = (e) =>
    typeof e.clientX === 'number' ? e.clientX : (e.touches?.[0]?.clientX ?? 0);

  const onPointerDown = (e) => {
    const rail = railRef.current;
    if (!rail) return;
    isDownRef.current = true;
    movedRef.current = false;
    rail.classList.add(styles.dragging);
    startXRef.current = getClientX(e) - rail.getBoundingClientRect().left;
    scrollLeftRef.current = rail.scrollLeft;
    if (rail.setPointerCapture && e.pointerId != null) {
      try {
        rail.setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  const onPointerMove = (e) => {
    const rail = railRef.current;
    if (!rail || !isDownRef.current) return;
    e.preventDefault();
    const x = getClientX(e) - rail.getBoundingClientRect().left;
    const walk = (x - startXRef.current) * 1.2;
    if (Math.abs(walk) > 3) movedRef.current = true;
    rail.scrollLeft = scrollLeftRef.current - walk;
  };

  const endDrag = (e) => {
    const rail = railRef.current;
    if (!rail) return;
    isDownRef.current = false;
    rail.classList.remove(styles.dragging);
    if (rail.releasePointerCapture && e?.pointerId != null) {
      try {
        rail.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const onCardClick = (e) => {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className={styles.rail}
      ref={railRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={endDrag}
    >
      {relatedItems.length === 0 && (
        <div className={styles.empty}>관련 상품이 없습니다.</div>
      )}

      {relatedItems.map((it) => (
        <Link
          key={it.id}
          href={`/shop/${it.id}`}
          className={styles.card}
          aria-label={`${it.name} 상세보기`}
          onClick={onCardClick}
        >
          <div className={styles.thumbWrap}>
            <Image
              src={it.img}
              alt={it.name}
              width={220}
              height={220}
              className={styles.thumb}
              draggable={false}
            />
            <div className={styles.overlay}>
              <h3 className={styles.name}>{it.cat}</h3>
              <div className={styles.price}>
                {(it.price ?? 0).toLocaleString()}원
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
