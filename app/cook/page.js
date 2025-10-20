'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './cook.module.css';

export default function Cook() {
  const [showMore, setShowMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // ✅ 검색어 상태 추가

  // ✅ 카드 데이터 (title 포함)
  const cards = [
    { id: 1, img: '/images/main2img1.png', title: '1장 : 가지튀김', label: '1장' },
    { id: 2, img: '/images/main2img2.png', title: '2장 : 양파카레', label: '2장' },
    { id: 3, img: '/images/main2img3.png', title: '3장 : 채소쿠키', label: '3장' },
    { id: 4, img: '/images/main2img2.png', title: '4장 : 양파카레', label: '4장' },
    { id: 5, img: '/images/main2img3.png', title: '5장 : 채소쿠키', label: '5장' },
    { id: 6, img: '/images/main2img1.png', title: '6장 : 가지튀김', label: '6장' },
    { id: 7, img: '/images/main2img2.png', title: '7장 : 양파카레', label: '7장' },
    { id: 8, img: '/images/main2img1.png', title: '8장 : 가지튀김', label: '8장' },
  ];

  // ✅ 검색 필터 적용 (대소문자 무시)
  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ 보여줄 카드 (검색 후 showMore 여부에 따라 나누기)
  const visibleCards = showMore ? filteredCards : filteredCards.slice(0, 4);

  return (
    <main className={styles.cookSection}>
      {/* 소개 영역 */}
      <section className={styles.introBox}>
        <div className={styles.introContent}>
          <h2>“씨앗에서 식탁까지”</h2>
          <p>
            작은 농부로서의 하루를 직접 경험하며, 자연과 함께 성장하는 체험학습 프로그램입니다.<br />
            흙을 만지고 작물을 키우는 정성이 식탁 위 풍요로 이어지고,<br />
            그 과정 속에서 생명의 순환과 책임의 가치를 배웁니다.
          </p>
        </div>
      </section>

      {/* 타이틀 */}
      <section className={styles.titleArea}>
        <h3>씨앗에서 식탁까지</h3>
      </section>

      {/* 검색창 */}
      <section className={styles.searchWrap}>
        <div className={styles.character}></div>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="찾는 요리를 검색해팜듀!"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // ✅ 검색어 입력 감지
          />
        </div>
      </section>

      {/* 카드 리스트 */}
      <section className={`${styles.cardWrap} ${showMore ? styles.show : ''}`}>
        {visibleCards.length > 0 ? (
          <>
            {visibleCards.map((card) => (
              <motion.div
                key={card.id}
                className={styles.card}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Link href={`/cook/${card.id}`}>
                  <img src={card.img} alt={card.title} />
                  <span className={styles.label}>{card.title}</span>
                </Link>
              </motion.div>
            ))}
          </>
        ) : (
          <p className={styles.noResult}>검색 결과가 없습니다 😢</p>
        )}
      </section>

      {/* 버튼 */}
      {filteredCards.length > 4 && (
        <div
          className={`${styles.moreBtn} ${showMore ? styles.active : ''}`}
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? '닫기' : 'MORE'}
        </div>
      )}
    </main>
  );
}
