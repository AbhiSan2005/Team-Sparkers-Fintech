import React, { useState, useEffect } from "react";
import { Mic, X, MicOff, Send } from "lucide-react";

export default function VoiceAssistantSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your AI voice assistant. How can I help you with your banking needs today?",
    },
  ]);
  const [input, setInput] = useState("");
  
  // Voice backend integration state variables
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingTimer, setRecordingTimer] = useState(null);

  // Check backend health on component mount
  useEffect(() => {
    const checkVoiceService = async () => {
      try {
        const response = await fetch('http://localhost:5001/health');
        if (!response.ok) {
          console.warn("Voice service not available");
        }
      } catch (error) {
        console.warn("Voice service not running:", error);
      }
    };
    
    checkVoiceService();
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearTimeout(recordingTimer);
      }
    };
  }, [recordingTimer]);

  // Handle voice recording
  const handleStartListening = async () => {
    try {
      // Clear current input when starting voice recording
      setInput("");
      
      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser doesn't support microphone access");
      }
      
      if (!window.MediaRecorder) {
        throw new Error("Browser doesn't support MediaRecorder");
      }
      
      setIsListening(true);
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          volume: 1.0
        } 
      });
      
      // Setup MediaRecorder
      const supportedTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/wav'
      ];
      
      let mimeType = 'audio/webm';
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }
      
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstart = () => {
        setInput("🎤 Recording...");
      };
      
      recorder.onstop = async () => {
        setInput("⏳ Processing...");
        const audioBlob = new Blob(chunks, { type: mimeType });
        await sendAudioToBackend(audioBlob);
        
        // Release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
        setInput("❌ Recording error");
      };
      
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start(1000);
      
      // Auto-stop after 10 seconds
      const timer = setTimeout(() => {
        if (recorder.state === 'recording') {
          handleStopListening();
        }
      }, 10000);
      
      setRecordingTimer(timer);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsListening(false);
      setInput(`❌ Error: ${error.message}`);
    }
  };

  const handleStopListening = () => {
    // Clear timer
    if (recordingTimer) {
      clearTimeout(recordingTimer);
      setRecordingTimer(null);
    }
    
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    
    setIsListening(false);
  };

  // Send audio to backend for transcription
  const sendAudioToBackend = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      const response = await fetch('http://localhost:5001/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          const newTranscript = result.text.trim();
          if (newTranscript) {
            setInput(newTranscript);
          } else {
            setInput("🔇 No speech detected");
          }
        } else {
          setInput(`❌ Error: ${result.error}`);
        }
      } else {
        setInput(`❌ Error: HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending audio to backend:", error);
      setInput("❌ Connection error");
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() || input.includes("🎤") || input.includes("⏳") || input.includes("❌")) {
      return;
    }

    // Add user message
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    // Simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I understand your request. Let me help you with that banking information.",
        },
      ]);
    }, 1000);
  };

  const quickActions = [
    "Check Balance",
    "Recent Transactions", 
    "Transfer Money",
    "Loan Information"
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40"
        aria-label="Open Voice Assistant"
      >
        <Mic className="h-6 w-6" />
      </button>

      {/* Sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-blue-50">
              <h2 className="text-lg font-semibold text-gray-800">
                🎤 Voice Assistant
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[80%] ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t bg-gray-50">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Actions:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(action)}
                      className="p-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              {/* Combined text and voice input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {/* Voice button */}
                <button
                  onClick={isListening ? handleStopListening : handleStartListening}
                  className={`p-4 rounded-lg transition-colors ${
                    isListening
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  title={isListening ? "Stop Recording" : "Start Voice Recording"}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>

                {/* Send button */}
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}