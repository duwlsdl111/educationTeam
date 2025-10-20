'use client';

import { useState, useMemo } from 'react';
import styles from './detail.module.css';

const TABS = [
  { key: 'comp', label: '구성' },
  { key: 'info', label: '상품정보' },
  { key: 'refund', label: '반품/환불' },
];

const FALLBACK_DETAILS = {
  comp: {
    title: '씨앗 5종',
    list: [
      ['로메인', '베란다에서도 잘 자라는 상추류.'],
      ['상추', '생장 빠르고 초보도 수월.'],
      ['엔다이브', '쌉싸름한 식감, 샐러드용.'],
      ['와일드 루꼴라', '향 강하고 수확 주기 짧음.'],
      ['청경채', '다양한 환경에서 잘 자람.'],
    ],
  },
  info: [
    ['발아온도', '18~24℃'],
    ['물주기', '겉흙 마르면 충분히'],
    ['구성품', '씨앗 5종, 가이드, 라벨'],
  ],
  refund: [
    ['배송', '평일 14시 이전 주문 당일 출고'],
    ['교환/반품', '수령 후 7일 이내 가능'],
    ['유의', '개봉/훼손 시 어려울 수 있음'],
  ],
};

export default function InfoTabs({ details }) {
  const [tab, setTab] = useState('comp');

  const safe = useMemo(() => ({
    comp: details?.comp ?? FALLBACK_DETAILS.comp,
    info: details?.info ?? FALLBACK_DETAILS.info,
    refund: details?.refund ?? FALLBACK_DETAILS.refund,
  }), [details]);

  // comp.title이 배열로 들어와도 문자열로 보장
  const compTitle =
    Array.isArray(safe.comp?.title) ? safe.comp.title.join(' · ') : (safe.comp?.title ?? '구성');

  return (
    <div className={styles.infoInner}>
      <div className={styles.infoTabBtn} role="tablist" aria-label="상품 상세 탭">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`${styles.tabBtn} ${tab === t.key ? styles.tabActive : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.infoText}>
        {tab === 'comp' && safe.comp && (
          <>
            <h3 className={styles.infoTitle}>{compTitle}</h3>
            <ul className={styles.bullets}>
              {(safe.comp.list ?? []).map(([name, desc], i) => (
                <li key={`${name}-${i}`}>
                  <b>{name}</b> — {desc}
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === 'info' && safe.info && (
          <ul className={styles.metaList}>
            {safe.info.map(([label, value], i) => (
              <li key={`${label}-${i}`}>
                <b>{label}</b> {value}
              </li>
            ))}
          </ul>
        )}

        {tab === 'refund' && safe.refund && (
          <ul className={styles.metaList}>
            {safe.refund.map(([label, value], i) => (
              <li key={`${label}-${i}`}>
                <b>{label}</b> {value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
