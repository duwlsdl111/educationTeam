"use client";

import { useEffect, useState } from "react";
import styles from "./section3.module.css";

export default function Section3() {
  const [weather, setWeather] = useState(null);
  const [selectedVeg, setSelectedVeg] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=63a92c7bfcb0478b90d5faa8e8c88db2&units=metric&lang=kr`
        );
        const data = await response.json();
        console.log("weather API data:", data); // -> 디버그: 콘솔에서 데이터 구조 확인
        setWeather({
          main: data.weather?.[0]?.main ?? null, // 영어값 (예: "Clear")
          icon: data.weather?.[0]?.icon ?? null,
          temp: data.main ? Math.round(data.main.temp) : null,
          pm: "좋음",
        });
      } catch (error) {
        console.error("날씨 불러오기 실패:", error);
      }
    };

    fetchWeather();
  }, []);

  // 영어 -> 한글 매핑 함수 (안전하게 처리)
  const weatherKorean = {
    Clear: "맑음",
    Rain: "비",
    Snow: "눈",
    Clouds: "구름",
    Wind: "바람",
    // 한파(Cold)는 API에서 바로 주지 않을 수 있음. 필요하면 조건 추가
  };

  // 안전하게 한글 날씨 계산 (weather가 없으면 빈 문자열)
  const koreanWeather = weather?.main
    ? weatherKorean[weather.main] || weather.main
    : "";

  // weather 이미지 매핑 (한글 기준)
  const weatherImages = {
    맑음: "sunny.png",
    비: "rain.png",
    눈: "snow.png",
    바람: "windy.png",
    구름: "cloud.png",
    한파: "cold.png",
  };

  // farmdu 이미지 (한글 기준)
  const getFarmduImage = () => {
    if (!koreanWeather) return "/images/defaultfarmdu.png";
    switch (koreanWeather) {
      case "비":
        return "/images/rainfarmdu.png";
      case "맑음":
        return "/images/sunnyfarmdu.png";
      case "눈":
        return "/images/snowfarmdu.png";
      case "바람":
        return "/images/windyfarmdu.png";
      case "한파":
        return "/images/coldfarmdu.png";
      default:
        return "/images/sunnyfarmdu.png";
    }
  };

  // 채소 이미지 매핑 (한글 채소명 -> 실제 파일명)
  const vegetableImages = {
    토마토: "tomato.png",
    가지: "gaji.png",
    상추: "sangchu.png",
    당근: "carrot.png",
    방울배추: "cabage.png",
    고추: "pepper.png",
    오이: "cucumber.png",
    파: "greenonion.png",
    마늘: "garlic.png",
    완두콩: "bean.png",
  };

  // 채소별 + (한글)날씨별 관리법 (필요시 더 추가)
  const vegGuide = {
  토마토: {
    맑음: {
      home: "햇빛은 좋지만 너무 뜨거우면 커튼으로 가려요.",
      outdoor: "그늘막과 짚 덮기로 온도 낮춰요.",
    },
    비: {
      home: "비 맞지 않게 안쪽으로 옮겨요.",
      outdoor: "비닐 덮개로 잎을 보호해요.",
    },
    한파: {
      home: "따뜻한 실내로 옮겨요.",
      outdoor: "비닐하우스로 덮어요.",
    },
    눈: {
      home: "눈 오면 실내로 옮겨요.",
      outdoor: "덮개로 덮어 얼지 않게 해요.",
    },
    바람: {
      home: "창문 닫고 안쪽으로 옮겨요.",
      outdoor: "지지대와 끈으로 묶어요.",
    },
  },

  가지: {
    맑음: {
      home: "흙이 마르면 바로 물 주세요.",
      outdoor: "아침·저녁으로 물을 듬뿍 줘요.",
    },
    비: {
      home: "물을 주지 말고 흙을 말려요.",
      outdoor: "배수로를 만들어 물 고임을 막아요.",
    },
    한파: {
      home: "5℃ 이하로 내려가면 실내로 옮겨요.",
      outdoor: "서리 내리기 전 수확해요.",
    },
    눈: {
      home: "창가에서 멀리 두어요.",
      outdoor: "눈 맞기 전에 수확해요.",
    },
    바람: {
      home: "화분을 벽 쪽에 두어요.",
      outdoor: "줄기가 부러지지 않게 고정해요.",
    },
  },

  상추: {
    맑음: {
      home: "반그늘에서 시원하게 키워요.",
      outdoor: "낮에는 그늘막으로 잎을 보호해요.",
    },
    비: {
      home: "창문을 열어 통풍을 시켜요.",
      outdoor: "흙이 젖으면 썩으니 덮개로 보호해요.",
    },
    한파: {
      home: "비닐로 덮고 낮엔 열어요.",
      outdoor: "덮개로 보온하고 햇빛 확보해요.",
    },
    눈: {
      home: "덮고 밤엔 닫아요.",
      outdoor: "눈 쌓이면 털어줘요.",
    },
    바람: {
      home: "바람 맞지 않게 위치 바꿔요.",
      outdoor: "바람막이 울타리 세워요.",
    },
  },

  당근: {
    맑음: {
      home: "통풍을 시켜주고 흙을 촉촉하게 해요.",
      outdoor: "흙이 마르지 않게 멀칭(덮기)해요.",
    },
    비: {
      home: "물받침의 물은 버려요.",
      outdoor: "비 온 뒤 흙을 고르게 펴줘요.",
    },
    한파: {
      home: "천이나 신문지로 덮어요.",
      outdoor: "땅이 얼기 전 덮개로 보온해요.",
    },
    눈: {
      home: "흙 위를 덮어 따뜻하게 해요.",
      outdoor: "눈 오기 전 덮개로 보호해요.",
    },
    바람: {
      home: "화분이 흔들리지 않게 눌러요.",
      outdoor: "잎이 흔들리지 않게 흙을 단단히 눌러요.",
    },
  },

  방울배추: {
    맑음: {
      home: "벌레가 생기면 잎을 털어줘요.",
      outdoor: "해충 방제망으로 보호해요.",
    },
    비: {
      home: "옆에 물이 고이지 않게 닦아요.",
      outdoor: "통풍을 시켜 곰팡이 예방해요.",
    },
    한파: {
      home: "찬바람 막고 덮개로 감싸요.",
      outdoor: "추위엔 강하지만 얼면 잎이 상해요.",
    },
    눈: {
      home: "바람이 드는 곳은 피하고 감싸요.",
      outdoor: "잎 위 눈을 바로 털어요.",
    },
    바람: {
      home: "잎이 찢어지지 않게 조심해요.",
      outdoor: "지지대를 세워 흔들림 막아요.",
    },
  },

  고추: {
    맑음: {
      home: "햇빛은 충분히, 물은 적당히!",
      outdoor: "잎이 탈 때는 그늘막 설치해요.",
    },
    비: {
      home: "잎을 털어 병을 막아요.",
      outdoor: "장마철엔 비닐하우스로 보호해요.",
    },
    한파: {
      home: "열매는 미리 따요.",
      outdoor: "모두 수확하고 건조시켜요.",
    },
    눈: {
      home: "남은 열매는 일찍 따요.",
      outdoor: "열매를 모두 따서 말려요.",
    },
    바람: {
      home: "창문 닫고 보호해요.",
      outdoor: "지지대로 묶고 고정해요.",
    },
  },

  오이: {
    맑음: {
      home: "아침마다 물 듬뿍!",
      outdoor: "하루 한 번 이상 물주기 필수.",
    },
    비: {
      home: "비 오는 날엔 물주지 않아요.",
      outdoor: "줄기 밑이 썩지 않게 덮개 해요.",
    },
    한파: {
      home: "겨울엔 쉬게 해요.",
      outdoor: "추위에 약해서 재배 안 해요.",
    },
    눈: {
      home: "겨울엔 키우지 않아요.",
      outdoor: "눈에는 견디지 못해요.",
    },
    바람: {
      home: "화분을 낮은 곳에 두어요.",
      outdoor: "덩굴을 묶어 고정해요.",
    },
  },

  파: {
    맑음: {
      home: "흙이 말랐는지 자주 확인해요.",
      outdoor: "햇빛 아래서 잘 자라요.",
    },
    비: {
      home: "물받침을 비워요.",
      outdoor: "쓰러지면 흙을 덮어 고정해요.",
    },
    한파: {
      home: "흙이 얼지 않게 천으로 덮어요.",
      outdoor: "흙으로 덮어 보온해요.",
    },
    눈: {
      home: "화분 위를 덮어요.",
      outdoor: "흙을 덮어 따뜻하게 유지해요.",
    },
    바람: {
      home: "쓰러지면 바로 세워줘요.",
      outdoor: "흙을 덮어 뿌리를 고정해요.",
    },
  },

  마늘: {
    맑음: {
      home: "통풍이 잘 되게 두어요.",
      outdoor: "흙이 단단해지지 않게 고르게 해요.",
    },
    비: {
      home: "배수가 잘되게 화분 밑에 돌을 깔아요.",
      outdoor: "비에 젖지 않게 덮개로 보호해요.",
    },
    한파: {
      home: "통풍 좋은 곳에 두어요.",
      outdoor: "흙 덮기(멀칭)로 뿌리를 보호해요.",
    },
    눈: {
      home: "비닐로 덮어 얼지 않게 해요.",
      outdoor: "멀칭으로 뿌리를 보호해요.",
    },
    바람: {
      home: "잎이 마르지 않게 물 확인해요.",
      outdoor: "줄기가 꺾이지 않게 묶어요.",
    },
  },

  완두콩: {
    맑음: {
      home: "가장 시원한 곳에 두어요.",
      outdoor: "더위에 약하니 반그늘에 심어요.",
    },
    비: {
      home: "비가 들지 않게 창문 닫기.",
      outdoor: "물이 고이지 않게 둔덕 위에 심어요.",
    },
    한파: {
      home: "실내 쪽으로 옮겨요.",
      outdoor: "바람막이 비닐을 세워 보호해요.",
    },
    눈: {
      home: "실내로 옮겨요.",
      outdoor: "찬바람 막이 설치해요.",
    },
    바람: {
      home: "화분을 안쪽으로 옮겨요.",
      outdoor: "바람막이로 보호해요.",
    },
  },
};


  const weatherTextMap = {
    Clear: "맑은 날",
    Rain: "비 오는 날",
    Snow: "눈 오는 날",
    Clouds: "맑은 날", // 구름 많은 날은 맑은 날로 표시
    Wind: "바람 부는 날",
    Cold: "한파인 날",
  };

  const vegetables = Object.keys(vegetableImages);

  const handleClick = (veg) => {
    setSelectedVeg((prev) => (prev === veg ? null : veg));
  };

  return (
    <div className={styles.sec3}>
      <div className={styles.sec3title}>
        <h2>오늘의 날씨</h2>
      </div>

      <div className={styles.sec3content}>
        <div className={styles.weatherfarmdu}>
          <img src={getFarmduImage()} alt="farmdu" />
        </div>

        <div className={styles.weatherinfo}>
          <ul>
            <li className={styles.weathertext}>
              <div className={styles.weathericon}>
                {koreanWeather ? (
                  <img
                    src={`/images/${
                      weatherImages[weather.main] || "sunny.png"
                    }`}
                    alt={weather.main}
                  />
                ) : (
                  <p>불러오는 중...</p>
                )}
              </div>
              <ul>
                <li>오늘의 날씨는</li>
                <li>
                  {koreanWeather ? (
                    <>
                      <p>{koreanWeather}</p>
                      <p>|</p>
                      <p>{weather.temp}°C</p>
                      <p>|</p>
                      <p>미세먼지 {weather.pm}</p>
                    </>
                  ) : (
                    <p>불러오는 중...</p>
                  )}
                </li>
              </ul>
            </li>

            {/* 채소 리스트 */}
            <li className={styles.vegetable} style={{ position: "relative" }}>
              <ul className={styles.vegetablelist1}>
                {vegetables.slice(0, 5).map((veg) => (
                  <li
                    key={veg}
                    onClick={() => handleClick(veg)}
                    className={styles.vegetableItem}
                  >
                    <div>
                      <img src={`/images/${vegetableImages[veg]}`} alt={veg} />
                    </div>
                    <p>{veg}</p>
                  </li>
                ))}
              </ul>

              <ul className={styles.vegetablelist2}>
                {vegetables.slice(5).map((veg) => (
                  <li
                    key={veg}
                    onClick={() => handleClick(veg)}
                    className={styles.vegetableItem}
                  >
                    <div>
                      <img src={`/images/${vegetableImages[veg]}`} alt={veg} />
                    </div>
                    <p>{veg}</p>
                  </li>
                ))}
              </ul>

              {/* 선택된 채소 정보 박스 (ul 전체를 덮도록 li 밖에서 렌더링) */}
              {selectedVeg &&
                weather &&
                (() => {
                  const weatherMap = {
                    Clear: "맑음",
                    Rain: "비",
                    Snow: "눈",
                    Clouds: "맑음",
                    Wind: "바람",
                    Cold: "한파",
                  };

                  const currentWeatherKor = weatherMap[weather.main] || "맑음";
                  const guide =
                    vegGuide[selectedVeg] &&
                    vegGuide[selectedVeg][currentWeatherKor];

                  return guide ? (
                    <div className={styles.vegGuide}>
                      <ul className={styles.vegGuidetitle}>
                        <li>
                          "{selectedVeg}" {weatherTextMap[weather.main]} 에는
                        </li>
                        <li
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedVeg(null)} // 클릭 시 닫기
                        >
                          &lt; 다른작물보기
                        </li>
                      </ul>
                      <ul className={styles.vegGuidebox}>
                        <li className={styles.vegGuideimg}>
                          <img
                            src={`/images/${vegetableImages[selectedVeg]}`}
                            alt={selectedVeg}
                          />
                        </li>
                        <li className={styles.vegGuidetext}>
                          <ul>
                            <li className={styles.home}>
                              <img src="/images/home.png" alt="home" />
                              <div className={styles.hometext}>
                                <p>{guide.home}</p>
                              </div>
                            </li>
                            <li className={styles.outdoor}>
                              <img src="/images/outdoor.png" alt="outdoor" />
                              <div className={styles.outdoortext}>
                                <p>{guide.outdoor}</p>
                              </div>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    {
                      /* <div className={styles.vegGuide}>
                      <p>현재 날씨에 대한 관리 정보가 없습니다.</p>
                    </div> */
                    }
                  );
                })()}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
