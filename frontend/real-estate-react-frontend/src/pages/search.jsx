import React, { useState } from 'react'
import './search.css'

function Search({ onBackClick }) {
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isChatting, setIsChatting] = useState(false)

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      alert(data.message)
      setFile(null)
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while uploading the file.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleChatSubmit = async (event) => {
    event.preventDefault()
    if (chatMessage.trim()) {
      setIsChatting(true)
      try {
        const response = await fetch('http://127.0.0.1:5000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: chatMessage }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setChatHistory([...chatHistory, { type: 'user', message: chatMessage }, { type: 'bot', message: data.response }])
        setChatMessage('')
      } catch (error) {
        console.error('Error:', error)
        alert('An error occurred while processing your message.')
      } finally {
        setIsChatting(false)
      }
    }
  }

  return (
    <div className="search-page">
      <button className="back-button" onClick={onBackClick}>Back</button>
      <h1 className="search-title">Search Documents</h1>
      
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      
      <div className="chat-container">
        <div className="chat-messages">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.type}`}>
              {msg.message}
            </div>
          ))}
        </div>
        <form onSubmit={handleChatSubmit} className="chat-form">
          <input 
            type="text" 
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Type your message here..."
            className="chat-input"
          />
          <button type="submit" className="chat-submit" disabled={isChatting}>
            {isChatting ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Search
