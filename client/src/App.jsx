import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';

import LanguageSelector from './components/IndiaLanguageSelector';
import VoiceAssistantSidebar from './components/VoiceAssistantSidebar';
import HomePage from './Pages/HomePage';
import AboutUs from './Pages/AboutUs';
import ContactUs from './Pages/ContactUs';
import Careers from './Pages/Carrer';
import BranchLocator from './Pages/BranchLocator'
import CustomerService from './Pages/CustomerService'

function App() {
  return (
     <TranslationProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LanguageSelector />} />
          <Route path="/home-page" element={<HomePage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/locateus" element={<BranchLocator />} />
          <Route path="/branchlocator" element={<BranchLocator />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/customer-service" element={<CustomerService />} />
        </Routes>
        <VoiceAssistantSidebar />
      </div>
    </TranslationProvider>
  );
}

export default App;
