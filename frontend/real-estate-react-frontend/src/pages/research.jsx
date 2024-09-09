import React, { useState, useRef } from 'react'
import './research.css'
import TableComponent from '../components/TableComponent';

const data = [
  { Name: "John Doe", Age: 28, Occupation: "Engineer" },
  { Name: "Jane Smith", Age: 32, Occupation: "Designer" },
  { Name: "Sam Johnson", Age: 22, Occupation: "Developer" }
];


function OfferMemorandum({ onBackClick }) {
  const [files, setFiles] = useState([])
  const [chatMessage, setChatMessage] = useState('')
  const [response, setResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(prevFiles => [...prevFiles, ...droppedFiles])
  }

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(prevFiles => [...prevFiles, ...selectedFiles])
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  const handleChatSubmit = async (event) => {
    event.preventDefault()
    if (files.length === 0) {
      alert('Please select at least one file')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    formData.append('query', chatMessage)

    try {
      const response = await fetch('http://127.0.0.1:5000/process-data', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResponse(data.output)
    } catch (error) {
      console.error('Error:', error)
      setResponse('An error occurred while processing the files.')
    } finally {
      setIsLoading(false)
      setChatMessage('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChatSubmit(e)
    }
  }

  return (
    <div className="offer-memorandum">
      <button className="back-button" onClick={onBackClick}>Back</button>
      <h1 className="offer-memorandum-title">Research</h1>
      
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
                <button className="remove-button" onClick={() => removeFile(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleChatSubmit} className="chat-form">
        <textarea 
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="chat-input"
        />
        <button type="submit" className="chat-submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Send'}
        </button>
      </form>

      {/* <div>
      <h1>Simple Styled Table</h1>
      <TableComponent data={data} />
    </div> */}

      {response && (
        <div className="response-container">
          <h2>Analysis Result:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  )
}

export default OfferMemorandum
