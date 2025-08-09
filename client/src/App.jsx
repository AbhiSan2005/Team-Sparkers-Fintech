import { Routes, Route } from 'react-router-dom'
import React from 'react'
import HomePage from './Pages/HomePage';
import AboutUs from './Pages/AboutUs';
import ContactUs from './Pages/ContactUs';


function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/home" element={<HomePage />} /> */}
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
    </div>
  )
}

export default App