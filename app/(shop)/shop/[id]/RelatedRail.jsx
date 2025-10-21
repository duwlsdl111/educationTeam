'use client';

import { useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './detail.module.css';

// 랜덤 섞기 유틸
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function RelatedRail({ items = [], baseId = '' }) {
  const railRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const movedRef = useRef(false);

  // ✅ 랜덤으로 7개만 (자기 자신 제외)
  const relatedItems = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return [];
    const filtered = items.filter((it) => it.id !== baseId);
    return shuffle(filtered).slice(0, 7);
  }, [items, baseId]);

  // === 드래그 스크롤 ===
  const onPointerDown = (e) => {
    const rail = railRef.current;
    if (!rail) return;
    isDownRef.current = true;
    movedRef.current = false;
    rail.classList.add(styles.dragging);
    startXRef.current = e.clientX - rail.getBoundingClientRect().left;
    scrollLeftRef.current = rail.scrollLeft;
    rail.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const rail = railRef.current;
    if (!rail || !isDownRef.current) return;
    e.preventDefault();
    const x = e.clientX - rail.getBoundingClientRect().left;
    const walk = (x - startXRef.current) * 1.2;
    if (Math.abs(walk) > 3) movedRef.current = true;
    rail.scrollLeft = scrollLeftRef.current - walk;
  };

  const endDrag = (e) => {
    const rail = railRef.current;
    if (!rail) return;
    isDownRef.current = false;
    rail.classList.remove(styles.dragging);
    rail.releasePointerCapture?.(e.pointerId);
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
    >
      {relatedItems.length === 0 && (
        <div className={styles.empty}>상품이 없습니다.</div>
      )}

      {relatedItems.map((it) => (
        <Link
          key={it.id}
          href={`/shop/${it.id}`}
          className={styles.card}
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
