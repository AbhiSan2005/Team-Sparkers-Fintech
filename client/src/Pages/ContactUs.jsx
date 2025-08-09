import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import MainNavbar from '../components/MainNavbar';
import ServicesNavbar from '../components/ServicesNavbar';

// Animation classes using Tailwind CSS
// Add this to your tailwind.config.js if you want custom animations:
/*
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.6s ease",
      },
    },
  },
*/

export default function ContactUs() {
  const cardClass =
    "bg-white rounded-2xl shadow-lg p-8 border border-blue-100 " +
    "hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.03] transition-all duration-400 cursor-pointer animate-fadeInUp";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#001f4d] via-[#003366] to-[#004080]">
      <MainNavbar />
      <ServicesNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002D72] to-blue-600 shadow-lg py-20 px-6 text-center max-w-5xl mx-auto rounded-b-3xl mt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-yellow-400 drop-shadow-lg">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-yellow-100 font-medium drop-shadow-md">
          We're here to help. Reach out via phone, email, WhatsApp, or visit our branches.
        </p>
      </section>

      {/* Main Contact Content */}
      <section className="max-w-6xl mx-auto p-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-16">
        {/* Phone Support */}
        <div className={cardClass}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-yellow-400 rounded-full text-[#002D72] shadow-md">
              <Phone size={28} />
            </div>
            <h2 className="text-2xl font-bold text-[#002D72]">Call Us</h2>
          </div>
          <p className="text-gray-800 leading-relaxed">
            Toll-Free: <a href="tel:18002334526" className="underline hover:text-[#002D72]">1800 233 4526</a>,{' '}
            <a href="tel:18001022636" className="underline hover:text-[#002D72]">1800 102 2636</a><br />
            Landline: 020-24480797, 020-24504118, 020-24504117
          </p>
        </div>

        {/* Email Support */}
        <div className={cardClass}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-yellow-400 rounded-full text-[#002D72] shadow-md">
              <Mail size={28} />
            </div>
            <h2 className="text-2xl font-bold text-[#002D72]">Email Us</h2>
          </div>
          <p className="text-gray-800 leading-relaxed">
            <a href="mailto:mahaconnect@mahabank.co.in" className="underline hover:text-[#002D72]">
              mahaconnect@mahabank.co.in
            </a>
          </p>
        </div>

        {/* WhatsApp Support */}
        <div className={cardClass}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-yellow-400 rounded-full text-[#002D72] shadow-md">
              <MessageCircle size={28} />
            </div>
            <h2 className="text-2xl font-bold text-[#002D72]">WhatsApp Banking</h2>
          </div>
          <p className="text-gray-800 leading-relaxed">
            Send <strong className="text-yellow-400">"Hi"</strong> to{' '}
            <a href="https://wa.me/917066036640" className="underline hover:text-[#002D72]">
              +91 70660 36640
            </a>
          </p>
        </div>

        {/* Head Office Address (full width for large screens) */}
        <div className={cardClass + " sm:col-span-2 lg:col-span-3"}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-yellow-400 rounded-full text-[#002D72] shadow-md">
              <MapPin size={28} />
            </div>
            <h2 className="text-2xl font-bold text-[#002D72]">Head Office</h2>
          </div>
          <address className="not-italic text-gray-800 leading-relaxed space-y-2">
            Bank of Maharashtra Central Office,<br />
            Lokmangal, 1501, Shivajinagar, Pune - 411005<br />
            Phone: 020-25532731, 733, 734, 735, 736<br />
            Fax: 020-25532728
          </address>
        </div>
      </section>

      <footer className="bg-[#002D72] text-gray-200 py-6 text-center mt-16">
        <p>© {new Date().getFullYear()} Bank of Maharashtra. All rights reserved.</p>
      </footer>
    </div>
  );
}
