import React, { useState, useEffect } from "react";
import { Mic, X, MicOff, Send, Volume2, VolumeX } from "lucide-react";

export default function VoiceAssistantSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I'm your AI voice assistant. How can I help you with your banking needs today?",
    },
  ]);
  const [input, setInput] = useState("");
  
  // Voice backend integration state variables
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingTimer, setRecordingTimer] = useState(null);
  
  // Text-to-speech state
  const [isReading, setIsReading] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

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
      // Stop any ongoing speech
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [recordingTimer, speechSynthesis]);

  // Handle text-to-speech
  const handleReadAloud = (messageId, text) => {
    if (!speechSynthesis) {
      alert("Text-to-speech is not supported in your browser");
      return;
    }

    // If already reading this message, stop it
    if (isReading === messageId) {
      speechSynthesis.cancel();
      setIsReading(null);
      return;
    }

    // Stop any ongoing speech
    speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Set event listeners
    utterance.onstart = () => {
      setIsReading(messageId);
    };

    utterance.onend = () => {
      setIsReading(null);
    };

    utterance.onerror = () => {
      setIsReading(null);
    };

    // Start speaking
    speechSynthesis.speak(utterance);
  };

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
    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate bot reply
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: "I understand your request. Let me help you with that banking information.Wikipedia is a free online encyclopedia that anyone can edit, and millions already have. Wikipedia's purpose is to benefit readers by presenting information on all branches of knowledge. Hosted by the Wikimedia Foundation, Wikipedia consists of freely editable content, with articles that usually contain numerous links guiding readers to more information. Written collaboratively by volunteers known as Wikipedians, Wikipedia articles can be edited by anyone with Internet access, except in limited cases in which editing is restricted to prevent disruption or vandalism. Since its creation on January 15, 2001, it has grown into the world's largest reference website, attracting over a billion visitors each month. Wikipedia currently has more than sixty-five million articles in more than 300 languages, including 7,036,720 articles in English, with 107,534 active contributors in the past month. Wikipedia's fundamental principles are summarized in its five pillars. While the Wikipedia community has developed many policies and guidelines, new editors do not need to be familiar with them before they start contributing.",
      };
      setMessages(prev => [...prev, botMessage]);
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
        <div className="fixed inset-0 bg-blur bg-opacity-24 z-50">
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
              {messages.map((message) => (
                <div
                  key={message.id}
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
                  
                  {/* Read aloud button for bot messages */}
                  {message.sender === "bot" && (
                    <div className="mt-2">
                      <button
                        onClick={() => handleReadAloud(message.id, message.text)}
                        className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full transition-colors ${
                          isReading === message.id
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                        title={isReading === message.id ? "Stop reading" : "Read aloud"}
                      >
                        {isReading === message.id ? (
                          <>
                            <VolumeX className="h-3 w-3" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3 w-3" />
                            <span>Read aloud</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
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
