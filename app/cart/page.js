'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// cart 페이지 기준 상대경로
import { ALL_PRODUCTS } from '../../lib/products';
import styles from './cart.module.css';

const LS_KEY = 'cart';          // [{ id, qty }]
const LS_OPT_KEY = 'cart_opts'; // { [id]: "선택값" }

export default function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusIdFromURL = searchParams.get('id') || searchParams.get('focus') || null;

  const [rawCart, setRawCart] = useState([]);                // [{id, qty}]
  const [selectedIds, setSelectedIds] = useState(new Set()); // 선택된 항목 id
  const [optById, setOptById] = useState({});                // { [id]: value }
  const [highlightId, setHighlightId] = useState(null);      // 하이라이트용

  // ✅ 토스트 상태
  const [toast, setToast] = useState(null); // {message, action?}
  const toastTimer = useRef(null);
  const showToast = (message, action = null, ms = 4000) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, action });
    toastTimer.current = setTimeout(() => setToast(null), ms);
  };
  useEffect(() => () => toastTimer.current && clearTimeout(toastTimer.current), []);

  // 1) LS에서 팜두 주머니/옵션 불러오기
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      setRawCart(Array.isArray(data) ? data : []);
      setSelectedIds(new Set((Array.isArray(data) ? data : []).map(i => i.id)));

      const opt = JSON.parse(localStorage.getItem(LS_OPT_KEY) || '{}');
      setOptById(opt && typeof opt === 'object' ? opt : {});
    } catch {
      setRawCart([]);
      setSelectedIds(new Set());
      setOptById({});
    }
  }, []);

  // 2) product 맵
  const productMap = useMemo(() => {
    const m = new Map();
    for (const p of ALL_PRODUCTS) m.set(p.id, p);
    return m;
  }, []);

  // 3) 렌더 데이터 (옵션 리스트 포함)
  const items = useMemo(() => {
    return rawCart
      .map(({ id, qty }) => {
        const p = productMap.get(id);
        if (!p) return null;

        const potOptions = (p.ui?.potOptions ?? []).map((o) => {
          if (typeof o === 'string') return { value: o, label: o, extra: 0 };
          return { value: o.value, label: o.label, extra: Number(o.extra || 0) };
        });

        const optValue = optById[id] ?? '';
        const activeOpt = potOptions.find((o) => o.value === optValue);
        const extra = activeOpt?.extra ?? 0;

        return {
          id,
          name: p.name,
          cat: p.cat,
          img: p.img,
          price: Number(p.price) || 0,
          qty: Math.max(1, Number(qty) || 1),
          options: potOptions,
          optValue,
          extra,
        };
      })
      .filter(Boolean);
  }, [rawCart, productMap, optById]);

  // URL의 id가 있으면: 선택 체크 + 스크롤 + 하이라이트
  useEffect(() => {
    if (!focusIdFromURL) return;
    const exists = items.some(it => it.id === focusIdFromURL);
    if (!exists) return;

    // 선택 추가
    setSelectedIds(prev => {
      const s = new Set(prev);
      s.add(focusIdFromURL);
      return s;
    });

    // 스크롤 + 하이라이트
    const el = document.getElementById(`cart-item-${focusIdFromURL}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightId(focusIdFromURL);
    const t = setTimeout(() => setHighlightId(null), 1800);
    return () => clearTimeout(t);
  }, [focusIdFromURL, items]);

  // 4) 합계 (선택만) → 총 수량(selectedQty)까지 계산
  const summary = useMemo(() => {
    const selected = items.filter(it => selectedIds.has(it.id));
    const productsTotal = selected.reduce(
      (acc, it) => acc + (it.price + it.extra) * it.qty,
      0
    );
    const shipping = 0;
    const payment = productsTotal + shipping;
    const selectedQty = selected.reduce((acc, it) => acc + it.qty, 0);
    return {
      count: selected.length,   // 선택된 “상품 종류”
      selectedQty,              // 선택된 “총 수량”
      productsTotal,
      shipping,
      payment
    };
  }, [items, selectedIds]);

  // 5) 유틸
  const persistCart = (next) => {
    setRawCart(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };
  const persistOpts = (next) => {
    setOptById(next);
    localStorage.setItem(LS_OPT_KEY, JSON.stringify(next));
  };

  // 수량 변경
  const setQty = (id, qty) => {
    const v = Math.max(1, Math.min(99, Number(qty) || 1));
    persistCart(rawCart.map(it => (it.id === id ? { ...it, qty: v } : it)));
  };
  const inc = (id) => setQty(id, (rawCart.find(i => i.id === id)?.qty || 1) + 1);
  const dec = (id) => setQty(id, (rawCart.find(i => i.id === id)?.qty || 1) - 1);

  // 옵션 변경
  const onOptionChange = (id, value) => {
    const next = { ...optById, [id]: value };
    if (!value) delete next[id]; // 선택안함이면 제거
    persistOpts(next);
  };

  // 선택/삭제
  const toggleSelect = (id) => {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  };
  const selectAll = () => setSelectedIds(new Set(items.map(it => it.id)));
  const deselectAll = () => setSelectedIds(new Set());
  const removeSelected = () => {
    const next = rawCart.filter(it => !selectedIds.has(it.id));
    persistCart(next);
    const opts = { ...optById };
    for (const id of selectedIds) delete opts[id];
    persistOpts(opts);
    setSelectedIds(new Set());
    showToast('선택한 상품을 삭제했어요.');
  };
  const removeOne = (id) => {
    const next = rawCart.filter(it => it.id !== id);
    persistCart(next);
    const s = new Set(selectedIds);
    s.delete(id);
    setSelectedIds(s);
    const opts = { ...optById };
    delete opts[id];
    persistOpts(opts);
    showToast('상품을 삭제했어요.');
  };

  const onCheckout = () => {
    const selected = items.filter(it => selectedIds.has(it.id));
    if (selected.length === 0) {
      showToast('선택된 상품이 없습니다.');
      return;
    }
    showToast('결제 페이지로 이동할까요?', () => router.push('/checkout'));
  };

  return (
    <main className={styles.cartPage}>
      {/* 브레드크럼 */}
      <nav className={styles.breadcrumb}>
        <ol>
          <li className={styles.active}>01 팜두 주머니</li>
          <li>02 주문서 작성/결제</li>
          <li>03 주문완료</li>
        </ol>
      </nav>

      <h2 className={styles.cartTitle}>팜두 주머니</h2>

      <div className={styles.cartControls}>
        <button onClick={selectAll}>전체 선택</button>
        <button onClick={deselectAll}>선택 해제</button>
      </div>

      <section className={styles.cartGrid}>
        {items.map((it) => (
          <article
            key={it.id}
            id={`cart-item-${it.id}`}
            className={`${styles.cartItem} ${highlightId === it.id ? styles.flash : ''}`}
          >
            {/* 체크박스 */}
            <input
              type="checkbox"
              className={styles.checkItem}
              checked={selectedIds.has(it.id)}
              onChange={() => toggleSelect(it.id)}
              aria-label={`${it.name} 선택`}
            />

            {/* 썸네일 */}
            <Link href={`/shop/${it.id}`} className={styles.thumbLink} aria-label={`${it.name} 상세보기`}>
              <Image
                src={it.img}
                alt={it.name}
                width={400}
                height={400}
                className={styles.thumb}
              />
            </Link>

            {/* 정보 패널 */}
            <div className={styles.info}>
              {/* 상품명 */}
              <div className={styles.meta} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.listname}>상품명</span>
                <h3 className={styles.name} style={{ color: '#fff', fontWeight: 400, fontSize: '1.2rem' }}>
                  {it.name}
                </h3>
              </div>

              {/* 수량 */}
              <div className={styles.row} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.listname}>수량</span>
                <div className={styles.qtyBox}>
                  <button type="button" onClick={() => dec(it.id)} aria-label="수량 감소">−</button>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={it.qty}
                    onChange={(e) => setQty(it.id, e.target.value)}
                    aria-label="수량"
                    onWheel={(e) => e.currentTarget.blur()} 
                  />
                  <button type="button" onClick={() => inc(it.id)} aria-label="수량 증가">＋</button>
                </div>
              </div>

              {/* 옵션 */}
              <div className={styles.row} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.listname}>옵션</span>
                <div className={styles.optWrap}>
                  <select
                    className={styles.select}
                    value={it.optValue ?? ''}
                    onChange={(e) => onOptionChange(it.id, e.target.value)}
                    aria-label="옵션 선택"
                  >
                    <option value="">선택안함</option>
                    {it.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                        {o.extra ? ` (+${o.extra.toLocaleString()}원)` : ''}
                      </option>
                    ))}
                  </select>
                  {it.optValue && (
                    <button
                      type="button"
                      className={styles.clear}
                      aria-label="옵션 초기화"
                      onClick={() => onOptionChange(it.id, '')}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* 금액 */}
              <div className={styles.row} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={styles.listname}>금액</span>
                <div className={styles.lineTotal} style={{ color: '#fff' }}>
                  {((it.price + it.extra) * it.qty).toLocaleString()}원
                </div>
              </div>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className={styles.empty}>
            <p style={{ marginBottom: '20px' }}>팜두 주머니가 비었습니다.</p>
            <Link
              href="/shop"
              style={{
                border: '1px solid #E47C14',
                borderRadius: '50px',
                padding: '5px 10px',
                fontWeight: 600,
                fontSize: '1.2rem',
                background: '#fff'
              }}
            >
              쇼핑 하러가기 →
            </Link>
          </div>
        )}
      </section>

      {/* 합계 */}
      <div className={styles.cartSummary}>
        <div className={styles.summaryTotal}>
          <div className={styles.cartTotal}>
            총 주문 상품 {summary.selectedQty}개
            <span style={{ opacity: 0.7, marginLeft: 8 }}>(종류 {summary.count}개)</span>
          </div>
          <div className={styles.summaryText}>
            <p>
              총 상품금액 : <strong>{summary.productsTotal.toLocaleString()}원</strong>
              <span className={styles.plus}> + </span>
              무료배송
              <span className={styles.equals}> = </span>
            </p>
            <p>
              결제예정금액 : <strong>{summary.payment.toLocaleString()}원</strong>
            </p>
          </div>
        </div>

        <div className={styles.cartBtns}>
          <button className={styles.btnRemove} onClick={removeSelected}>선택상품 삭제하기</button>
          <button className={styles.btnPay} onClick={onCheckout}>결제하기</button>
        </div>
      </div>

      {/* ✅ 토스트 */}
      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">
          <p>{toast.message}</p>
          <div className={styles.toastBtns}>
            {toast.action && (
              <button className={styles.yes} onClick={toast.action}>예</button>
            )}
            <button className={styles.no} onClick={() => setToast(null)}>닫기</button>
          </div>
        </div>
      )}
    </main>
  );
}
