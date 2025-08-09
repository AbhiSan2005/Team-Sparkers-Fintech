import React from "react";
import { Routes, Route } from "react-router-dom";

const HomePage = () => {
    return ( 
        <div className="min-h-screen bg-gray-50">
            <Routes>
                <Route path="/" element={<h1 className="text-center text-2xl font-bold">Welcome to the Home Page</h1>} />
                {/* Add more routes here as needed */}
            </Routes>
        </div>
     );
}
 
export default HomePage;