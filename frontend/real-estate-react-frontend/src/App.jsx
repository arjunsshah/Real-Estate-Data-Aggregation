import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import OfferMemorandum from './pages/offer_memorandum'
import Search from './pages/search'

function App() {
  const [activeTab, setActiveTab] = useState('Home')
  const [showOfferMemorandum, setShowOfferMemorandum] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const handleStartClick = () => {
    setShowOfferMemorandum(true)
  }

  const handleSearchClick = () => {
    setShowSearch(true)
  }

  const handleBackClick = () => {
    setShowOfferMemorandum(false)
    setShowSearch(false)
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="content">
        {!showOfferMemorandum && !showSearch && (
          <>
            {activeTab === 'Home' && (
              <div className="home-content">
                <div className="feature-box">
                  <h2>Create an Offer Memorandum</h2>
                  <button className="start-button" onClick={handleStartClick}>Start</button>
                </div>
                <div className="feature-box">
                  <h2>Search Documents</h2>
                  <button className="search-button" onClick={handleSearchClick}>Search</button>
                </div>
              </div>
            )}
            {activeTab === 'Documents' && <h2>Documents</h2>}
            {activeTab === 'Deals' && <h2>Deals</h2>}
          </>
        )}
        {showOfferMemorandum && <OfferMemorandum onBackClick={handleBackClick} />}
        {showSearch && <Search onBackClick={handleBackClick} />}
      </main>
    </div>
  )
}

export default App
