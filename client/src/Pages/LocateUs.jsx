import React from 'react';
import MainNavbar from '../components/MainNavbar';
import ServicesNavbar from '../components/ServicesNavbar';
import { MapPin } from 'lucide-react';

export default function LocateUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f4d] via-[#003366] to-[#004080]">
      <MainNavbar />
      <ServicesNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002D72] to-blue-600 shadow-lg py-20 px-6 text-center max-w-5xl mx-auto rounded-b-3xl mt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-yellow-400 drop-shadow-lg">
          Locate Us
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-yellow-100 font-medium drop-shadow-md">
          Find a Bank of Maharashtra branch or ATM near you.
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto p-8 mt-10 space-y-10">
        {/* Branch Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 flex flex-col sm:flex-row items-center gap-8 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-400 animate-fadeInUp">
          <div className="p-4 bg-yellow-400 rounded-full text-[#002D72] shadow-md">
            <MapPin size={38} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#002D72] mb-2">Visit Our Branches</h2>
            <p className="text-gray-800 mb-2">
              With over 2000+ branches across India, we’re always nearby. 
              <br />Use our online branch locator to find addresses and contact details.
            </p>
            <a
              href="https://bankofmaharashtra.in/branch-locator" target="_blank" rel="noopener noreferrer"
              className="text-yellow-500 font-semibold hover:text-yellow-600 underline"
            >
              Branch Locator &rarr;
            </a>
          </div>
        </div>

        {/* ATM Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 flex flex-col sm:flex-row items-center gap-8 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-400 animate-fadeInUp">
          <div className="p-4 bg-yellow-400 rounded-full text-[#002D72] shadow-md">
            <MapPin size={38} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#002D72] mb-2">ATM Locator</h2>
            <p className="text-gray-800 mb-2">
              Access cash easily using our vast ATM network. Check locations, timings, and services online.
            </p>
            <a
              href="https://bankofmaharashtra.in/atm-locator" target="_blank" rel="noopener noreferrer"
              className="text-yellow-500 font-semibold hover:text-yellow-600 underline"
            >
              ATM Locator &rarr;
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#002D72] text-gray-200 py-6 text-center mt-16">
        <p>© {new Date().getFullYear()} Bank of Maharashtra. All rights reserved.</p>
      </footer>
    </div>
  );
}

