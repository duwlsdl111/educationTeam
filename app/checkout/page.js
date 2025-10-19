'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './checkout.module.css';

// 제품 마스터 (id만 있을 때 name/price/img 보강)
import { ALL_PRODUCTS } from '../../lib/products';

// 로컬스토리지 키
const CART_KEY_PRIMARY = 'lf_cart';
const CART_KEY_LEGACY = 'cart'; // 과거 키 폴백
const LAST_ORDER_KEY = 'lf_last_order';

// 숫자 안전 변환 ("17,000원" -> 17000)
const toNumber = (v) => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const n = Number(String(v ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

// 통화 포맷
const fmtKRW = (n) => (Number.isFinite(n) ? n.toLocaleString() : '0');

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState([]); // [{id, name, price, qty, img}]
  const [form, setForm] = useState({
    orderer: '',
    receiver: '',
    phone: '',
    zipcode: '',
    addr1: '',
    addr2: '',
    memo: '',
  });

  // 주문자 동일 토글
  const [isSame, setIsSame] = useState(false);

  // 결제수단
  const [payMethod, setPayMethod] = useState('');

  // 토스트
  const [toast, setToast] = useState(null); // { message, action? }
  const toastTimer = useRef(null);
  const showToast = (message, action = null, ms = 4000) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, action });
    toastTimer.current = setTimeout(() => setToast(null), ms);
  };
  useEffect(() => () => toastTimer.current && clearTimeout(toastTimer.current), []);

  useEffect(() => {
  try {
    const savedForm = JSON.parse(localStorage.getItem('lf_checkout_form') || 'null');
    if (savedForm && typeof savedForm === 'object') {
      setForm((f) => ({ ...f, ...savedForm })); // 기존 값 위에 덮어쓰기
    }
  } catch {}
}, []);

  // ✅ 장바구니 or 바로구매 로드
  useEffect(() => {
    // 제품 맵
    const pmap = new Map();
    for (const p of ALL_PRODUCTS) pmap.set(p.id, p);

    const pid = searchParams.get('pid');
    const qtyParam = searchParams.get('qty');
    const optParam = searchParams.get('opt') || ''; // 선택 옵션값(문자열)

    if (pid) {
      // ----- 바로구매 모드 -----
      const p = pmap.get(pid);
      if (!p) {
        setItems([]);
        return;
      }

      // 옵션 추가금 계산
      const potOptions = (p.ui?.potOptions ?? []).map((o) =>
        typeof o === 'string'
          ? { value: o, label: o, extra: 0 }
          : { value: o.value, label: o.label, extra: Number(o.extra || 0) }
      );
      const activeOpt = potOptions.find((o) => o.value === optParam);
      const extra = activeOpt?.extra ?? 0;

      const qty = Math.max(1, toNumber(qtyParam) || 1);
      const basePrice = toNumber(p.price);
      const priceWithOpt = basePrice + extra;

      setItems([
        {
          id: p.id,
          name: p.name + (activeOpt ? ` (${activeOpt.label})` : ''),
          img: p.img,
          price: priceWithOpt, // 옵션가 포함
          qty,
        },
      ]);
      return;
    }

    // ----- 장바구니 모드 -----
    try {
      const rawPrimary = JSON.parse(localStorage.getItem(CART_KEY_PRIMARY) || 'null');
      const rawLegacy  = JSON.parse(localStorage.getItem(CART_KEY_LEGACY)  || 'null');

      const raw = Array.isArray(rawPrimary)
        ? rawPrimary
        : (Array.isArray(rawLegacy) ? rawLegacy : []);

      if (!Array.isArray(raw) || raw.length === 0) {
        setItems([]);
        return;
      }

      const enriched = raw
        .map((it) => {
          const id  = it.id ?? it.productId ?? it.pid;
          const qty = Math.max(1, toNumber(it.qty) || 1);

          if (it.name && it.price != null && it.img) {
            return { id, name: it.name, img: it.img, price: toNumber(it.price), qty };
          }
          const p = pmap.get(id);
          if (!p) return null;
          return { id, name: p.name, img: p.img, price: toNumber(p.price), qty };
        })
        .filter(Boolean);

      setItems(enriched);
    } catch (e) {
      console.error(e);
      setItems([]);
    }
  }, [searchParams]);

  // 요약
  const summary = useMemo(() => {
    const itemsSafe = Array.isArray(items) ? items : [];

    const productsTotal = itemsSafe.reduce((acc, it) => {
      const price = toNumber(it?.price);
      const qty = Math.max(1, toNumber(it?.qty) || 1);
      return acc + price * qty;
    }, 0);

    const countKinds = itemsSafe.length;
    const countQty = itemsSafe.reduce(
      (acc, it) => acc + Math.max(1, toNumber(it?.qty) || 1),
      0
    );
    const shipping = 0;

    // 1개일 때는 "외 n개" 문구 제외
    let title = '-';
    if (countKinds === 1) title = itemsSafe[0].name;
    else if (countKinds > 1) title = `${itemsSafe[0].name} 외 ${countKinds - 1}개`;

    return {
      title,
      productsTotal,
      shipping,
      payment: productsTotal + shipping,
      countKinds,
      countQty,
    };
  }, [items]);

  // 폼 핸들러
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === 'receiver' && isSame) setIsSame(false);
  };

  // 주문자 동일 토글
  const toggleSame = () => {
    setIsSame((prev) => {
      const next = !prev;
      setForm((f) => ({ ...f, receiver: next ? (f.orderer || '') : '' }));
      return next;
    });
  };
  useEffect(() => {
    if (isSame) setForm((f) => ({ ...f, receiver: f.orderer || '' }));
  }, [isSame, form.orderer]);

  // 제출 → 저장하고 완료로 이동
  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.orderer || !form.receiver || !form.phone || !form.addr1) {
      showToast('⚠️ 필수 정보를 모두 입력해주세요.');
      return;
    }
    if (!payMethod) {
      showToast('💳 결제수단을 선택해주세요.');
      return;
    }

    const orderPayload = {
      items,
      form,
      payment: summary.payment,
      payMethod,
      orderedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(orderPayload));
      localStorage.removeItem(CART_KEY_PRIMARY);
      localStorage.removeItem(CART_KEY_LEGACY);
    } catch (err) {
      console.error('Failed to persist order:', err);
    }

    router.push('/order/complete');
  };

  const searchZip = () => {
    showToast('📦 우편번호 검색 모달이 연결될 예정입니다.');
  };

  return (
    <main className={styles.checkoutPage}>
      {/* 브레드크럼 */}
      <nav className={styles.breadcrumb}>
        <ol>
          <li><Link href="/cart">01 팜두 주머니</Link></li>
          <li className={styles.active}>02 주문서 작성/결제</li>
          <li>03 주문완료</li>
        </ol>
      </nav>

      <h1 className={styles.checkoutTitle}>주문서 작성 / 결제</h1>

      <form className={styles.form} onSubmit={onSubmit}>
        {/* 배송정보 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>배송정보</h2>

          <div className={styles.formRow}>
            <label htmlFor="orderer">주문인</label>
            <input
              id="orderer"
              name="orderer"
              value={form.orderer}
              onChange={onChange}
              placeholder="주문자 성함을 적어주세요."
              required
            />
          </div>

          <div className={styles.formRow}>
            <label htmlFor="receiver">수령인</label>
            <div className={styles.inputWrap}>
              <input
                id="receiver"
                className={styles.input}
                name="receiver"
                value={form.receiver}
                onChange={onChange}
                placeholder="수령인 성함을 적어주세요."
                required
              />
              <button
                type="button"
                className={`${styles.inlineToggle} ${isSame ? styles.on : ''}`}
                onClick={toggleSame}
                aria-pressed={isSame}
                title="주문자와 동일"
              >
                <span className={styles.dot} />
                <span className={styles.toggleText}>주문자와 동일</span>
              </button>
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="phone">연락처</label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="010 - 0000 - 0000"
              inputMode="tel"
              required
            />
          </div>

          <div className={styles.formRow}>
            <label htmlFor="zipcode">우편번호 검색</label>
            <div className={styles.inline}>
              <input
                id="zipcode"
                name="zipcode"
                value={form.zipcode}
                onChange={onChange}
                placeholder="우편번호"
                required
              />
              <button type="button" className={styles.miniPrimary} onClick={searchZip}>
                우편번호 검색
              </button>
            </div>
          </div>

          <div className={styles.formRow}>
            <label htmlFor="addr1">배송지</label>
            <input
              id="addr1"
              name="addr1"
              value={form.addr1}
              onChange={onChange}
              placeholder="주소"
              required
            />
          </div>

          <div className={styles.formRow}>
            <label htmlFor="addr2" aria-hidden="true"></label>
            <input
              id="addr2"
              name="addr2"
              value={form.addr2}
              onChange={onChange}
              placeholder="상세 주소"
            />
          </div>

          <div className={styles.formRow}>
            <label htmlFor="memo">배송 요청 사항</label>
            <select id="memo" name="memo" value={form.memo} onChange={onChange}>
              <option value="">입력(선택)</option>
              <option value="문앞에 놓아주세요">문앞에 놓아주세요</option>
              <option value="부재시 경비실에 맡겨주세요">부재시 경비실에 맡겨주세요</option>
              <option value="배송 전 연락 부탁드립니다">배송 전 연락 부탁드립니다</option>
            </select>
          </div>
        </section>

        {/* 결제정보 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>결제정보</h2>
          <div className={styles.summaryRow}>
            <span>상품명</span>
            <strong>{summary.title}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>총 상품 금액</span>
            <strong>{fmtKRW(summary.productsTotal)}원</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>배송비</span>
            <strong>무료배송</strong>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>총 결제 금액</span>
            <strong className={styles.totalPrice}>{fmtKRW(summary.payment)}원</strong>
          </div>
        </section>

        {/* 결제수단 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>결제수단</h2>
          <div className={styles.payGrid}>
            {[
              { id: 'card', label: '신용/체크카드' },
              { id: 'toss', img: '/images/toss.png', alt: 'toss 결제' },
              { id: 'naver', img: '/images/naverpay.png', alt: 'N Pay 결제' },
              { id: 'payco', img: '/images/payco.png', alt: 'PAYCO 결제' },
              { id: 'bank', label: '무통장 입금' },
              { id: 'phone', label: '휴대폰 결제' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPayMethod(p.id)}
                className={`${styles.payBtn} ${payMethod === p.id ? styles.payBtnAccent : ''}`}
                aria-pressed={payMethod === p.id}
              >
                {p.img ? (
                  <img src={p.img} alt={p.alt} className={styles.payLogo} />
                ) : (
                  p.label
                )}
              </button>
            ))}
          </div>

          <div className={styles.notice}>
            <p>유의사항</p>
            <p>본인은 만 14세 이상이며, 주문 내용을 확인하였습니다.</p>
            <p>㈜리틀파머는 직접 상품을 제조·판매하는 사업자로서, 상품정보 및 거래에 대한 책임을 부담합니다.</p>
            <p>미성년자가 부모(법정대리인)의 동의 없이 구매한 경우, 관련 법률에 따라 계약이 취소될 수 있습니다.</p>
          </div>

          <div className={styles.actionBar}>
            <Link href="/cart" className={styles.btnGhost}>장바구니 가기</Link>
            <button type="submit" className={styles.btnPrimary}>결제하기</button>
          </div>
        </section>
      </form>

      {/* 토스트 */}
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
