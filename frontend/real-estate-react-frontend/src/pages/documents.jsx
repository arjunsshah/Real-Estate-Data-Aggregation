import React, { useState, useRef } from 'react';
import './documents.css';

function Documents({ onBackClick }) {
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

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
      formData.append('files', file); // Append each file to FormData
    });

    try {
      setIsLoading(true); // Show loading while uploading
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData, // Send the FormData with files
      });

      const result = await response.json(); // Parse the JSON response
      setResponse(result);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsLoading(false); // Stop loading after the upload is done
    }
  };

  return (
    <div className="offer-memorandum">
      <button className="back-button" onClick={onBackClick}>
        Back
      </button>
      <h1 className="offer-memorandum-title">Documents</h1>

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
    </div>
  );
}

export default Documents;


// import React, { useState, useRef } from 'react';
// import './documents.css';
// import axios from 'axios';

// function Documents({ onBackClick }) {
//   const [files, setFiles] = useState([]);
//   const [response, setResponse] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const droppedFiles = Array.from(e.dataTransfer.files);
//     setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
//   };

//   const handleFileInput = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
//   };

//   const handleClick = () => {
//     fileInputRef.current.click();
//   };

//   const removeFile = (index) => {
//     setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//   };

//   const handleUpload = async () => {
//     const formData = new FormData();
//     files.forEach((file) => {
//       formData.append('files', file); // Append each file to FormData
//     });

//     try {
//       setIsLoading(true); // Show loading while uploading
//       const response = await axios.post('/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setResponse(response.data); // Set the response from the server
//     } catch (error) {
//       console.error('Error uploading files:', error);
//     } finally {
//       setIsLoading(false); // Stop loading after the upload is done
//     }
//   };

//   return (
//     <div className="offer-memorandum">
//       <button className="back-button" onClick={onBackClick}>
//         Back
//       </button>
//       <h1 className="offer-memorandum-title">Documents</h1>

//       <div
//         className="file-drop-area"
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//         onClick={handleClick}
//       >
//         <p>Drag and drop files here, or click to select files</p>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileInput}
//           style={{ display: 'none' }}
//           multiple
//         />
//       </div>

//       {files.length > 0 && (
//         <div className="file-list">
//           <h3>Selected files:</h3>
//           <ul>
//             {files.map((file, index) => (
//               <li key={index}>
//                 <span className="file-name">{file.name}</span>
//                 <button className="remove-button" onClick={() => removeFile(index)}>
//                   Remove
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {files.length > 0 && (
//         <button onClick={handleUpload} disabled={isLoading}>
//           {isLoading ? 'Uploading...' : 'Submit Files'}
//         </button>
//       )}

//       {response && (
//         <div className="response-container">
//           <h2>Upload Result:</h2>
//           <p>{response.message}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Documents;
















// import React, { useState, useRef } from 'react'
// import './documents.css'

// function Documents({ onBackClick }) {
//   const [files, setFiles] = useState([])
//   const [response, setResponse] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const fileInputRef = useRef(null)

//   const handleDragOver = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//   }

//   const handleDrop = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     const droppedFiles = Array.from(e.dataTransfer.files)
//     setFiles(prevFiles => [...prevFiles, ...droppedFiles])
//   }

//   const handleFileInput = (e) => {
//     const selectedFiles = Array.from(e.target.files)
//     setFiles(prevFiles => [...prevFiles, ...selectedFiles])
//   }

//   const handleClick = () => {
//     fileInputRef.current.click()
//   }

//   const removeFile = (index) => {
//     setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
//   }

//   const handleFileSubmit = async (event) => {
//     event.preventDefault()
//     if (files.length === 0) {
//       alert('Please select at least one file')
//       return
//     }

//     setIsLoading(true)
//     const formData = new FormData()
//     files.forEach(file => formData.append('files', file))
//     formData.append('query', chatMessage)

//     try {
//       const response = await fetch('http://127.0.0.1:5000/upload', {
//         method: 'POST',
//         body: formData,
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       setResponse(data.output)
//     } catch (error) {
//       console.error('Error:', error)
//       setResponse('An error occurred while processing the files.')
//     } finally {
//       setIsLoading(false)
//     }
//   }


//   return (
//     <div className="documents">
//       <h1 className="documents-title">Documents</h1>
      
//       <div 
//         className="file-drop-area"
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//         onClick={handleClick}
//       >
//         <p>Drag and drop files here, or click to select files</p>
//         <input 
//           type="file" 
//           ref={fileInputRef}
//           onChange={handleFileInput}
//           style={{ display: 'none' }}
//           multiple
//         />
//       </div>
//       {files.length > 0 && (
//         <div className="file-list">
//           <h3>Selected files:</h3>
//           <ul>
//             {files.map((file, index) => (
//               <li key={index}>
//                 <span className="file-name">{file.name}</span>
//                 <button className="remove-button" onClick={() => removeFile(index)}>Remove</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}



//     </div>
//   )
// }

// export default Documents