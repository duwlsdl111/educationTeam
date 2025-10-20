'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './minigame.module.css';

const PLOT_COUNT = 2;
const STORAGE_KEY = 'mini_farm_state_v1';

const SEEDS = {
  carrot: { emoji: '🥕', name: '당근', rate: 1.0 },
  strawberry: { emoji: '🍓', name: '딸기', rate: 0.9 },
  corn: { emoji: '🌽', name: '옥수수', rate: 0.8 },
};

export default function Minigame() {
  const [state, setState] = useState(() => ({
    score: 0,
    selectedSeed: 'carrot',
    day: 1,
    plots: Array.from({ length: PLOT_COUNT }, () => ({
      type: null,
      growth: 0,
      sun: 30,
      water: 30,
      health: 60,
      harvested: false,
    })),
  }));
  const [toastMsg, setToastMsg] = useState('');
  const toastTimerRef = useRef(null);

  // 초기 로드
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const plots =
        parsed.plots?.length === PLOT_COUNT
          ? parsed.plots
          : Array.from({ length: PLOT_COUNT }, (_, i) => parsed.plots?.[i] ?? {
              type: null, growth: 0, sun: 30, water: 30, health: 60, harvested: false,
            });
      setState({ ...parsed, plots });
    } catch {}
  }, []);

  // 상태 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // 언마운트 시 토스트 타이머 정리
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // 유틸
  const toast = (msg) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(''), 1500);
  };

  const stageEmoji = (p) => {
    if (!p.type) return '🪴';
    if (p.growth < 25) return '🌱';
    if (p.growth < 60) return '🌿';
    if (p.growth < 100) return '🌳';
    return SEEDS[p.type].emoji;
  };

  const seeds = useMemo(
    () => Object.keys(SEEDS).map((key) => ({ key, ...SEEDS[key] })),
    []
  );

  // 액션들
  const setPlots = (updater) =>
    setState((s) => ({ ...s, plots: updater(s.plots) }));

  const plant = (idx) => {
    setPlots((prev) => {
      const next = [...prev];
      const p = { ...next[idx] };
      if (p.type && p.growth > 0) {
        toast('이미 자라고 있어요!');
        return prev;
      }
      p.type = state.selectedSeed;
      p.growth = 1;
      p.health = 60;
      p.water = 30;
      p.sun = 30;
      p.harvested = false;
      next[idx] = p;
      toast(`${SEEDS[p.type].emoji} ${SEEDS[p.type].name} 심기 성공!`);
      return next;
    });
  };

  const water = (idx) => {
    setPlots((prev) => {
      const next = [...prev];
      const p = { ...next[idx] };
      if (!p.type) {
        toast('먼저 씨앗을 심자!');
        return prev;
      }
      p.water = Math.min(100, p.water + 25);
      p.growth = Math.min(100, p.growth + 8);
      next[idx] = p;
      return next;
    });
  };

  const sunAct = (idx) => {
    setPlots((prev) => {
      const next = [...prev];
      const p = { ...next[idx] };
      if (!p.type) {
        toast('먼저 씨앗을 심자!');
        return prev;
      }
      p.sun = Math.min(100, p.sun + 25);
      p.health = Math.min(100, p.health + 6);
      p.growth = Math.min(100, p.growth + 5);
      next[idx] = p;
      return next;
    });
  };

  const harvest = (idx) => {
    setState((s) => {
      const nextPlots = [...s.plots];
      const p = { ...nextPlots[idx] };
      if (!p.type) {
        toast('아직 아무것도 없어요');
        return s;
      }
      if (p.growth < 100 || p.health < 40) {
        toast('아직 수확할 수 없어요');
        return s;
      }
      p.type = null;
      p.growth = 0;
      p.health = 60;
      p.water = 30;
      p.sun = 30;
      p.harvested = true;
      nextPlots[idx] = p;

      const newScore = s.score + 1;
      toast('축하해요! 🧺 수확 성공!');
      if (newScore >= 3) setTimeout(() => toast('오늘 목표 달성! 금메달 🥇'), 300);

      return { ...s, plots: nextPlots, score: newScore };
    });
  };

  const nextDay = () => {
    setState((s) => {
      const nextPlots = s.plots.map((p) => {
        if (!p.type) return p;
        const rate = SEEDS[p.type].rate;
        let sun = Math.max(0, p.sun - 12);
        let water = Math.max(0, p.water - 12);
        let growth = p.growth;
        let health = p.health;

        if (sun > 20 && water > 20) {
          growth = Math.min(100, growth + 10 * rate);
          health = Math.min(100, health + 2);
        } else {
          health = Math.max(0, health - 8);
        }
        return { ...p, sun, water, growth, health };
      });
      return { ...s, plots: nextPlots, day: s.day + 1 };
    });
    toast(`새로운 하루! 현재 ${state.day + 1}일차`);
  };

  const randomEvent = () => {
    setPlots((prev) => {
      const events = [
        { msg: '소나기가 내렸어요! 💧', fn: (p) => ({ ...p, water: Math.min(100, p.water + 20) }) },
        { msg: '화창한 햇빛! ☀️', fn: (p) => ({ ...p, sun: Math.min(100, p.sun + 20) }) },
        { msg: '벌레가 나타났어요! 🐛', fn: (p) => ({ ...p, health: Math.max(0, p.health - 15) }) },
        { msg: '좋은 거름! 🧪', fn: (p) => ({ ...p, growth: Math.min(100, p.growth + 12) }) },
      ];

      const ev = events[Math.floor(Math.random() * events.length)];
      const idxs = prev.map((p, i) => (p.type ? i : -1)).filter((i) => i >= 0);

      if (idxs.length === 0) {
        toast('빈 밭에는 이벤트가 없어요');
        return prev;
      }
      const targetIdx = idxs[Math.floor(Math.random() * idxs.length)];
      const next = [...prev];
      next[targetIdx] = ev.fn(next[targetIdx]);
      toast(ev.msg);
      return next;
    });
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      score: 0,
      selectedSeed: 'carrot',
      day: 1,
      plots: Array.from({ length: PLOT_COUNT }, () => ({
        type: null,
        growth: 0,
        sun: 30,
        water: 30,
        health: 60,
        harvested: false,
      })),
    });
  };

  return (
    <div className={styles.minigame}>
      <div className={styles.miniG_wrap}>
        <header className={styles.miniG_header}>
          <div className={styles.miniG_title}>
            <span aria-hidden>🚜미니 농사체험</span>
            <span className={styles.miniG_badge} title="오늘 목표">🎯 오늘 목표: 2개 </span>
          </div>
          
        </header>

        <section className={styles.miniG_toolbar} aria-label="씨앗 선택">
          <div className={styles.miniG_tool} style={{ flex: '1 1 100%' }}>
            <strong>씨앗 고르기</strong>
            <div className={styles.miniG_seed_picker}>
              {seeds.map((s) => (
                <button
                  key={s.key}
                  className={`${styles.miniG_seed} ${state.selectedSeed === s.key ? styles.miniG_active : ''}`}
                  title={s.name}
                  aria-label={`${s.name} 씨앗 선택`}
                  onClick={() => {
                    setState((prev) => ({ ...prev, selectedSeed: s.key }));
                    toast(`${s.emoji} ${s.name} 씨앗 선택!`);
                  }}
                >
                  <span className={styles.miniG_seedIcon} aria-hidden>{s.emoji}</span>
                  <span className={styles.miniG_seedLabel} aria-hidden>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.miniG_tool}>
            <strong>날씨 진행(다음 날로)</strong>
            <button onClick={nextDay}>하루 보내기</button>
          </div>

          <div className={styles.miniG_tool}>
            <strong>랜덤 이벤트</strong>
            <button onClick={randomEvent}>발생!</button>
          </div>
        </section>

        <section className={styles.miniG_field} aria-label="밭">
          <div className={styles.miniG_plots}>
            {state.plots.map((p, i) => (
              <div
                key={i}
                className={`${styles.miniG_plot} ${!p.type ? styles.miniG_empty : ''}`}
              >
                <div className={styles.miniG_plant} aria-hidden>
                  {stageEmoji(p)}
                </div>

                <div className={styles.miniG_bars} aria-hidden>
                  <div className={`${styles.miniG_bar} ${styles.miniG_sun}`}>
                    <i style={{ width: `${p.type ? p.sun : 0}%` }} />
                  </div>
                  <div className={`${styles.miniG_bar} ${styles.miniG_water}`}>
                    <i style={{ width: `${p.type ? p.water : 0}%` }} />
                  </div>
                  <div className={`${styles.miniG_bar} ${styles.miniG_health}`}>
                    <i style={{ width: `${p.type ? p.health : 0}%` }} />
                  </div>
                </div>

                <div className={styles.miniG_controls} role="group" aria-label="작물 관리">
                  <button onClick={() => plant(i)}>씨앗</button>
                  <button onClick={() => water(i)}>물 💧</button>
                  <button onClick={() => sunAct(i)}>햇빛 ☀️</button>
                  <button onClick={() => harvest(i)}>수확 🧺</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.miniG_footer} role="contentinfo">
          <div className={styles.miniG_row}>
            <div className={styles.miniG_badge}>💧 을 줘야 쑥쑥 자라요 !</div>
            <div className={styles.miniG_badge}>☀️ 과 놀아야 건강해요 !</div>
            <div className={styles.miniG_badge}>🐛 가 있으면 아파요 !</div>
          </div>
          <div className={styles.miniG_seed_score}>
            <div className={styles.miniG_score} aria-live="polite">
              수확: <span>{state.score}</span>개
            </div>
            <button className={`${styles.miniG_seed} ${styles.miniG_resetBtn}`} onClick={reset}>
              다시하기
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${styles.miniG_toast} ${toastMsg ? styles.miniG_show : ''}`}
        role="status"
        aria-live="polite"
      >
        {toastMsg}
      </div>
    </div>
  );
}
