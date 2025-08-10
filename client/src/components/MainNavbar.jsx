import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { MapPin } from "lucide-react";
import { useTranslation, T } from '../context/TranslationContext.jsx';

export default function MainNavbar() {
  const { currentLanguage, changeLanguage, isLoading, preloadTranslations } = useTranslation();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "ta", name: "Tamil", nativeName: "தமিழ்" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" }
  ];

  // Preload navbar translations when language changes
  useEffect(() => {
    if (currentLanguage !== 'en') {
      const navbarTexts = [
        "Bank of Maharashtra",
        "Home",
        "About Us",
        "Contact Us",
        "Locate Us",
        "Careers"
      ];
      
      preloadTranslations(navbarTexts);
    }
  }, [currentLanguage, preloadTranslations]);

  const handleLanguageSelect = async (language) => {
    setIsLanguageDropdownOpen(false);
    await changeLanguage(language.code, language.name);
  };

  const getCurrentLanguageDisplay = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.nativeName : "English";
  };

  return (
    <nav className="bg-[#002D72] text-white shadow">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img
            src="https://imgs.search.brave.com/h_sxaRZsuTlgRfGbEtrWuHTOftX0vqICBvRn2IX162Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/YnJhbmRmZXRjaC5p/by9pZC0xSVVHcUY3/L3cvNDAwL2gvNDAw/L3RoZW1lL2Rhcmsv/aWNvbi5qcGVnP2M9/MWJ4aWQ2NE11cDdh/Y3pld1NBWU1YJnQ9/MTczNjk3Nzg4MTk5/NQ"
            alt="Bank of Maharashtra Logo"
            className="w-10 h-10 rounded-full"
            data-no-translate="true"
          />
          <span className="text-lg font-bold">
            <T>Bank of Maharashtra</T>
          </span>
        </div>

        {/* Navigation Links with Language Dropdown */}
        <div className="flex items-center gap-6">
          <ul className="flex gap-6 font-medium">
            <li>
              <Link to="/home-page" className="hover:text-yellow-400 transition">
                <T>Home</T>
              </Link>
            </li>
            <li>
              <Link to="/aboutus" className="hover:text-yellow-400 transition">
                <T>About Us</T>
              </Link>
            </li>
            <li>
              <Link to="/contactus" className="hover:text-yellow-400 transition">
                <T>Contact Us</T>
              </Link>
            </li>
            <li>
              <Link to="/locateus" className="hover:text-yellow-400 transition">
                <T>Locate Us</T>
              </Link>
            </li>
            <li>
              <Link to="/branchlocator" className="hover:text-yellow-400 transition">
                <T> <MapPin /> </T>
              </Link>
            </li>
          </ul>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
              aria-label="Select Language"
              disabled={isLoading}
            >
              <span className="text-sm">
                {getCurrentLanguageDisplay()}
              </span>
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isLanguageDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language)}
                      disabled={isLoading}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 ${
                        currentLanguage === language.code
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{language.nativeName}</span>
                        <span className="text-xs text-gray-500">{language.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isLanguageDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsLanguageDropdownOpen(false)}
        />
      )}
    </nav>
  );
}
