// src/components/VocabExportTextarea.jsx
import { useState, useMemo } from "react";
import styles from "./VocabExportTextarea.module.css";

function VocabExportTextarea({ filteredKanji, showOnlyLearnedVocab, learnedKanjiSet }) {
  const [isOpen, setIsOpen] = useState(false);

  // Tạo danh sách từ vựng dạng text để hiển thị trong textarea
  const exportText = useMemo(() => {
    const lines = [];

    filteredKanji.forEach((kanji) => {
      const vocabs = showOnlyLearnedVocab
        ? (kanji.vocabs || []).filter((v) => {
            if (!v.vocab) return false;
            for (const char of v.vocab) {
              if (/[\u3040-\u309F\u30A0-\u30FF々ー\s\-・。、！？]/.test(char)) continue;
              if (!learnedKanjiSet.has(char)) return false;
            }
            return true;
          })
        : (kanji.vocabs || []);

      vocabs.forEach((v) => {
        if (v.vocab && v.hiragana && v.romaji && v.meaning) {
          const line = `${v.vocab} - (${v.hiragana}, ${v.romaji}) - ${v.meaning}`;
          lines.push(line);
        }
      });
    });

    return lines.join("\n");
  }, [filteredKanji, showOnlyLearnedVocab, learnedKanjiSet]);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(exportText)
      .then(() => alert("Đã copy toàn bộ từ vựng vào clipboard!"))
      .catch((err) => alert("Không thể copy: " + err));
  };

  return (
    <>
      {/* Nút mở textarea */}
      <div className={styles.exportButtonContainer}>
        <button
          className={styles.exportButton}
          onClick={() => setIsOpen(true)}
          disabled={exportText.trim() === ""}
        >
          Xem / Copy từ vựng đã lọc (Textarea)
        </button>
      </div>

      {/* Modal chứa textarea */}
      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Từ vựng đã lọc ({exportText.split("\n").filter(Boolean).length} từ)</h2>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
              ×
            </button>

            <div className={styles.controls}>
              <button onClick={copyToClipboard} className={styles.copyButton}>
                Copy toàn bộ
              </button>
            </div>

            <textarea
              className={styles.textarea}
              value={exportText || "Không có từ vựng nào thỏa mãn điều kiện."}
              readOnly
              rows={20}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default VocabExportTextarea;