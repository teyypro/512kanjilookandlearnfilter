import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function KanjiPage({kanji_info}) {
  const { id } = useParams(); // id từ URL
  const [kanji, setKanji] = useState(null)

  useEffect(() => {
        const numericId = parseInt(id, 10);
        const selected = kanji_info[numericId - 1];
        setKanji(selected);
      })

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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default KanjiPage;
