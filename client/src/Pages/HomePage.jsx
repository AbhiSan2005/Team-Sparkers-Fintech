import React, { useState, useEffect } from "react";
import { ArrowRight, Shield, CreditCard, Smartphone } from "lucide-react";
import { useTranslation } from '../context/TranslationContext.jsx';
import { T } from '../context/TranslationContext.jsx';
import { Link } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import ServicesNavbar from "../components/ServicesNavbar";
import VoiceAssistantSidebar from "../components/VoiceAssistantSidebar";

export default function HomePage() {
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const { isLoading, currentLanguage, preloadTranslations } = useTranslation();
  
  const handleVoiceAssistantToggle = () => {
    setIsVoiceAssistantOpen(!isVoiceAssistantOpen);
  };

  // Preload translations
  useEffect(() => {
    if (currentLanguage !== 'en') {
      const pageTexts = [
        // Hero section
        "Welcome to Bank of Maharashtra",
        "Get Help Anytime with",
        "Our Customer Service Team",
        "Security", 
        "We’re here to assist you with all your banking needs, queries, and support — anytime, anywhere.",
        "Customer Service",
        
        // Features section
        "Our Key Services",
        "Safe & Secure",
        "Advanced encryption and security measures to protect your funds and personal data.",
        "Digital Banking", 
        "Seamless online banking experience for all your financial needs.",
        "Mobile Banking App",
        "Bank on the go with our user-friendly mobile application.",
        
        // Statistics section
        "Trusted by Millions",
        "Year Established",
        "Customers Served", 
        "Branches & ATMs",
        "Customer Support",
        
        // CTA section
        "Ready to Start Your Banking Journey?",
        "Join millions of satisfied customers who trust Bank of Maharashtra for their financial needs.",
        "Open Savings Account",
        "Learn More",
        
        // Footer
        "Quick Links",
        "Home",
        "About Us", 
        "Contact",
        "Careers",
        "Services",
        "Personal Banking",
        "Business Banking",
        "Loans",
        "Insurance",
        "Digital Banking",
        "Internet Banking",
        "Mobile Banking", 
        "UPI Services",
        "Card Services",
        "Support",
        "Customer Care",
        "Branch Locator",
        "FAQs",
        "Grievance",
        "Bank of Maharashtra. All rights reserved.",
        "Licensed by RBI | Deposits insured by DICGC up to ₹5,00,000",
        
        // Loading text
        "Translating page..."
      ];
      
      preloadTranslations(pageTexts);
    }
  }, [currentLanguage, preloadTranslations]);

  return (
    <div className="bg-gray-50 text-gray-900 font-sans relative">
      {/* Translation Loading Indicator */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 z-50">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <T>Translating page...</T>
          </div>
        </div>
      )}

      {/* MAIN NAVBAR */}
      <MainNavbar />

      {/* SERVICES NAVBAR */}
      <ServicesNavbar />

      {/* Voice Assistant Sidebar */}
      <VoiceAssistantSidebar
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002D72] to-blue-600 text-white">
        <div className="flex flex-col md:flex-row items-center px-6 py-20 max-w-7xl mx-auto">
          {/* Left */}
          <div className="flex-1 space-y-6">
            <span className="text-sm uppercase tracking-wide text-yellow-300">
              <T>Welcome to Bank of Maharashtra</T>
            </span>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <T>Get Help Anytime with</T>{" "}
              <span className="text-yellow-400">
                <T>Our Customer Service Team</T>
              </span>
            </h1>
            <p className="text-lg text-gray-200 max-w-xl">
              <T>We’re here to assist you with all your banking needs, queries, and support — anytime, anywhere.</T>
            </p>
            <Link to="/customer-service" className="inline-flex items-center gap-3 px-7 py-3 bg-yellow-400 text-[#002D72] font-semibold rounded-lg text-lg shadow-lg hover:shadow-yellow-500 hover:scale-105 transition">
              Customer Service
            </Link>

            {/* <a 
              href="/customer-service"
              className="inline-flex items-center gap-3 px-7 py-3 bg-yellow-400 text-[#002D72] font-semibold rounded-lg text-lg shadow-lg hover:shadow-yellow-500 hover:scale-105 transition"
            >
              <T>Customer Service</T> <ArrowRight size={22} />
            </a> */}
          </div>

          {/* Right */}
          <div className="flex-1 mt-10 md:mt-0 flex justify-center">
            <img
              src="https://imgs.search.brave.com/_a8obmttQc2aQQJ87nigX8PMjZcolFB0JprQEn4_OAY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wbGF5/LWxoLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9QZ3NlNUZVY3pF/ekJqb1k1dTlveGJy/S0h5RU5vQndIVFF2/LVZhUVo2QkZyTHV2/c2pwLUpRNUNjdzBD/bjVlLUxWR284PXc0/MTYtaDIzNS1ydw"
              alt="Bank of Maharashtra"
              className="rounded-2xl shadow-lg border-4 border-white"
              data-no-translate="true"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-14 text-[#002D72]">
            <T>Our Key Services</T>
          </h3>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Safe & Secure",
                desc: "Advanced encryption and security measures to protect your funds and personal data.",
              },
              {
                icon: CreditCard,
                title: "Digital Banking",
                desc: "Seamless online banking experience for all your financial needs.",
              },
              {
                icon: Smartphone,
                title: "Mobile Banking App",
                desc: "Bank on the go with our user-friendly mobile application.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-8 border rounded-2xl bg-white shadow-sm hover:shadow-xl hover:scale-105 transition"
              >
                <div className="p-4 bg-blue-100 text-[#002D72] rounded-full mb-4">
                  <Icon size={36} />
                </div>
                <h4 className="text-xl font-semibold mb-2">
                  <T>{title}</T>
                </h4>
                <p className="text-gray-600">
                  <T>{desc}</T>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#002D72]">
            <T>Trusted by Millions</T>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">1935</div>
              <p className="text-gray-600">
                <T>Year Established</T>
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">50L+</div>
              <p className="text-gray-600">
                <T>Customers Served</T>
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">2000+</div>
              <p className="text-gray-600">
                <T>Branches & ATMs</T>
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">
                <T>Customer Support</T>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-[#002D72] text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold mb-4">
            <T>Ready to Start Your Banking Journey?</T>
          </h3>
          <p className="text-lg mb-8 text-gray-200">
            <T>Join millions of satisfied customers who trust Bank of Maharashtra for their financial needs.</T>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-yellow-400 text-[#002D72] font-semibold rounded-lg hover:bg-yellow-500 transition">
              <T>Open Savings Account</T>
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#002D72] transition">
              <T>Learn More</T>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#002D72] text-gray-200 py-8 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">
                <T>Quick Links</T>
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-yellow-400"><T>Home</T></a></li>
                <li><a href="#" className="hover:text-yellow-400"><T>About Us</T></a></li>
                <li><a href="#" className="hover:text-yellow-400"><T>Contact</T></a></li>
                <li><a href="#" className="hover:text-yellow-400"><T>Careers</T></a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">
                <T>Services</T>
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-yellow-400"><T>Personal Banking</T></a></li>
                <li><a href="#" className="hover:text-yellow-400"><T>Business Banking</T></a></li>
                <li><a href="#" className="hover:text-yellow-400"><T>Loans</T></a></li>
                <li><a href="#" className="hover:text-yellow-400"><T>Insurance</T></a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">
                <T>Digital Banking</T>
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-yellow-400"><T>Internet Banking</T></a></li>
                <li><a href="#" className="hover:text-yellow-400"><T>Mobile Banking</T></a></li>
                <li><a href="#" className="hover:text-yellow-400"><T>UPI Services</T></a></li>
                <li><a href="#" className="hover:text-yellow-400"><T>Card Services</T></a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">
                <T>Support</T>
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-yellow-400"><T>Customer Care</T></a></li>
                <li><a href="#" className="hover:text-yellow-400"><T>Branch Locator</T></a></li>
                <li><a href="#" className="hover:text-yellow-400"><T>FAQs</T></a></li>
                <li><a href="#" className="hover:text-yellow-400"><T>Grievance</T></a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-700 pt-6">
            <p>
              © {new Date().getFullYear()} <T>Bank of Maharashtra. All rights reserved.</T>
            </p>
            <p className="text-sm mt-2 text-gray-400">
              <T>Licensed by RBI | Deposits insured by DICGC up to ₹5,00,000</T>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
