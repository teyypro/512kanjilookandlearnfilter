// Home.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import styles from './Home.module.css';

function Home({ kanji_list }) {
  const [showJump, setShowJump] = useState(false); // true = hiện, false = ẩn

  const toggleJumpBoard = () => {
    setShowJump(prev => !prev);
  };

  return (
    <>
      {/* Navigation Bar (giữ nguyên phần nav của bạn) */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.navBrand}>
          西 512KanjiLook&Learn
        </Link>

        <div className={styles.fabContainer}>
          <Link to="/setting" className={`${styles.fab} ${styles.fabSetting}`}>
            ⚙️
          </Link>
          <Link to="/full_showing" className={`${styles.fab} ${styles.fabShowAll}`}>
            📝
          </Link>

          {/* Nút toggle bảng jump lesson */}
          <button
            onClick={toggleJumpBoard}
            className={`${styles.fab} ${styles.fabJumpToggle}`}
            title={showJump ? "Ẩn danh sách lesson" : "Hiện danh sách lesson"}
          >
            {showJump ? "下" : "上"}
          </button>
        </div>
      </nav>

      {/* Phần jump board - chỉ hiện khi showJump = true */}
   
        <div className={styles.lessonJumpContainer} style={{ bottom: `${showJump ? "0" : "-20%"}` }}>
          <div className={styles.lessonButtons}>
            {kanji_list.map((group, group_index) => {
              const lessonNum = group_index + 1;
              return (
                <button
                  key={group_index}
                  onClick={() => {
                    const element = document.getElementById(`lesson-${lessonNum}`);
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "center", // hoặc "start" nếu muốn lên đầu
                      });
                    }
                    // Tùy chọn: tự động ẩn sau khi click
                    // setShowJump(false);
                  }}
                  className={styles.lessonJumpBtn}
                >
                 {lessonNum}
                </button>
              );
            })}
          </div>
        </div>


      {/* Phần nội dung chính */}
      <div className={styles.homeContainer}>
        {kanji_list.map((group, group_index) => (
          <div
            key={group_index}
            id={`lesson-${group_index + 1}`}
            className={styles.lessonGroup}
          >
            <Link to={`/lesson/${group_index + 1}`}>🔥 
              <h5 className={styles.lessonTitle}>
                第 {group_index + 1} 課
              </h5>
            </Link>

            <ul className={styles.kanjiList}>
              {group.map((word, index) => (
                <li key={index} className={styles.kanjiItem}>
                  <Link
                    to={`/kanji/${group_index * 16 + index + 1}`}
                    className={styles.kanjiLink}
                  >
                    <h4>{group_index * 16 + index + 1}</h4>
                    <h2>{word.kanji}</h2>
                    <h3>{word.hanViet}</h3>
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