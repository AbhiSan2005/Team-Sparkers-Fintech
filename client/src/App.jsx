import { Routes, Route } from 'react-router-dom'
import React from 'react'
import HomePage from './Pages/HomePage';
import AboutUs from './Pages/AboutUs';
import ContactUs from './Pages/ContactUs';
import BranchLocator from './Pages/BranchLocator'; // Add this import
import LanguageSelector from './components/IndiaLanguageSelector';
import LocateUs from './Pages/LocateUs';
import Careers from './Pages/Carrer';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LanguageSelector />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/branch-locator" element={<BranchLocator />} />
        <Route path="/locateus" element={<LocateUs />} />
        <Route path="/careers" element={<Careers />} />
      </Routes>
    </div>
  );
}

export default App;