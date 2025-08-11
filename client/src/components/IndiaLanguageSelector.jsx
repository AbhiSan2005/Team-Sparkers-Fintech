import React, { useEffect, useMemo, useRef, useState } from "react";
import logo from "../assets/images/logo.png";          // adjust path if needed
import indiaMap from "../assets/images/india_map.png"; // add this image to your assets
import { useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*                               TRANSLATIONS                                 */
/* -------------------------------------------------------------------------- */
const I18N = {
  en: {
    name: "English",
    pill: "Language: English (Default)",
    badge: "Secure Digital Banking",
    headline: "Welcome to Bank of Maharashtra",
    subcopy: "Choose a language by tapping a location on the map.",
    primary: "Get Started",
    secondary: "Learn More",
    current: "Current: English",
    note: "Tip: Click a pulsing marker to switch language. Saved for next time."
  },
  hi: {
    name: "हिन्दी",
    pill: "भाषा: हिन्दी",
    badge: "सुरक्षित डिजिटल बैंकिंग",
    headline: "बैंक ऑफ महाराष्ट्र में स्वागत है",
    subcopy: "मानचित्र पर स्थान चुनकर भाषा बदलें।",
    primary: "शुरू करें",
    secondary: "और जानें",
    current: "वर्तमान: हिन्दी",
    note: "भाषा बदलने के लिए चिन्ह पर क्लिक करें। पसंद याद रहेगी।"
  },
  bn: {
    name: "বাংলা",
    pill: "ভাষা: বাংলা",
    badge: "নিরাপদ ডিজিটাল ব্যাংকিং",
    headline: "ব্যাংক অফ মহারাষ্ট্রে স্বাগতম",
    subcopy: "মানচিত্রে অবস্থান স্পর্শ করে ভাষা বাছুন।",
    primary: "শুরু করুন",
    secondary: "আরও জানুন",
    current: "বর্তমান: বাংলা",
    note: "ভাষা বদলাতে চিহ্নে ক্লিক করুন। পছন্দ সংরক্ষিত থাকবে।"
  },
  mr: {
    name: "मराठी",
    pill: "भाषा: मराठी",
    badge: "सुरक्षित डिजिटल बँकिंग",
    headline: "बँक ऑफ महाराष्ट्रात स्वागत आहे",
    subcopy: "नकाशावर स्थान निवडा आणि भाषा बदला.",
    primary: "सुरू करा",
    secondary: "अधिक जाणून घ्या",
    current: "चालू: मराठी",
    note: "भाषा बदलण्यासाठी चिन्हावर क्लिक करा. निवड जतन होईल."
  },
  te: {
    name: "తెలుగు",
    pill: "భాష: తెలుగు",
    badge: "సురక్షిత డిజిటల్ బ్యాంకింగ్",
    headline: "బ్యాంక్ ఆఫ్ మహారాష్ట్రకు స్వాగతం",
    subcopy: "మ్యాప్‌లో ఉన్న స్థానాన్ని తట్టి భాషను ఎంచుకోండి.",
    primary: "ప్రారంభించండి",
    secondary: "మరింత తెలుసుకోండి",
    current: "ప్రస్తుత: తెలుగు",
    note: "భాష మార్చేందుకు గుర్తుపై క్లిక్ చేయండి. ఎంపిక నిల్వ ఉంటుంది."
  },
  ta: {
    name: "தமிழ்",
    pill: "மொழி: தமிழ்",
    badge: "பாதুকাప্পান ডিজিট্টল் ব�্গী",
    headline: "வங்কি ऑফ मহারাষ্ট्राविற্कु વরવের্पु",
    subcopy: "வரைപ্படত্তিল् इদत্তैत் তொডন্দু মொঝিযैत् তেরন্দেদুক্কবুম্।",
    primary: "তொডগবুम্",
    secondary: "মেলুম् আরিক",
    current: "তর্পোদু: তমিঝ্",
    note: "মொঝি মার্ত্ত তুডিপ্পু কুরি সொডুক্কবুম্। তেরব সেমিক্কপ্পাডুম্।"
  },
  kn: {
    name: "ಕನ್ನಡ",
    pill: "ಭಾಷೆ: ಕನ್ನಡ",
    badge: "ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್",
    headline: "ಬ್ಯಾಂಕ್ ಆಫ್ ಮಹಾರಾಷ್ಟ್ರಕ್ಕೆ ಸ್ವಾಗತ",
    subcopy: "ನಕ್ಷೆಯಲ್ಲಿ ಸ್ಥಳ ಆಯ್ಕೆ ಮಾಡಿ ಭಾಷೆ ಬದಲಿಸಿ.",
    primary: "ಪ್ರಾರಂಭಿಸಿ",
    secondary: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    current: "ಪ್ರಸ್ತುತ: ಕನ್ನಡ",
    note: "ಭಾಷೆ ಬದಲಿಸಲು ಗುರುತಿಗೆ ಕ್ಲಿಕ್ ಮಾಡಿ. ಆಯ್ಕೆ ಉಳಿಯುತ್ತದೆ."
  }
};

/* -------------------------------------------------------------------------- */
/*                          UPDATED MARKER POSITIONS                         */
/* -------------------------------------------------------------------------- */
const markers = [
  { lang: "hi", left: "45%", top: "35%", label: "हिन्दी" },
  { lang: "bn", left: "64%", top: "45%", label: "বাংলা", color: "from-orange-400" },
  { lang: "mr", left: "32%", top: "55%", label: "मराठी", color: "from-amber-500" },
  { lang: "te", left: "43%", top: "64%", label: "తెలుగు", color: "from-red-500" },
  { lang: "ta", left: "37%", top: "85%", label: "தமிழ்", color: "from-green-500" },
  { lang: "kn", left: "32%", top: "70%", label: "ಕನ್ನಡ", color: "from-blue-500" }
];

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */
const DEFAULT_LANG = "en";
const GET_STARTED_URL = "https://bankofmaharashtra.in/";

export default function BankOfMaharashtraLanguageSelector() {
  const [lang, setLang] = useState(DEFAULT_LANG);
  const t = useMemo(() => I18N[lang], [lang]);
  const hasMounted = useRef(false);
  const navigate = useNavigate();

  /* --------------------------- load stored choice -------------------------- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("preferred_lang");
      if (saved && I18N[saved]) {
        setLang(saved);
        document.documentElement.lang = saved;
      } else {
        document.documentElement.lang = DEFAULT_LANG;
      }
    } catch {
      document.documentElement.lang = DEFAULT_LANG;
    }
    hasMounted.current = true;
  }, []);

  /* --------------------------- persist language --------------------------- */
  useEffect(() => {
    if (!hasMounted.current) return;
    try { localStorage.setItem("preferred_lang", lang); }
    catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  /* ------------------------------- handlers -------------------------------- */
  const handleSelect = key => () => setLang(key);
  
  // Updated handleGetStarted function to store language in session storage
const handleGetStarted = () => {
    try {
      // Store the current language in session storage
      sessionStorage.setItem("session_lang", lang);
      
      // Optional: Store additional metadata for better handling
      sessionStorage.setItem("session_lang_data", JSON.stringify({
        language: lang,
        languageName: I18N[lang].name,
        timestamp: Date.now(),
        source: "language_selector"
      }));
    } catch (error) {
      console.warn("Could not store language in session storage:", error);
    }
    
    // Navigate to homepage instead of external URL
    navigate("/home-page");
  };
  
  const resetToEnglish = () => setLang("en");

  /* -------------------------------- render --------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-orange-50 flex flex-col">
      <div className="mx-auto max-w-7xl px-4 py-8 flex-1 flex flex-col">
        {/* ------------------------------ HEADER ------------------------------ */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Bank of Maharashtra Logo" className="w-40 h-auto" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-blue-900">
                Bank of Maharashtra
              </h1>
              <p className="text-sm text-blue-700">
                India's Leading Public Sector Bank
              </p>
            </div>
          </div>
          <span className="rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm text-blue-800 shadow-sm backdrop-blur">
            {t.pill}
          </span>
        </header>

        {/* ------------------------------ GRID ------------------------------- */}
 <main className="grid grid-cols-2 gap-6 flex-1">
  {/* --------------------------- MAP CARD (fixed size) --------------------------- */}
  <section className="relative overflow-hidden rounded-xl border border-blue-100 bg-white shadow-xl">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-orange-500/5" />
    {/* Fixed height to keep section stable across language changes */}
    <div className="relative p-6 h-[420px] md:h-[460px]">
      <div
        className="relative size-full overflow-hidden rounded-lg border border-blue-100"
        aria-label="Map of India with language selectors"
      >
        {/* India Map Image fits within container */}
        <img
          src={indiaMap}
          alt="India Map"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Language Markers - Now responsive to container size */}
        <div className="absolute inset-0">
          {markers.map((m) => (
            <button
              key={m.lang}
              onClick={handleSelect(m.lang)}
              aria-label={I18N[m.lang].name}
              className={[
                "absolute -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-white",
                "cursor-pointer transition-all duration-300 hover:scale-125",
                "bg-gradient-to-br from-white to-blue-500 shadow-lg animate-pulse",
                m.color && `bg-gradient-to-br from-white ${m.color}`
              ].join(" ")}
              style={{
                left: m.left,
                top: m.top,
                // Ensure markers stay within bounds and scale with container
                position: 'absolute',
                zIndex: 10
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </section>

  {/* ------------------------- CONTENT CARD (fixed size) ------------------------ */}
  <section className="relative overflow-hidden rounded-xl border border-blue-100 bg-white shadow-xl">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-orange-500/3" />
    {/* Fixed height wrapper to keep size constant on language change */}
    <div className="relative p-6 h-[420px] md:h-[460px] flex">
      {/* Only this inner column scrolls if text is long */}
      <div className="relative flex flex-col w-full overflow-hidden">
        <div className="shrink-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs text-green-800 w-fit">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            {t.badge}
          </span>
        </div>

        {/* Reserve space to prevent height jumps across languages */}
        <div className="mt-4 grid gap-2">
          <h2
            key={`h-${lang}`}
            className="text-2xl md:text-3xl font-bold text-blue-900"
            style={{ minHeight: "2.8em", lineHeight: 1.2 }}
          >
            {t.headline}
          </h2>
          <p
            key={`p-${lang}`}
            className="text-sm md:text-base text-gray-600"
            style={{ minHeight: "3.2em", lineHeight: 1.2 }}
          >
            {t.subcopy}
          </p>
        </div>

        <div className="mt-4 shrink-0">
          <button
            onClick={handleGetStarted}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t.primary}
          </button>
        </div>

        <div className="mt-4 shrink-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-800 w-fit">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            {t.current}
          </span>
        </div>

        {/* Scrollable auxiliary area for long text */}
        <div className="mt-3 grow overflow-y-auto pr-2">
          <p className="text-xs text-gray-500">{t.note}</p>
          <div className="mt-3">
            <button
              onClick={resetToEnglish}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-transform duration-200 hover:-translate-y-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Switch to English
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>


        {/* ------------------------------ FOOTER ----------------------------- */}
        <footer className="mt-auto pt-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span>Trusted by millions since 1935</span>
            <span>•</span>
            <span>Secure &amp; Reliable Banking</span>
            <span>•</span>
            <span>Leading Public Sector Bank</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
