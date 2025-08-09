import React from 'react';
import MainNavbar from '../components/MainNavbar';
import ServicesNavbar from '../components/ServicesNavbar';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f4d] via-[#003366] to-[#004080]">
      <MainNavbar />
      <ServicesNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002D72] to-blue-600 shadow-lg py-20 px-6 text-center max-w-5xl mx-auto rounded-b-3xl mt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-yellow-400 drop-shadow-lg">
          About Us
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-yellow-100 font-medium drop-shadow-md">
          Trusted. Progressive. Serving the nation since 1935.
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        {/* Mission Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.03] transition-all duration-400 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-[#002D72] mb-4">Our Mission</h2>
          <p className="text-gray-800 leading-relaxed">
            To provide innovative, efficient and customer-centered financial services enabling growth and prosperity for all. 
            We strive for social upliftment and economic development through trust, transparency, and excellence.
          </p>
        </div>
        {/* Vision Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.03] transition-all duration-400 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-[#002D72] mb-4">Our Vision</h2>
          <p className="text-gray-800 leading-relaxed">
            To be a leading bank driving inclusive growth and transforming lives across India by leveraging technology, innovation, and responsibility.
          </p>
        </div>
        {/* Journey Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.03] transition-all duration-400 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-[#002D72] mb-4">Our Journey</h2>
          <p className="text-gray-800 leading-relaxed">
            Established in 1935, Bank of Maharashtra has grown into one of the largest public sector banks, with thousands of branches serving millions of customers nationwide. We empower individuals, corporations, MSMEs, farmers, and NRIs with our secure and reliable services.
          </p>
        </div>
      </section>

      <footer className="bg-[#002D72] text-gray-200 py-6 text-center mt-16">
        <p>© {new Date().getFullYear()} Bank of Maharashtra. All rights reserved.</p>
      </footer>
    </div>
  );
}
