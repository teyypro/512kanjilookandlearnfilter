// src/components/KanjiStrokeAnimator.jsx
import { useState, useEffect, useRef } from "react";
import styles from "./KanjiStrokeAnimator.module.css";

function KanjiStrokeAnimator({ svgContent }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
  const [colorizeStrokes, setColorizeStrokes] = useState(false);
  const containerRef = useRef(null);
  const pathsRef = useRef([]);

  const strokeColors = [
    "#e74c3c", "#3498db", "#2ecc71", "#f1c40f",
    "#9b59b6", "#e67e22", "#1abc9c", "#16a085",
    "#e84393", "#8e44ad",
  ];

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    // Xóa nội dung cũ và chèn SVG mới
    containerRef.current.innerHTML = svgContent;

    const svg = containerRef.current.querySelector("svg");
    if (!svg) return;

    // Đặt kích thước cố định nhưng responsive
    svg.setAttribute("width", "280");
    svg.setAttribute("height", "280");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    const strokePaths = svg.querySelectorAll(
      'g[id^="kvg\\:StrokePaths"] path[id^="kvg\\:"]'
    );

    pathsRef.current = Array.from(strokePaths);

    resetToInitial();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      pathsRef.current = [];
    };
  }, [svgContent]);

  // Ẩn/hiện số thứ tự nét
  useEffect(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;

    const numbersGroup = svg.querySelector('g[id^="kvg\\:StrokeNumbers"]');
    if (numbersGroup) {
      numbersGroup.style.display = showNumbers ? "" : "none";
    }
  }, [showNumbers]);

  // Xử lý animation + màu nét
  useEffect(() => {
    if (pathsRef.current.length === 0) return;

    pathsRef.current.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = isAnimating ? `${length}` : "0";
      path.style.stroke = colorizeStrokes
        ? strokeColors[pathsRef.current.indexOf(path) % strokeColors.length]
        : "#0f172a"; // Màu đen đậm psychology-friendly
    });

    if (isAnimating) {
      pathsRef.current.forEach((path, index) => {
        path.style.transition = "none";
        path.getBoundingClientRect(); // Force reflow
        const delay = index * 0.7;
        path.style.transition = `stroke-dashoffset 0.8s ease-in-out ${delay}s`;
        path.style.strokeDashoffset = "0";
      });

      const estimatedTime = pathsRef.current.length * 800 + 1200;
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, estimatedTime);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, colorizeStrokes]);

  const resetToInitial = () => {
    setIsAnimating(false);
    setColorizeStrokes(false);
    setShowNumbers(true);

    pathsRef.current.forEach((path) => {
      path.style.transition = "none";
      path.style.strokeDashoffset = "0";
      path.style.stroke = "#0f172a";
    });
  };

  const handleAnimate = () => setIsAnimating(true);
  const handleReset = () => resetToInitial();

  if (!svgContent) {
    return <p className={styles.loading}>Đang tải thứ tự nét bút...</p>;
  }

  return (
    <div className={styles.animatorContainer}>
      <div ref={containerRef} className={styles.svgWrapper} />

      <div className={styles.controls}>
        <button
          onClick={handleAnimate}
          disabled={isAnimating}
          className={`${styles.btn} ${styles.animateBtn}`}
        >
          Play Stroke ✏️
        </button>

        <button
          onClick={handleReset}
          className={`${styles.btn} ${styles.resetBtn}`}
        >
          Reset
        </button>

        <button
          onClick={() => setShowNumbers((prev) => !prev)}
          className={`${styles.btn} ${styles.toggleBtn}`}
        >
          {showNumbers ? "Ẩn số nét" : "Hiện số nét"}
        </button>

        <button
          onClick={() => setColorizeStrokes((prev) => !prev)}
          className={`${styles.btn} ${styles.colorBtn} ${colorizeStrokes ? styles.active : ""}`}
        >
          {colorizeStrokes ? "Tắt màu nét" : "Màu sắc nét"}
        </button>
      </div>
    </div>
  );
}

export default KanjiStrokeAnimator;