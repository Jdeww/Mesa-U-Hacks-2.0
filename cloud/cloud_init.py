# cloud/cloud_init.py
from __future__ import annotations
import os, mimetypes
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
import boto3

# --- Load env (.env can be in cloud/ OR project root) ---
HERE = Path(__file__).resolve().parent
ROOT = HERE.parent

# Prefer cloud/.env; fall back to project-root/.env
if (HERE / ".env").exists():
    load_dotenv(HERE / ".env")
elif (ROOT / ".env").exists():
    load_dotenv(ROOT / ".env")

# --- Required settings ---
AWS_REGION: str = os.environ.get("AWS_REGION", "us-east-2")
S3_BUCKET: str = os.environ.get("S3_BUCKET", "")
S3_ENDPOINT_URL: Optional[str] = os.environ.get("S3_ENDPOINT_URL") or None
S3_PUBLIC_READ: bool = os.environ.get("S3_PUBLIC_READ", "false").lower() == "true"

if not S3_BUCKET:
    raise RuntimeError("❌ Missing S3_BUCKET in env.")

# --- Paths (relative to this file) ---
FILES_DIR = ROOT / "InputFiles"          # input folder with your docs
OUTPUT_DIR = ROOT / "OutputFiles"   # where downloads will be saved
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Default key prefix in the bucket
UPLOAD_PREFIX = "uploads/"

# --- S3 client (reusable) ---
def get_s3():
    """
    Returns a configured boto3 S3 client using env credentials.
    """
    return boto3.client(
        "s3",
        region_name=AWS_REGION,
        endpoint_url=S3_ENDPOINT_URL,
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    )

def guess_content_type(filename: str) -> str:
    return mimetypes.guess_type(filename)[0] or "application/octet-stream"

def s3_path(key: str) -> str:
    return f"s3://{S3_BUCKET}/{key}"

def s3_http_url(key: str) -> str:
    # Path-style is safest (works with dots in bucket names)
    return f"https://s3.{AWS_REGION}.amazonaws.com/{S3_BUCKET}/{key}"

def ensure_prefix(prefix: str) -> str:
    return prefix if prefix.endswith("/") else prefix + "/"

def presigned_get_url(key: str, expires_in: int = 3600) -> str:
    s3 = get_s3()
    return s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": S3_BUCKET, "Key": key},
        ExpiresIn=expires_in,
    )

# Health check helper (optional)
def check_s3_access(prefix: str = UPLOAD_PREFIX) -> bool:
    s3 = get_s3()
    try:
        s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=prefix, MaxKeys=1)
        return True
    except Exception:
        return False
