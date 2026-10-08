import { LEVELS } from "../data/levels";
import type { GameProgress } from "../types";

interface MapScreenProps {
  progress: GameProgress;
  onStart: (level: number) => void;
  onReview: () => void;
  onReset: () => void;
}

export default function MapScreen({ progress, onStart, onReview, onReset }: MapScreenProps) {
  return (
    <main className="map-screen">
      <header className="map-header">
        <div>
          <div className="eyebrow">⚔️ PHIÊU LƯU TOÁN HỌC</div>
          <h1>Giải Cứu Công Chúa</h1>
          <p>Vượt qua 10 vùng đất bằng sức mạnh của bảng cửu chương!</p>
        </div>
        <div className="map-actions"><button className="review-main-btn" onClick={onReview}>📚 Ôn tập</button><div className="score-pill">
          <span>⭐</span>
          <strong>{progress.totalScore.toLocaleString("vi-VN")}</strong>
          <small>điểm</small>
        </div></div>
      </header>

      <section className="adventure-map">
        <div className="map-cloud cloud-a">☁️</div>
        <div className="map-cloud cloud-b">☁️</div>
        <div className="map-path" />

        {LEVELS.map((level, index) => {
          const result = progress.levels[level.id];
          const locked = level.id > progress.unlockedLevel;
          const active = level.id === progress.unlockedLevel;

          return (
            <button
              key={level.id}
              className={`level-node ${level.colorClass} ${locked ? "locked" : ""} ${active ? "active" : ""}`}
              style={{
                left: `${8 + (index % 5) * 20.5}%`,
                top: `${index < 5 ? 20 + index * 11 : 64 - (index - 5) * 10}%`,
              }}
              onClick={() => !locked && onStart(level.id)}
              disabled={locked}
              aria-label={locked ? `Map ${level.id} đang khóa` : `Chơi map ${level.id}`}
            >
              <span className="node-number">{level.id}</span>
              <span className="node-icon">{locked ? "🔒" : level.emoji}</span>
              <span className="node-label">{level.name}</span>
              {result && <span className="node-stars">{"★".repeat(result.stars)}{"☆".repeat(3 - result.stars)}</span>}
            </button>
          );
        })}

        <div className="princess">
          <div className="princess-bubble">Giúp mình với! 👑</div>
          <div className="princess-character">👸</div>
        </div>
        <div className="hero-character">🧙‍♂️</div>
      </section>

      <footer className="map-footer">
        <span>Map {progress.unlockedLevel}/10 đã mở khóa</span>
        <button className="reset-btn" onClick={onReset}>↻ Chơi lại từ đầu</button>
      </footer>
    </main>
  );
}