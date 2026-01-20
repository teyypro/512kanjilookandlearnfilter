import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import KanjiStrokeAnimator from "./KanjiStrokeAnimator";
import AudioSpeech from "./AudioSpeech";

function KanjiPage({ kanji_info }) {
  const { id } = useParams(); 
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
          const svgStartIndex = data.indexOf('<svg');
          if (svgStartIndex !== -1) {
            const cleaned = data.slice(svgStartIndex).trim();
            setSvgContent(cleaned);
          } else {
            setSvgContent(data.trim()); // fallback
          }
        })
        .catch((err) => console.error("Lỗi fetch SVG:", err));
    }
  }, [id, kanji_info]);

  if (!kanji) return <div>Loading...</div>;

  return (
    <div>
      <h1>{kanji.kanji} - {kanji.hanViet}</h1>
      <p>{kanji.description}</p>

      <h2>On readings</h2>
      <p>{kanji.on.data} ({kanji.on.romaji})</p>

      <h2>Kun readings</h2>
      <p>{kanji.kun.data} ({kanji.kun.romaji})</p>

      <h2>Vocabulary</h2>
      <ul>
        {kanji.vocabs.map((v, index) => (
          <li key={index}>
            {v.vocab} ({v.hiragana}, {v.romaji}) - {v.meaning}
            <AudioSpeech text = {v.hiragana}/>
          </li>
        ))}
      </ul>

      <h2>Stroke Order</h2>
      <KanjiStrokeAnimator svgContent={svgContent} />
    </div>
  );
}

export default KanjiPage;