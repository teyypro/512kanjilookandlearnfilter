import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VoiceContext } from "./GetVoicesList"; // điều chỉnh đường dẫn nếu cần
import KanjiStrokeAnimator from "../components/KanjiStrokeAnimator";
import styles from "./KanjiPage.module.css";

function KanjiPage({ kanji_info }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { speech } = useContext(VoiceContext); // chỉ cần speech config

  const [kanji, setKanji] = useState(null);
  const [svgContent, setSvgContent] = useState(null);

  const BASE_URL = "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/";

  const hex5 = (char) => {
    return char.codePointAt(0).toString(16).padStart(5, "0");
  };

  useEffect(() => {
    const numericId = parseInt(id, 10);
    const selected = kanji_info[numericId - 1];
    setKanji(selected);

    if (selected?.kanji) {
      const hex = hex5(selected.kanji);
      const url = BASE_URL + hex + ".svg";
      fetch(url)
        .then((res) => res.text())
        .then((data) => {
          const svgStartIndex = data.indexOf("<svg");
          const cleaned = svgStartIndex !== -1
            ? data.slice(svgStartIndex).trim()
            : data.trim();
          setSvgContent(cleaned);
        })
        .catch((err) => console.error("Lỗi fetch SVG:", err));
    }
  }, [id, kanji_info]);

  if (!kanji) return <div className={styles.kanjiContainer}>Đang tải...</div>;

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
    <>
      <nav className={styles.topNav}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/")}
          aria-label="Quay lại trang chủ"
        >
          ❮
        </button>
        <div className={styles.navTitle}>
          <span className={styles.kanjiTitle}>{kanji.kanji}</span>
          <span className={styles.separator}> ~ </span>
          <span className={styles.hanvietTitle}>{kanji.hanViet}</span>
        </div>
      </nav>

      <div className={styles.kanjiContainer}>
        {/* Thông tin cơ bản */}
        <section className={styles.basicInfo}>
          <div className={styles.kanjiMain}>
            <h1 className={styles.kanjiChar}>{kanji.kanji}</h1>
            <p className={styles.hanVietMain}>{kanji.hanViet}</p>
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Bộ thủ</span>
              <span className={styles.metaValue}>{kanji.radical || "—"}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Số nét</span>
              <span className={styles.metaValue}>{kanji.stroke || "—"}</span>
            </div>
          </div>
        </section>

        {/* Thứ tự nét bút */}
        <section className={styles.strokeSection}>
          <h2 className={styles.sectionTitle}>Thứ tự nét bút</h2>
          <div className={styles.strokeContainer}>
            <KanjiStrokeAnimator svgContent={svgContent} />
          </div>
        </section>

        {/* Mô tả */}
        {kanji.description && (
          <div className={styles.descriptionBox}>
            <p className={styles.description}>{kanji.description}</p>
          </div>
        )}

        {/* Âm On */}
        <section className={styles.readingSection}>
          <h2 className={styles.sectionTitle}>Âm On</h2>
          <div className={styles.readingList}>
            {kanji.on?.length > 0 ? (
              kanji.on.map((item, idx) => (
                <div key={idx} className={styles.readingItem}>
                  <span>{item.jp}</span>
                  <small> ({item.romaji})</small>
                </div>
              ))
            ) : (
              <p className={styles.noData}>Chưa có dữ liệu</p>
            )}
          </div>
        </section>

        {/* Âm Kun */}
        <section className={styles.readingSection}>
          <h2 className={styles.sectionTitle}>Âm Kun</h2>
          <div className={styles.readingList}>
            {kanji.kun?.length > 0 ? (
              kanji.kun.map((item, idx) => (
                <div key={idx} className={styles.readingItem}>
                  <span>{item.jp}</span>
                  <small> ({item.romaji})</small>
                </div>
              ))
            ) : (
              <p className={styles.noData}>Chưa có dữ liệu</p>
            )}
          </div>
        </section>

        {/* Từ vựng */}
        <section className={styles.vocabSection}>
          <h2 className={styles.sectionTitle}>Từ vựng</h2>
          {kanji.vocabs?.length > 0 ? (
            <ul className={styles.vocabList}>
              {kanji.vocabs.map((v, index) => (
                <li
                  key={index}
                  className={styles.vocabItem}
                  onClick={() => speak(v.hiragana)}
                  role="button"
                  tabIndex={0}
                  title="Nhấn để nghe phát âm từ vựng"
                >
                  <div
                    className={styles.vocabHeader}
                    onClick={(e) => {
                      e.stopPropagation(); // ngăn click lan ra li cha nếu cần
                      speak(v.hiragana);
                    }}
                  >
                    <div className={styles.vocabText}>{v.vocab}</div>
                    <div className={styles.vocabDetails}>
                      ({v.hiragana}, {v.romaji})
                    </div>
                  </div>

                  <div className={styles.vocabMeaning}>{v.meaning}</div>

                  {v.samples?.length > 0 && (
                    <div className={styles.samples}>
                      <h4 className={styles.sampleTitle}>Ví dụ:</h4>
                      <ul className={styles.sampleList}>
                        {v.samples.map((s, sIdx) => (
                          <li
                            key={sIdx}
                            className={styles.sampleItem}
                            onClick={(e) => {
                              e.stopPropagation(); // ngăn lan ra vocabItem
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
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noData}>Chưa có từ vựng</p>
          )}
        </section>
      </div>
    </>
  );
}

export default KanjiPage;