'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './detail.module.css';

export default function RelatedRail({ items = [] }) {
  const railRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const movedRef = useRef(false);

  const getClientX = (e) => {
    // PointerEvent 우선, fallback로 터치/마우스 처리
    if (typeof e.clientX === 'number') return e.clientX;
    if (e.touches && e.touches[0]) return e.touches[0].clientX;
    return 0;
  };

  const onPointerDown = (e) => {
    const rail = railRef.current;
    if (!rail) return;
    isDownRef.current = true;
    movedRef.current = false;

    rail.classList.add(styles.dragging);

    startXRef.current = getClientX(e) - rail.getBoundingClientRect().left;
    scrollLeftRef.current = rail.scrollLeft;

    // 포인터 캡처 (지원 브라우저에서 드래그 안정화)
    if (rail.setPointerCapture && e.pointerId != null) {
      try { rail.setPointerCapture(e.pointerId); } catch {}
    }
  };

  const onPointerMove = (e) => {
    const rail = railRef.current;
    if (!rail || !isDownRef.current) return;

    e.preventDefault(); // 스크롤 충돌 방지
    const x = getClientX(e) - rail.getBoundingClientRect().left;
    const walk = (x - startXRef.current) * 1.2; // 감도 조절
    if (Math.abs(walk) > 3) movedRef.current = true; // 드래그로 판단
    rail.scrollLeft = scrollLeftRef.current - walk;
  };

  const endDrag = (e) => {
    const rail = railRef.current;
    if (!rail) return;
    isDownRef.current = false;
    rail.classList.remove(styles.dragging);

    if (rail.releasePointerCapture && e?.pointerId != null) {
      try { rail.releasePointerCapture(e.pointerId); } catch {}
    }
  };

  const onCardClick = (e) => {
    // 드래그했다면 링크 이동 막기
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className={styles.rail}
      ref={railRef}
      // Pointer(마우스/펜/터치 공통)
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      // 터치 전용 브라우저 호환 (선택)
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={endDrag}
    >
      {items.map((it) => (
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
              draggable={false} // 이미지 드래그 방지
            />
            <div className={styles.overlay}>
              <h3 className={styles.name}>{it.cat}</h3>
              <div className={styles.price}>{it.price.toLocaleString()}원</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
