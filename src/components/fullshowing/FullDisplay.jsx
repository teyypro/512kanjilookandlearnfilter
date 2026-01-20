// src/components/FullDisplay.jsx
import { useState, useMemo } from "react";
import AudioSpeech from "../AudioSpeech";

function FullDisplay({ kanji_info, kanji_list }) {
  // === Phần lọc bài học ===
  const totalLessons = Math.ceil(kanji_info.length / 16);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [filterMode, setFilterMode] = useState("all");
  const [startLesson, setStartLesson] = useState(1);
  const [endLesson, setEndLesson] = useState(totalLessons);

  // Checkbox mới: chỉ hiển thị từ vựng có tất cả kanji đã học (dựa trên kanji_list)
  const [showOnlyLearnedVocab, setShowOnlyLearnedVocab] = useState(false);

  // Tính các bài được chọn (giống trước)
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

  // Tìm bài cao nhất đang được chọn → tất cả kanji từ đầu đến hết bài đó là "đã học"
  const maxSelectedLesson = useMemo(() => {
    if (selectedLessonNumbers.length === 0) return 0;
    return Math.max(...selectedLessonNumbers);
  }, [selectedLessonNumbers]);

  // Tập hợp tất cả kanji đã học (từ bài 1 đến bài maxSelectedLesson)
  const learnedKanjiSet = useMemo(() => {
    const set = new Set();

    // Duyệt từ bài 1 đến bài maxSelectedLesson
    for (let lesson = 1; lesson <= maxSelectedLesson; lesson++) {
      const lessonIndex = lesson - 1;
      if (lessonIndex < kanji_list.length) {
        kanji_list[lessonIndex].forEach((kanjiObj) => {
          if (kanjiObj.kanji) {
            set.add(kanjiObj.kanji);
          }
        });
      }
    }

    return set;
  }, [maxSelectedLesson, kanji_list]);

  // Tối ưu lọc kanji để hiển thị bảng (vẫn dùng kanji_info như cũ)
  const filteredKanji = useMemo(() => {
    let lessonNumbers = selectedLessonNumbers;

    const startIndices = lessonNumbers.map((num) => (num - 1) * 16);
    const endIndices = startIndices.map((start) => start + 16);

    return startIndices.reduce((acc, start, idx) => {
      const end = endIndices[idx];
      return acc.concat(kanji_info.slice(start, end));
    }, []);
  }, [kanji_info, selectedLessonNumbers]);

  // === Phần ẩn/hiện cột ===
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

  // Hàm kiểm tra xem từ vựng có toàn bộ kanji đã học hay không
  const isVocabFullyLearned = (vocabStr) => {
    if (!vocabStr) return true; // không có kanji thì vẫn hiển thị

    for (const char of vocabStr) {
      // Bỏ qua hiragana, katakana, dấu cách, dấu gạch nối, dấu chấm...
      if (/[\u3040-\u309F\u30A0-\u30FF々ー\s\-・。、！？]/.test(char)) {
        continue;
      }
      // Nếu là kanji mà chưa học → false
      if (!learnedKanjiSet.has(char)) {
        return false;
      }
    }
    return true;
  };

  // === Render ===
  return (
    <div>
      <h1>Tất cả các bài học Kanji</h1>
      <p>Tổng cộng {kanji_info.length} kanji</p>

      {/* Phần lọc bài học */}
      <div>
        <h3>Lọc bài học</h3>

        <label>
          <input
            type="radio"
            name="filterMode"
            value="all"
            checked={filterMode === "all"}
            onChange={() => setFilterMode("all")}
          />
          Hiển thị tất cả bài
        </label>

        <br />
        <label>
          <input
            type="radio"
            name="filterMode"
            value="range"
            checked={filterMode === "range"}
            onChange={() => setFilterMode("range")}
          />
          Từ bài:
          <input
            type="number"
            min="1"
            max={totalLessons}
            value={startLesson}
            onChange={(e) => setStartLesson(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: "60px", margin: "0 10px" }}
          />
          đến bài:
          <input
            type="number"
            min="1"
            max={totalLessons}
            value={endLesson}
            onChange={(e) => setEndLesson(Math.min(totalLessons, parseInt(e.target.value) || totalLessons))}
            style={{ width: "60px", margin: "0 10px" }}
          />
        </label>

        <br />
        <label>
          <input
            type="radio"
            name="filterMode"
            value="custom"
            checked={filterMode === "custom"}
            onChange={() => setFilterMode("custom")}
          />
          Chọn bài cụ thể:
        </label>
        <div style={{ marginTop: "10px" }}>
          {Array.from({ length: totalLessons }, (_, i) => i + 1).map((lessonNum) => (
            <label key={lessonNum} style={{ marginRight: "15px" }}>
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
              />
              Bài {lessonNum}
            </label>
          ))}
        </div>
      </div>

      {/* Checkbox mới */}
      <div style={{ margin: "20px 0" }}>
        <label>
          <input
            type="checkbox"
            checked={showOnlyLearnedVocab}
            onChange={(e) => setShowOnlyLearnedVocab(e.target.checked)}
          />
          Chỉ hiển thị từ vựng có tất cả kanji đã được học (từ bài 1 đến bài hiện tại)
        </label>
      </div>

      {/* Toggle cột */}
      <div style={{ margin: "20px 0" }}>
        <h3>Ẩn / Hiện cột</h3>
        {/* ... giữ nguyên phần toggle cột ... */}
        <label style={{ marginRight: "20px" }}>
          <input
            type="checkbox"
            checked={visibleColumns.kanji}
            onChange={() => toggleColumn("kanji")}
          />
          Kanji
        </label>
        <label style={{ marginRight: "20px" }}>
          <input
            type="checkbox"
            checked={visibleColumns.hanViet}
            onChange={() => toggleColumn("hanViet")}
          />
          Hán Việt
        </label>
        <label style={{ marginRight: "20px" }}>
          <input
            type="checkbox"
            checked={visibleColumns.description}
            onChange={() => toggleColumn("description")}
          />
          Mô tả
        </label>
        <label style={{ marginRight: "20px" }}>
          <input
            type="checkbox"
            checked={visibleColumns.on}
            onChange={() => toggleColumn("on")}
          />
          Âm On
        </label>
        <label style={{ marginRight: "20px" }}>
          <input
            type="checkbox"
            checked={visibleColumns.kun}
            onChange={() => toggleColumn("kun")}
          />
          Âm Kun
        </label>
        <label>
          <input
            type="checkbox"
            checked={visibleColumns.vocab}
            onChange={() => toggleColumn("vocab")}
          />
          Từ vựng
        </label>
      </div>

      {/* Bảng hiển thị */}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {visibleColumns.kanji && <th>Kanji</th>}
            {visibleColumns.hanViet && <th>Hán Việt</th>}
            {visibleColumns.description && <th>Mô tả</th>}
            {visibleColumns.on && <th>Âm On</th>}
            {visibleColumns.kun && <th>Âm Kun</th>}
            {visibleColumns.vocab && <th>Từ vựng</th>}
          </tr>
        </thead>
        <tbody>
          {filteredKanji.length === 0 ? (
            <tr>
              <td colSpan={Object.values(visibleColumns).filter(Boolean).length}>
                Không có kanji nào trong các bài đã chọn.
              </td>
            </tr>
          ) : (
            filteredKanji.map((kanji, index) => {
              // Lọc từ vựng nếu bật chế độ chỉ hiển thị từ đã học
              const displayedVocabs = showOnlyLearnedVocab
                ? (kanji.vocabs || []).filter((v) => isVocabFullyLearned(v.vocab))
                : (kanji.vocabs || []);

              return (
                <tr key={kanji.kanji || index}>
                  {visibleColumns.kanji && <td>{kanji.kanji || "—"}</td>}
                  {visibleColumns.hanViet && <td>{kanji.hanViet || "—"}</td>}
                  {visibleColumns.description && <td>{kanji.description || "—"}</td>}
                  {visibleColumns.on && (
                    <td>
                      {kanji.on?.data || "—"} <br />
                      <small>({kanji.on?.romaji || "—"})</small>
                    </td>
                  )}
                  {visibleColumns.kun && (
                    <td>
                      {kanji.kun?.data || "—"} <br />
                      <small>({kanji.kun?.romaji || "—"})</small>
                    </td>
                  )}
                  {visibleColumns.vocab && (
                    <td>
                      {displayedVocabs.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: "20px" }}>
                          {displayedVocabs.map((v, i) => (
                            <li key={i}>
                              {v.vocab} ({v.hiragana}, {v.romaji}) — {v.meaning}
                              <AudioSpeech text={v.hiragana} />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "—"
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FullDisplay;