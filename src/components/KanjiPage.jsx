import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function KanjiPage() {
  const { id } = useParams(); // id từ URL
  const [kanji, setKanji] = useState(null);

  useEffect(() => {
    fetch("/full_kanji_data.json")
      .then((res) => res.json())
      .then((data) => {
        // ép kiểu id sang số
        const numericId = parseInt(id, 10);

        // nếu muốn lấy theo index (id-1)
        const selected = data[numericId - 1];

        // hoặc nếu muốn lấy theo trường stt
        // const selected = data.find(item => item.stt === numericId);

        setKanji(selected);
      })
      .catch((err) => {
        console.log("Error loading JSON: ", err);
      });
  }, [id]);

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
