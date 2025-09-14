export interface MCQ {
  q: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface ContentBundle {
  jobId: string;
  status: string;
  summary: string;
  flashcards: Flashcard[];
  mcqs: MCQ[];
}

export interface StudyMaterial {
  summarization: string;
  questions: string;
  answers: string;
  lastUpdated: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}