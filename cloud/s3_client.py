# s3_client.py
import os, uuid, mimetypes
import boto3

def _client():
    return boto3.client(
        "s3",
        region_name=os.environ.get("AWS_REGION", "us-east-2"),
        endpoint_url=os.environ.get("S3_ENDPOINT_URL") or None,
        aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    )

def _public_url(bucket: str, key: str) -> str:
    base = os.environ.get("S3_PUBLIC_BASE_URL")
    if base:
        return f"{base.rstrip('/')}/{key}"
    region = os.environ.get("AWS_REGION", "us-east-2")
    return f"https://{bucket}.s3.{region}.amazonaws.com/{key}"

def upload_fileobj(fileobj, filename: str, prefix: str = "uploads/"):
    bucket = os.environ["S3_BUCKET"]
    
    safe_name = os.path.basename(filename)  # keep only the file name, no path
    key = f"{prefix}{safe_name}"

    content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"
    extra = {"ContentType": content_type}

    if os.environ.get("S3_PUBLIC_READ", "false").lower() == "true":
        extra["ACL"] = "public-read"

    s3 = _client()
    fileobj.seek(0)
    s3.upload_fileobj(fileobj, bucket, key, ExtraArgs=extra)

    return key, _public_url(bucket, key)

def upload_path(path: str, prefix: str = "uploads/"):
    with open(path, "rb") as f:
        return upload_fileobj(f, os.path.basename(path), prefix=prefix)
