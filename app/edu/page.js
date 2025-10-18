import styles from "./edu.module.css"

export default function Edu() {
    return (
        <div className={styles.edu_wrap}>
            {/* 광고배너 */}
            <div className={styles.edu_banner}>
                <img src="/images/edu_banner.png" alt="edubanner" />
            </div>
            {/* 검색기능 */}
            <div className={styles.edu_search}>
                <div className={styles.edu_search_farmdu}>
                    <img src="/images/edu_farmdu.png" alt="farmdu" />
                </div>
                <input placeholder="검색어를 입력해팜듀" />
            </div>
            {/* 내비게이션 (집, 텃밭, 농장, 기타) */}
            <div className={styles.edu_nav}>
                <ul>
                    <li>집</li>
                    <li>텃밭</li>
                    <li>농장</li>
                    <li>기타</li>
                </ul>
            </div>
            {/* 컨텐츠 박스 */}
            <div className={styles.edu_contentbox}>
                {/* 첫번째 */}
                <div className={styles.edu_contentbox_title}>
                    <p>흙 & 햇빛 🌞</p>
                </div>
                <div className={styles.edu_contentbox_wrap}>
                    <ul>
                        <li>
                            <div className={styles.edu_contentbox_video}></div>
                            <ul>
                                <li>영상 타이틀</li>
                                <li>흙의 종류와 색</li>
                            </ul>
                            <ul>
                                <li>소요시간</li>
                                <li>04분 01초</li>
                            </ul>
                            <div style={{
                                width: "330px",
                                height: "60px",
                                color: "#fff",
                                fontSize: "30px",
                                marginLeft:"14px",
                                borderRadius: "50px",
                                backgroundColor: "#157C3E",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                영상보러가기
                            </div>
                        </li>
                        <li>
                            <div className={styles.edu_contentbox_video}></div>
                            <ul>
                                <li>영상 타이틀</li>
                                <li>흙의 종류와 색</li>
                            </ul>
                            <ul>
                                <li>소요시간</li>
                                <li>04분 01초</li>
                            </ul>
                            <div style={{
                                width: "330px",
                                height: "60px",
                                color: "#fff",
                                fontSize: "30px",
                                marginLeft:"14px",
                                borderRadius: "50px",
                                backgroundColor: "#157C3E",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                영상보러가기
                            </div>
                        </li>
                        <li>
                            <div className={styles.edu_contentbox_video}></div>
                            <ul>
                                <li>영상 타이틀</li>
                                <li>흙의 종류와 색</li>
                            </ul>
                            <ul>
                                <li>소요시간</li>
                                <li>04분 01초</li>
                            </ul>
                            <div style={{
                                width: "330px",
                                height: "60px",
                                color: "#fff",
                                fontSize: "30px",
                                marginLeft:"14px",
                                borderRadius: "50px",
                                backgroundColor: "#157C3E",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                영상보러가기
                            </div>
                        </li>
                    </ul>
                </div>
                {/* 두번째 */}
                <div className={styles.edu_contentbox_title}>
                    <p>흙 & 햇빛 🌞</p>
                </div>
                <div className={styles.edu_contentbox_wrap}>
                    <ul>
                        <li>
                            <div className={styles.edu_contentbox_video}></div>
                            <ul>
                                <li>영상 타이틀</li>
                                <li>흙의 종류와 색</li>
                            </ul>
                            <ul>
                                <li>소요시간</li>
                                <li>04분 01초</li>
                            </ul>
                            <div style={{
                                width: "330px",
                                height: "60px",
                                color: "#fff",
                                fontSize: "30px",
                                marginLeft:"14px",
                                borderRadius: "50px",
                                backgroundColor: "#157C3E",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                영상보러가기
                            </div>
                        </li>
                        <li>
                            <div className={styles.edu_contentbox_video}></div>
                            <ul>
                                <li>영상 타이틀</li>
                                <li>흙의 종류와 색</li>
                            </ul>
                            <ul>
                                <li>소요시간</li>
                                <li>04분 01초</li>
                            </ul>
                            <div style={{
                                width: "330px",
                                height: "60px",
                                color: "#fff",
                                fontSize: "30px",
                                marginLeft:"14px",
                                borderRadius: "50px",
                                backgroundColor: "#157C3E",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                영상보러가기
                            </div>
                        </li>
                        <li>
                            <div className={styles.edu_contentbox_video}></div>
                            <ul>
                                <li>영상 타이틀</li>
                                <li>흙의 종류와 색</li>
                            </ul>
                            <ul>
                                <li>소요시간</li>
                                <li>04분 01초</li>
                            </ul>
                            <div style={{
                                width: "330px",
                                height: "60px",
                                color: "#fff",
                                fontSize: "30px",
                                marginLeft:"14px",
                                borderRadius: "50px",
                                backgroundColor: "#157C3E",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                영상보러가기
                            </div>
                        </li>
                    </ul>
                </div>
                {/* 세번째 */}
                <div className={styles.edu_contentbox_title}>
                    <p>흙 & 햇빛 🌞</p>
                </div>
                <div className={styles.edu_contentbox_wrap}>
                    <ul>
                        <li>
                            <div className={styles.edu_contentbox_video}></div>
                            <ul>
                                <li>영상 타이틀</li>
                                <li>흙의 종류와 색</li>
                            </ul>
                            <ul>
                                <li>소요시간</li>
                                <li>04분 01초</li>
                            </ul>
                            <div style={{
                                width: "330px",
                                height: "60px",
                                color: "#fff",
                                fontSize: "30px",
                                marginLeft:"14px",
                                borderRadius: "50px",
                                backgroundColor: "#157C3E",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                영상보러가기
                            </div>
                        </li>
                        <li>
                            <div className={styles.edu_contentbox_video}></div>
                            <ul>
                                <li>영상 타이틀</li>
                                <li>흙의 종류와 색</li>
                            </ul>
                            <ul>
                                <li>소요시간</li>
                                <li>04분 01초</li>
                            </ul>
                            <div style={{
                                width: "330px",
                                height: "60px",
                                color: "#fff",
                                fontSize: "30px",
                                marginLeft:"14px",
                                borderRadius: "50px",
                                backgroundColor: "#157C3E",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                영상보러가기
                            </div>
                        </li>
                        <li>
                            <div className={styles.edu_contentbox_video}></div>
                            <ul>
                                <li>영상 타이틀</li>
                                <li>흙의 종류와 색</li>
                            </ul>
                            <ul>
                                <li>소요시간</li>
                                <li>04분 01초</li>
                            </ul>
                            <div style={{
                                width: "330px",
                                height: "60px",
                                color: "#fff",
                                fontSize: "30px",
                                marginLeft:"14px",
                                borderRadius: "50px",
                                backgroundColor: "#157C3E",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                영상보러가기
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}