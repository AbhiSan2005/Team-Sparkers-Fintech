import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#002D72] text-white shadow">
        <div className="logo">
            <Link to="/">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThKagjoBjoLk3Lq42gWQjH01z9It4yWe1a1g&s" alt="" className="h-15 w-50"/>  
            </Link>    
        </div>
        <nav className="hidden md:flex space-x-6 w-250 p-2">
          <Link to="/" className="hover:text-[#FFD700] p-3 border-2 rounded-xl">Home</Link>
          <Link to="/aboutus" className="hover:text-[#FFD700] p-3 border-2 rounded-xl">About Us</Link>
          <Link to="/contactus" className="hover:text-[#FFD700] p-3 border-2 rounded-xl">Contact Us</Link>
        </nav>
        <button className="px-4 py-2 bg-[#FFD700] text-[#002D72] font-semibold rounded-lg hover:bg-yellow-400">
          Net Banking
        </button>
      </header>
  )
}

export default Navbar
