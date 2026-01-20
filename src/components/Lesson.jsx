import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import AudioSpeech from "./AudioSpeech";

function Lesson({ kanji_info }) {
  const { num } = useParams();
  const lessonNumber = parseInt(num, 10);

  if (isNaN(lessonNumber) || lessonNumber < 1) {
    return <div>Lesson không hợp lệ{lessonNumber}</div>;
  }

  const startIndex = (lessonNumber - 1) * 16;
  const endIndex = startIndex + 16;

  const kanjisInLesson = useMemo(() => {
    return kanji_info.slice(startIndex, endIndex);
  }, [kanji_info, startIndex, endIndex]);

  if (kanjisInLesson.length === 0) {
    return <div>Lesson {lessonNumber} chưa có dữ liệu hoặc đã hết kanji.</div>;
  }


  //getvoice

  return (
    <div>
      <h1>Lesson {lessonNumber}</h1>
      <p>Tổng cộng {kanjisInLesson.length} kanji trong lesson này</p>

      <table border="1">
        <thead>
          <tr>
            <th>Kanji</th>
            <th>Hán Việt</th>
            <th>Mô tả</th>
            <th>Từ vựng</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {kanjisInLesson.map((kanji, index) => (
            <tr key={kanji.kanji || index}>
              <td>{kanji.kanji}</td>
              <td>{kanji.hanViet || "—"}</td>
              <td>{kanji.description || "—"}</td>
              <td>
                {kanji.vocabs?.length > 0 ? (
                  <ul>
                    {kanji.vocabs.map((v, i) => (
                      <li key={i}>
                        {v.vocab} ({v.hiragana}, {v.romaji}) — {v.meaning}
                        <AudioSpeech text = {v.hiragana}/>
                        
                      </li>
                    ))}
                  </ul>
                ) : (
                  "—"
                )}
              </td>
              <td>
                <Link to={`/kanji/${kanji.kanji}`}>Xem chi tiết →</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {lessonNumber > 1 && (
          <Link to={`/lesson/${lessonNumber - 1}`}>
            ← Lesson {lessonNumber - 1}
          </Link>
        )}
        {" | "}
        <Link to={`/lesson/${lessonNumber + 1}`}>
          Lesson {lessonNumber + 1} →
        </Link>
      </div>
    </div>
  );
}

export default Lesson;
