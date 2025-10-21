"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
// (next-auth 안 쓰면 아래 import 제거해도 됩니다)
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import styles from "./login.module.css";

const Login = () => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ""; // ✅ 기본값

  const [imgSrc, setImgSrc] = useState(`${BASE_URL}/images/p_LoginBack.png`);
  const [showImage, setShowImage] = useState(true);
  const [modal, setModal] = useState({ show: false, msg: "" });

  useEffect(() => {
    const apply = () => {
      const w = window.innerWidth;
      setShowImage(w > 393);
      setImgSrc(
        w <= 768
          ? `${BASE_URL}/images/t_LoginBack.png`
          : `${BASE_URL}/images/p_LoginBack.png`
      );
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [BASE_URL]);

  // ✅ 로컬 로그인 (성공 시 localStorage에 userId 저장 + 즉시 반영 이벤트)
  const handleLogin = async (e) => {
    e.preventDefault();
    const userId = e.target.userId.value.trim();
    const password = e.target.password.value.trim();

    if (!userId || !password) {
        setModal({ show: true, msg: "아이디와 비밀번호를 입력해주세요." });
        return;
    }

    try {
        const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
        });

        const data = await res.json();

        if (res.ok) {
        // ✅ 로그인 성공 시에만 저장 + 이벤트 발행
        localStorage.setItem("userId", userId);
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("auth:change", { detail: { userId } }));
        }
        router.replace("/"); // 새로고침 없이 헤더 반영
        } else {
        setModal({ show: true, msg: data.message || "로그인 실패" });
        }
    } catch (error) {
        console.error("로그인 오류:", error);
        setModal({ show: true, msg: "서버 오류가 발생했습니다." });
    }
    };


  // ✅ 소셜 로그인 (next-auth 사용 시)
  const handleSocialLogin = (provider) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className={styles.loginContainer}>
      {showImage && (
        <div className={styles.imgContainer}>
          <img src={imgSrc} alt="배경" />
        </div>
      )}

      <div className={styles.loginForm}>
        <form className={styles.loginBox} onSubmit={handleLogin}>
          <h1 className={styles.loginTitle}>로그인</h1>
          <ul className={styles.loginFieldList}>
            <li className={styles.fieldItem}>
              <label htmlFor="userId">아이디</label>
              <input id="userId" name="userId" required />
            </li>
            <li className={styles.fieldItem}>
              <label htmlFor="password">비밀번호</label>
              <input id="password" type="password" name="password" required />
            </li>
          </ul>
          <button type="submit" className={styles.submit}>
            로그인
          </button>
        </form>

        {/* ✅ 소셜 로그인 (원하면 유지) */}
        <div className={styles.loginsocial}>
          <ul className={styles.socialList}>
            <li>
              <img
                src={`${BASE_URL}/images/p_loginGoogle.png`}
                alt="Google"
                className={styles.socialBtn}
                onClick={() => handleSocialLogin("google")}
                style={{ cursor: "pointer" }}
              />
            </li>
            <li>
              <img
                src={`${BASE_URL}/images/p_loginKakao.png`}
                alt="Kakao"
                className={styles.socialBtn}
                onClick={() => handleSocialLogin("kakao")}
                style={{ cursor: "pointer" }}
              />
            </li>
            <li>
              <img
                src={`${BASE_URL}/images/p_loginNaver.png`}
                alt="Naver"
                className={styles.socialBtn}
                style={{ cursor: "pointer" }}
              />
            </li>
          </ul>
        </div>

        <div className={styles.member}>
          <ul className={styles.memberList}>
            <li>아이디 찾기</li>
            <li>|</li>
            <li>비밀번호 찾기</li>
            <li>|</li>
            <Link href="/member">회원가입</Link>
          </ul>
        </div>
      </div>

      {modal.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <p className={styles.modalText}>{modal.msg}</p>
            <button
              className={styles.modalBtn}
              onClick={() => setModal({ show: false, msg: "" })}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
