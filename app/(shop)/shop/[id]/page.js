// app/(shop)/shop/[id]/page.js
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// alias 없이 상대경로 사용
import { ALL_PRODUCTS, getProductById } from '../../../../lib/products';
import BackBtn from '../../../components/BackBtn';

import InfoPanel from './InfoPanel';
import InfoTabs from './InfoTabs';
import RelatedRail from './RelatedRail'; // ✅ 분리된 클라이언트 컴포넌트
import styles from './detail.module.css';

export function generateStaticParams() {
  return (ALL_PRODUCTS ?? []).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const product = getProductById(params.id);
  if (!product) return { title: '상품을 찾을 수 없음 | LittleFarmer' };
  return { title: `${product.name} | LittleFarmer` };
}

export default function ProductPage({ params }) {
  const product = getProductById(params.id);
  if (!product) return notFound();

  // 같은 접두어(id의 연속 영문)만 뽑아서 관련상품 구성 (자기 자신 제외)
  const prefix = product.id.match(/^[A-Za-z]+/)?.[0] ?? '';
  const related = (ALL_PRODUCTS ?? []).filter(
    (p) => p.id !== product.id && p.id.startsWith(prefix)
  );

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.noticeBar}>
          <Image
            src="/images/shop-hero2.png"
            alt="리틀파머 상세"
            fill
            className={styles.noticeImg}
            priority
          />
        </div>
        <h1 className={styles.title}>{product.name}</h1>
      </div>

      <section className={styles.top}>
        <div className={styles.topInner}>
          <div className={styles.gallery}>
            <div className={styles.mainImg}>
              <Image
                src={product.img}
                alt={product.name}
                fill
                className={styles.mainImage}
                priority
              />
            </div>

            <div className={styles.subImgs}>
              {(product.images ?? []).map((img, i) => (
                <div key={`${product.id}-sub-${i}`} className={styles.subImgBox}>
                  <Image
                    src={img}
                    alt={`${product.name} 서브이미지 ${i + 1}`}
                    fill
                    className={styles.subImg}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 상세 패널 (클라이언트 컴포넌트) */}
          <InfoPanel product={product} />
        </div>

        {/* 상세 탭 */}
        <InfoTabs details={product.details} />
      </section>

      {/* 뒤로가기 */}
      <div className={styles.backRow}>
        &lt; <BackBtn fallback="/shop" />
      </div>

      {/* 함께 보면 좋은 상품 */}
      {related.length > 0 && (
        <section className={styles.related}>
          <h3 className={styles.relatedTitle}>함께 보면 좋은 상품</h3>

          {/* ✅ 드래그/가로스크롤은 클라이언트 컴포넌트로 분리 */}
          <div className={styles.relatedBox}>
            <RelatedRail items={related} />
          </div>
        </section>
      )}
    </main>
  );
}
