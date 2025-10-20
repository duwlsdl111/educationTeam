'use client';

import { useParams } from 'next/navigation';
import styles from './cookDetail.module.css';

export default function CookDetail() {
  const { id } = useParams();

  // ✅ id 값별로 데이터 분리
  const recipes = {
    1: {
      title: '"가지 튀김"',
      date: '2025.10.02 작성',
      views: '조회수 : 255회',
      images: [
        '/images/cook-detail1-1.png',
        '/images/cook-detail1-2.png',
        '/images/cook-detail1-3.png',
        '/images/cook-detail1-4.png',
        '/images/cook-detail1-5.png',
      ],
      paragraphs: [
        '오늘은 드디어 가지를 수확하는 날! 가지 열매가 무성하게 자라니 "이제 됐다!" 싶었어요. \n조심스럽게 잎을 잡고 쑥 하고 뽑았더니, 보라색 가지가 툭 하고 떨어지는 순간이 너무 즐거웠어요.',
        '집에 와서 가지를 씻고 엄마가 가지를 썰어주셨어요. \n그 후 올리브오일, 소금 간을 약간 해주고',
        '에어프라이어에서 10~15분 잘 돌려가며 구워줬어요!',
        '평소에는 가지를 잘 먹지 않았는데, 내가 직접 기른 가지라 그런지 너무 맛있게 잘 먹었어요! \n 아빠도 "우리 딸이 키운 가지라 그런지 훨씬 맛있네" 라고 해주셔서 뿌듯했어요. \n 오늘은 내가 작은 농부이자 요리사였던 하루였어요:)',
      ],
    },
    2: {
      title: '"양파 카레"',
      date: '2025.10.03 작성',
      views: '조회수 : 312회',
      images: [
        '/images/cook-detail2-1.png',
        '/images/cook-detail2-2.png',
        '/images/cook-detail2-3.png',
        '/images/cook-detail2-4.png',
      ],
      paragraphs: [
        '며칠 전부터 양파 잎이 점점 쓰러져서 엄마가 ‘이제 뽑아도 되겠다’고 하셨어요. \n그래서 흙을 파고 땅을 살짝 흔드니까, 동그란 양파가 불쑥 올라왔어요.',
        '양파를 씻고 칼로 자르는데 눈물이 조금 나서 ‘아, 진짜 양파구나’ 싶었어요. \n하지만 눈물이 났어도 신기하고 기분이 좋았어요!',
        '엄마랑 같이 양파를 넣고 카레를 만들었는데, \n노란 카레 속에서 내가 키운 양파가 보글보글 끓고 있는 걸 보니 마치 내가 요리를 완성한 것 같았어요. \n내가 키운 양파가 카레 속 주인공이 된 것 같아서 너무 자랑스러웠어요!!!',
      ],
    },
    3: {
      title: '"채소 쿠키"',
      date: '2025.10.17 작성',
      views: '조회수 : 1212회',
      images: [
        '/images/cook-detail3-1.png',
        '/images/cook-detail3-2.png',
        '/images/cook-detail3-3.png',
        '/images/cook-detail3-4.png',
        '/images/cook-detail3-5.png',
      ],
      paragraphs: [
        '주말농장 에서 키운 감자와 채소들을 드디어 캐냈어요. \n이 채소들을 어떻게 먹을까 하다가, 엄마랑 상의해서 특별하게 ‘채소 쿠키’를 만들어 보기로 했어요.',
        '엄마는 밀가루랑 버터, 설탕을 준비해 주셨고, 나는 갈아놓은 채소들을 반죽 속에 넣었어요.',
        '오븐 속에 쿠키가 구워지면서 달콤한 냄새와 은근한 당근 향이 집 안 가득 퍼졌어요! \n드디어 오븐에서 꺼낸 채소 쿠키! 겉에 초콜릿 펜으로 눈코입도 만들어줬어요!',
        '내가 직접 땅에서 기른 채소로 만든 쿠키라서 정말 특별하게 느껴졌고, \n엄마,아빠도 ‘네가 만든 게 세상에서 제일 맛있다’고 하셔서 하루 종일 행복했어요!',
      ],
    },
    4: {
      title: '"양파 카레"',
      date: '2025.10.03 작성',
      views: '조회수 : 312회',
      images: [
        '/images/cook-detail2-1.png',
        '/images/cook-detail2-2.png',
        '/images/cook-detail2-3.png',
        '/images/cook-detail2-4.png',
      ],
      paragraphs: [
        '며칠 전부터 양파 잎이 점점 쓰러져서 엄마가 ‘이제 뽑아도 되겠다’고 하셨어요. \n그래서 흙을 파고 땅을 살짝 흔드니까, 동그란 양파가 불쑥 올라왔어요.',
        '양파를 씻고 칼로 자르는데 눈물이 조금 나서 ‘아, 진짜 양파구나’ 싶었어요. \n하지만 눈물이 났어도 신기하고 기분이 좋았어요!',
        '엄마랑 같이 양파를 넣고 카레를 만들었는데, \n노란 카레 속에서 내가 키운 양파가 보글보글 끓고 있는 걸 보니 마치 내가 요리를 완성한 것 같았어요. \n내가 키운 양파가 카레 속 주인공이 된 것 같아서 너무 자랑스러웠어요!!!',
      ],
    },
    5: {
      title: '"채소 쿠키"',
      date: '2025.10.17 작성',
      views: '조회수 : 1212회',
      images: [
        '/images/cook-detail3-1.png',
        '/images/cook-detail3-2.png',
        '/images/cook-detail3-3.png',
        '/images/cook-detail3-4.png',
        '/images/cook-detail3-5.png',
      ],
      paragraphs: [
        '주말농장 에서 키운 감자와 채소들을 드디어 캐냈어요. \n이 채소들을 어떻게 먹을까 하다가, 엄마랑 상의해서 특별하게 ‘채소 쿠키’를 만들어 보기로 했어요.',
        '엄마는 밀가루랑 버터, 설탕을 준비해 주셨고, 나는 갈아놓은 채소들을 반죽 속에 넣었어요.',
        '오븐 속에 쿠키가 구워지면서 달콤한 냄새와 은근한 당근 향이 집 안 가득 퍼졌어요! \n드디어 오븐에서 꺼낸 채소 쿠키! 겉에 초콜릿 펜으로 눈코입도 만들어줬어요!',
        '내가 직접 땅에서 기른 채소로 만든 쿠키라서 정말 특별하게 느껴졌고, \n엄마,아빠도 ‘네가 만든 게 세상에서 제일 맛있다’고 하셔서 하루 종일 행복했어요!',
      ],
    },
    6: {
      title: '"가지 튀김"',
      date: '2025.10.02 작성',
      views: '조회수 : 255회',
      images: [
        '/images/cook-detail1-1.png',
        '/images/cook-detail1-2.png',
        '/images/cook-detail1-3.png',
        '/images/cook-detail1-4.png',
        '/images/cook-detail1-5.png',
      ],
      paragraphs: [
        '오늘은 드디어 가지를 수확하는 날! 가지 열매가 무성하게 자라니 "이제 됐다!" 싶었어요. \n조심스럽게 잎을 잡고 쑥 하고 뽑았더니, 보라색 가지가 툭 하고 떨어지는 순간이 너무 즐거웠어요.',
        '집에 와서 가지를 씻고 엄마가 가지를 썰어주셨어요. \n그 후 올리브오일, 소금 간을 약간 해주고',
        '에어프라이어에서 10~15분 잘 돌려가며 구워줬어요!',
        '평소에는 가지를 잘 먹지 않았는데, 내가 직접 기른 가지라 그런지 너무 맛있게 잘 먹었어요! \n 아빠도 "우리 딸이 키운 가지라 그런지 훨씬 맛있네" 라고 해주셔서 뿌듯했어요. \n 오늘은 내가 작은 농부이자 요리사였던 하루였어요:)',
      ],
    },
    7: {
      title: '"양파 카레"',
      date: '2025.10.03 작성',
      views: '조회수 : 312회',
      images: [
        '/images/cook-detail2-1.png',
        '/images/cook-detail2-2.png',
        '/images/cook-detail2-3.png',
        '/images/cook-detail2-4.png',
      ],
      paragraphs: [
        '며칠 전부터 양파 잎이 점점 쓰러져서 엄마가 ‘이제 뽑아도 되겠다’고 하셨어요. \n그래서 흙을 파고 땅을 살짝 흔드니까, 동그란 양파가 불쑥 올라왔어요.',
        '양파를 씻고 칼로 자르는데 눈물이 조금 나서 ‘아, 진짜 양파구나’ 싶었어요. \n하지만 눈물이 났어도 신기하고 기분이 좋았어요!',
        '엄마랑 같이 양파를 넣고 카레를 만들었는데, \n노란 카레 속에서 내가 키운 양파가 보글보글 끓고 있는 걸 보니 마치 내가 요리를 완성한 것 같았어요. \n내가 키운 양파가 카레 속 주인공이 된 것 같아서 너무 자랑스러웠어요!!!',
      ],
    },
    8: {
      title: '"가지 튀김"',
      date: '2025.10.02 작성',
      views: '조회수 : 255회',
      images: [
        '/images/cook-detail1-1.png',
        '/images/cook-detail1-2.png',
        '/images/cook-detail1-3.png',
        '/images/cook-detail1-4.png',
        '/images/cook-detail1-5.png',
      ],
      paragraphs: [
        '오늘은 드디어 가지를 수확하는 날! 가지 열매가 무성하게 자라니 "이제 됐다!" 싶었어요. \n조심스럽게 잎을 잡고 쑥 하고 뽑았더니, 보라색 가지가 툭 하고 떨어지는 순간이 너무 즐거웠어요.',
        '집에 와서 가지를 씻고 엄마가 가지를 썰어주셨어요. \n그 후 올리브오일, 소금 간을 약간 해주고',
        '에어프라이어에서 10~15분 잘 돌려가며 구워줬어요!',
        '평소에는 가지를 잘 먹지 않았는데, 내가 직접 기른 가지라 그런지 너무 맛있게 잘 먹었어요! \n 아빠도 "우리 딸이 키운 가지라 그런지 훨씬 맛있네" 라고 해주셔서 뿌듯했어요. \n 오늘은 내가 작은 농부이자 요리사였던 하루였어요:)',
      ],
    },
  };

  // ✅ id값에 맞는 recipe 선택
  const recipe = recipes[id];

  // ✅ 잘못된 id 접근 시 처리
  if (!recipe) {
    return <p className={styles.error}>존재하지 않는 페이지입니다 😢</p>;
  }

  return (
    <main className={styles.detailWrap}>
      <div className={styles.titleBox}>
        <h2 className={styles.mainTitle}>작은 농부들의 맛있는 이야기</h2>
        <div className={styles.line}></div>
        <h3 className={styles.subTitle}>{recipe.title}</h3>
      </div>

      {/* 대표 이미지 */}
      <section className={styles.heroImage}>
        <img src={recipe.images[0]} alt="대표 이미지" />
      </section>

      {/* 내용 */}
      <section className={styles.contentSection}>
        {recipe.paragraphs.map((text, i) => (
          <div key={i} className={styles.imageText}>
            <img src={recipe.images[i + 1]} alt={`내용 이미지 ${i + 1}`} />
            <p className={styles.paragraph}>{text}</p>
          </div>
        ))}

        <div className={styles.metaBox}>
          <p>{recipe.date}</p>
          <p>{recipe.views}</p>
        </div>
      </section>
    </main>
  );
}
