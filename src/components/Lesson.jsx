import { useParams } from "react-router-dom";
import { useMemo, useRef, useContext } from "react";
import { VoiceContext } from "./GetVoicesList"; // điều chỉnh đường dẫn nếu cần
import styles from './Lesson.module.css';

function Lesson({ kanji_info }) {
  const { num } = useParams();
  const lessonNumber = parseInt(num, 10);
  const { speech } = useContext(VoiceContext);

  const kanjiRefs = useRef({});

  if (isNaN(lessonNumber) || lessonNumber < 1) {
    return <div className={styles.lessonContainer}>Lesson không hợp lệ: {lessonNumber}</div>;
  }

  const startIndex = (lessonNumber - 1) * 16;
  const endIndex = startIndex + 16;

  const kanjisInLesson = useMemo(() => {
    return kanji_info.slice(startIndex, endIndex);
  }, [kanji_info, startIndex, endIndex]);

  if (kanjisInLesson.length === 0) {
    return (
      <div className={styles.lessonContainer}>
        Lesson {lessonNumber} chưa có dữ liệu hoặc đã hết kanji.
      </div>
    );
  }

  const speak = (textToSpeak, lang = "ja-JP") => {
    if (!textToSpeak) return;
    if (!speech?.voice) {
      console.warn("Không có giọng nói được chọn");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.voice = speech.voice;
    utterance.rate = speech.rate ?? 1;
    utterance.pitch = speech.pitch ?? 1;
    utterance.volume = speech.volume ?? 1;
    utterance.lang = lang;

    speechSynthesis.speak(utterance);
  };

  return (
    <div className={styles.lessonContainer}>
      {/* Panel fixed danh sách kanji nhanh */}
      <div className={styles.kanjiQuickNav}>

        <div className={styles.kanjiList}>
          {kanjisInLesson.map((kanji, index) => (
            <button
              key={kanji.kanji || index}
              className={styles.kanjiQuickBtn}
              onClick={() => {
                const ref = kanjiRefs.current[kanji.kanji || index];
                if (ref) {
                  ref.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              {kanji.kanji}
            </button>
          ))}
        </div>
      </div>

      <h1 className={styles.lessonTitle}>Lesson {lessonNumber}</h1>
      <p className={styles.totalKanji}>
        Tổng cộng {kanjisInLesson.length} kanji trong lesson này
      </p>

      <div className={styles.kanjiGrid}>
        {kanjisInLesson.map((kanji, index) => (
          <div
            key={kanji.kanji || index}
            ref={(el) => (kanjiRefs.current[kanji.kanji || index] = el)}
            id={`kanji-${kanji.kanji || index}`}
            className={styles.kanjiCard}
          >
            <div className={styles.kanjiHeader}>
              <h2 className={styles.kanjiChar}>{kanji.kanji}</h2>
              <p className={styles.hanViet}>{kanji.hanViet || "—"}</p>
            </div>

            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Bộ thủ:</span>
                <span>{kanji.radical || "—"}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Số nét:</span>
                <span>{kanji.stroke || "—"}</span>
              </div>
            </div>

            {kanji.description && (
              <p className={styles.description}>{kanji.description}</p>
            )}

            <div className={styles.vocabSection}>
              <h3 className={styles.vocabTitle}>Từ vựng</h3>
              {kanji.vocabs?.length > 0 ? (
                <ul className={styles.vocabList}>
                  {kanji.vocabs.map((v, i) => (
                    <li
                      key={i}
                      className={styles.vocabItem}
                      onClick={() => speak(v.hiragana)}
                      role="button"
                      tabIndex={0}
                      title="Nhấn để nghe hiragana"
                    >
                      <div className={styles.vocabText}>{v.vocab}</div>
                      <div className={styles.vocabDetails}>
                        ({v.hiragana}, {v.romaji})
                      </div>
                      <div className={styles.vocabMeaning}>{v.meaning}</div>

                      {v.samples?.length > 0 && (
                        <ul className={styles.sampleList}>
                          {v.samples.map((s, sIdx) => (
                            <li
                              key={sIdx}
                              className={styles.sampleItem}
                              onClick={(e) => {
                                e.stopPropagation();
                                speak(s.jp);
                              }}
                              role="button"
                              tabIndex={0}
                              title="Nhấn để nghe câu ví dụ"
                            >
                              <div className={styles.jpExample}>{s.jp}</div>
                              <div className={styles.vnExample}>{s.vn}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noData}>Chưa có từ vựng</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lesson;