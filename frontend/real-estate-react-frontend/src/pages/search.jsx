import React, { useState } from 'react'
import './search.css'

function Search({ onBackClick }) {
  const [chatMessage, setChatMessage] = useState('')

  const handleChatSubmit = (event) => {
    event.preventDefault()
    if (chatMessage.trim()) {
      // Here you would typically handle sending the chat message
      console.log('Sending message:', chatMessage)
      setChatMessage('')
    }
  }

  return (
    <div className="search-page">
      <button className="back-button" onClick={onBackClick}>Back</button>
      <h1 className="search-title">Search Documents</h1>
      
      <div className="chat-container">
        <div className="chat-messages">
          {/* Chat messages would be displayed here */}
        </div>
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
    </div>
  )
}

export default Search
