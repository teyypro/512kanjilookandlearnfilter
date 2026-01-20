import { Link } from "react-router-dom";

function Home({kanji_list}) {
 

  return (
    <div>
      <h1>ListKanjiHere</h1>
      {kanji_list.map((group, group_index) => (
        <div key={group_index}>
          <Link to={`/lesson/${group_index + 1}`}>
            <h2>Lesson {group_index + 1}</h2>
          </Link>
          
          <ul>
            {group.map((word, index) => (
              <li key={index}>
                <Link to={`/kanji/${group_index * 16 + index + 1}`}>
                  {word.kanji} - {word.hanViet}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Home;
