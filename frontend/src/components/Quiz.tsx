import React, { useEffect, useRef, useState } from "react";
import type { MCQ } from "../types";
import "./Quiz.css";

type Props = {
  items: MCQ[];
  onFinish?: (result: { correct: number; total: number; elapsedSeconds: number }) => void;
};

const Quiz: React.FC<Props> = ({ items, onFinish }) => {
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correct, setCorrect] = useState(0);
  

  // ---- Timer ----
  const [elapsed, setElapsed] = useState(0); // seconds
  const timerRef = useRef<number | null>(null);

  // start/stop interval based on `started`
  useEffect(() => {
    if (!started) return;
    if (timerRef.current === null) {
      timerRef.current = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [started]);

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  if (!items || items.length === 0) {
    return <div style={{ textAlign: "center", marginTop: 40 }}>No questions.</div>;
  }

  const q = items[i];
  const isLast = i === items.length - 1;

  //const [sheenIdx, setSheenIdx] = useState<number | null>(null);

  const choose = (idx: number) => {
    if (showAnswer) return;
    setSelected(idx);

    // trigger one-shot sheen on this button
    // setSheenIdx(idx);
    // window.setTimeout(() => setSheenIdx(null), 650)
  };

  

  const reveal = () => {
    if (selected === null) return;
    setShowAnswer(true);
    if (selected === q.answer) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (!showAnswer) return;
    if (isLast) {
      stopTimer();
      onFinish?.({ correct, total: items.length, elapsedSeconds: elapsed });
      return;
    }
    setI((n) => n + 1);
    setSelected(null);
    setShowAnswer(false);
  };

  // ---- Timer display ----
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeLabel =
    elapsed >= 3600
      ? "Its been an hour hurry the f*ck up"
      : `Time: ${minutes}:${String(seconds).padStart(2, "0")}`;

  // ---- Start screen ----
  if (!started) {
    return (
      <div style={{ maxWidth: 720, margin: "40px auto", padding: 16, textAlign: "center" }}>
        <h3>Ready to start the quiz?</h3>
        <p>You’ll have a running timer.</p>
        <button
          onClick={() => setStarted(true)}
          style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #ddd" }}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  

  // ---- Quiz UI ----
  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <div
        style={{
          marginBottom: 12,
          fontWeight: 700,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div>Question {i + 1} / {items.length}</div>
        <div style={{ textAlign: "center" }}>{timeLabel}</div>
        <div style={{ textAlign: "right" }}>Score: {correct}/{items.length}</div>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 18, marginBottom: 16 }}>{q.q}</div>

        <div style={{ display: "grid", gap: 8 }}>
          {q.options.map((opt, idx) => {
            const chosen = selected === idx;
            const correctChoice = showAnswer && idx === q.answer;
            const wrongChoice = showAnswer && chosen && idx !== q.answer;

            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                disabled={showAnswer}
                className={["btn-pop", "tilt"].join(" ").trim()}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "4px solid #ddd",
                  background: correctChoice
                    ? "#0cea0cff"
                    : wrongChoice
                    ? "#dd3d3dff"
                    : chosen
                    ? "#42aebcff"
                    : "var(--surface)",
                  cursor: showAnswer ? "default" : "pointer",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
          <button onClick={reveal} className="btn-pop" disabled={selected === null || showAnswer}>Reveal</button>
          <button onClick={next} className ="btn-pop" disabled={!showAnswer}>{isLast ? "Finish" : "Next"}</button>
        </div>

        {showAnswer && q.explanation && (
          <div style={{ marginTop: 12, fontSize: 14, opacity: 0.8 }}>
            Explanation: {q.explanation}
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Quiz;
