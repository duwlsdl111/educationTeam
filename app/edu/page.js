"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./edu.module.css";

export default function Edu() {
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState(tabFromUrl || "house");

    // 탭 변경 시 URL에 반영 (뒤로가기 시에도 유지)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set("tab", activeTab);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, "", newUrl);
    }, [activeTab]);

    const tabData = {
        house: [
            { title: "흙 & 햇빛 🌞" },
            { title: "식물의 비밀 🌱" },
            { title: "물주기 중요성 💧" },
        ],
        garden: [
            { title: "텃밭 준비하기 🪴" },
            { title: "비료 선택법 🌿" },
            { title: "잡초 관리법 🍃" },
        ],
        farm: [
            { title: "농장 관리법 🚜" },
            { title: "토양 테스트 🧪" },
            { title: "계절별 작물 🌾" },
        ],
        etc: [
            { title: "기타 영상 🎥" },
            { title: "팜듀의 꿀팁 🐝" },
            { title: "쉬운 농사 🌼" },
        ],
    };

    return (
        <div>
            {/* 광고배너 */}
            <div className={styles.edu_banner}>
                <img src="/images/edu_banner.png" alt="edubanner" />
            </div>
            <div className={styles.edu_wrap}>
                {/* 검색기능 */}
                <div className={styles.edu_search}>
                    <div className={styles.edu_search_farmdu}>
                        <img src="/images/edu_farmdu.png" alt="farmdu" />
                    </div>
                    <input placeholder="검색어를 입력해팜듀" />
                </div>

                {/* 내비게이션 */}
                <div className={styles.edu_nav}>
                    <ul>
                        {Object.keys(tabData).map((key) => (
                            <li
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={activeTab === key ? styles.active : ""}
                            >
                                {key === "house"
                                    ? "집"
                                    : key === "garden"
                                        ? "텃밭"
                                        : key === "farm"
                                            ? "농장"
                                            : "기타"}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 컨텐츠 영역 */}
                <div className={styles.edu_contentbox}>
                    {tabData[activeTab]?.map((section, i) => (
                        <div key={i}>
                            <div className={styles.edu_contentbox_title}>
                                <p>{section.title}</p>
                            </div>

                            <div className={styles.edu_contentbox_wrap}>
                                <ul>
                                    {[1, 2, 3].map((num) => (
                                        <li key={num}>
                                            <div className={styles.edu_contentbox_video}>
                                                <img
                                                    src={`/images/thumbnail${num}.png`}
                                                    alt={`thumbnail${num}`}
                                                />
                                            </div>
                                            <ul>
                                                <li>영상 타이틀</li>
                                                <li>{section.title}</li>
                                            </ul>
                                            <ul>
                                                <li>소요시간</li>
                                                <li>{`0${num}분 ${5 + num}초`}</li>
                                            </ul>

                                            <Link href={`/edudetail?tab=${activeTab}`}>
                                                <div
                                                    style={{
                                                        width: "330px",
                                                        height: "60px",
                                                        color: "#fff",
                                                        fontSize: "30px",
                                                        marginLeft: "14px",
                                                        borderRadius: "50px",
                                                        backgroundColor: "#157C3E",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    영상보러가기
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
