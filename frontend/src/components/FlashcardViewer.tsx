import React, { useState } from "react";
import type { Flashcard } from "../types";

type Props = {
  items: Flashcard[];
  onComplete?: () => void;
};

const FlashcardViewer: React.FC<Props> = ({ items, onComplete }) => {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!items || items.length === 0) {
    return <div style={{ textAlign: "center", marginTop: 40 }}>No cards.</div>;
  }

  const current = items[i];
  const isLast = i === items.length - 1;

  const next = () => {
    if (isLast) {
      onComplete?.();
      return;
    }
    setI((n) => n + 1);
    setFlipped(false);
  };

  const prev = () => {
    if (i > 0) {
      setI((n) => n - 1);
      setFlipped(false);
    }
  };

  const flip = () => setFlipped((f) => !f);

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <div
        onClick={flip}
        role="button"
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 24,
          minHeight: 140,
          cursor: "pointer",
          userSelect: "none",
          textAlign: "center",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          Card {i + 1} / {items.length}
        </div>
        <div style={{ fontSize: 18 }}>
          {flipped ? current.back : current.front}
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>
          (click to flip)
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
        <button onClick={prev} disabled={i === 0}>Prev</button>
        <button onClick={flip}>Flip</button>
        <button onClick={next}>{isLast ? "Finish" : "Next"}</button>
      </div>
    </div>
  );
};

export default FlashcardViewer;
