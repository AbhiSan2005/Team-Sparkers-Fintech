import React, { useState, useRef } from "react";
import { Mic, MicOff, Save } from "lucide-react";
import MainNavbar from "../components/MainNavbar";
import ServicesNavbar from "../components/ServicesNavbar";

export default function CustomerService() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    aadhar: "",
    address: "",
  });
  const [isListening, setIsListening] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const chunksRef = useRef([]);

  // Speak aloud text
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Start recording when a field is focused
  const startListening = async (fieldName) => {
    try {
      setCurrentField(fieldName);
      setIsListening(true);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/wav";

      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        await sendAudioToBackend(audioBlob, fieldName);
      };

      setMediaRecorder(recorder);
      recorder.start();
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  // Stop recording
  const stopListening = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    setIsListening(false);
  };

  // Call Flask voice backend for transcription
  const sendAudioToBackend = async (audioBlob, fieldName) => {
    try {
      const fd = new FormData();
      fd.append("audio", audioBlob, "recording.wav");

      const res = await fetch("http://localhost:5001/transcribe", {
        method: "POST",
        body: fd,
      });
      const result = await res.json();

      if (result.success && result.text) {
        const newText = result.text.trim();
        setFormData((prev) => ({ ...prev, [fieldName]: prev[fieldName] + " " + newText }));
        speakText(newText);
      }
    } catch (err) {
      console.error("Transcription error", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert("Customer details submitted successfully!");
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      <MainNavbar />
      <ServicesNavbar />

      <div className="max-w-4xl mx-auto bg-white mt-10 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-[#002D72] mb-6 text-center">
          Customer Service Form
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Please provide your details — our voice assistant will help fill them in.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Age", name: "age", type: "number" },
            { label: "Aadhar Number", name: "aadhar", type: "text", maxLength: 12 },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <div className="flex gap-2">
                <input
                  {...field}
                  value={formData[field.name]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  onFocus={() => startListening(field.name)}
                  onBlur={() => stopListening()}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
                <button
                  type="button"
                  onClick={
                    isListening && currentField === field.name
                      ? stopListening
                      : () => startListening(field.name)
                  }
                  className={`p-3 rounded-full ${
                    isListening && currentField === field.name
                      ? "bg-red-500"
                      : "bg-blue-500"
                  } text-white`}
                  title={isListening ? "Stop Recording" : "Start Recording"}
                >
                  {isListening && currentField === field.name ? (
                    <MicOff size={18} />
                  ) : (
                    <Mic size={18} />
                  )}
                </button>
              </div>
            </div>
          ))}

          {/* Address Field */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="flex gap-2">
              <textarea
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                onFocus={() => startListening("address")}
                onBlur={() => stopListening()}
                rows={3}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your address"
              ></textarea>
              <button
                type="button"
                onClick={
                  isListening && currentField === "address"
                    ? stopListening
                    : () => startListening("address")
                }
                className={`p-3 rounded-full ${
                  isListening && currentField === "address"
                    ? "bg-red-500"
                    : "bg-blue-500"
                } text-white`}
                title={isListening ? "Stop Recording" : "Start Recording"}
              >
                {isListening && currentField === "address" ? (
                  <MicOff size={18} />
                ) : (
                  <Mic size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-3 rounded-lg shadow"
            >
              <Save size={20} /> Submit Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
