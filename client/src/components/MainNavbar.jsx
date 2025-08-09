import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from 'lucide-react';

export default function MainNavbar() {
  return (
  <nav className="bg-[#002D72] text-white shadow">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          {/* Change the 'src' below to your actual logo file path */}
          <img
            src="https://imgs.search.brave.com/h_sxaRZsuTlgRfGbEtrWuHTOftX0vqICBvRn2IX162Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/YnJhbmRmZXRjaC5p/by9pZC0xSVVHcUY3/L3cvNDAwL2gvNDAw/L3RoZW1lL2Rhcmsv/aWNvbi5qcGVnP2M9/MWJ4aWQ2NE11cDdh/Y3pld1NBWU1YJnQ9/MTczNjk3Nzg4MTk5/NQ"
            alt="Bank of Maharashtra Logo"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-lg font-bold">Bank of Maharashtra</span>
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-6 font-medium">
          <li>
            <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
          </li>
          <li>
            <Link to="/aboutus" className="hover:text-yellow-400 transition">About Us</Link>
          </li>
          <li>
            <Link to="/contactus" className="hover:text-yellow-400 transition">Contact Us</Link>
          </li>
          <li>
            <Link to="/locateus" className="hover:text-yellow-400 transition">Locate Us</Link>
          </li>
          <li>
            <Link to="/careers" className="hover:text-yellow-400 transition">Careers</Link>
          </li>
          <li>
            <Link to="/branch-locator" className="hover:text-yellow-400 transition"><MapPin /></Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
