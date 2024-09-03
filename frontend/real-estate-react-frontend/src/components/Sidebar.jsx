import React from 'react'

function Sidebar({ activeTab, setActiveTab }) {
  const tabs = ['Home', 'Documents', 'Deals']

  return (
    <nav className="sidebar">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`sidebar-tab ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
    
  )
}

export default Sidebar
