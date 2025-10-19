"use client";

import { useState } from "react";
import styles from "./section2.module.css";

export default function Section2() {
  const [mapSrc, setMapSrc] = useState("/images/koreamap.png");
  const [activeCity, setActiveCity] = useState(null);
  const [showDescription, setShowDescription] = useState(false);

  const cityDescriptions = {
    경기도: "경기도는 서울과 인접한 중심 지역으로 다양한 농산물이 생산됩니다.",
    강원도: "강원도는 산과 바다가 어우러진 청정 지역으로 특산물이 풍부합니다.",
    충청남도: "충청남도는 논농사와 채소 재배가 활발한 지역입니다.",
    충청북도: "충청북도는 곡물과 과일 재배가 유명합니다.",
    경상북도: "경상북도는 사과와 포도가 유명한 지역입니다.",
    경상남도: "경상남도는 딸기, 배, 멜론 등의 농산물이 유명합니다.",
    전라북도: "전라북도는 쌀과 전통 장류가 유명합니다.",
    전라남도: "전라남도는 과일과 해산물이 풍부한 지역입니다.",
    제주도: "제주도는 감귤과 한라봉 등 특산물이 유명합니다.",
  };

  const cityImages = {
    경기도: "/images/gyunggi_info.png",
    강원도: "/images/gangwon_info.png",
    충청남도: "/images/chungnam_info.png",
    충청북도: "/images/chungbuk_info.png",
    경상북도: "/images/gyungbuk_info.png",
    경상남도: "/images/gyungnam_info.png",
    전라북도: "/images/junbuk_info.png",
    전라남도: "/images/junnam_info.png",
    제주도: "/images/jeju_info.png",
  };

  const handleCityClick = (city) => {
    if (activeCity === city) {
      setMapSrc("/images/koreamap.png");
      setActiveCity(null);
      setShowDescription(false); 
      return;
    }

    switch (city) {
      case "경기도":
        setMapSrc("/images/gyunggi_active.png");
        break;
      case "강원도":
        setMapSrc("/images/gangwon_active.png");
        break;
      case "충청남도":
        setMapSrc("/images/chungnam_active.png");
        break;
      case "충청북도":
        setMapSrc("/images/chungbuk_active.png");
        break;
      case "경상북도":
        setMapSrc("/images/gyungbuk_active.png");
        break;
      case "경상남도":
        setMapSrc("/images/gyungnam_active.png");
        break;
      case "전라북도":
        setMapSrc("/images/junbuk_active.png");
        break;
      case "전라남도":
        setMapSrc("/images/junnam_active.png");
        break;
      case "제주도":
        setMapSrc("/images/jeju_active.png");
        break;
      default:
        setMapSrc("/images/koreamap.png");
        break;
    }

    setActiveCity(city);
    setShowDescription(true);
  };

  return (
    <div className={styles.sec2}>
      <div className={styles.sec2title}>
        <h2>한눈에 보는 "지역 특산물"</h2>
      </div>
      <div className={styles.map}>
        <div className={styles.krmap}>
          <img src={mapSrc} alt="korea map" />
          <div className={styles.citytitle}>
            <p className={styles.gyunggi} onClick={() => handleCityClick("경기도")}>경기도</p>
            <p className={styles.gangwon} onClick={() => handleCityClick("강원도")}>강원도</p>
            <p className={styles.chungnam} onClick={() => handleCityClick("충청남도")}>충청남도</p>
            <p className={styles.chungbuk} onClick={() => handleCityClick("충청북도")}>충청북도</p>
            <p className={styles.gyungbuk} onClick={() => handleCityClick("경상북도")}>경상북도</p>
            <p className={styles.junbuk} onClick={() => handleCityClick("전라북도")}>전라북도</p>
            <p className={styles.junnam} onClick={() => handleCityClick("전라남도")}>전라남도</p>
            <p className={styles.gyungnam} onClick={() => handleCityClick("경상남도")}>경상남도</p>
            <p className={styles.jeju} onClick={() => handleCityClick("제주도")}>제주도</p>
          </div>
        </div>
        <div className={styles.currentmap}>
          <div>
            <img
              src={activeCity ? cityImages[activeCity] : "/images/section2farmdu.png"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
