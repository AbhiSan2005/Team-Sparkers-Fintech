import React, { useState, useEffect, useRef } from "react";
import { Mic, X, MicOff, Send } from "lucide-react";
import { BotMessageSquare } from "lucide-react";

export default function VoiceAssistantSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your AI voice assistant. How can I help you with your banking needs today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTimer, setRecordingTimer] = useState(null);
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Check if backend is up
  useEffect(() => {
    fetch("http://localhost:5001/health").catch(() =>
      console.warn("Voice service not available")
    );
  }, []);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (recordingTimer) clearTimeout(recordingTimer);
      window.speechSynthesis.cancel();
    };
  }, [recordingTimer]);

  // --- Manual TTS ---
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      console.warn("TTS not supported");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  // -------- Voice recording --------
  const handleStartListening = async () => {
    try {
      setInput("");
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error("Browser doesn't support microphone access");
      if (!window.MediaRecorder)
        throw new Error("Browser doesn't support MediaRecorder");

      setIsListening(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1, volume: 1.0 },
      });

      const supportedTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/wav",
      ];
      let mimeType = "audio/webm";
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstart = () => setInput("🎤 Recording...");
      recorder.onstop = async () => {
        setInput("⏳ Processing...");
        const audioBlob = new Blob(chunks, { type: mimeType });
        await sendAudioToBackend(audioBlob);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.onerror = () => {
        setInput("❌ Recording error");
        setIsListening(false);
      };

      setMediaRecorder(recorder);
      recorder.start(1000);

      // Auto stop after 10 seconds
      setRecordingTimer(
        setTimeout(() => {
          if (recorder.state === "recording") handleStopListening();
        }, 10000)
      );
    } catch (err) {
      setIsListening(false);
      setInput(`❌ Error: ${err.message}`);
    }
  };

  const handleStopListening = () => {
    if (recordingTimer) {
      clearTimeout(recordingTimer);
      setRecordingTimer(null);
    }
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    setIsListening(false);
  };

  // ------- Send audio to backend -------
  const sendAudioToBackend = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      const response = await fetch("http://localhost:5001/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `❌ Error: HTTP ${response.status}` },
        ]);
        return;
      }

      const result = await response.json();
      const newTranscript = result.text?.trim();

      if (result.success && newTranscript) {
        setMessages((prev) => [...prev, { sender: "user", text: newTranscript }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "🔇 No speech detected" },
        ]);
      }

      // Append bot replies
      if (result.rasa_reply && Array.isArray(result.rasa_reply)) {
        const botMessages = result.rasa_reply
          .filter((r) => r.text)
          .map((r) => ({ sender: "bot", text: r.text }));
        if (botMessages.length) setMessages((prev) => [...prev, ...botMessages]);
      }

      setInput("");
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Connection error" },
      ]);
    }
  };

  // ------- Send typed message -------
  const handleSendMessage = async () => {
    if (!input.trim() || input.includes("🎤") || input.includes("⏳") || input.includes("❌"))
      return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "web-user", message: userMsg }),
      });
      const botReplies = await res.json();
      const botMessages = botReplies
        .filter((r) => r.text)
        .map((r) => ({ sender: "bot", text: r.text }));

      if (botMessages.length) setMessages((prev) => [...prev, ...botMessages]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Could not reach Rasa server" },
      ]);
    }
  };

  const quickActions = [
    "Check Balance",
    "Recent Transactions",
    "Transfer Money",
    "Loan Information",
  ];

  return (
    <>
      {/* Floating open button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 text-gray-800 p-6 rounded-full shadow-2xl border-2 border-yellow-300 transition z-40"
        >
          <BotMessageSquare size={30} />
        </button>
      )}

      {/* Main sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm z-50 flex justify-end">
          <aside className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col rounded-l-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b bg-blue-50 rounded-tl-2xl">
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-blue-900 p-2 rounded-full">
                  <BotMessageSquare size={22} />
                </span>
                <span className="font-semibold text-gray-800 text-lg">Voice Assistant</span>
              </div>
              <button
                className="text-gray-500 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-3 flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[80%]">
                    <div
                      className={`py-2 px-4 rounded-2xl shadow-sm ${
                        m.sender === "bot"
                          ? "bg-gray-100 text-gray-800 rounded-bl-none"
                          : "bg-blue-600 text-white rounded-br-none"
                      }`}
                    >
                      {m.text}
                    </div>
                    {/* Read aloud button only on bot messages */}
                    {m.sender === "bot" && (
                      <div className="mt-1">
                        <button
                          onClick={() => speakText(m.text)}
                          className="mt-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-700 text-sm rounded-full flex items-center gap-1 transition"

                        >
                          🔊 Read aloud
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick actions & input */}
            <div className="px-5 pt-2 pb-0 border-t bg-white">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(action)}
                    className="px-4 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full text-sm text-blue-700"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pb-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-200 rounded-full"
                  disabled={isListening}
                />
                <button
                  onClick={isListening ? handleStopListening : handleStartListening}
                  className={`p-3 rounded-full ${
                    isListening
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
