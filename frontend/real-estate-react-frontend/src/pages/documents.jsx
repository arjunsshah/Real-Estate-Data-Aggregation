import React, { useState, useRef, useEffect } from 'react';
import './documents.css';

function Documents({ onBackClick }) {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/files');
      const data = await response.json();
      setUploadedFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setResponse(result);
      fetchUploadedFiles(); // Refresh the file list after upload
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsLoading(false);
      setFiles([]); // Clear the file selection after upload
    }
  };

  return (
    <div className="documents">
      <h1 className="documents-title">Documents</h1>

      <div
        className="file-drop-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <p>Drag and drop files here, or click to select files</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          style={{ display: 'none' }}
          multiple
        />
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <h3>Selected files:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                <span className="file-name">{file.name}</span>
                <button className="remove-button" onClick={() => removeFile(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <button onClick={handleUpload} disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Submit Files'}
        </button>
      )}

      {response && (
        <div className="response-container">
          <h2>Upload Result:</h2>
          <p>{response.message}</p>
        </div>
      )}

      <div className="uploaded-files">
        <h2>Uploaded Files</h2>
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Size</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file, index) => (
              <tr key={index}>
                <td>{file.name}</td>
                <td>{(file.size / 1024).toFixed(2)} KB</td>
                <td>{new Date(file.date * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Documents;

