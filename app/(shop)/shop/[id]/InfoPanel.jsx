'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './detail.module.css';

const LS_KEY = 'cart';          // [{ id, qty }]
const LS_OPT_KEY = 'cart_opts'; // { [id]: "선택값" }

export default function InfoPanel({ product, onToast }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [optValue, setOptValue] = useState('');

  // CartPage와 동일 포맷의 옵션 맵핑
  const potOptions = useMemo(() => {
    return (product?.ui?.potOptions ?? []).map(o => {
      if (typeof o === 'string') return { value: o, label: o, extra: 0 };
      return { value: o.value, label: o.label, extra: Number(o.extra || 0) };
    });
  }, [product]);

  const onAddToCart = () => {
    try {
      // 1) 장바구니 읽기
      const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : '[]';
      const cart = Array.isArray(JSON.parse(raw || '[]')) ? JSON.parse(raw || '[]') : [];

      // 2) 같은 상품 있으면 수량만 증가
      const idx = cart.findIndex((c) => c.id === product.id);
      const addQty = Math.max(1, Math.min(99, Number(qty) || 1));
      if (idx >= 0) {
        cart[idx].qty = Math.min(99, (Number(cart[idx].qty) || 1) + addQty);
      } else {
        cart.push({ id: product.id, qty: addQty });
      }
      localStorage.setItem(LS_KEY, JSON.stringify(cart));

      // 3) 옵션 저장(선택 시)
      if (optValue) {
        const rawOpt = typeof window !== 'undefined' ? localStorage.getItem(LS_OPT_KEY) : '{}';
        const opts = JSON.parse(rawOpt || '{}');
        opts[product.id] = optValue;
        localStorage.setItem(LS_OPT_KEY, JSON.stringify(opts));
      }

      // 4) 토스트 + /cart?id= 로 이동 액션
      onToast?.({
        message: '🌱 팜두 주머니에 담았습니다! 보러갈까요?',
        action: () => router.push(`/cart?id=${product.id}`),
      });
    } catch (e) {
      console.error(e);
      onToast?.({ message: '장바구니 담기에 실패했어요. 잠시 후 다시 시도해주세요.' });
    }
  };

  const onBuyNow = () => {
    onToast?.({
      message: '바로 결제 페이지로 이동할까요?',
      action: () =>
        router.push(
          `/checkout?pid=${product.id}&qty=${qty}${optValue ? `&opt=${encodeURIComponent(optValue)}` : ''}`
        ),
    });
  };

  const compList = product?.details?.comp?.list ?? product?.items ?? [];
  const shippingLine = product?.ui?.shippingText
    ? product.ui.shippingText
    : `배송 방법 : 택배  |  배송비 : ${product?.ui?.shippingFee ?? '무료배송'}`;

  return (
    <aside className={styles.info}>
      <h2 className={styles.infoTitle} style={{ fontSize: '1.5rem' }}>
        {product?.cat ?? '상품'}
      </h2>
      <p className={styles.priceMain}>{(product?.price ?? 0).toLocaleString()}원</p>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>구성 상품</h3>
        <ul className={styles.bullets}>
          {compList.map((it, i) => {
            const name = Array.isArray(it) ? it[0] : it?.name ?? String(it);
            const en = Array.isArray(it) ? it[1] : it?.en;
            return (
              <li key={`${name}-${i}`}>
                <span className={styles.bulletDot}>•</span>
                <span className={styles.bulletText}>
                  {name}{en ? <span className={styles.en}> {en}</span> : null}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 옵션 */}
      <div className={styles.selectRow}>
        <label htmlFor="addon" className={styles.selectLabel}>흙과 화분 추가</label>
        <select
          id="addon"
          className={styles.select}
          value={optValue}
          onChange={(e) => setOptValue(e.target.value)}
        >
          <option value="">흙과 화분 추가 (선택)</option>
          {potOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}{opt.extra ? ` (+${opt.extra.toLocaleString()}원)` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* 수량 */}
      <div className={styles.qtyWrap}>
        <span className={styles.qtyLabel}>수량</span>
        <div className={styles.qtyBox}>
          <button type="button" aria-label="감소" onClick={() => setQty((q) => Math.max(1, q - 1))}>–</button>
          <input readOnly value={qty} aria-live="polite" />
          <button type="button" aria-label="증가" onClick={() => setQty((q) => Math.min(99, q + 1))}>+</button>
        </div>
      </div>

      {/* 합계 */}
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>총 상품금액({qty}개)</span>
        <strong className={styles.totalPrice}>
          {((product?.price ?? 0) * qty).toLocaleString()}원
        </strong>
      </div>

      <p className={styles.shipNote}>{shippingLine}</p>

      {/* CTA */}
      <div className={styles.ctaBar}>
        <button type="button" className={styles.btnCart} onClick={onAddToCart}>장바구니</button>
        <button type="button" className={styles.btnPay} onClick={onBuyNow}>결제하기</button>
      </div>
    </aside>
  );
}
