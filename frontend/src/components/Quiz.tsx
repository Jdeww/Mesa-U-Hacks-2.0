import React, { useState } from "react";

import type { MCQ } from "../types";


type Props = {
  items: MCQ[];
  onFinish?: (result: { correct: number; total: number }) => void;
};

const Quiz: React.FC<Props> = ({ items, onFinish }) => {
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correct, setCorrect] = useState(0);

  if (!items || items.length === 0) {
    return <div style={{ textAlign: "center", marginTop: 40 }}>No questions.</div>;
  }

  const q = items[i];
  const isLast = i === items.length - 1;
  //const isCorrect = selected !== null && selected === q.answer;

  const choose = (idx: number) => {
    if (showAnswer) return;          // locked after reveal
    setSelected(idx);
  };

  const reveal = () => {
    if (selected === null) return;
    setShowAnswer(true);
    if (selected === q.answer) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (!showAnswer) return;         // force reveal first
    if (isLast) {
      onFinish?.({ correct, total: items.length });
      return;
    }
    setI((n) => n + 1);
    setSelected(null);
    setShowAnswer(false);
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <div style={{ marginBottom: 12, fontWeight: 700 }}>
        Question {i + 1} / {items.length}
        <span style={{ float: "right" }}>Score: {correct}/{items.length}</span>
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
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: correctChoice ? "#e8ffe8" : wrongChoice ? "#ffe8e8" : chosen ? "#f3f6ff" : "white",
                  cursor: showAnswer ? "default" : "pointer",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
          <button onClick={reveal} disabled={selected === null || showAnswer}>Reveal</button>
          <button onClick={next} disabled={!showAnswer}>{isLast ? "Finish" : "Next"}</button>
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
