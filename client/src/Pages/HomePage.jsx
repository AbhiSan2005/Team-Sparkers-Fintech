import React, { useState } from "react";
import { ArrowRight, Shield, CreditCard, Smartphone, Mic } from "lucide-react";

import MainNavbar from "../components/MainNavbar";
import ServicesNavbar from "../components/ServicesNavbar";
import ChatBotSidebar from "../components/ChatBotSideBar";
import VoiceAssistantSidebar from "../components/VoiceAssistantSidebar";

export default function HomePage() {
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  const handleVoiceAssistantToggle = () => {
    setIsVoiceAssistantOpen(!isVoiceAssistantOpen);
  };

  return (
    <div className="bg-gray-50 text-gray-900 font-sans relative">
      {/* MAIN NAVBAR */}
      <MainNavbar />

      {/* SERVICES NAVBAR */}
      <ServicesNavbar />

      {/* Voice Assistant Sidebar */}
      <VoiceAssistantSidebar
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
      />

      {/* Fixed Action Buttons */}
      <div className="fixed right-6 bottom-6 z-30 flex flex-col gap-4">
        <ChatBotSidebar />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002D72] to-blue-600 text-white">
        <div className="flex flex-col md:flex-row items-center px-6 py-20 max-w-7xl mx-auto">
          {/* Left */}
          <div className="flex-1 space-y-6">
            <span className="text-sm uppercase tracking-wide text-yellow-300">
              Welcome to Bank of Maharashtra
            </span>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Empowering Your Future with{" "}
              <span className="text-yellow-400">Trust</span> &{" "}
              <span className="text-white">Security</span>
            </h1>
            <p className="text-lg text-gray-200 max-w-xl">
              Secure. Reliable. Innovative. Banking that grows with you, serving
              customers since 1935.
            </p>
            <button className="flex items-center gap-3 px-7 py-3 bg-yellow-400 text-[#002D72] font-semibold rounded-lg text-lg shadow-lg hover:shadow-yellow-500 hover:scale-105 transition">
              Open an Account <ArrowRight size={22} />
            </button>
          </div>

          {/* Right */}
          <div className="flex-1 mt-10 md:mt-0 flex justify-center">
            <img
              src="https://imgs.search.brave.com/_a8obmttQc2aQQJ87nigX8PMjZcolFB0JprQEn4_OAY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wbGF5/LWxoLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9QZ3NlNUZVY3pF/ekJqb1k1dTlveGJy/S0h5RU5vQndIVFF2/LVZhUVo2QkZyTHV2/c2pwLUpRNUNjdzBD/bjVlLUxWR284PXc0/MTYtaDIzNS1ydw"
              alt="Bank of Maharashtra"
              className="rounded-2xl shadow-lg border-4 border-white"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-14 text-[#002D72]">
            Our Key Services
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
                <h4 className="text-xl font-semibold mb-2">{title}</h4>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#002D72] text-gray-200 py-8 text-center">
        <p>
          © {new Date().getFullYear()} Bank of Maharashtra. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
