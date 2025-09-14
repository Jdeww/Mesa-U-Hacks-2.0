// Shared types for study content
export type Flashcard = { front: string; back: string };

export type MCQ = {
  q: string;
  options: string[];     // 4 options for now
  answer: number;        // 0..3
  explanation?: string;
};

export type ContentBundle = {
  jobId: string;
  status: "pending" | "ready" | "error";
  summary: string;
  flashcards: Flashcard[];
  mcqs: MCQ[];
};
