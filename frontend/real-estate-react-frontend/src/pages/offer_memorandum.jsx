import React, { useState, useRef } from 'react'
import './Offer_Memorandum.css'

function OfferMemorandum({ onBackClick }) {
  const [file, setFile] = useState(null)
  const [chatMessage, setChatMessage] = useState('')
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFile = e.dataTransfer.files[0]
    setFile(droppedFile)
  }

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleChatSubmit = (event) => {
    event.preventDefault()
    if (chatMessage.trim()) {
      // Here you would typically handle sending the chat message
      console.log('Sending message:', chatMessage)
      setChatMessage('')
    }
  }

  return (
    <div className="offer-memorandum">
      <button className="back-button" onClick={onBackClick}>Back</button>
      <h1 className="offer-memorandum-title">Offer Memorandum</h1>
      
      <div 
        className="file-drop-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <p>Drag and drop file here, or click to select file</p>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>
      {file && <p>Selected file: {file.name}</p>}
      
      <form onSubmit={handleChatSubmit} className="chat-form">
        <input 
          type="text" 
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Type your message here..."
          className="chat-input"
        />
        <button type="submit" className="chat-submit">Send</button>
      </form>
    </div>
  )
}

export default OfferMemorandum
