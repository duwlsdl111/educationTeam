import { notFound } from 'next/navigation';
import { ALL_PRODUCTS, getProductById } from '../../../../lib/products';
import ProductClient from './ProductClient';

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

  // ✅ 클라이언트 래퍼로 위임 (토스트 포함)
  return <ProductClient product={product} related={related} />;
}