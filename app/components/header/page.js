'use client';
import Link from 'next/link';
import styles from './header.module.css';

export default function Header() {
  return (
    <div className={styles.header}>
        {/* 헤더 좌측 영역 */}
      <div className={styles.left}>
        <Link href="/"><img src="/images/logo.png" /></Link>
      </div>
      {/* 헤더 우측영역 */}
      <div className={styles.right}>
        {/* 검색 로그인 회원가입 */}
        <ul className={styles.log}>
            <Link href="/cart">팜두주머니</Link>
            <li>|</li>
            <Link href="/">로그인</Link>
            <li>|</li>
            <Link href="/">회원가입</Link>
        </ul>
        {/* 내비게이션 */}
        <ul className={styles.nav}>
            <Link href="/">교육영상</Link>
            <Link href="/shop">지원사업</Link>
            <Link href="/">요리교실</Link>
            <Link href="/">농장예약</Link>
            <Link href="/">마이팜</Link>
            <Link href="/">FAQ</Link>
        </ul>
      </div>
    </div>
  );
}