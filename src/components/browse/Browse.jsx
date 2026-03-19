import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./Browse.module.css";

function Browse({ kanji_list }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState("1"); // "1" → Kanji, "2" → Vocab
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const allKanji = useMemo(() => {
    if (!Array.isArray(kanji_list)) return [];
    return kanji_list.flat();
  }, [kanji_list]);

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    let found = [];

    if (mode === "1") {
      found = allKanji
        .filter((item) =>
          item.kanji?.toLowerCase().includes(term) ||
          item.hanViet?.toLowerCase().includes(term)
        )
        .map((k) => ({ type: "kanji", data: k }));
    } else {
      allKanji.forEach((kanjiItem) => {
        if (Array.isArray(kanjiItem.vocabs)) {
          kanjiItem.vocabs.forEach((v) => {
            if (
              v.vocab?.toLowerCase().includes(term) ||
              v.hiragana?.toLowerCase().includes(term) ||
              v.romaji?.toLowerCase().includes(term) ||
              v.meaning?.toLowerCase().includes(term)
            ) {
              found.push({
                type: "vocab",
                data: { vocabData: v, kanjiData: kanjiItem },
              });
            }
          });
        }
      });
    }

    setResults(found);
    setIsSearching(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
  <div className={styles.container}>
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <div className={styles.containBar}>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className={styles.select}
            >
              <option value="1">Kanji</option>
              <option value="2">Từ vựng</option>
            </select>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.input}
            />
          </div>
          <button onClick={handleSearch} className={styles.btnSearch}>
            Tra cứu
          </button>
        </div>
      </div>

      <div className={styles.results}>
        {isSearching && <div className={styles.status}>Đang xử lý...</div>}

        {!isSearching && results.length === 0 && searchTerm.trim() && (
          <div className={styles.status}>Không có kết quả phù hợp.</div>
        )}

        {results.map((result, index) => {
          if (result.type === "kanji") {
            const k = result.data;
            return (
              <div key={`k-${index}`} className={styles.card}>
                <div className={styles.cardHeader}>
                  <Link to={`/kanji/${k.stt}`} className={styles.kanjiLink}>
                    <span className={styles.bigKanji}>{k.kanji}</span>
                  </Link>
                  <div className={styles.mainInfo}>
                    <h2 className={styles.hanviet}>{k.hanViet}</h2>
                    <p className={styles.subInfo}>
                      {k.stroke} nét — Bộ: {k.radical} — {k.stt}
                    </p>
                    <strong>{k.description}</strong>
                  </div>
                </div>

                <div className={styles.vocabSection}>

          
         {k.vocabs && k.vocabs.length > 0 ? (
            <table className={styles.vocabTable}>

              <tbody>
                {k.vocabs.map((v, vi) => (
                  <tr key={vi} className={styles.vocabRow}>
                    <td className={styles.vocabCell}>
                      <strong >{v.vocab}</strong>
                    </td>
                    <td className={styles.vocabCell}>
                      <span >{v.hiragana}</span>
                    </td>
                    <td className={styles.vocabCell}>
                      <span >{v.meaning}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.noVocab}>No Vocabs</p>
          )}
        </div>
              </div>
            );
          }

          if (result.type === "vocab") {
            const { vocabData: v, kanjiData: k } = result.data;

            return (
              <div
                key={`v-${index}`}
                className={`${styles.card} ${styles.vocabCard}`}
              >
                <div className={styles.vocabMain}>
                  <strong
                    className={styles.vocabWord}
            
                  >
                    {v.vocab}
                  </strong>
                  <div>
                    <span className={styles.hiragana}>{v.hiragana}</span>
                    <span className={styles.romaji}> / {v.romaji}</span>

                  </div>
                  
                </div>

                <div className={styles.meaning}>{v.meaning}</div>

                <Link
                  to={`/kanji/${k.stt}`}
                  className={styles.originLink}
                >
                  {k.kanji} ({k.hanViet} - {k.stt})
                </Link>

                {v.samples?.length > 0 && (
                  <div className={styles.samples}>
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
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

export default Browse;