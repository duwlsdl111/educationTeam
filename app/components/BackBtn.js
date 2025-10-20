'use client';

import { useRouter } from 'next/navigation';

export default function BackBtn({ fallback = '/shop', className = '' }) {
  const router = useRouter();
  const onBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push(fallback);
  };
  return (
    <button type="button" onClick={onBack} className={className}>
      뒤로가기
    </button>
  );
}