// Home.jsx
import { Link } from "react-router-dom";
import styles from './Home.module.css';  // ← Import CSS Modules

function Home({ kanji_list }) {
  return (
    <>
      {/* Navigation Bar */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.navBrand}>
          512KanjiLookAndLearn of TeyyPro
        </Link>

        <div className={styles.navLinks}>
          <Link to="/setting">Setting</Link>
          <Link to="/full_showing">Show All Kanji</Link>
        </div>
      </nav>

      <div className={styles.homeContainer}>

        {kanji_list.map((group, group_index) => (
          <div key={group_index} className={styles.lessonGroup}>
            <Link to={`/lesson/${group_index + 1}`}>
              <h2 className={styles.lessonTitle}>
                🔥Lesson {group_index + 1}
              </h2>
            </Link>

            <ul className={styles.kanjiList}>
              {group.map((word, index) => (
                <li key={index} className={styles.kanjiItem}>
                  <Link
                    to={`/kanji/${group_index * 16 + index + 1}`}
                    className={styles.kanjiLink}
                  >
                    <h2>{word.kanji}</h2>  <h4>{word.hanViet}</h4>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;