interface TimerBarProps {
  remaining: number;
  total: number;
}

export default function TimerBar({ remaining, total }: TimerBarProps) {
  const percentage = Math.max(0, Math.min(100, (remaining / total) * 100));
  const danger = remaining <= Math.max(3, total * 0.25);

  return (
    <div className="timer-wrap">
      <div className="timer-meta">
        <span>⏱️ Thời gian</span>
        <strong className={danger ? "timer-danger" : ""}>{remaining.toFixed(1)}s</strong>
      </div>
      <div className="timer-track" aria-label={`Còn ${remaining.toFixed(1)} giây`}>
        <div
          className={`timer-fill ${danger ? "danger" : ""}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}