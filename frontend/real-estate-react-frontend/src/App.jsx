import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Research from './pages/research'
import Search from './pages/search'
import Documents from './pages/documents'

function App() {
  const [activeTab, setActiveTab] = useState('Home')
  const [showResearch, setShowResearch] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const handleStartClick = () => {
    setShowResearch(true)
  }

  const handleSearchClick = () => {
    setShowSearch(true)
  }

  const handleBackClick = () => {
    setShowResearch(false)
    setShowSearch(false)
  }

  const renderContent = () => {
    if (showResearch) {
      return <Research onBackClick={handleBackClick} />
    }
    if (showSearch) {
      return <Search onBackClick={handleBackClick} />
    }
    switch (activeTab) {
      case 'Home':
        return (
          <div className="home-content">
            <div className="feature-box">
              <h2>Perform Research</h2>
              <button className="start-button" onClick={handleStartClick}>Start</button>
            </div>
            <div className="feature-box">
              <h2>Search Documents</h2>
              <button className="search-button" onClick={handleSearchClick}>Search</button>
            </div>
          </div>
        );
      case 'Documents':
        return <Documents />;
      case 'Deals':
        return <h2>Deals</h2>;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="content">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
