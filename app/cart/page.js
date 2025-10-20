'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// cart 페이지 기준 상대경로
import { ALL_PRODUCTS } from '../../lib/products';
import styles from './cart.module.css';

const LS_KEY = 'cart';          // [{ id, qty }]
const LS_OPT_KEY = 'cart_opts'; // { [id]: "선택값" }

export default function CartPage() {
  const [rawCart, setRawCart] = useState([]);               // [{id, qty}]
  const [selectedIds, setSelectedIds] = useState(new Set()); // 선택된 항목 id
  const [optById, setOptById] = useState({});               // { [id]: value }

  // 1) LS에서 장바구니/옵션 불러오기
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

        // 옵션 리스트 표준화: [{value, label, extra}]
        const potOptions = (p.ui?.potOptions ?? []).map((o) => {
          if (typeof o === 'string') return { value: o, label: o, extra: 0 };
          // {value,label,extra} 구조 가정
          return { value: o.value, label: o.label, extra: Number(o.extra || 0) };
        });

        // 활성 옵션
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
          extra, // 옵션 추가금
        };
      })
      .filter(Boolean);
  }, [rawCart, productMap, optById]);

  // 4) 합계 (선택만)
  const summary = useMemo(() => {
    const selected = items.filter(it => selectedIds.has(it.id));
    const productsTotal = selected.reduce(
      (acc, it) => acc + (it.price + it.extra) * it.qty,
      0
    );
    const shipping = 0;
    const payment = productsTotal + shipping;
    return { count: selected.length, productsTotal, shipping, payment };
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
    // 빈 값이면 키 제거 (선택안함)
    if (!value) delete next[id];
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
  };

  const onCheckout = () => {
    const selected = items.filter(it => selectedIds.has(it.id));
    if (selected.length === 0) {
      alert('선택된 상품이 없습니다.');
      return;
    }
    console.log('결제항목:', selected);
    alert('결제 페이지로 이동합니다. (데모)');
  };

  return (
    <main className={styles.cartPage}>
      {/* 브레드크럼 */}
      <nav className={styles.breadcrumb}>
        <ol>
          <li className={styles.active}>01 장바구니</li>
          <li>02 주문서 작성/결제</li>
          <li>03 주문완료</li>
        </ol>
      </nav>

      <h2 className={styles.cartTitle}>장바구니</h2>

      <div className={styles.cartControls}>
        <button onClick={selectAll}>전체 선택</button>
        <button onClick={deselectAll}>선택 해제</button>
      </div>

      <section className={styles.cartGrid}>
        {items.map((it) => (
          <article key={it.id} id={`cart-item-${it.id}`} className={styles.cartItem}>
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
              <div className={styles.meta} style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                <span className={styles.listname}>상품명</span>
                <h3 className={styles.name} style={{color: "#fff", fontWeight: "400", fontSize: "1.2rem"}}>{it.name}</h3>
              </div>

              {/* 수량 */}
              <div className={styles.row} style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
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
                  />
                  <button type="button" onClick={() => inc(it.id)} aria-label="수량 증가">＋</button>
                </div>
              </div>

              {/* 옵션 */}
              <div className={styles.row} style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
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
              <div className={styles.row} style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                <span className={styles.listname} >금액</span>
                <div className={styles.lineTotal} style={{color: "#fff"}}>
                  {((it.price + it.extra) * it.qty).toLocaleString()}원
                </div>
              </div>

              {/* 액션 */}
              {/* <div className={styles.itemBtns}>
                <button type="button" onClick={() => removeOne(it.id)} className={styles.btnRemoveOne}>
                  삭제
                </button>
                <Link href={`/shop/${it.id}`} className={styles.btnDetail}>상세보기</Link>
              </div> */}
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className={styles.empty}>
            장바구니가 비었습니다. <Link href="/shop">쇼핑 계속하기 →</Link>
          </div>
        )}
      </section>

      {/* 합계 */}
      <div className={styles.cartSummary}>
        <p className={styles.summaryText}>
          총 상품금액 : <strong>{summary.productsTotal.toLocaleString()}원</strong>
          <span className={styles.plus}> + </span>
          무료배송
          <span className={styles.equals}> = </span>
          결제예정금액 : <strong>{summary.payment.toLocaleString()}원</strong>
        </p>

        <div className={styles.cartBtns}>
          <button className={styles.btnRemove} onClick={removeSelected}>선택상품 삭제하기</button>
          <button className={styles.btnPay} onClick={onCheckout}>결제하기</button>
        </div>
      </div>
    </main>
  );
}
