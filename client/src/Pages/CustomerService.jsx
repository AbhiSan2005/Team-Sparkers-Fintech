import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Save, Phone, Shield, Check, RotateCcw, AlertCircle } from "lucide-react";
import { auth } from "../context/firebase"; // Import your Firebase auth
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import MainNavbar from "../components/MainNavbar";
import ServicesNavbar from "../components/ServicesNavbar";

export default function CustomerService() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phone: "",
    aadhar: "",
    address: "",
  });
  const [isListening, setIsListening] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmationResult, setConfirmationResult] = useState(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Initialize reCAPTCHA verifier
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
    }
    
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // Validation functions
  const validateAge = (age) => {
    const numAge = parseInt(age);
    if (!age) return "Age is required";
    if (isNaN(numAge)) return "Age must be a number";
    if (numAge < 18) return "Age must be at least 18 years";
    if (numAge > 100) return "Age must not exceed 100 years";
    return null;
  };

  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    if (phone.length !== 10) return "Phone number must be exactly 10 digits";
    if (!/^\d{10}$/.test(phone)) return "Phone number must contain only digits";
    return null;
  };

  const validateAadhar = (aadhar) => {
    if (!aadhar) return "Aadhar number is required";
    if (aadhar.length !== 12) return "Aadhar number must be exactly 12 digits";
    if (!/^\d{12}$/.test(aadhar)) return "Aadhar number must contain only digits";
    return null;
  };

  // Handle input changes with validation
  const handleInputChange = (fieldName, value) => {
    let processedValue = value;
    let error = null;

    // Process value based on field type
    switch (fieldName) {
      case 'age':
        processedValue = value.replace(/\D/g, '');
        if (processedValue && (parseInt(processedValue) > 100)) {
          processedValue = '100';
        }
        error = validateAge(processedValue);
        break;
      
      case 'phone':
        processedValue = value.replace(/\D/g, '').slice(0, 10);
        error = validatePhone(processedValue);
        if (otpSent && processedValue !== formData.phone) {
          setOtpSent(false);
          setOtpVerified(false);
          setOtp("");
          setCanResend(false);
          setResendTimer(0);
          setConfirmationResult(null);
        }
        break;
      
      case 'aadhar':
        processedValue = value.replace(/\D/g, '').slice(0, 12);
        error = validateAadhar(processedValue);
        break;
      
      case 'fullName':
        processedValue = value.replace(/\s+/g, ' ');
        if (!processedValue.trim()) {
          error = "Full name is required";
        }
        break;
      
      case 'address':
        if (!value.trim()) {
          error = "Address is required";
        }
        break;
    }

    setFormData(prev => ({ ...prev, [fieldName]: processedValue }));
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Timer effect for resend functionality
  useEffect(() => {
    if (otpSent && !otpVerified && resendTimer > 0) {
      timerRef.current = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && otpSent && !otpVerified) {
      setCanResend(true);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resendTimer, otpSent, otpVerified]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Speak aloud text
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Start recording - only when voice button is clicked
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
    setCurrentField(null);
  };

  // Handle voice button click
  const handleVoiceButtonClick = (fieldName) => {
    if (isListening && currentField === fieldName) {
      stopListening();
    } else {
      startListening(fieldName);
    }
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
        const currentValue = formData[fieldName];
        const combinedValue = currentValue ? currentValue + " " + newText : newText;
        handleInputChange(fieldName, combinedValue);
        speakText(newText);
      }
    } catch (err) {
      console.error("Transcription error", err);
    }
  };

  // Send OTP using Firebase
  const sendOtp = async (isResend = false) => {
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      alert(phoneError);
      return;
    }

    setIsLoadingOtp(true);
    try {
      // Format phone number with country code (+91 for India)
      const phoneNumber = `+91${formData.phone}`;
      
      // Get reCAPTCHA verifier
      const appVerifier = window.recaptchaVerifier;
      
      // Send OTP using Firebase
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setResendTimer(60);
      setCanResend(false);
      setOtp("");
      
      const message = isResend ? "OTP resent successfully!" : "OTP sent successfully to your phone number!";
      alert(message);
      speakText(message);
      
    } catch (error) {
      console.error("OTP send error:", error);
      let errorMessage = "Failed to send OTP. Please try again.";
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/invalid-phone-number':
          errorMessage = "Invalid phone number format.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many requests. Please try again later.";
          break;
        case 'auth/quota-exceeded':
          errorMessage = "SMS quota exceeded. Please try again later.";
          break;
        default:
          errorMessage = error.message || "Failed to send OTP.";
      }
      
      alert(errorMessage);
      
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(function(widgetId) {
          grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setIsLoadingOtp(false);
    }
  };

  // Resend OTP
  const resendOtp = () => {
    if (canResend) {
      sendOtp(true);
    }
  };

  // Verify OTP using Firebase
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    if (!confirmationResult) {
      alert("Please request OTP first");
      return;
    }

    try {
      setIsLoadingOtp(true);
      
      // Verify the OTP using Firebase
      const result = await confirmationResult.confirm(otp);
      
      console.log("User signed in successfully:", result.user);
      
      setOtpVerified(true);
      setCanResend(false);
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Show success alert as requested
      alert("You are signed in!");
      speakText("You are signed in!");
      
    } catch (error) {
      console.error("OTP verification error:", error);
      
      let errorMessage = "Invalid OTP. Please try again.";
      
      switch (error.code) {
        case 'auth/invalid-verification-code':
          errorMessage = "Invalid verification code. Please check and try again.";
          break;
        case 'auth/code-expired':
          errorMessage = "Verification code has expired. Please request a new one.";
          break;
        default:
          errorMessage = error.message || "Failed to verify OTP.";
      }
      
      alert(errorMessage);
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    newErrors.fullName = formData.fullName.trim() ? null : "Full name is required";
    newErrors.age = validateAge(formData.age);
    newErrors.phone = validatePhone(formData.phone);
    newErrors.aadhar = validateAadhar(formData.aadhar);
    newErrors.address = formData.address.trim() ? null : "Address is required";

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== null);
    
    if (hasErrors) {
      alert("Please fix all validation errors before submitting");
      return;
    }

    if (!otpVerified) {
      alert("Please verify your phone number first");
      return;
    }

    console.log("Submitted Data:", formData);
    alert("Customer details submitted successfully!");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fieldConfigs = [
    { label: "Full Name", name: "fullName", type: "text", icon: "👤", placeholder: "Enter your full name" },
    { label: "Age", name: "age", type: "text", icon: "🎂", placeholder: "Enter age (18-100)" },
    { label: "Phone Number", name: "phone", type: "tel", icon: "📱", placeholder: "Enter 10-digit phone number" },
    { label: "Aadhar Number", name: "aadhar", type: "text", icon: "🆔", placeholder: "Enter 12-digit Aadhar number" },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen text-gray-900 font-sans">
      <MainNavbar />
      <ServicesNavbar />

      <div className="max-w-5xl mx-auto mt-8 px-4">
        {/* reCAPTCHA container - hidden */}
        <div id="recaptcha-container"></div>
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Customer Service Portal</h1>
          <p className="text-gray-600 text-lg">
            Complete your registration with our AI-powered voice assistant
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Fields Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {fieldConfigs.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
                    <span className="text-xl">{field.icon}</span>
                    {field.label}
                    {field.name === "phone" && otpVerified && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </label>
                  
                  <div className="relative">
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className={`w-full p-4 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-200 text-lg ${
                        errors[field.name] 
                          ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                          : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      }`}
                      placeholder={field.placeholder}
                      disabled={field.name === "phone" && otpVerified}
                    />
                    
                    {/* Voice Input Button */}
                    <button
                      type="button"
                      onClick={() => handleVoiceButtonClick(field.name)}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
                        isListening && currentField === field.name
                          ? "bg-red-500 hover:bg-red-600 animate-pulse"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white shadow-lg`}
                      title={isListening && currentField === field.name ? "Stop Recording" : "Start Voice Input"}
                    >
                      {isListening && currentField === field.name ? (
                        <MicOff size={20} />
                      ) : (
                        <Mic size={20} />
                      )}
                    </button>
                  </div>

                  {/* Error Message */}
                  {errors[field.name] && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{errors[field.name]}</span>
                    </div>
                  )}

                  {/* Field-specific info */}
                  {field.name === "age" && !errors[field.name] && (
                    <p className="text-xs text-gray-500">Must be between 18 and 100 years</p>
                  )}
                  {field.name === "phone" && !errors[field.name] && !otpVerified && (
                    <p className="text-xs text-gray-500">10 digits only, no spaces or special characters</p>
                  )}
                  {field.name === "aadhar" && !errors[field.name] && (
                    <p className="text-xs text-gray-500">12 digits only, no spaces or special characters</p>
                  )}

                  {/* OTP Section for Phone Field */}
                  {field.name === "phone" && (
                    <div className="mt-4 space-y-3">
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={() => sendOtp(false)}
                          disabled={!!errors.phone || !formData.phone || isLoadingOtp}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <Shield size={16} />
                          {isLoadingOtp ? "Sending..." : "Send OTP"}
                        </button>
                      ) : !otpVerified ? (
                        <div className="space-y-3">
                          {/* OTP Input and Verify Button */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              placeholder="Enter 6-digit OTP"
                              className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              maxLength={6}
                            />
                            <button
                              type="button"
                              onClick={verifyOtp}
                              disabled={isLoadingOtp}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200 font-medium"
                            >
                              {isLoadingOtp ? "Verifying..." : "Verify"}
                            </button>
                          </div>
                          
                          {/* Resend Button and Timer */}
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={resendOtp}
                              disabled={!canResend || isLoadingOtp}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                                canResend && !isLoadingOtp
                                  ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <RotateCcw size={14} className={canResend ? "" : "opacity-50"} />
                              {isLoadingOtp ? "Resending..." : "Resend OTP"}
                            </button>
                            
                            {resendTimer > 0 && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <span>Resend in</span>
                                <span className="font-mono font-bold text-blue-600">
                                  {formatTime(resendTimer)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {canResend && (
                            <p className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                              ✅ You can now resend the OTP
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                          <Check size={16} />
                          Phone number verified
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Address Field - Full Width */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
                <span className="text-xl">🏠</span>
                Address
              </label>
              <div className="relative">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={4}
                  className={`w-full p-4 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-200 text-lg resize-none ${
                    errors.address 
                      ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                      : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  placeholder="Enter your complete address"
                />
                <button
                  type="button"
                  onClick={() => handleVoiceButtonClick("address")}
                  className={`absolute right-2 top-4 p-2 rounded-full transition-all duration-200 ${
                    isListening && currentField === "address"
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white shadow-lg`}
                  title={isListening && currentField === "address" ? "Stop Recording" : "Start Voice Input"}
                >
                  {isListening && currentField === "address" ? (
                    <MicOff size={20} />
                  ) : (
                    <Mic size={20} />
                  )}
                </button>
              </div>
              {errors.address && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.address}</span>
                </div>
              )}
            </div>

            {/* Voice Status Indicator */}
            {isListening && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-blue-700">
                  <Mic className="w-5 h-5 animate-pulse" />
                  <span className="font-medium">
                    Listening for {currentField && currentField.replace(/([A-Z])/g, ' $1').toLowerCase()}...
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={!otpVerified || Object.values(errors).some(error => error !== null)}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white text-xl font-bold py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                <Save size={24} />
                Submit Customer Details
              </button>
              {!otpVerified && (
                <p className="text-red-500 text-center mt-2 text-sm">
                  Please verify your phone number to continue
                </p>
              )}
              {Object.values(errors).some(error => error !== null) && (
                <p className="text-red-500 text-center mt-2 text-sm">
                  Please fix all validation errors to continue
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            🎤 Click the microphone icon to use voice input • ✏️ Or type directly in the fields
          </p>
        </div>
      </div>
    </div>
  );
}
