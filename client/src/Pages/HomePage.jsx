import React, { useState } from "react";
import { ArrowRight, Shield, CreditCard, Smartphone, MessageCircle, Send } from "lucide-react";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    // Simulated bot reply (replace with API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thank you for your query. Our team will assist you shortly." },
      ]);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 text-gray-900 font-sans relative">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#002D72] text-white shadow">
        <h1 className="text-2xl font-bold">Bank of Maharashtra</h1>
        <nav className="hidden md:flex space-x-6">
          <a href="#features" className="hover:text-[#FFD700]">Features</a>
          <a href="#about" className="hover:text-[#FFD700]">About</a>
          <a href="#contact" className="hover:text-[#FFD700]">Contact</a>
        </nav>
        <button className="px-4 py-2 bg-[#FFD700] text-[#002D72] font-semibold rounded-lg hover:bg-yellow-400">
          Net Banking
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center px-6 py-16 max-w-7xl mx-auto">
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Empowering Your Future with <span className="text-[#002D72]">Trust</span> & <span className="text-[#FFD700]">Security</span>
          </h2>
          <p className="text-lg text-gray-600">
            Bank of Maharashtra brings you secure, reliable, and innovative banking solutions.
            Serving you with excellence since 1935.
          </p>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#002D72] text-white rounded-lg text-lg hover:bg-blue-900">
            Open an Account <ArrowRight size={20} />
          </button>
        </div>
        <div className="flex-1 mt-10 md:mt-0">
          <img
            src="https://imgs.search.brave.com/_a8obmttQc2aQQJ87nigX8PMjZcolFB0JprQEn4_OAY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wbGF5/LWxoLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9QZ3NlNUZVY3pF/ekJqb1k1dTlveGJy/S0h5RU5vQndIVFF2/LVZhUVo2QkZyTHV2/c2pwLUpRNUNjdzBD/bjVlLUxWR284PXc0/MTYtaDIzNS1ydw"
            alt="Bank of Maharashtra"
            className="rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#002D72]">Our Key Services</h3>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg hover:shadow-lg transition">
              <Shield className="text-[#002D72] mb-4" size={40} />
              <h4 className="text-xl font-semibold mb-2">Safe & Secure</h4>
              <p className="text-gray-600">Advanced encryption and security measures to protect your funds and personal data.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg hover:shadow-lg transition">
              <CreditCard className="text-[#002D72] mb-4" size={40} />
              <h4 className="text-xl font-semibold mb-2">Digital Banking</h4>
              <p className="text-gray-600">Seamless online banking experience for all your financial needs.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg hover:shadow-lg transition">
              <Smartphone className="text-[#002D72] mb-4" size={40} />
              <h4 className="text-xl font-semibold mb-2">Mobile Banking App</h4>
              <p className="text-gray-600">Bank on the go with our user-friendly mobile application.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#002D72] text-gray-200 py-8 text-center">
        <p>© {new Date().getFullYear()} Bank of Maharashtra. All rights reserved.</p>
      </footer>

      {/* Chatbot Floating Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-[#FFD700] text-[#002D72] p-4 rounded-full shadow-lg hover:bg-yellow-400 transition"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col overflow-hidden">
          <div className="bg-[#002D72] text-white p-3 font-semibold">Bank Chat Assistant</div>
          <div className="flex-1 p-3 space-y-2 overflow-y-auto h-64">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-[#FFD700] text-[#002D72] ml-auto"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-[#002D72] text-white px-4 flex items-center justify-center hover:bg-blue-900"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
