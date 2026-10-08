import { useState } from "react";
import MapScreen from "./components/MapScreen";
import GameScreen from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";
import ReviewScreen from "./components/ReviewScreen";
import { loadProgress, resetProgress, saveLevelResult } from "./utils/storage";
import type { GameProgress } from "./types";

type Screen = "map" | "game" | "result" | "review";

export default function App() {
  const [progress, setProgress] = useState<GameProgress>(() => loadProgress());
  const [screen, setScreen] = useState<Screen>("map");
  const [level, setLevel] = useState(1);
  const [lastResult, setLastResult] = useState({
    score: 0,
    stars: 0,
    correct: 0,
    bestTime: 0,
  });

  const startLevel = (selectedLevel: number) => {
    if (selectedLevel <= progress.unlockedLevel) {
      setLevel(selectedLevel);
      setScreen("game");
    }
  };

  const finishLevel = (result: typeof lastResult) => {
    setLastResult(result);
    setProgress((current) => saveLevelResult(current, level, result));
    setScreen("result");
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ tiến độ và chơi lại từ Map 1 không?")) {
      setProgress(resetProgress());
      setLevel(1);
      setScreen("map");
    }
  };

  if (screen === "game") {
    return (
      <GameScreen
        level={level}
        progress={progress}
        onFinish={finishLevel}
        onBack={() => setScreen("map")}
      />
    );
  }

  if (screen === "review") { return <ReviewScreen onBack={() => setScreen("map")} />; }

  if (screen === "result") {
    return (
      <ResultScreen
        level={level}
        result={lastResult}
        onNext={() => {
          if (level < 10) {
            setLevel(level + 1);
            setScreen("game");
          }
        }}
        onMap={() => setScreen("map")}
      />
    );
  }

  return <MapScreen progress={progress} onStart={startLevel} onReview={() => setScreen("review")} onReset={handleReset} />;
}