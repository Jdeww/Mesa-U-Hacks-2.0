import React, { useState } from "react";
import { FlashcardViewer, Quiz } from "./components";
import type { ContentBundle } from "./types";

const API = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";



const demoBundle: ContentBundle = {
  jobId: "demo-123",
  status: "ready",
  summary:
    "This is a short demo summary covering binary search, stacks vs queues, and merge complexity.",
  flashcards: [
    { front: "What is Big-O of binary search?", back: "O(log n)" },
    { front: "Stack vs Queue?", back: "LIFO vs FIFO" },
    { front: "Merge two sorted arrays complexity?", back: "O(m + n)" },
  ],
  mcqs: [
    {
      q: "Time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      answer: 1,
      explanation: "It halves the search space each step.",
    },
    {
      q: "Merging two sorted arrays (sizes m and n) takes…",
      options: ["O(m+n)", "O(log(m+n))", "O(mn)", "O(1)"],
      answer: 0,
      explanation: "You scan both arrays once.",
    },
    {
      q: "Stack removal policy?",
      options: ["FIFO", "LIFO", "Random", "Priority"],
      answer: 1,
    },
  ],
};

export default function ContentView() {
  const [jobId, setJobId] = useState("");
  const [bundle, setBundle] = useState<ContentBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<{ correct: number; total: number } | null>(null);

  const loadContent = async () => {
    if (!jobId.trim()) {
      setErr("Enter a jobId or click Demo Content.");
      return;
    }
    setErr(null);
    setLoading(true);
    setQuizResult(null);
    try {
      const r = await fetch(`${API}/content/${encodeURIComponent(jobId)}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = (await r.json()) as ContentBundle;
      setBundle(data);
    } catch (e: any) {
      setErr(e.message || "Failed to load content");
      setBundle(null);
    } finally {
      setLoading(false);
    }
  };

  const useDemo = () => {
    setErr(null);
    setQuizResult(null);
    setBundle(demoBundle);
  };
  

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h1 style={{ textAlign: "center" }}>Study Session</h1>

      {/* Loader controls */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          placeholder="Enter jobId (e.g., from /upload)"
          style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button onClick={loadContent} disabled={loading}>
          {loading ? "Loading..." : "Load"}
        </button>
        <button onClick={useDemo}>Demo Content</button>
      </div>

      {/* Status & errors */}
      {err && (
        <div style={{ color: "#b00020", marginTop: 8 }}>
          Error: {err}
        </div>
      )}

      {/* Render content */}
      {bundle && (
        <div style={{ marginTop: 24 }}>
          {/* Summary */}
<div className="surface-card"  // <-- add this
     style={{ padding: 16 }}>
  <div style={{ fontWeight: 700, marginBottom: 8 }}>Summary</div>
  <div>{bundle.summary || "No summary."}</div>
</div>


          {/* Flashcards */}
          <h2 style={{ textAlign: "center", marginTop: 24 }}>Review</h2>
          <FlashcardViewer
            items={bundle.flashcards}
            onComplete={() => {
              // optional: do something when review ends
              // e.g., scroll to quiz
              const el = document.getElementById("quiz");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Quiz */}
          <h2 id="quiz" style={{ textAlign: "center", marginTop: 24 }}>Quiz</h2>
          <Quiz
            items={bundle.mcqs}
            onFinish={(r) => setQuizResult(r)}
          />

          {quizResult && (
            <div style={{ textAlign: "center", marginTop: 8, fontWeight: 700 }}>
              Finished: {quizResult.correct}/{quizResult.total}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
