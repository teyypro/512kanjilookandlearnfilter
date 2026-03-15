// src/components/FullDisplay.jsx
import { useState, useMemo, useContext, useEffect, useRef } from "react";
import styles from "./FullDisplay.module.css";
import VocabExportTextarea from "./VocabExportTextarea";
import { VoiceContext } from "../GetVoicesList";

function FullDisplay({ kanji_info, kanji_list }) {
  const totalLessons = Math.ceil(kanji_info.length / 16);

  // ─── Bộ lọc & hiển thị ───────────────────────────────────────
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [filterMode, setFilterMode] = useState("none");
  const [startLesson, setStartLesson] = useState(1);
  const [endLesson, setEndLesson] = useState(totalLessons);
  const [showOnlyLearnedVocab, setShowOnlyLearnedVocab] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({
    stt: true,
    kanji: true,
    radical: false,
    stroke: false,
    hanViet: true,
    description: false,
    on: false,
    kun: false,
    vocab: true,
  });

  const [showSettingsPanel, setShowSettingsPanel] = useState(true);

  const toggleColumn = (col) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  const selectedLessonNumbers = useMemo(() => {
    if (filterMode === "all") {
      return Array.from({ length: totalLessons }, (_, i) => i + 1);
    }
    if (filterMode === "range" && startLesson <= endLesson) {
      return Array.from(
        { length: endLesson - startLesson + 1 },
        (_, i) => startLesson + i
      );
    }
    if (filterMode === "custom") {
      return selectedLessons;
    }
    return [];
  }, [filterMode, selectedLessons, startLesson, endLesson, totalLessons]);

  const maxSelectedLesson = useMemo(() => {
    if (selectedLessonNumbers.length === 0) return 0;
    return Math.max(...selectedLessonNumbers);
  }, [selectedLessonNumbers]);

  const learnedKanjiSet = useMemo(() => {
    const set = new Set();
    for (let lesson = 1; lesson <= maxSelectedLesson; lesson++) {
      const lessonIndex = lesson - 1;
      if (lessonIndex < kanji_list.length) {
        kanji_list[lessonIndex].forEach((kanjiObj) => {
          if (kanjiObj.kanji) set.add(kanjiObj.kanji);
        });
      }
    }
    return set;
  }, [maxSelectedLesson, kanji_list]);

  const filteredKanji = useMemo(() => {
    const startIndices = selectedLessonNumbers.map((num) => (num - 1) * 16);
    const endIndices = startIndices.map((start) => start + 16);
    return startIndices.reduce((acc, start, idx) => {
      const end = endIndices[idx];
      return acc.concat(kanji_info.slice(start, end));
    }, []);
  }, [kanji_info, selectedLessonNumbers]);

  const isVocabFullyLearned = (vocabStr) => {
    if (!vocabStr) return true;
    for (const char of vocabStr) {
      if (/[\u3040-\u309F\u30A0-\u30FF々ー\s\-・。、！？]/.test(char)) continue;
      if (!learnedKanjiSet.has(char)) return false;
    }
    return true;
  };

  // ─── Đọc tự động ─────────────────────────────────────────────
  const { voices, speech } = useContext(VoiceContext);
  const [isReading, setIsReading] = useState(false);
  const [currentReadIndex, setCurrentReadIndex] = useState(0);
  const allVocabsRef = useRef([]);

  const SpeakOut = (text) => {
    if (!text || !speech?.voice) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = speech.voice;
    utter.rate = speech.rate ?? 1;
    utter.pitch = speech.pitch ?? 1;
    utter.volume = speech.volume ?? 1;
    utter.lang = "ja-JP";
    speechSynthesis.speak(utter);
  };

  useEffect(() => {
    allVocabsRef.current = [];
    filteredKanji.forEach((kanji) => {
      const vocabs = showOnlyLearnedVocab
        ? (kanji.vocabs || []).filter((v) => isVocabFullyLearned(v.vocab))
        : (kanji.vocabs || []);
      allVocabsRef.current.push(...vocabs);
    });
  }, [filteredKanji, showOnlyLearnedVocab, learnedKanjiSet]);

  useEffect(() => {
    if (!isReading) return;

    const interval = setInterval(() => {
      setCurrentReadIndex((prev) => {
        const next = prev + 1;
        if (next >= allVocabsRef.current.length) {
          setIsReading(false);
          return 0;
        }
        const vocab = allVocabsRef.current[next];
        if (vocab?.hiragana) {
          SpeakOut(vocab.hiragana);
        }
        return next;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isReading]);

  useEffect(() => {
    if (isReading && currentReadIndex > 0) {
      const elem = document.getElementById(`voca_no_${currentReadIndex}`);
      elem?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentReadIndex, isReading]);

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <header className={styles.nav}>
        <h1 className={styles.navBrand}>512 Kanji Look&Learn Filter</h1>

        <div className={styles.headerControls}>
          <button
            className={`${styles.settingsBtn} ${showSettingsPanel ? styles.active : ""}`}
            onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            title="Cài đặt lọc & hiển thị"
          >
            ⚙️
          </button>

          <button
            className={`${styles.readingBtn} ${isReading ? styles.readingActive : ""}`}
            onClick={() => {
              setIsReading((prev) => {
                if (!prev) setCurrentReadIndex(0);
                return !prev;
              });
            }}
          >
            {isReading ? "⏹" : "▶️"}
          </button>
        </div>
      </header>

      {/* Settings Drawer */}
  
        {/* // <div className={styles.settingsOverlay} onClick={() => setShowSettingsPanel(false)}> */}
          <div className={styles.settingsPanel} onClick={(e) => e.stopPropagation()} style={{ 
            transform: `translate(-50%,${showSettingsPanel ? "0" : "200%"})`,
            scale: `${showSettingsPanel ? "1" : "0.5"}` }}>
            <div className={styles.panelchoicer}>
              <h3>Cài đặt</h3>
              <button className={styles.closeBtn} onClick={() => setShowSettingsPanel(false)}>
                ×
              </button>
            </div>

            {/* Lọc bài học */}
            <section className={styles.section}>
              <h4>Lọc bài học</h4>
              <div className={styles.filterOptions}>
                <label>
                  <input
                    type="radio"
                    name="filterMode"
                    value="all"
                    checked={filterMode === "all"}
                    onChange={() => setFilterMode("all")}
                  />
                  Tất cả
                </label>
                <label>
                  <input
                    type="radio"
                    name="filterMode"
                    value="range"
                    checked={filterMode === "range"}
                    onChange={() => setFilterMode("range")}
                  />
                  Từ bài
                  <input
                    type="number"
                    min={1}
                    max={totalLessons}
                    value={startLesson}
                    onChange={(e) => setStartLesson(Math.max(1, Number(e.target.value) || 1))}
                  />
                  đến
                  <input
                    type="number"
                    min={1}
                    max={totalLessons}
                    value={endLesson}
                    onChange={(e) => setEndLesson(Math.min(totalLessons, Number(e.target.value) || totalLessons))}
                  />
                </label>
                <label>
                  <input
                    type="radio"
                    name="filterMode"
                    value="custom"
                    checked={filterMode === "custom"}
                    onChange={() => setFilterMode("custom")}
                  />
                  Chọn bài
                </label>
              </div>

              {filterMode === "custom" && (
                <div className={styles.customGrid}>
                  {Array.from({ length: totalLessons }, (_, i) => i + 1).map((n) => (
                    <label key={n}>
                      <input
                        type="checkbox"
                        checked={selectedLessons.includes(n)}
                        onChange={(e) =>
                          setSelectedLessons((prev) =>
                            e.target.checked ? [...prev, n] : prev.filter((x) => x !== n)
                          )
                        }
                      />
                      {n}
                    </label>
                  ))}
                </div>
              )}
            </section>

            {/* Tùy chọn hiển thị */}
            <section className={styles.section}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={showOnlyLearnedVocab}
                  onChange={(e) => setShowOnlyLearnedVocab(e.target.checked)}
                />
                Chỉ hiện từ vựng đã học hết Kanji
              </label>

              <VocabExportTextarea
                filteredKanji={filteredKanji}
                showOnlyLearnedVocab={showOnlyLearnedVocab}
                learnedKanjiSet={learnedKanjiSet}
              />
            </section>

            {/* Hiện/Ẩn cột */}
            <section className={styles.section}>
              <h4>Hiện/Ẩn cột</h4>
              <div className={styles.columnToggles}>
                {Object.keys(visibleColumns).map((col) => (
                  <label key={col} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={visibleColumns[col]}
                      onChange={() => toggleColumn(col)}
                    />
                    {col === "stt" ? "STT" : col === "hanViet" ? "Hán Việt" : col.charAt(0).toUpperCase() + col.slice(1)}
                  </label>
                ))}
              </div>
            </section>
          </div>
        {/* // </div> */}


      {/* Nội dung chính */}
      <main className={styles.mainContent}>
        <div className={styles.kanjiGrid}>
          {filteredKanji.length === 0 ? (
            <div className={styles.empty}>EMPTY *☆[]~(￣▽￣)~*</div>
          ) : (
            filteredKanji.map((kanji, idx) => {
              const displayedVocabs = showOnlyLearnedVocab
                ? (kanji.vocabs || []).filter((v) => isVocabFullyLearned(v.vocab))
                : (kanji.vocabs || []);

              return (
                <div key={kanji.kanji || idx} className={styles.kanjiCard}>
                  <div className={styles.cardHeader}>
                    {visibleColumns.stt && (
                      <div className={styles.cardField}>
                        <span className={styles.label}>STT</span>
                        <strong>{kanji.stt}</strong>
                      </div>
                    )}

                    {visibleColumns.kanji && (
                      <div className={`${styles.cardField} ${styles.kanjiMain}`}>
                        <span className={styles.label}>Kanji</span>
                        <div className={styles.kanjiBig}>{kanji.kanji || "—"}</div>
                      </div>
                    )}

                    {visibleColumns.radical && (
                      <div className={styles.cardField}>
                        <span className={styles.label}>Bộ thủ</span>
                        <span>{kanji.radical || "—"}</span>
                      </div>
                    )}

                    {visibleColumns.stroke && (
                      <div className={styles.cardField}>
                        <span className={styles.label}>Nét</span>
                        <span>{kanji.stroke || "—"}</span>
                      </div>
                    )}

                    {visibleColumns.hanViet && (
                      <div className={styles.cardField}>
                        <span className={styles.label}>Hán Việt</span>
                        <span>{kanji.hanViet || "—"}</span>
                      </div>
                    )}

                    {visibleColumns.description && (
                      <div className={styles.cardField}>
                        <span className={styles.label}>Ý nghĩa</span>
                        <span>{kanji.description || "—"}</span>
                      </div>
                    )}

                    {visibleColumns.on && (
                      <div className={styles.cardField}>
                        <span className={styles.label}>On'yomi</span>
                        <div>
                          {kanji.on?.length > 0
                            ? kanji.on.map((o) => `${o.jp} (${o.romaji})`).join("、 ")
                            : "—"}
                        </div>
                      </div>
                    )}

                    {visibleColumns.kun && (
                      <div className={styles.cardField}>
                        <span className={styles.label}>Kun'yomi</span>
                        <div>
                          {kanji.kun?.length > 0
                            ? kanji.kun.map((k) => `${k.jp} (${k.romaji})`).join("、 ")
                            : "—"}
                        </div>
                      </div>
                    )}
                  </div>

                  {visibleColumns.vocab && (
                    <div className={styles.vocabSection}>
                      <h4>Từ vựng</h4>
                      {displayedVocabs.length > 0 ? (
                        <ul className={styles.vocabList}>
                          {displayedVocabs.map((v, i) => {
                            const globalIndex = allVocabsRef.current.indexOf(v);
                            const isActive = isReading && globalIndex === currentReadIndex;

                            return (
                              <li
                                key={i}
                                id={`voca_no_${globalIndex}`}
                                className={`${styles.vocabItem} ${isActive ? styles.active : ""}`}
                                onClick={() => {
                                  SpeakOut(v.hiragana +","+ (v.samples?.[0]?.jp || "") +","+ (v.samples?.[1]?.jp || "") +","+ (v.samples?.[2]?.jp || ""));
                                  setCurrentReadIndex(globalIndex);
                                }}
                              >
                                <div className={styles.vocabMain}>
                                  <strong className={styles.vocabWord}>{v.vocab}</strong>
                                  <span className={styles.hiragana}>{v.hiragana}</span>
                                  <span className={styles.romaji}> / {v.romaji}</span>
                                </div>
                                <div className={styles.meaning}>{v.meaning}</div>

                                {v.samples?.length > 0 && (
                                  <div className={styles.samples}>
                                    Ví dụ:
                                    <ul>
                                      {v.samples.map((s, si) => (
                                        <li key={si}>
                                          <span className={styles.jpEx}>{s.jp}</span>
                                          <span className={styles.vnEx}>{s.vn}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <span className={styles.noData}>—</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

export default FullDisplay;