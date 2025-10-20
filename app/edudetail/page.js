"use client";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./edudetail.module.css";

export default function Edudetail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab") || "house";

    const handleDownload = () => {
        window.location.href = "/api/download"; // 서버 API로 바로 다운로드
    };

    return (
        <div>
            {/* 광고배너 */}
            <div className={styles.edu_detail_banner}>
                <img src="/images/edu_detailbanner.png" alt="edubanner" />
            </div>

            <div className={styles.edu_detail_wrap}>
                {/* 컨텐츠 박스 */}
                <div className={styles.edu_detail_contentbox}>
                    <div className={styles.edu_detail_contentbox_title}>
                        <p>흙 & 햇빛 🌞</p>
                    </div>
                    <div className={styles.edu_detail_contentbox_wrap}>
                        <ul>
                            {[1, 2, 3].map((num) => (
                                <li key={num}>
                                    <div className={styles.edu_detail_contentbox_video}>
                                        <img
                                            src={`/images/thumbnail${num}.png`}
                                            alt={`thumbnail${num}`}
                                            className={styles.edu_thumbnail_img}
                                        />
                                    </div>
                                    <ul>
                                        <li>흙의 종류와 색</li>
                                        <li>04분 01초</li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 메인 영상 */}
                <div className={styles.streamingwrap}>
                    <button onClick={handleDownload}>
                        <img src="/images/download.png" alt="download" />
                        다운로드
                    </button>

                    <div className={styles.edu_videobox}>
                        <video src="/videos/video.mp4" controls width="1400" />
                    </div>

                    {/* 뒤로가기 */}
                    <p
                        style={{ cursor: "pointer" }}
                        onClick={() => router.push(`/edu?tab=${tab}`)}
                    >
                        &lt; 뒤로가기
                    </p>
                </div>
            </div>
        </div>
    );
}
