import React from 'react';
import MainNavbar from '../components/MainNavbar';
import ServicesNavbar from '../components/ServicesNavbar';

export default function Careers() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f4d] via-[#003366] to-[#004080]">
      <MainNavbar />
      <ServicesNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002D72] to-blue-600 shadow-lg py-20 px-6 text-center max-w-5xl mx-auto rounded-b-3xl mt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-yellow-400 drop-shadow-lg">
          Careers
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-yellow-100 font-medium drop-shadow-md">
          Build your future with Bank of Maharashtra. Join a nation-building mission.
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto p-8 mt-10 space-y-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-400 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-[#002D72] mb-4">Why Work With Us?</h2>
          <ul className="list-disc px-4 mb-4 text-gray-800 leading-relaxed space-y-2">
            <li>Collaborate with passionate professionals impacting millions nationwide</li>
            <li>Grow your career in banking, tech, management, and service roles</li>
            <li>Competitive benefits, inclusive culture, and career advancement opportunities</li>
            <li>Training and learning for professional excellence</li>
          </ul>

          <p className="text-gray-800 mb-4">
            Ready to join our dedicated team? We invite you to explore open positions and internships.
          </p>
          <a
            href="https://bankofmaharashtra.in/careers"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-yellow-500 font-semibold hover:text-yellow-600 underline"
          >
            View Current Openings &rarr;
          </a>
        </div>
      </section>

      <footer className="bg-[#002D72] text-gray-200 py-6 text-center mt-16">
        <p>© {new Date().getFullYear()} Bank of Maharashtra. All rights reserved.</p>
      </footer>
    </div>
  );
}
