import { LEVELS } from "../data/levels";

interface ResultScreenProps {
  level: number;
  result: { score: number; stars: number; correct: number; bestTime: number };
  onNext: () => void;
  onMap: () => void;
}

export default function ResultScreen({ level, result, onNext, onMap }: ResultScreenProps) {
  const isFinal = level === 10;
  const nextUnlocked = level < 10;
  const info = LEVELS[level - 1];

  return (
    <main className={`result-screen ${info.colorClass}`}>
      <div className="result-decor">✦ ✧ ✦</div>
      <section className="result-card">
        <div className="result-icon">{isFinal ? "👑" : result.stars >= 2 ? "🏆" : "🛡️"}</div>
        <div className="eyebrow">{isFinal ? "NHIỆM VỤ CUỐI CÙNG" : `MAP ${level} HOÀN THÀNH`}</div>
        <h1>{isFinal ? "Bạn đã giải cứu công chúa!" : "Xuất sắc!"}</h1>
        <p className="result-subtitle">
          {isFinal ? "Vương quốc đã được cứu. Bạn là người hùng!" : `Bạn đã vượt qua ${info.name}.`}
        </p>

        <div className="stars-big">
          {[1, 2, 3].map((star) => <span key={star}>{star <= result.stars ? "★" : "☆"}</span>)}
        </div>

        <div className="result-stats">
          <div><span>⭐ Điểm</span><strong>{result.score}</strong></div>
          <div><span>🎯 Chính xác</span><strong>{result.correct}/10</strong></div>
          <div><span>⏱️ Thời gian</span><strong>{result.bestTime.toFixed(1)}s</strong></div>
        </div>

        <div className="result-actions">
          {nextUnlocked && <button onClick={onNext}>Map tiếp theo →</button>}
          <button className={nextUnlocked ? "secondary" : ""} onClick={onMap}>🗺️ Về bản đồ</button>
        </div>
      </section>
    </main>
  );
}