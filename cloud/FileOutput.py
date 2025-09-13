# cloud/FileOutput.py
from __future__ import annotations
import os
from pathlib import Path
from typing import List, Iterable, Optional, Tuple
from botocore.exceptions import ClientError

from cloud_init import (
    get_s3, S3_BUCKET, AWS_REGION, OUTPUT_DIR, UPLOAD_PREFIX, ensure_prefix
)

def _list_keys(prefix: str = UPLOAD_PREFIX) -> List[Tuple[str, "datetime"]]:
    s3 = get_s3()
    prefix = ensure_prefix(prefix)
    keys: List[Tuple[str, "datetime"]] = []
    token: Optional[str] = None

    while True:
        kwargs = {"Bucket": S3_BUCKET, "Prefix": prefix}
        if token:
            kwargs["ContinuationToken"] = token
        resp = s3.list_objects_v2(**kwargs)
        for obj in resp.get("Contents", []):
            key = obj["Key"]
            if not key.endswith("/"):  # skip pseudo-dirs
                keys.append((key, obj["LastModified"]))
        if resp.get("IsTruncated"):
            token = resp.get("NextContinuationToken")
        else:
            break
    return keys

def _download_key(key: str, dest_dir: Path = OUTPUT_DIR) -> Path:
    s3 = get_s3()
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / Path(key).name
    s3.download_file(S3_BUCKET, key, str(dest))
    return dest

# --- Public API ---

def download_by_name(filename: str, prefix: str = UPLOAD_PREFIX) -> Path:
    """
    Download the most recent object named <prefix>/<filename>.
    Returns local path; raises if not found.
    """
    filename = Path(filename).name
    matches = [(k, ts) for (k, ts) in _list_keys(prefix) if k.endswith("/" + filename) or k == filename]
    if not matches:
        raise FileNotFoundError(f"No object named '{filename}' under prefix '{prefix}'")
    key, _ = sorted(matches, key=lambda x: x[1], reverse=True)[0]
    return _download_key(key)

def download_many_by_names(filenames: Iterable[str], prefix: str = UPLOAD_PREFIX) -> List[Path]:
    return [download_by_name(name, prefix=prefix) for name in filenames]

def download_all(prefix: str = UPLOAD_PREFIX) -> List[Path]:
    return [_download_key(k) for (k, _) in _list_keys(prefix)]

# --- CLI usage ---
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Download from S3 to ../OutputFiles")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--all", action="store_true", help="Download all files under prefix")
    group.add_argument("--name", type=str, help="Download one file by exact name")
    parser.add_argument("--prefix", type=str, default=UPLOAD_PREFIX, help="S3 prefix (default: uploads/)")
    args = parser.parse_args()

    if args.all:
        paths = download_all(prefix=args.prefix)
        if not paths:
            print(f"ℹ️ No objects under '{args.prefix}'")
        else:
            print("✅ Downloaded:")
            for p in paths:
                print(" -", p)
    else:
        p = download_by_name(args.name, prefix=args.prefix)
        print("✅ Downloaded:", p)
