'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './farm.module.css';

const FARM_ID = 'farm-gyounggi-01';

export default function FarmBookingPage() {
const router = useRouter();

  // ===== 지도 상태 =====
  const [mapSrc, setMapSrc] = useState('/images/koreamap.png');
  const [activeCity, setActiveCity] = useState(null);

  const cityImages = {
    경기도: '/images/farm_gyunggi.jpg',
    강원도: '/images/farm_gangwon.jpg',
    충청남도: '/images/farm_chungnam.jpg',
    충청북도: '/images/farm_chungbuk.jpg',
    경상북도: '/images/farm_gyungbuk.jpg',
    경상남도: '/images/farm_gyungnam.jpg',
    전라북도: '/images/farm_junbuk.jpg',
    전라남도: '/images/farm_junnam.jpg',
    제주도: '/images/farm_jeju.jpg',
  };

  const handleCityClick = (city) => {
    if (activeCity === city) {
      setActiveCity(null);
      setMapSrc('/images/koreamap.png');
      return;
    }

    setActiveCity(city);
    setMapSrc(`/images/${city}_active.png`);
  };

  // ===== 예약 상태 =====
  const [farmName, setFarmName] = useState('');
  const [farmAddr, setFarmAddr] = useState('');
  const [reserver, setReserver] = useState('');
  const [phone, setPhone] = useState('');
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [agree, setAgree] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);

  const excludedDates = useMemo(
    () => disabledDates.map((d) => new Date(d + 'T00:00:00')),
    [disabledDates]
  );

  useEffect(() => {
    fetch(`/api/bookings?farmId=${FARM_ID}`)
      .then((r) => r.json())
      .then((d) => d.ok && setDisabledDates(d.disabledDates || []))
      .catch(console.error);
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!selectedDate) return alert('예약 날짜를 선택해 주세요.');
    if (!agree) return alert('개인정보 수집/이용에 동의해 주세요.');
    if (!reserver || !phone) return alert('예약자와 연락처를 입력해 주세요.');

    const userId = localStorage.getItem("userId") || "";


    const payload = {
      farmId: FARM_ID, // 내부 코드용 ID
      farmName,        // ✅ 실제 입력한 농장이름도 저장
      date: selectedDate,
      name: reserver,
      phone,
      adults: Number(adults || 0),
      kids: Number(kids || 0),
      memo: farmAddr, // 농장 주소
      userId,
    };

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((r) => r.json());

    if (!res.ok) {
      alert(res.error || '예약 실패');
      return;
    }

    setDisabledDates((prev) => [...new Set([...prev, payload.date])]);
    alert('예약 완료!');

      router.push("/myFarm"); // ✅ 예약 완료 후 마이팜으로 이동
  }


  return (
    <main className={styles.page}>
      <h1 className={styles.title}>주말 농장 예약하기</h1>

      {/* ===== 지도 영역 ===== */}
      <section className={styles.mapSection}>
        <div className={styles.mapWrap}>
          <div className={styles.krmap}>
            <img src={mapSrc} alt="korea map" />
            <div className={styles.citytitle}>
              {[
                '경기도', '강원도', '충청남도', '충청북도',
                '경상북도', '경상남도', '전라북도', '전라남도', '제주도'
              ].map(city => (
                <p
                  key={city}
                  onClick={() => handleCityClick(city)}
                  className={`${styles.city} ${activeCity === city ? styles.active : ''}`}
                >
                  {city}
                </p>
              ))}
            </div>
          </div>

          {/* 오른쪽 이미지 */}
          <div className={styles.currentmap}>
            <img
              src={activeCity ? cityImages[activeCity] : '/images/section2farmdu.png'}
              alt="region info"
            />
          </div>
        </div>
      </section>

      {/* ===== 예약 섹션 ===== */}
      <section className={styles.bookingSection}>
        <h2 className={styles.sectionHead}>농장예약</h2>

        <div className={styles.bookingGrid}>
          {/* 좌: 갤러리 */}
          <aside className={styles.gallery}>
            <div className={styles.heroImg} />
            <div className={styles.thumbs}>
              <div className={styles.thumb} />
              <div className={styles.thumb} />
              <div className={styles.thumb} />
              <div className={styles.thumb} />
            </div>
          </aside>

          {/* 우: 폼 */}
          <form className={styles.form} onSubmit={onSubmit}>
            <label>
              <span>농장이름</span>
              <input value={farmName} onChange={(e) => setFarmName(e.target.value)} placeholder="예) 리틀팜 체험농장" />
            </label>
            <label>
              <span>농장위치</span>
              <input value={farmAddr} onChange={(e) => setFarmAddr(e.target.value)} placeholder="예) 경기도 안성시 ○○로 505" />
            </label>
            <label>
              <span>예약자</span>
              <input value={reserver} onChange={(e) => setReserver(e.target.value)} placeholder="예약자 성함" />
            </label>
            <label>
              <span>예약날짜</span>
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                locale={ko}
                dateFormat="yyyy-MM-dd"
                placeholderText="날짜를 선택하세요"
                minDate={new Date()}
                excludeDates={excludedDates}
                className={styles.dateInput}
                calendarClassName={styles.calendar}
              />
            </label>
            <label>
              <span>연락처</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" />
            </label>

            <label className={styles.peopleRow}>
              <span>인원</span>
              <div className={styles.inputWithLabel} data-label="대인">
                <input type="number" min="0" value={adults} onChange={(e) => setAdults(e.target.value)} />
              </div>
              <div className={styles.inputWithLabel} data-label="소인">
                <input type="number" min="0" value={kids} onChange={(e) => setKids(e.target.value)} />
              </div>
            </label>
            <p>*만 15세 이하는 소인 적용됩니다.</p>

            <label className={styles.agreeBox}>
              <p>개인정보 수집동의</p>
              <div className={styles.agreeTextBox}>
                <p>
                  리틀팜은 예약 확인 및 원활한 체험 진행을 위해 아래의 개인정보를 수집·이용합니다.<br /><br />
                  1. 수집 항목: 예약자 성명, 연락처, 예약일자, 인원 정보<br />
                  2. 이용 목적: 예약 확인, 안내 및 고객 응대<br />
                  3. 보유 및 이용 기간: 체험 종료 후 1개월까지 보관 후 즉시 파기<br />
                  4. 이용자는 개인정보 수집·이용에 동의하지 않을 수 있으나, 이 경우 예약이 제한될 수 있습니다.<br /><br />
                  ※ 위 내용에 동의하시면 아래 체크박스를 선택해주세요.
                </p>
              </div>
              <div className={styles.checkbox}>
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                개인정보 수집/이용에 동의합니다.
              </div>
            </label>

            <button className={styles.cta} type="submit">예약하기</button>
          </form>
        </div>
      </section>
    </main>
  );
}
