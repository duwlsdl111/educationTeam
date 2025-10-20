'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { CATEGORIES, ALL_PRODUCTS } from '../../../lib/products';
import styles from './shop.module.css';

const PAGE_SIZE = 16;

// ====== 유틸: 접두사/번호/탭매핑/정렬우선순위 ======
const getPrefix = (id='') => String(id).trim().toLowerCase().split('-')[0] || '';
const numFromId = (id='') => {
  const m = String(id).match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 9999;
};

// 탭 이름 → 접두사 매핑
const TAB_PREFIX = { '씨앗': 'seed', '모종': 'seedling', '굿즈': 'goods', '세트': 'set' };

// 전체 탭에서의 정렬 우선순위 (작을수록 먼저)
const ORDER_BY_PREFIX = { set: 0, goods: 1, seedling: 2, seed: 3 };

export default function ShopPage() {
  const router = useRouter();
  const [tab, setTab] = useState('전체');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // 탭 필터: cat 혼재 대비 → id 접두사 기준으로 필터링
  const filtered = useMemo(() => {
    if (tab === '전체') return ALL_PRODUCTS;

    const needPrefix = TAB_PREFIX[tab]; // 예: '씨앗' → 'seed'
    if (!needPrefix) return ALL_PRODUCTS;

    return ALL_PRODUCTS.filter(p => getPrefix(p.id) === needPrefix);
  }, [tab]);

  // 전체 탭일 때만 사용자 정의 순서로 정렬
  const sorted = useMemo(() => {
    if (tab !== '전체') return filtered;

    const list = [...filtered].sort((a, b) => {
      const pa = ORDER_BY_PREFIX[getPrefix(a.id)] ?? 99;
      const pb = ORDER_BY_PREFIX[getPrefix(b.id)] ?? 99;
      if (pa !== pb) return pa - pb;               // 세트 → 굿즈 → 모종 → 씨앗

      // 동일 그룹 내부 정렬: id 숫자 → 이름 보조
      const na = numFromId(a.id);
      const nb = numFromId(b.id);
      if (na !== nb) return na - nb;
      return String(a.name).localeCompare(String(b.name), 'ko');
    });
    return list;
  }, [filtered, tab]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const current = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  const onChangeTab = (nextTab) => {
    if (nextTab === tab) return;
    setTab(nextTab);
    setPage(1);
  };

  const handleAddToCart = (item, qty = 1) => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('cart') : '[]';
      const cart = JSON.parse(raw || '[]');
      const existing = cart.find((c) => c.id === item.id);
      if (existing) existing.qty += qty;
      else cart.push({ id: item.id, name: item.name, price: item.price, img: item.img, qty });
      localStorage.setItem('cart', JSON.stringify(cart));

      setToast({ message: '🌱 팜두 주머니에 담았습니다! 보러갈까요?', action: () => router.push('/cart') });
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 5000);
    } catch (e) {
      console.error(e);
      setToast({ message: '장바구니 담기에 실패했어요. 잠시 후 다시 시도해주세요.' });
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 3000);
    }
  };

  useEffect(() => () => toastTimer.current && clearTimeout(toastTimer.current), []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image src="/images/shop-hero.png" alt="리틀파머 스토어" fill className={styles.heroImg} priority />
        <p className={styles.heroText}>“ 리틀파머에서 판매하고 있는 모든 상품은 무료 배송입니다 ”</p>
      </section>

      <div className={styles.tabs} role="tablist" aria-label="카테고리 탭">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={tab === c}
            onClick={() => onChangeTab(c)}
            className={`${styles.tab} ${tab === c ? styles.active : ''}`}
          >
            {c}
          </button>
        ))}
      </div>

      <section className={styles.grid}>
        {current.map((p) => (
          <article key={p.id} className={styles.card}>
            <Link
              href={`/shop/${p.id}`}
              className={styles.thumbWrap}
              aria-label={`${p.name} 상세보기`}
            >
              <div className={styles.thumbBox}>
                <Image
                  src={p.img}
                  alt={p.name}
                  width={258}
                  height={258}
                  className={styles.thumb}
                />
                <div className={styles.overlay}>
                  <h3 className={styles.name}>{p.cat}</h3>
                  <div className={styles.price}>{p.price.toLocaleString()}원</div>
                </div>
              </div>
            </Link>

            <div className={styles.cardBody}>
              <div className={styles.actions}>
                <button type="button" className={styles.btnPrimary} onClick={() => handleAddToCart(p)}>
                  장바구니 담기
                </button>
              </div>
            </div>
          </article>
        ))}
        {current.length === 0 && <div className={styles.empty}>해당 카테고리의 상품이 없습니다.</div>}
      </section>

      <div className={styles.pager} role="navigation" aria-label="페이지네이션">
        <button type="button" className={styles.pgBtn} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          이전
        </button>
        <span className={styles.pgInfo}>{page} / {totalPages}</span>
        <button type="button" className={styles.pgBtn} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          다음
        </button>
      </div>

      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">
          <p>{toast.message}</p>
          <div className={styles.toastBtns}>
            {toast.action && <button onClick={toast.action} className={styles.yes}>예</button>}
            <button onClick={() => setToast(null)} className={styles.no}>닫기</button>
          </div>
        </div>
      )}
    </main>
  );
}
