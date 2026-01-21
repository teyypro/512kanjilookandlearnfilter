// src/pages/KanjiPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import KanjiStrokeAnimator from "../components/KanjiStrokeAnimator";
import AudioSpeech from "../components/AudioSpeech";
import styles from "./KanjiPage.module.css";

function KanjiPage({ kanji_info }) {
  const { id } = useParams();
  const navigate = useNavigate(); // Để quay về trang chủ
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
          if (svgStartIndex !== -1) {
            const cleaned = data.slice(svgStartIndex).trim();
            setSvgContent(cleaned);
          } else {
            setSvgContent(data.trim());
          }
        })
        .catch((err) => console.error("Lỗi fetch SVG:", err));
    }
  }, [id, kanji_info]);

  if (!kanji) return <div className={styles.kanjiContainer}>Đang tải...</div>;

  return (
    <>
      {/* Thanh navigate fixed */}
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
          <span className={styles.separator}> - </span>
          <span className={styles.hanvietTitle}>{kanji.hanViet}</span>
        </div>
      </nav>

      {/* Nội dung chính */}
      <div className={styles.kanjiContainer}>
        <h1 className={styles.mainTitle}>{kanji.kanji}</h1>
        <p className={styles.hanviet}>{kanji.hanViet}</p>

        <section className={styles.strokeSection}>
          <h2 className={styles.sectionTitle}>Thứ tự nét bút</h2>
          <div className={styles.strokeContainer}>
            <KanjiStrokeAnimator svgContent={svgContent} />
          </div>
        </section>

        {kanji.description && (
          <p className={styles.description}>{kanji.description}</p>
        )}

        <section className={styles.readingSection}>
          <h2 className={styles.sectionTitle}>Âm On</h2>
          <div className={styles.reading}>
            <span className={styles.label}>Kanji On:</span>
            {kanji.on?.data} <small>({kanji.on?.romaji})</small>
          </div>
        </section>

        <section className={styles.readingSection}>
          <h2 className={styles.sectionTitle}>Âm Kun</h2>
          <div className={styles.reading}>
            <span className={styles.label}>Kanji Kun:</span>
            {kanji.kun?.data} <small>({kanji.kun?.romaji})</small>
          </div>
        </section>

        <section className={styles.vocabSection}>
          <h2 className={styles.sectionTitle}>Từ vựng</h2>
          {kanji.vocabs?.length > 0 ? (
            <ul className={styles.vocabList}>
              {kanji.vocabs.map((v, index) => (
                <li key={index} className={styles.vocabItem}>
                  <div className={styles.vocabText}>{v.vocab}</div>
                  <div className={styles.vocabDetails}>
                    ({v.hiragana}, {v.romaji})
                  </div>
                  <div className={styles.vocabMeaning}>{v.meaning}</div>
                  <div className={styles.audioWrapper}>
                    <AudioSpeech text={v.hiragana} />
                  </div>
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