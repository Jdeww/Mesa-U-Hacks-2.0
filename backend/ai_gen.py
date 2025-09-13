# ai_gen.py
from typing import Dict, Any
from pathlib import Path
import re

try:
    import pdfplumber  # already in requirements
except Exception:
    pdfplumber = None


def _extract_text(file_path: str) -> str:
    """Return plain text from a .txt/.md/.pdf file (best-effort)."""
    p = Path(file_path)
    suf = p.suffix.lower()

    # .txt / .md
    if suf in {".txt", ".md"}:
        return p.read_text(encoding="utf-8", errors="ignore")

    # .pdf
    if suf == ".pdf" and pdfplumber is not None:
        parts = []
        with pdfplumber.open(p) as pdf:
            for page in pdf.pages:
                t = page.extract_text() or ""
                parts.append(t)
        return "\n".join(parts)

    return ""  # unsupported types for now


def _simple_summary(text: str, max_sentences: int = 5, max_chars: int = 800) -> str:
    """Very small summarizer: first few sentences, trimmed."""
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return "(no text found)"
    sentences = re.split(r"(?<=[.!?])\s+", text)
    out = " ".join(sentences[:max_sentences]).strip()
    if len(out) > max_chars:
        out = out[:max_chars].rstrip() + "…"
    return out


def generate_from_text(text: str) -> Dict[str, Any]:
    # Your existing toy generator (kept the same)
    summary = "Auto summary: binary search, stacks vs queues, merge complexity."  # placeholder
    flashcards = [
        {"front": "What is Big-O of binary search?", "back": "O(log n)"},
        {"front": "Stack vs Queue?", "back": "LIFO vs FIFO"},
        {"front": "Merge two sorted arrays complexity?", "back": "O(m + n)"},
    ]
    mcqs = [
        {
            "q": "Time complexity of binary search?",
            "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
            "answer": 1,
            "explanation": "Halves the search space each step.",
        },
        {
            "q": "Merging two sorted arrays of sizes m,n takes…",
            "options": ["O(m+n)", "O(log(m+n))", "O(mn)", "O(1)"],
            "answer": 0,
        },
        {"q": "Stack removal policy?", "options": ["FIFO", "LIFO", "Random", "Priority"], "answer": 1},
    ]
    return {"summary": summary, "flashcards": flashcards, "mcqs": mcqs}


def generate_from_file(file_path: str) -> Dict[str, Any]:
    """New entry point: read the file, make a simple summary, reuse your Q&A."""
    text = _extract_text(file_path)
    bundle = generate_from_text(text)   # reuse your existing generator
    bundle["summary"] = _simple_summary(text)
    return bundle
