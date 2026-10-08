import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Heart, Star } from "lucide-react";
import { LEVELS } from "../data/levels";
import type { GameProgress, Question } from "../types";
import { generateQuestions } from "../utils/questions";
import TimerBar from "./TimerBar";

interface GameScreenProps {
  level: number;
  progress: GameProgress;
  onFinish: (result: { score: number; stars: number; correct: number; bestTime: number }) => void;
  onBack: () => void;
}

export default function GameScreen({ level, progress, onFinish, onBack }: GameScreenProps) {
  const info = LEVELS[level - 1];
  const [questions] = useState<Question[]>(() => generateQuestions(10));
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(info.seconds);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [paused, setPaused] = useState(false);
  const questionStarted = useRef(performance.now());
  const finished = useRef(false);

  const question = questions[index];
  const progressPercent = ((index) / questions.length) * 100;

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const stars = correct >= 9 ? 3 : correct >= 7 ? 2 : correct >= 5 ? 1 : 0;
    const result = {
      score,
      stars,
      correct,
      bestTime: info.seconds - remaining,
    };
    setTimeout(() => onFinish(result), 350);
  }, [correct, info.seconds, onFinish, remaining, score]);

  const nextQuestion = useCallback((wasCorrect: boolean, earned: number) => {
    if (wasCorrect) {
      setCorrect((value) => value + 1);
      setScore((value) => value + earned);
    }

    if (index >= questions.length - 1) {
      if (wasCorrect) {
        setCorrect((value) => value + 1);
        setScore((value) => value + earned);
      }
      setTimeout(() => {
        if (!finished.current) {
          finished.current = true;
          const finalCorrect = correct + (wasCorrect ? 1 : 0);
          const finalScore = score + (wasCorrect ? earned : 0);
          const stars = finalCorrect >= 9 ? 3 : finalCorrect >= 7 ? 2 : finalCorrect >= 5 ? 1 : 0;
          onFinish({
            score: finalScore,
            stars,
            correct: finalCorrect,
            bestTime: Math.max(0.1, info.seconds - remaining),
          });
        }
      }, 500);
      return;
    }

    setTimeout(() => {
      setIndex((value) => value + 1);
      setSelected(null);
      setFeedback(null);
      setRemaining(info.seconds);
      questionStarted.current = performance.now();
    }, 420);
  }, [correct, index, info.seconds, onFinish, questions.length, remaining, score]);

  useEffect(() => {
    if (paused || feedback || finished.current) return;

    const timer = window.setInterval(() => {
      const elapsed = (performance.now() - questionStarted.current) / 1000;
      const next = Math.max(0, info.seconds - elapsed);
      setRemaining(next);

      if (next <= 0) {
        setFeedback("timeout");
        nextQuestion(false, 0);
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [feedback, info.seconds, nextQuestion, paused]);

  const handleAnswer = (answer: number) => {
    if (selected !== null || feedback || paused) return;
    const isCorrect = answer === question.answer;
    const elapsed = (performance.now() - questionStarted.current) / 1000;
    const speedRatio = Math.max(0, 1 - elapsed / info.seconds);
    const earned = isCorrect ? Math.round(70 + speedRatio * 50) : 0;

    setSelected(answer);
    setFeedback(isCorrect ? "correct" : "wrong");
    nextQuestion(isCorrect, earned);
  };

  const operationText = question.operation === "multiply" ? "×" : "÷";
  const levelResult = progress.levels[level];

  const answerStatus = useMemo(() => {
    if (!feedback) return "";
    if (feedback === "correct") return "✨ Chính xác! Tuyệt vời!";
    if (feedback === "timeout") return `⏰ Hết giờ! Đáp án là ${question.answer}`;
    return `💡 Chưa đúng! Đáp án là ${question.answer}`;
  }, [feedback, question.answer]);

  return (
    <main className={`game-screen ${info.colorClass}`}>
      <header className="game-header">
        <button className="icon-btn" onClick={onBack} aria-label="Quay lại bản đồ">
          <ArrowLeft size={25} />
        </button>

        <div className="game-level-title">
          <span>{info.emoji}</span>
          <div>
            <small>MAP {level} · {info.seconds} GIÂY/CÂU</small>
            <strong>{info.name}</strong>
          </div>
        </div>

        <div className="game-stats">
          <div><Heart size={19} fill="currentColor" /> 3</div>
          <div><Star size={19} fill="currentColor" /> {score}</div>
        </div>
      </header>

      <section className="game-layout">
        <aside className="game-side-card">
          <div className="mini-character">🧙‍♂️</div>
          <strong>Giải cứu công chúa!</strong>
          <p>Trả lời đúng 10 câu để vượt qua vùng đất này.</p>
          <div className="side-stat">
            <span>Câu hỏi</span>
            <strong>{index + 1}<small>/10</small></strong>
          </div>
          {levelResult && (
            <div className="side-best">
              Kỷ lục trước<br />
              <b>{"★".repeat(levelResult.stars)}{"☆".repeat(3 - levelResult.stars)}</b>
            </div>
          )}
        </aside>

        <section className="question-area">
          <div className="question-progress">
            <span>Tiến trình</span>
            <div><i style={{ width: `${progressPercent}%` }} /></div>
            <b>{index + 1}/10</b>
          </div>

          <div className="question-card">
            <div className="question-label">CÂU HỎI</div>
            <div className="question-text">
              {question.a} <span>{operationText}</span> {question.b} <span>= ?</span>
            </div>
          </div>

          <TimerBar remaining={remaining} total={info.seconds} />

          <div className="answers">
            {question.choices.map((choice) => {
              const isSelected = selected === choice;
              const isAnswer = feedback && choice === question.answer;
              return (
                <button
                  key={choice}
                  className={`answer-btn ${isSelected ? "selected" : ""} ${isAnswer ? "right-answer" : ""}`}
                  onClick={() => handleAnswer(choice)}
                  disabled={selected !== null || paused}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          <div className={`feedback ${feedback ?? ""}`} aria-live="polite">
            {answerStatus || "Chọn đáp án đúng nhé!"}
          </div>

          <button className="pause-btn" onClick={() => setPaused((value) => !value)}>
            {paused ? "▶ Tiếp tục" : "Ⅱ Tạm dừng"}
          </button>
        </section>

        <aside className="game-side-card right">
          <div className="map-emblem">{info.emoji}</div>
          <strong>{info.place}</strong>
          <p>Thời gian càng nhanh, điểm thưởng càng cao.</p>
          <div className="tip">💡 Mẹo: Đọc phép tính thật nhanh trước khi chọn đáp án.</div>
        </aside>
      </section>

      {paused && (
        <div className="pause-overlay">
          <div className="pause-card">
            <div>⏸️</div>
            <h2>Đang tạm dừng</h2>
            <p>Hãy nghỉ một chút rồi tiếp tục cuộc phiêu lưu.</p>
            <button onClick={() => setPaused(false)}>Tiếp tục chơi</button>
            <button className="secondary" onClick={onBack}>Về bản đồ</button>
          </div>
        </div>
      )}
    </main>
  );
}