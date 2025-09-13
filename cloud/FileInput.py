# cloud/FileInput.py
from __future__ import annotations
import os, uuid
from pathlib import Path
from typing import Iterable, Tuple, List
from botocore.exceptions import ClientError

from cloud_init import (
    get_s3, S3_BUCKET, AWS_REGION, S3_PUBLIC_READ,
    FILES_DIR, UPLOAD_PREFIX, guess_content_type, s3_path, s3_http_url, ensure_prefix
)

def _build_key(filename: str, prefix: str, keep_name: bool = True, with_uuid: bool = False) -> str:
    prefix = ensure_prefix(prefix)
    name = Path(filename).name.replace(" ", "_")
    if keep_name and not with_uuid:
        return f"{prefix}{name}"
    if keep_name and with_uuid:
        return f"{prefix}{uuid.uuid4().hex}_{name}"
    # fallback: only UUID (rarely needed)
    ext = Path(name).suffix
    return f"{prefix}{uuid.uuid4().hex}{ext}"

def upload_path(path: Path | str, prefix: str = UPLOAD_PREFIX) -> tuple[str, str]:
    """
    Upload a single local file to S3, keeping the original filename.
    If the same file name exists in S3, it will be overwritten.
    """
    p = Path(path)
    if not p.is_file():
        raise FileNotFoundError(f"Not a file: {p}")

    # just keep the original filename
    name = p.name.replace(" ", "_")
    key = ensure_prefix(prefix) + name

    extra = {"ContentType": guess_content_type(name)}
    # don’t set ACLs if bucket has Object Ownership enforced
    if os.environ.get("S3_PUBLIC_READ", "false").lower() == "true":
        extra["ACL"] = "public-read"

    s3 = get_s3()
    with p.open("rb") as f:
        s3.upload_fileobj(f, S3_BUCKET, key, ExtraArgs=extra)

    return key, s3_http_url(key)


def upload_folder(folder: Path | str = FILES_DIR, prefix: str = UPLOAD_PREFIX) -> List[Tuple[str, str]]:
    """
    Recursively upload all files in a folder. Returns list of (key, url).
    """
    folder = Path(folder)
    if not folder.exists():
        raise FileNotFoundError(f"Folder not found: {folder}")
    results: List[Tuple[str, str]] = []
    for path in folder.rglob("*"):
        if path.is_file():
            results.append(upload_path(path, prefix=prefix))
    return results

# --- CLI usage ---
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Upload files to S3")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--all", action="store_true", help="Upload all files under ../files")
    group.add_argument("--file", type=str, help="Upload a single file by path (defaults to ../files/<name>)")
    parser.add_argument("--name", type=str, help="If --file not given, use file name inside ../files")
    parser.add_argument("--prefix", type=str, default=UPLOAD_PREFIX, help="S3 prefix (default: uploads/)")
    args = parser.parse_args()

    if args.all:
        res = upload_folder(FILES_DIR, prefix=args.prefix)
        for key, url in res:
            print(f"✅ {s3_path(key)}")
            print(f"   URL: {url}")
    else:
        local = Path(args.file) if args.file else (FILES_DIR / args.name)
        key, url = upload_path(local, prefix=args.prefix)
        print(f"✅ {s3_path(key)}")
        print(f"   URL: {url}")
