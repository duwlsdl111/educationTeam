const seedBox = {
  id: "seed-box",
  title: "그린 셀렉트 씨앗 박스",
  price: 2900,
  badges: ["NEW", "베란다 재배", "쉬운 난이도"],
  gallery: [
    { id: 1, src: "/images/products/seed-01.png", alt: "패키지 정면" },
    { id: 2, src: "/images/products/seed-02.png", alt: "구성품" },
    { id: 3, src: "/images/products/seed-03.png", alt: "사용 예시" },
    { id: 4, src: "/images/products/seed-04.png", alt: "디테일" },
  ],
  meta: [
    { label: "구성", value: "씨앗 3종" },
    { label: "발아율", value: "85% 이상" },
    { label: "재배", value: "실내/베란다 가능" },
    { label: "동봉", value: "초보 가이드, 라벨 스티커" },
  ],
  detail: {
    heading: "씨앗 등록 · 초보자에게도 딱 맞아요.",
    body:
      "봄/가을 모두 재배 가능한 다품종 구성으로 베란다 환경에서도 잘 자랍니다. " +
      "동봉된 가이드를 따라 물·빛·온도만 지켜주면 발아가 쉬워요.",
    bullets: [
      "발아 최적 온도: 18~24℃",
      "물 주기: 겉흙이 마르면 충분히",
      "추천 토양 pH: 6.0~6.5",
    ],
  },

  related: [
    {
      id: "case-01",
      title: "씨앗 보관 케이스",
      price: 3900,
      thumb: { src: "/images/products/seed-01.png", alt: "보관 케이스 썸네일" },
      href: "#",
    },
    {
      id: "label-01",
      title: "식물 라벨 스티커",
      price: 1900,
      thumb: { src: "/images/products/seed-02.png", alt: "라벨 스티커 썸네일" },
      href: "#",
    },
  ],
};

export default seedBox;
