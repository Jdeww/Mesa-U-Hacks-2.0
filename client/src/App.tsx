import React, { useState } from "react";

type UploadedFile = { filename: string; size: number; url: string };

export default function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files ?? []));
    setUploaded([]);
    setStatus("");
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setStatus("Please choose at least one file first.");
      return;
    }
    setIsUploading(true);
    setStatus("Uploading...");

    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));

      const res = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed");

      setUploaded(data.files as UploadedFile[]);
      setStatus("Upload complete!");
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
      <h1>Upload .txt / .pdf</h1>
      <input type="file" accept=".txt,.pdf" multiple onChange={handleChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload to Server"}
      </button>
      {status && <p>{status}</p>}
      {uploaded.length > 0 && (
        <ul>
          {uploaded.map((f, i) => (
            <li key={i}>
              {f.filename} — <a href={`http://localhost:3001${f.url}`} target="_blank">Open</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
