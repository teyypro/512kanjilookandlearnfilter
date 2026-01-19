import { useState, useEffect, useRef } from "react";

function KanjiStrokeAnimator({ svgContent }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
  const [colorizeStrokes, setColorizeStrokes] = useState(false);
  const containerRef = useRef(null);
  const pathsRef = useRef([]);

  const strokeColors = [
    "#e74c3c", "#3498db", "#2ecc71", "#f1c40f",
    "#9b59b6", "#e67e22", "#1abc9c", "#34495e",
  ];

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    containerRef.current.innerHTML = svgContent;

    const svg = containerRef.current.querySelector("svg");
    if (!svg) return;

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

  useEffect(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;

    const numbersGroup = svg.querySelector('g[id^="kvg\\:StrokeNumbers"]');
    if (numbersGroup) {
      numbersGroup.style.display = showNumbers ? "" : "none";
    }
  }, [showNumbers]);

  useEffect(() => {
    if (pathsRef.current.length === 0) return;

    if (isAnimating) {
      pathsRef.current.forEach((path, index) => {
        const length = path.getTotalLength();
        path.style.transition = "none";
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.stroke = colorizeStrokes
          ? strokeColors[index % strokeColors.length]
          : "#000000";
        path.getBoundingClientRect();
        const delay = index * 0.8;
        path.style.transition = `stroke-dashoffset 0.8s ease-in-out ${delay}s`;
        path.style.strokeDashoffset = "0";
      });

      const estimatedTime = pathsRef.current.length * 800 + 1000;
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, estimatedTime);

      return () => clearTimeout(timer);
    } else {
      pathsRef.current.forEach((path) => {
        path.style.transition = "none";
        path.style.strokeDashoffset = "0";
      });
    }
  }, [isAnimating]);

  useEffect(() => {
    pathsRef.current.forEach((path, index) => {
      path.style.stroke = colorizeStrokes
        ? strokeColors[index % strokeColors.length]
        : "#000000";
    });
  }, [colorizeStrokes]);

  const resetToInitial = () => {
    setIsAnimating(false);
    pathsRef.current.forEach((path) => {
      const length = path.getTotalLength();
      path.style.transition = "none";
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = "0";
      path.style.stroke = "#000000";
    });
    setColorizeStrokes(false);
    setShowNumbers(true);
  };

  const handleAnimate = () => setIsAnimating(true);
  const handleReset = () => resetToInitial();

  if (!svgContent) {
    return <p>Đang tải dữ liệu kanji...</p>;
  }

  return (
    <div>
      <div ref={containerRef} />
      <div>
        <button onClick={handleAnimate} disabled={isAnimating}>
          Animate
        </button>
        <button onClick={handleReset}>
          Reset về ban đầu
        </button>
        <button onClick={() => setShowNumbers((prev) => !prev)}>
          {showNumbers ? "Ẩn số nét" : "Hiện số nét"}
        </button>
        <button onClick={() => setColorizeStrokes((prev) => !prev)}>
          {colorizeStrokes ? "Tắt màu nét" : "Bật màu nét"}
        </button>
      </div>
    </div>
  );
}

export default KanjiStrokeAnimator;
