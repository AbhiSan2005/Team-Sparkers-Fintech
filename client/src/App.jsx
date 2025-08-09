import { Routes, Route } from 'react-router-dom';
import React from 'react';
import HomePage from './Pages/HomePage';
import { Routes, Route } from 'react-router-dom'
import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App