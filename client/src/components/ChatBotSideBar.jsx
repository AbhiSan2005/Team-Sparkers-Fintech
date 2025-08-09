import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatBotSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    // Simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thanks for your message. We’ll get back shortly!" },
      ]);
    }, 500);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-yellow-400 text-[#002D72] p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <MessageCircle size={28} />
      </button>

      {/* Sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#002D72] text-white p-4">
          <h2 className="font-semibold">Bank Chat Assistant</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-yellow-400 text-[#002D72] ml-auto"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
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
            className="bg-[#002D72] text-white px-4 hover:bg-blue-900 flex items-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
