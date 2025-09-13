// App.js
import React, { useRef } from 'react';

function App() {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    console.log("Selected files:", files);
    alert(`You selected ${files.length} file(s).`);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Upload Your File</h1>
      <button onClick={handleButtonClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Upload File
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".txt,.pdf"
        multiple
      />
    </div>
  );
}

export default App;