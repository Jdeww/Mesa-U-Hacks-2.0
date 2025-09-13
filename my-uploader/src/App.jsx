import React, { useState } from "react";

export default function App() {
  const [fileNames, setFileNames] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFileNames(files.map((file) => file.name));
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <input
        type="file"
        accept=".txt,.pdf"
        multiple
        onChange={handleFileChange}
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          cursor: "pointer"
        }}
      />

      {/* Show selected file names */}
      {fileNames.length > 0 && (
        <div style={{ marginTop: "1rem", textAlign: "left", display: "inline-block" }}>
          <h3>Selected files:</h3>
          <ul>
            {fileNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
