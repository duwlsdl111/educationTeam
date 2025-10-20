'use client';

import { useState } from 'react';
import styles from './detail.module.css';

export default function InfoPanel({ product }) {
  const [qty, setQty] = useState(1);

  const onAddToCart = () => {
    try {
      const key = 'lf_cart';
      const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : '[]';
      const cart = JSON.parse(raw || '[]');

      const idx = cart.findIndex((c) => c.id === product.id);
      if (idx >= 0) cart[idx].qty += qty;
      else cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        qty,
      });

      localStorage.setItem(key, JSON.stringify(cart));
      alert('팜두 주머니에 담았습니다! 보러갈까요?');
    } catch (e) {
      console.error(e);
      alert('장바구니 담기에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const onBuyNow = () => {
    alert('바로구매 플로우로 이동합니다.');
    // e.g., router.push(`/checkout?pid=${product.id}&qty=${qty}`)
  };

  const compList = product?.details?.comp?.list ?? product?.items ?? [];

  // 배송 문구: 전체 문자열이 제공되면 그대로, 없으면 기본값 구성
  const shippingLine = product?.ui?.shippingText
    ? product.ui.shippingText
    : `배송 방법 : 택배  |  배송비 : ${product?.ui?.shippingFee ?? '무료배송'}`;

  return (
    <aside className={styles.info}>
      {/* 제목 & 가격 */}
      <h2 className={styles.infoTitle} style={{ fontSize: '1.5rem' }}>
        {product?.cat ?? '상품'}
      </h2>
      <p className={styles.priceMain}>
        {(product?.price ?? 0).toLocaleString()}원
      </p>

      {/* 구성 상품 */}
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

      {/* 선택 셀렉트 */}
      <div className={styles.selectRow}>
        <label htmlFor="addon" className={styles.selectLabel}>흙과 화분 추가</label>
        <select id="addon" className={styles.select} defaultValue="">
          <option value="">흙과 화분 추가 (선택)</option>
          {(product?.ui?.potOptions ?? []).map((opt) => (
            <option key={opt.value ?? opt.label} value={opt.value ?? opt.label}>
              {opt.label ?? String(opt)}
            </option>
          ))}
        </select>
      </div>

      {/* 수량 */}
      <div className={styles.qtyWrap}>
        <span className={styles.qtyLabel}>수량</span>
        <div className={styles.qtyBox}>
          <button
            type="button"
            aria-label="감소"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            –
          </button>
          <input readOnly value={qty} aria-live="polite" />
          <button
            type="button"
            aria-label="증가"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
          >
            +
          </button>
        </div>
      </div>

      {/* 합계 */}
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>총 상품금액({qty}개)</span>
        <strong className={styles.totalPrice}>
          {((product?.price ?? 0) * qty).toLocaleString()}원
        </strong>
      </div>

      {/* 배송 문구 */}
      <p className={styles.shipNote}>{shippingLine}</p>

      {/* CTA */}
      <div className={styles.ctaBar}>
        <button type="button" className={styles.btnCart} onClick={onAddToCart}>
          장바구니
        </button>
        <button type="button" className={styles.btnPay} onClick={onBuyNow}>
          결제하기
        </button>
      </div>
    </aside>
  );
}
