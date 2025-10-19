'use client';

export default function OpenChatButton() {
  const openPopup = (w, h) => {
    const padW = 2, padH = 2; // 브라우저 크롬 여유
    const left = Math.max(0, (window.screen.width  - (w + padW)) / 2);
    const top  = Math.max(0, (window.screen.height - (h + padH)) / 2);
    window.open(
      '/chat',
      'LittleFarmerChat',
      `width=${w + padW},height=${h + padH},left=${left},top=${top},` +
      `resizable=no,scrollbars=no,toolbar=no,location=no,status=no,menubar=no`
    );
  };

  const handleClick = () => {
    const vw = window.innerWidth;

    if (vw >= 1024) {
      // 💻 데스크탑: 600×730 팝업
      openPopup(393, 852);
    } else if (vw >= 600) {
      // 📱 태블릿: 393×730 팝업
      openPopup(393, 852);
    } else if (vw > 320) {
      // 📱 일반 모바일(321~599): 전체 페이지 이동
      window.location.href = '/chat';
    } else {
      // 📱 초소형 모바일(≤320): 전체 페이지 이동 (필요시 쿼리로 모드 구분 가능)
      window.location.href = '/chat?xs=1';
    }
  };

  return <button onClick={handleClick}>챗봇열기</button>;
}
