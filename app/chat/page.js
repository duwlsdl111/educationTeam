'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import styles from './chat.module.css';

import { QUICK_BADGES, BOT_GREETING, SUGGESTIONS, getReplyFromData, getDynamicSuggestions } from '@/data/chatData';

export default function Chat() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  // 초기 메시지: 분리된 데이터 사용
  const initialBot = useMemo(() => BOT_GREETING, []);
  const [messages, setMessages] = useState([initialBot]);

  // 메뉴 닫기
  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        menuBtnRef.current && !menuBtnRef.current.contains(e.target)
      ) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  // ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // 자동 스크롤
  useEffect(scrollToBottom, [messages.length]);

  // 타입어헤드 필터: 분리된 SUGGESTIONS 사용
  const query = inputValue.trim();
  const baseList = !query ? [] : SUGGESTIONS
    .filter(s => s.text.includes(query) || s.tags.some(t => query.includes(t)))
    .map(s => s.text);
  const cropList = getDynamicSuggestions(query, 6);
  const filtered = !autoEnabled || !query ? [] : Array.from(new Set([...cropList, ...baseList])).slice(0, 6);
  const showTypeahead = autoEnabled && query.length > 0 && filtered.length > 0;

  const onPick = (text) => {
    setInputValue(text);
    inputRef.current?.focus();
  };

  // 전송/리셋
  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: 'user', text }]);
    setInputValue('');
    inputRef.current?.focus();

    // 데이터에 기반한 답변
    setTimeout(() => {
      const reply = getReplyFromData(text);
      setMessages(prev => [...prev, { id: `b-${Date.now()}`, role: 'bot', text: reply }]);
    }, 700);
  };

  const handleReset = () => {
    setMessages([initialBot]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const onKeyDownInput = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className={styles.chat}>
        {/* 헤더 */}
        <div className={styles.chatHeader}>
          <div className={styles.chatLogo}>
            <Image src="/images/chatLogo.png" alt="Farmer" width={130} height={45} priority />
          </div>

          <button
            ref={menuBtnRef}
            type="button"
            className={styles.chatMenuBtn}
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            aria-controls="chatMenuPanel"
            onClick={() => setMenuOpen(v => !v)}
          >
            {!menuOpen ? (
              <Image src="/images/hamburger.png" alt="" width={22} height={18} priority />
            ) : (
              <Image src="/images/Vector.png" alt="" width={22} height={18} priority />
            )}
          </button>
        </div>

        {/* 본문 */}
        <div className={styles.chatMain} style={{ borderRadius: '10px' }}>
          <div className={styles.chatNotice}>
            오늘 리틀파머 체험은 오전 10시 ~ 오후 5시까지 운영돼요 🌱
          </div>

          {/* 대화 리스트 */}
          <div className={styles.chatChatting}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.msg} ${m.role === 'bot' ? styles.bot : styles.user} ${
                  m.id === 'b-hello' ? styles.popIn : ''
                }`}
              >
                {m.role === 'bot' && (
                  <div className={styles.avatarBot}>
                    <Image
                      src="/images/avatar-bot.png"
                      alt="팜두"
                      width={28}
                      height={28}
                      style={{ background: '#fff', padding: '2px', borderRadius: '50px' }}
                    />
                  </div>
                )}

                <div className={styles.msgCol}>
                  <div className={styles.bubble}>
                    {m.text}

                    {/* 빠른 배지: 라벨을 아이콘에 매핑해서 렌더 */}
                    {m.badges?.length > 0 && (
                      <div
                        className={`${styles.badgeGrid} ${m.id === 'b-hello' ? styles.stagger : ''}`}
                        role="group"
                        aria-label="빠른 안내"
                        data-stagger
                      >
                        {m.badges.map((label) => {
                          const meta = QUICK_BADGES.find(b => b.label === label);
                          return (
                            <button
                              key={label}
                              type="button"
                              className={styles.badgeBtn}
                              onClick={() => onPick(label)}
                              title={label}
                            >
                              {/* 아이콘은 data가 제공 */}
                              {meta ? (
                                <span
                                  className={styles.badgeIco}
                                  style={{ backgroundImage: `url(${meta.icon})` }}
                                  aria-hidden="true"
                                />
                              ) : (
                                <span className={styles.badgeIco} data-kind={label} />
                              )}
                              <span className={styles.badgeLabel}>{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className={styles.meta}>{m.role === 'bot' ? '팜두' : '나'}</div>
                </div>

                {m.role === 'user' && (
                  <div className={styles.avatarUser}>
                    <Image
                      src="/images/avatar-me.png"
                      alt="나"
                      width={28}
                      height={28}
                      style={{ background: '#fff', padding: '2px', borderRadius: '50px' }}
                    />
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* 타입어헤드 */}
          {showTypeahead && (
            <div className={styles.typeahead} role="listbox">
              {filtered.map((text) => (
                <button
                  key={text}
                  className={styles.typeItem}
                  role="option"
                  onClick={() => onPick(text)}
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {/* 자동완성 스위치 바 */}
          <div className={styles.autoDock} role="region" aria-label="자동완성 설정">
            <span>자동완성</span>
            <button
              type="button"
              aria-pressed={autoEnabled}
              aria-label={`자동완성 ${autoEnabled ? '켜짐' : '꺼짐'}`}
              onClick={() => setAutoEnabled(v => !v)}
              className={`${styles.switch} ${autoEnabled ? styles.on : styles.off}`}
            >
              <span className={styles.knob} />
            </button>
          </div>
        </div>
      </div>

      {/* 입력 바 */}
      <div className={styles.chatChattingBar}>
        <button
          type="button"
          className={styles.chatReset}
          title="대화 초기화"
          onClick={handleReset}
        >
          <Image src="/images/reset.png" alt="" width={30} height={30} priority />
        </button>

        <input
          ref={inputRef}
          placeholder="메시지를 입력하세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDownInput}
        />

        <button
          type="button"
          className={styles.chatSubmit}
          title="보내기"
          onClick={handleSend}
          disabled={!inputValue.trim()}
          aria-disabled={!inputValue.trim()}
        >
          <Image src="/images/submit.png" alt="" width={30} height={30} priority />
        </button>
      </div>

      {/* 메뉴 패널 */}
      <div
        id="chatMenuPanel"
        ref={menuRef}
        className={`${styles.menuPanel} ${menuOpen ? styles.open : ''}`}
        role="menu"
      >
        <button className={styles.menuItem} role="menuitem" onClick={handleReset}>
          대화 초기화
        </button>
        <button className={styles.menuItem} role="menuitem" onClick={() => {setMenuOpen(false); router.push('/login'); }}>로그인하기</button>
      </div>
    </>
  );
}
