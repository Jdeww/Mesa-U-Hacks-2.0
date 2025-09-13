from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import uuid, json

from ai_gen import generate_from_text

# --- paths ---
ROOT = Path(__file__).parent
UPLOADS = ROOT / "uploads"
DATA = ROOT / "data"
UPLOADS.mkdir(exist_ok=True)
DATA.mkdir(exist_ok=True)

app = FastAPI()

# --- CORS (dev-friendly) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- models ---
class GenerateReq(BaseModel):
    jobId: str

# --- helpers ---
def save_json(job_id: str, payload: dict) -> None:
    (DATA / f"{job_id}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

def load_json(job_id: str) -> dict | None:
    p = DATA / f"{job_id}.json"
    if not p.exists(): return None
    return json.loads(p.read_text(encoding="utf-8"))

# --- endpoints ---

# app.py (only the changed/added lines shown)

from ai_gen import generate_from_text, generate_from_file  # add generate_from_file

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    job_id = uuid.uuid4().hex[:8]
    file_path = UPLOADS / f"{job_id}_{file.filename}"
    content = await file.read()
    file_path.write_bytes(content)

    # store fileId so /generate knows what to read
    stub = {
        "jobId": job_id,
        "status": "pending",
        "fileId": str(file_path),   # <--- add this
        "summary": "",
        "flashcards": [],
        "mcqs": []
    }
    save_json(job_id, stub)
    return {"fileId": str(file_path), "jobId": job_id}

@app.post("/generate")
async def generate(req: GenerateReq):
    job = load_json(req.jobId)
    if not job:
        return {"ok": False, "error": "job not found"}
    file_id = job.get("fileId")
    if not file_id:
        return {"ok": False, "error": "no fileId on job; upload first"}

    # NEW: build bundle from the actual file
    payload = {
        "jobId": req.jobId,
        "status": "ready",
        **generate_from_file(file_id)
    }
    save_json(req.jobId, payload)
    return {"ok": True, "jobId": req.jobId}


@app.get("/content/{job_id}")
async def content(job_id: str):
    data = load_json(job_id)
    if not data:
        return {"jobId": job_id, "status": "error", "message": "Job not found"}
    return data

# --- dev helper: create a ready-to-load demo job ---
@app.post("/seed-demo")
async def seed_demo():
    job_id = "demo-" + uuid.uuid4().hex[:5]
    payload = {
        "jobId": job_id,
        "status": "ready",
        **generate_from_text("demo text")
    }
    save_json(job_id, payload)
    return {"jobId": job_id, "status": "ready"}


