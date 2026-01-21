// Home.jsx
import { Link } from "react-router-dom";
import styles from './Home.module.css';

function Home({ kanji_list }) {
  return (
    <>
      {/* Navigation Bar */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.navBrand}>
         西 512KanjiLook&Learn
        </Link>
      </nav>

      <div className={styles.homeContainer}>
        {kanji_list.map((group, group_index) => (
          <div key={group_index} className={styles.lessonGroup}>
            <Link to={`/lesson/${group_index + 1}`}>
              <h2 className={styles.lessonTitle}>
                🔥 Lesson {group_index + 1}
              </h2>
            </Link>

            <ul className={styles.kanjiList}>
              {group.map((word, index) => (
                <li key={index} className={styles.kanjiItem}>
                  <Link
                    to={`/kanji/${group_index * 16 + index + 1}`}
                    className={styles.kanjiLink}
                  >
                    <h2>{word.kanji}</h2>
                    <h4>{word.hanViet}</h4>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 2 Floating Action Buttons - luôn hiện */}
      <div className={styles.fabContainer}>
        <Link to="/setting" className={`${styles.fab} ${styles.fabSetting}`}>
          ⚙️
        </Link>
        <Link to="/full_showing" className={`${styles.fab} ${styles.fabShowAll}`}>
          📝
        </Link>
      </div>
    </>
  );
}

export default Home;