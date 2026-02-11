// src/components/FullDisplay.jsx
import { useState, useMemo, useContext, useEffect } from "react";
import AudioSpeech from "../AudioSpeech";
import styles from "./FullDisplay.module.css";
import VocabExportTextarea from "./VocabExportTextarea";
import { VoiceContext } from "../GetVoicesList";

function FullDisplay({ kanji_info, kanji_list }) {
  const totalLessons = Math.ceil(kanji_info.length / 16);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [filterMode, setFilterMode] = useState(null);
  const [startLesson, setStartLesson] = useState(1);
  const [endLesson, setEndLesson] = useState(totalLessons);
  let allDisplayedVocabs = []
  const [showOnlyLearnedVocab, setShowOnlyLearnedVocab] = useState(false);

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

  const [visibleColumns, setVisibleColumns] = useState({
    kanji: true,
    hanViet: true,
    description: true,
    on: false,
    kun: false,
    vocab: true,
  });

  const toggleColumn = (col) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  const isVocabFullyLearned = (vocabStr) => {

    if (!vocabStr) return true;
    for (const char of vocabStr) {
      if (/[\u3040-\u309F\u30A0-\u30FF々ー\s\-・。、！？]/.test(char)) continue;
      if (!learnedKanjiSet.has(char)) return false;
    }
    return true;
  };

  const visibleColumnCount = Object.values(visibleColumns).filter(Boolean).length;

  const { voices, speech, setSpeech } = useContext(VoiceContext);
  
  const SpeakOut = (text) => {
      if (!text) return;
  
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = speech.voice;
      utter.rate = speech.rate;
      utter.pitch = speech.pitch;
      utter.volume = speech.volume;
      utter.lang = "ja-JP";
  
  
      speechSynthesis.speak(utter);
    };

    const [readWord, setReadWord] = useState(1)
    const [isReading, setIsReading] = useState(false)
useEffect(() => {
  if (!isReading) return;

  const n = allDisplayedVocabs.length;
  
  const interval = setInterval(async () => {
    // Scroll tới từ hiện tại
        // Tăng chỉ số
    setReadWord((prev) => (prev >= n ? 0 : prev + 1));
    document.getElementById(`voca_no_${readWord+1}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  // Delay 1 giây trước khi tăng chỉ số
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Đọc từ
    SpeakOut(allDisplayedVocabs[readWord]?.hiragana);
    
  
    

  }, 3000); // Tổng cộng 3 giây: 2 giây interval + 1 giây delay

  return () => clearInterval(interval);
}, [isReading, readWord, allDisplayedVocabs]);

    let stt = 1
  
  return (
    
    <div className={styles.container}>
      <button 
      className={styles.reading} 
      onClick={() => setIsReading((prev) => !prev)}
      >{isReading ? "⏹️" : "🔉"}</button>
      <h1 className={styles.title}>512 Kanji Look & Learn Filter</h1>
      <p className={styles.subtitle}>Lọc từ vựng theo các Kanji đã học</p>

      {/* Phần lọc bài học */}
      <section className={styles.filterSection}>
        <h3 className={styles.sectionTitle}>Lọc bài học</h3>

        <div className={styles.filterOptions}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="filterMode"
              value="all"
              checked={filterMode === "all"}
              onChange={() => setFilterMode("all")}
              className={styles.radio}
            />
            Hiển thị tất cả bài
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="filterMode"
              value="range"
              checked={filterMode === "range"}
              onChange={() => setFilterMode("range")}
              className={styles.radio}
            />
            Từ bài
            <input
              type="number"
              min="1"
              max={totalLessons}
              value={startLesson}
              onChange={(e) => setStartLesson(Math.max(1, parseInt(e.target.value) || 1))}
              className={styles.numberInput}
            />
            đến bài
            <input
              type="number"
              min="1"
              max={totalLessons}
              value={endLesson}
              onChange={(e) => setEndLesson(Math.min(totalLessons, parseInt(e.target.value) || totalLessons))}
              className={styles.numberInput}
            />
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="filterMode"
              value="custom"
              checked={filterMode === "custom"}
              onChange={() => setFilterMode("custom")}
              className={styles.radio}
            />
            Chọn bài cụ thể
          </label>
        </div>

        {filterMode === "custom" && (
          <div className={styles.customLessons}>
            {Array.from({ length: totalLessons }, (_, i) => i + 1).map((lessonNum) => (
              <label key={lessonNum} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedLessons.includes(lessonNum)}
                  onChange={(e) => {
                    setSelectedLessons((prev) =>
                      e.target.checked
                        ? [...prev, lessonNum]
                        : prev.filter((n) => n !== lessonNum)
                    );
                  }}
                  className={styles.checkbox}
                />
                Bài {lessonNum}
              </label>
            ))}
          </div>
        )}
      </section>

      {/* Checkbox chỉ hiển thị từ đã học */}
      <section className={styles.optionSection}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showOnlyLearnedVocab}
            onChange={(e) => setShowOnlyLearnedVocab(e.target.checked)}
            className={styles.checkbox}
          />
          Chỉ hiển thị từ vựng có tất cả kanji đã được học
        </label>
        <VocabExportTextarea
          filteredKanji={filteredKanji}
          showOnlyLearnedVocab={showOnlyLearnedVocab}
          learnedKanjiSet={learnedKanjiSet}
        /> 
      </section>

      {/* Toggle cột */}
      <section className={styles.optionSection}>
        <h3 className={styles.sectionTitle}>Ẩn / Hiện cột</h3>
        <div className={styles.columnToggles}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={visibleColumns.kanji}
              onChange={() => toggleColumn("kanji")}
              className={styles.checkbox}
            />
            Kanji
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={visibleColumns.hanViet}
              onChange={() => toggleColumn("hanViet")}
              className={styles.checkbox}
            />
            Hán Việt
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={visibleColumns.description}
              onChange={() => toggleColumn("description")}
              className={styles.checkbox}
            />
            Mô tả
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={visibleColumns.on}
              onChange={() => toggleColumn("on")}
              className={styles.checkbox}
            />
            Âm On
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={visibleColumns.kun}
              onChange={() => toggleColumn("kun")}
              className={styles.checkbox}
            />
            Âm Kun
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={visibleColumns.vocab}
              onChange={() => toggleColumn("vocab")}
              className={styles.checkbox}
            />
            Từ vựng
          </label>
        </div>
      </section>

      {/* Danh sách kanji - dùng div thay table */}
      <div className={styles.kanjiList}>
        {filteredKanji.length === 0 ? (
          <div className={styles.emptyMessage}>
            Không có kanji nào trong các bài đã chọn.
          </div>
        ) : (
  
          filteredKanji.map((kanji, index) => {
           const displayedVocabs = showOnlyLearnedVocab
              ? (kanji.vocabs || []).filter((v) => isVocabFullyLearned(v.vocab))
              : (kanji.vocabs || []);
            allDisplayedVocabs = allDisplayedVocabs.concat(displayedVocabs)
            return (
              <div key={kanji.kanji || index} className={styles.kanjiCard}>
                <div className={styles.cardHeader}>
                  {visibleColumns.kanji && (
                    <div className={`${styles.cardField} ${styles.kanjiField}`}>
                      <span className={styles.fieldLabel}>Kanji</span>
                      <span className={styles.kanjiValue}>{kanji.kanji || "—"}</span>
                    </div>
                  )}

                  {visibleColumns.hanViet && (
                    <div className={styles.cardField}>
                      <span className={styles.fieldLabel}>Hán Việt</span>
                      <span>{kanji.hanViet || "—"}</span>
                    </div>
                  )}

                  {visibleColumns.description && (
                    <div className={styles.cardField}>
                      <span className={styles.fieldLabel}>Mô tả</span>
                      <span>{kanji.description || "—"}</span>
                    </div>
                  )}

                  {visibleColumns.on && (
                    <div className={styles.cardField}>
                      <span className={styles.fieldLabel}>Âm On</span>
                      <div>
                        {kanji.on?.data || "—"}
                        <br />
                        <small className={styles.romaji}>({kanji.on?.romaji || "—"})</small>
                      </div>
                    </div>
                  )}

                  {visibleColumns.kun && (
                    <div className={styles.cardField}>
                      <span className={styles.fieldLabel}>Âm Kun</span>
                      <div>
                        {kanji.kun?.data || "—"}
                        <br />
                        <small className={styles.romaji}>({kanji.kun?.romaji || "—"})</small>
                      </div>
                    </div>
                  )}
                </div>

                {visibleColumns.vocab && (
                  <div className={styles.cardField}>
                    <span className={styles.fieldLabel}>Từ vựng</span>
                    {displayedVocabs.length > 0 ? (
                      <ul className={styles.vocabList}>
                        {displayedVocabs.map((v, i) => {
                          const current_index = stt;
                          stt++;
                          return (
                          <li key={i} 
                              className={`${styles.vocabItem} ${(current_index == readWord && isReading) ? styles.vocaChosen:''}`} 
                              onClick={()=>{SpeakOut(v.hiragana)
                                        setReadWord(current_index )
                                      console.log(current_index)}}
                              id={`voca_no_${current_index}`}>
                            <div className={styles.vocabText}>
                                <h2>{current_index}</h2>
                              <h1>{v.vocab} </h1>{v.hiragana}, {v.romaji}<h2>{v.meaning}</h2>
                            </div>
                          </li>
                        )
                        })}
                      </ul>
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
    }

export default FullDisplay;