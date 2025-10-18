import styles from "./edudetail.module.css"

export default function Edudetail() {
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
                            <li>
                                <div className={styles.edu_detail_contentbox_video}></div>
                                <ul>
                                    <li>흙의 종류와 색</li>
                                    <li>04분 01초</li>
                                </ul>
                            </li>
                            <li>
                                <div className={styles.edu_detail_contentbox_video}></div>
                                <ul>
                                    <li>흙의 종류와 색</li>
                                    <li>04분 01초</li>
                                </ul>
                            </li>
                            <li>
                                <div className={styles.edu_detail_contentbox_video}></div>
                                <ul>
                                    <li>흙의 종류와 색</li>
                                    <li>04분 01초</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* 메인 동영상 */}
                <div className={styles.streamingwrap}>
                    <button>
                        <img src="/images/download.png" alt="download" />
                        다운로드
                    </button>
                    <div className={styles.edu_videobox}>
                        {/* 동영상 영역 */}
                        동영상 영역
                    </div>
                    <p>&lt; 뒤로가기</p>
                </div>
            </div>
        </div>
    );
};