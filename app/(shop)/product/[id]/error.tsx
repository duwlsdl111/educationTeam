// app/(shop)/product/[id]/error.tsx
'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: 24 }}>
      <h2>문제가 발생했어요 😵</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error?.message || error)}</pre>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
}
