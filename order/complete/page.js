'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './complete.module.css';
import { ALL_PRODUCTS } from '../../../lib/products'; // ✅ 마스터로 보강

const CART_KEY_PRIMARY = 'lf_cart';
const CART_KEY_LEGACY = 'cart';
const LAST_ORDER_KEY = 'lf_last_order';
const CHECKOUT_FORM_KEY = 'lf_checkout_form';

const toNumber = (v) => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const n = Number(String(v ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

function fmtKR(d) {
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy} / ${mm} / ${dd}`;
}

export default function OrderCompletePage() {
  const router = useRouter();

  const [items, setItems] = useState([]); // [{id,name,price,qty,img}]
  const [form, setForm] = useState({
    receiver: '',
    addr1: '',
    addr2: '',
    phone: '',
    memo: '',
  });
  const [payment, setPayment] = useState(0);

  // 🔧 마스터로 보강하여 id/이름/가격/이미지 정규화
  const pmap = useMemo(() => {
    const m = new Map();
    for (const p of ALL_PRODUCTS) m.set(p.id, p);
    return m;
  }, []);

  const normalize = (list) => {
    return (Array.isArray(list) ? list : [])
      .map((it) => {
        const id = it.id ?? it.productId ?? it.pid;
        if (!id) return null;
        const base = pmap.get(id) || {};
        return {
          id,
          name: it.name ?? base.name ?? '상품',
          img: it.img ?? base.img ?? '/images/placeholder.png',
          price: toNumber(it.price ?? base.price ?? 0),
          qty: Math.max(1, toNumber(it.qty) || 1),
        };
      })
      .filter(Boolean);
  };

  // 데이터 불러오기: 우선 lf_last_order, 없으면 장바구니 폴백
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || 'null');
      if (saved && Array.isArray(saved.items)) {
        const norm = normalize(saved.items);
        setItems(norm);
        setPayment(toNumber(saved.payment) || norm.reduce((a, it) => a + it.price * it.qty, 0));
        setForm({
          receiver: saved.form?.receiver || '',
          addr1: saved.form?.addr1 || '',
          addr2: saved.form?.addr2 || '',
          phone: saved.form?.phone || '',
          memo: saved.form?.memo || '',
        });
        return;
      }
      // 폴백: 카트
      const cartPrimary = JSON.parse(localStorage.getItem(CART_KEY_PRIMARY) || '[]');
      const cartLegacy = JSON.parse(localStorage.getItem(CART_KEY_LEGACY) || '[]');
      const raw = Array.isArray(cartPrimary) ? cartPrimary : (Array.isArray(cartLegacy) ? cartLegacy : []);
      const norm = normalize(raw);
      setItems(norm);
      setPayment(norm.reduce((a, it) => a + it.price * it.qty, 0));
    } catch {
      setItems([]);
      setPayment(0);
    }
  }, [pmap]);

  const today = useMemo(() => new Date(), []);
  const shipStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d;
  }, []);

  // ✅ 브레드크럼 이동 전 상태 복원 (id 포함 그대로 저장)
  const restoreCart = () => {
    try {
      localStorage.setItem(CART_KEY_PRIMARY, JSON.stringify(items));              // 전체 저장
      const legacy = items.map((it) => ({ id: it.id, qty: it.qty ?? 1 }));        // 호환 저장
      localStorage.setItem(CART_KEY_LEGACY, JSON.stringify(legacy));
    } catch { }
  };
  const restoreCheckout = () => {
    try {
      localStorage.setItem(CART_KEY_PRIMARY, JSON.stringify(items));
      const legacy = items.map((it) => ({ id: it.id, qty: it.qty ?? 1 }));
      localStorage.setItem(CART_KEY_LEGACY, JSON.stringify(legacy));
      localStorage.setItem(CHECKOUT_FORM_KEY, JSON.stringify(form));              // 입력값 유지(선택)
    } catch { }
  };

  const gotoCart = (e) => {
    e.preventDefault();
    restoreCart();
    router.push('/cart');
  };
  const gotoCheckout = (e) => {
    e.preventDefault();
    restoreCheckout();
    router.push('/checkout');
  };

  // ✅ 주문 완료 시 MongoDB 저장
  useEffect(() => {
    const saveOrderToDB = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId || items.length === 0) return;

      try {
        const res = await fetch("/api/order/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            items,
            payment,
            form,
          }),
        });

        if (!res.ok) {
          console.error("❌ 주문 저장 실패:", await res.text());
        } else {
          console.log("✅ 주문이 MongoDB에 저장되었습니다!");
        }
      } catch (err) {
        console.error("❌ MongoDB 저장 중 오류:", err);
      }
    };

    saveOrderToDB();
  }, [items, payment, form]);

  return (
    <main className={styles.page}>
      {/* 브레드크럼 */}
      <nav className={styles.breadcrumb}>
        <ol>
          <li><a href="/cart" onClick={gotoCart}>01 팜두 주머니</a></li>
          <li><a href="/checkout" onClick={gotoCheckout}>02 주문서 작성/결제</a></li>
          <li className={styles.active}>03 주문완료</li>
        </ol>
      </nav>

      <h1 className={styles.title}>주문완료</h1>

      {/* 주문상품 정보 */}
      <section className={styles.section}>
        <h2 className={styles.sectionHead}>주문상품 정보</h2>

        <div className={styles.itemsGrid}>
          {items.map((it) => (
            <article key={it.id} className={styles.card}>
              <div className={styles.thumbWrap}>
                {/* ✅ 상품 상세로 이동할 수 있도록 id 링크 */}
                <Link href={`/shop/${it.id}`} className={styles.thumbLink} aria-label={`${it.name} 상세보기`}>
                  <img src={it.img} alt={it.name} className={styles.thumb} />
                </Link>
              </div>
              <div className={styles.info}>
                <div className={styles.badges}>
                  <span className={`${styles.badge} ${styles.badgeGreen}`}>구매수량</span>
                  <span className={styles.badgeValue}>{it.qty}개</span>
                </div>
                <div className={styles.badges}>
                  <span className={`${styles.badge} ${styles.badgeGreen}`}>개별가</span>
                  <span className={styles.badgeValue}>{it.price.toLocaleString()}원</span>
                </div>
                <div className={styles.badges}>
                  <span className={`${styles.badge} ${styles.badgeGreen}`}>상품명</span>
                  {/* ✅ 상품명도 링크 */}
                  <Link href={`/shop/${it.id}`} className={styles.nameLink}>{it.name}</Link>
                </div>
              </div>
            </article>
          ))}

          {items.length === 0 && (
            <div className={styles.empty}>표시할 주문 상품이 없습니다.</div>
          )}
        </div>

        <div className={styles.metaRowWrap}>
          <div className={styles.metaRow}>
            <span>{fmtKR(today)} 결제 완료</span>
            <span className={styles.right}>최종 결제 금액</span>
          </div>
          <div className={styles.metaRow}>
            <span>{fmtKR(shipStart)} 이내 배송 시작</span>
            <strong className={styles.finalPrice}>= {payment.toLocaleString()}원</strong>
          </div>
        </div>
      </section>

      {/* 결제정보 */}
      <section className={styles.section}>
        <h2 className={styles.sectionHead}>결제정보</h2>
        <div className={styles.infoTable}>
          <div className={styles.infoRow}>
            <div className={styles.infoKey}>수령인</div>
            <div className={styles.infoVal}>{form.receiver || '—'}</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoKey}>배송지</div>
            <div className={styles.infoVal}>
              {form.addr1 ? `${form.addr1}${form.addr2 ? ' ' + form.addr2 : ''}` : '—'}
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoKey}>연락처</div>
            <div className={styles.infoVal}>{form.phone || '—'}</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoKey}>배송시 요청사항</div>
            <div className={styles.infoVal}>{form.memo || '—'}</div>
          </div>
        </div>
      </section>

      <div className={styles.actions}>
        <Link href="/shop" className={styles.btnGhost}>쇼핑 계속하기</Link>
        <Link href="/myFarm" className={styles.btnPrimary}>마이팜 가기</Link>
      </div>
    </main>
  );
}
