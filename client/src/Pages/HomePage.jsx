import React from "react";
import { ArrowRight, Shield, CreditCard, Smartphone } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
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
        {/* Text */}
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

        {/* Image */}
        <div className="flex-1 mt-10 md:mt-0">
          <img
            src="https://www.bankofmaharashtra.in/writereaddata/bannerImages/hb1.jpg"
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
    </div>
  );
}
