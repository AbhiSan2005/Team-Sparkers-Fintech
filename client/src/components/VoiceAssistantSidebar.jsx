import React, { useState, useEffect } from "react";
import { Mic, X, MicOff, Volume2, VolumeX, Send } from "lucide-react";

export default function VoiceAssistantSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm your AI voice assistant. How can I help you with your banking needs today?" },
  ]);
  const [input, setInput] = useState("");

  const handleStartListening = () => {
    setIsListening(true);
    // Add speech recognition logic here
    console.log("Starting voice recognition...");
    
    // Simulate transcript (replace with actual speech recognition)
    setTimeout(() => {
      setTranscript("Check my account balance");
      setIsListening(false);
    }, 3000);
  };

  const handleStopListening = () => {
    setIsListening(false);
    console.log("Stopping voice recognition...");
  };

  const handleSendVoice = () => {
    if (!transcript.trim()) return;

    // Add user message from voice
    setMessages(prev => [...prev, { sender: "user", text: transcript }]);
    setTranscript("");

    // Simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "I understand your request. Let me help you with that banking information." },
      ]);
    }, 1000);
  };

  const handleSendText = () => {
    if (!input.trim()) return;

    // Add user message from text input
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    // Simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thanks for your message. I'll help you with that right away!" },
      ]);
    }, 500);
  };

  const toggleSpeaker = () => {
    setIsSpeaking(!isSpeaking);
  };

  const quickActions = ["Check Balance", "Recent Transactions", "Transfer Money", "Loan Information"];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-24 right-6 p-4 rounded-full shadow-lg hover:scale-110 transition-transform text-white
          ${isListening 
            ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
            : 'bg-gradient-to-r from-[#002D72] to-blue-600'
          }
        `}
      >
        <Mic size={28} />
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
        <div className="flex items-center justify-between bg-gradient-to-r from-[#002D72] to-blue-600 text-white p-4">
          <div className="flex items-center gap-2">
            <Mic size={20} />
            <h2 className="font-semibold">Voice Assistant</h2>
          </div>
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

        {/* Voice Transcript Display */}
        {(isListening || transcript) && (
          <div className="mx-4 mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">
              {isListening ? "🎤 Listening..." : "Voice Input:"}
            </p>
            <p className="text-gray-800 text-sm">
              {transcript || "Speak now..."}
              {isListening && <span className="animate-pulse">|</span>}
            </p>
            {transcript && (
              <button
                onClick={handleSendVoice}
                className="mt-2 px-3 py-1 bg-[#002D72] text-white text-xs rounded hover:bg-blue-700 transition-colors"
              >
                Send Voice Message
              </button>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick Actions:</p>
          <div className="flex flex-wrap gap-1">
            {quickActions.map((action) => (
              <button
                key={action}
                className="text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
                onClick={() => setInput(action)}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Controls */}
        <div className="px-4 pb-2 flex gap-2">
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm transition-all
              ${isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-[#002D72] text-white hover:bg-blue-700'
              }
            `}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            {isListening ? "Stop" : "Voice"}
          </button>

          <button
            onClick={toggleSpeaker}
            className={`
              p-2 rounded-lg transition-colors border text-sm
              ${isSpeaking 
                ? 'bg-yellow-400 text-[#002D72] border-yellow-400' 
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }
            `}
            title={isSpeaking ? "Mute Assistant" : "Enable Voice Responses"}
          >
            {isSpeaking ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>

        {/* Text Input Area */}
        <div className="flex border-t">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message or use voice..."
            className="flex-1 p-2 outline-none text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
          />
          <button
            onClick={handleSendText}
            className="bg-[#002D72] text-white px-4 hover:bg-blue-900 flex items-center transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
