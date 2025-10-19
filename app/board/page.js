"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./board.module.css";
import { FAQ_TABS, FAQ_ITEMS } from "../../data/faq";

export default function LittleFarmerPage() {
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState("전체");
  const [mode, setMode] = useState("list");      // "list" | "write"
  const [visibleCount, setVisibleCount] = useState(4);
  const [editingId, setEditingId] = useState(null);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // form
  const [title, setTitle] = useState("");
  const [body, setBody]   = useState("");
  const [file, setFile]   = useState(null);
  const [preview, setPreview] = useState("");

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) { setFile(null); setPreview(""); return; }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };
  const fileToDataUrl = (f) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  async function fetchPosts(selectedTab = tab) {
    try {
      setLoading(true);
      const qs = new URLSearchParams();
      if (selectedTab && selectedTab !== "전체") qs.set("cat", selectedTab);
      qs.set("page", "1");
      qs.set("pageSize", "200");
      const res = await fetch(`/api/posts?${qs.toString()}`, { cache: "no-store" });
      const data = await res.json();
      setPosts(data.items || []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { fetchPosts(tab); setVisibleCount(4); }, [tab]);

  const allItems = useMemo(() => [...posts, ...FAQ_ITEMS], [posts]);
  const list = useMemo(() => (tab === "전체" ? allItems : allItems.filter(i => i.cat === tab)), [tab, allItems]);
  const filtered = useMemo(() => list.slice(0, visibleCount), [list, visibleCount]);
  const hasMore = visibleCount < list.length;

  // ✏️ 편집
  const onEdit = (item) => {
    if (!item.user) return; // 사용자 글만 편집
    setEditingId(item._id || item.id);
    setTitle(item.q || "");
    setBody(item.a || "");
    setPreview(item.img || "");
    setFile(null);
    setMode("write");
    setToast("✏️ 수정 모드입니다");
    setTimeout(() => setToast(""), 1600);
  };

  // 🗑️ 삭제
  const onDelete = async (item) => {
    if (!item?._id) {
      setToast("삭제할 ID가 없습니다.");
      setTimeout(() => setToast(""), 1800);
      return;
    }
    if (!window.confirm("정말 삭제하시겠어요?")) return;
    try {
      const res = await fetch(`/api/posts/${item._id}`, { method: "DELETE" });
      const text = await res.text();
      let data; try { data = JSON.parse(text); } catch { data = { error: text }; }
      if (!res.ok) {
        setToast(data?.error || "삭제 실패");
        setTimeout(() => setToast(""), 2200);
        return;
      }
      setToast("🗑️ 삭제되었습니다.");
      setTimeout(() => setToast(""), 1600);
      await fetchPosts(tab);
      setVisibleCount(4);
    } catch (e) {
      console.error(e);
      setToast("네트워크 오류로 삭제 실패");
      setTimeout(() => setToast(""), 2200);
    }
  };

  // 등록/수정 제출
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let img = preview || null;
      if (file) img = await fileToDataUrl(file);

      let res, data;
      if (editingId) {
        res = await fetch(`/api/posts/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: title, a: body, img }),
        });
      } else {
        res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: title, a: body, img }),
        });
      }

      const text = await res.text();
      try { data = JSON.parse(text); } catch { data = { error: text }; }

      if (!res.ok) {
        setToast(data?.error || (editingId ? "수정 실패" : "저장 실패"));
        setTimeout(() => setToast(""), 2200);
        return;
      }

      setToast(editingId ? "✅ 수정되었습니다!" : "🌿 등록되었습니다!");
      setTimeout(() => setToast(""), 1800);

      const newCat = data?.item?.cat || tab || "전체";
      setTitle(""); setBody(""); setFile(null); setPreview("");
      setEditingId(null);
      setMode("list");
      setTab(newCat);
      await fetchPosts(newCat);
      setVisibleCount(4);
    } catch (err) {
      console.error(err);
      setToast("네트워크 오류가 발생했어요.");
      setTimeout(() => setToast(""), 2200);
    }
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setTitle(""); setBody(""); setFile(null); setPreview("");
    setMode("list");
  };

  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <h2>리틀파머 (Little Farmer)</h2>
        <p>‘작은 농부’라는 뜻으로, 도시 속에서도 자연을 가까이 경험할 수 있는 아이들을 상징합니다.</p>
        <p>작은 씨앗을 심는 순간부터 자라나는 과정까지,</p>
        <p>리틀파머는 아이들의 배움·돌봄·성장을 함께합니다.</p>
      </section>

      <div className={styles.topbar}>
        <div className={styles.tabs}>
          {FAQ_TABS.map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${t === tab ? styles.active : ""}`}
              onClick={() => setTab(t)}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>

        {mode === "list" ? (
          <button className={styles.writeBtn} onClick={() => { setMode("write"); setEditingId(null); }} type="button">
            글쓰기
          </button>
        ) : (
          <button className={styles.writeBtnGhost} onClick={onCancelEdit} type="button">
            {editingId ? "편집취소" : "목록보기"}
          </button>
        )}
      </div>

      {mode === "list" ? (
        <section className={styles.faqWrap}>
          {loading && <div style={{ padding: 12, fontWeight: 700 }}>불러오는 중…</div>}
          <div className={styles.grid}>
            {filtered.map((item) => (
              <article key={item._id || item.id} className={styles.card}>
                {item.user && (
                  <>
                    <button
                      aria-label="수정하기"
                      className={styles.editBtn}
                      onClick={() => onEdit(item)}
                      type="button"
                      title="수정"
                    >
                      ✏️
                    </button>
                    <button
                      aria-label="삭제하기"
                      className={styles.delBtn}
                      onClick={() => onDelete(item)}
                      type="button"
                      title="삭제"
                    >
                      🗑️
                    </button>
                  </>
                )}

                <div className={styles.cardText}>
                  <h4>Q. {item.q}</h4>
                  <p>{item.a}</p>
                </div>
                <div className={styles.cardImg}>
                  {item.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.img} alt={item.q} className={styles.imgFill} />
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          {hasMore && (
            <button className={styles.more} onClick={() => setVisibleCount((p) => p + 4)} type="button">
              MORE
            </button>
          )}
        </section>
      ) : (
        <section className={styles.composeWrap}>
          <form className={styles.compose} onSubmit={onSubmit}>
            <div className={styles.formRow}>
              <div className={styles.labelPill}>제목</div>
              <input
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요 (예: 씨앗 키트 후기)"
                required
              />
            </div>
            <hr className={styles.hr} />
            <div className={styles.formRow}>
              <div className={styles.labelPill}>내용</div>
              <textarea
                className={styles.textarea}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="내용을 입력하세요"
                rows={10}
                required
              />
            </div>
            <hr className={styles.hr} />
            <div className={styles.formRow}>
              <div className={styles.labelPill}>사진</div>
              <div className={styles.fileArea}>
                <label className={styles.fileBtn}>
                  사진 첨부 하기
                  <input type="file" accept="image/*" onChange={onPickFile} hidden />
                </label>
                {preview && (
                  <div className={styles.preview}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="미리보기" />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.btnPrimary}>
                {editingId ? "수정완료" : "등록하기"}
              </button>
            </div>
          </form>
        </section>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </main>
  );
}
