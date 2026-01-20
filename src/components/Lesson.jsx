// Lesson.jsx
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import AudioSpeech from "./AudioSpeech";
import styles from './Lesson.module.css';

function Lesson({ kanji_info }) {
  const { num } = useParams();
  const lessonNumber = parseInt(num, 10);

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

  return (
    <div className={styles.lessonContainer}>
      <h1 className={styles.lessonTitle}>🔥Lesson {lessonNumber}</h1>
      <p className={styles.totalKanji}>
        Tổng cộng {kanjisInLesson.length} kanji trong lesson này
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Kanji</th>
            <th>Hán Việt</th>
            <th>Mô tả</th>
            <th>Từ vựng</th>
          </tr>
        </thead>
        <tbody>
          {kanjisInLesson.map((kanji, index) => (
            <tr key={kanji.kanji || index}>
              <td className={styles.kanjiCell} data-label="Kanji">
                {kanji.kanji}
              </td>
              <td className={styles.hanvietCell} data-label="Hán Việt">
                {kanji.hanViet || "—"}
              </td>
              <td className={styles.descriptionCell} data-label="Mô tả">
                {kanji.description || "—"}
              </td>
              <td className={styles.vocabCell} data-label="Từ vựng">
                {kanji.vocabs?.length > 0 ? (
                  <ul>
                    {kanji.vocabs.map((v, i) => (
                      <li key={i}>
                        <div className={styles.vocabText}>{v.vocab}</div>
                        <div className={styles.vocabDetails}>
                          ({v.hiragana}, {v.romaji})
                        </div>
                        <div className={styles.vocabMeaning}>{v.meaning}</div>
                        <AudioSpeech text={v.hiragana} className={styles.audioBtn} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Lesson;