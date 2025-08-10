import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';

import LanguageSelector from './components/IndiaLanguageSelector';
import VoiceAssistantSidebar from './components/VoiceAssistantSidebar';
import HomePage from './Pages/HomePage';
import AboutUs from './Pages/AboutUs';
import ContactUs from './Pages/ContactUs';
import LocateUs from './Pages/LocateUs';
import Careers from './Pages/Carrer';

function App() {
  return (
     <TranslationProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LanguageSelector />} />
          <Route path="/home-page" element={<HomePage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/locateus" element={<LocateUs />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
        <VoiceAssistantSidebar />
      </div>
    </TranslationProvider>
  );
}

export default App;
