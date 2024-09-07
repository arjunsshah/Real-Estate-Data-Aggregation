import React, { useState } from 'react'
import './search.css'

function Search({ onBackClick }) {
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [isChatting, setIsChatting] = useState(false)
  const [response, setResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)



  const handleChatSubmit = async (event) => {
    event.preventDefault()
    if (chatMessage == "") {
        alert('Please write a query')
        return
    }
    console.log(chatMessage)
    const query = { query: chatMessage };

    setIsLoading(true)
    try {
        const response = await fetch('http://127.0.0.1:5000/query_documents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(query), // Convert the query object to a JSON string
          })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log(data.result)
      setResponse(data.result)
    } catch (error) {
      console.error('Error:', error)
      setResponse('An error occurred while processing the files.')
    } finally {
      setIsLoading(false)
      setChatMessage('')
    }
  }

  return (
    <div className="search-page">
      <button className="back-button" onClick={onBackClick}>Back</button>
      <h1 className="search-title">Search Documents</h1>
      
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

        {response && (
        <div className="response-container">
          <h2>Analysis Result:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  )
}

export default Search
