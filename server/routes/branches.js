// routes/branches.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mock data - In production, replace with actual Bank of Maharashtra API or database
const branchData = [
  {
    id: 1,
    name: "Bank of Maharashtra - Shivaji Nagar",
    address: "No 1183A, First Floor, Yashomangal, FC Road, Shivaji Nagar, Pune, Maharashtra - 411005",
    phone: "18002334526",
    ifsc: "MAHB0000116",
    pincode: "411005",
    lat: 18.5314,
    lng: 73.8447,
    timings: "Mon-Fri: 10:00 AM - 4:00 PM, Sat: 10:00 AM - 1:00 PM"
  },
  {
    id: 2,
    name: "Bank of Maharashtra - Pimpri",
    address: "Masulkar Tower, Masulkar Colony, Pimpri, Pune, Maharashtra - 411018",
    phone: "18002334526",
    ifsc: "MAHB0000895",
    pincode: "411018",
    lat: 18.6278,
    lng: 73.8131,
    timings: "Mon-Fri: 10:00 AM - 4:00 PM, Sat: 10:00 AM - 1:00 PM"
  }
  // Add more branch data as needed
];

// Function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

// Get coordinates for PIN code (using a geocoding service)
async function getCoordinatesFromPincode(pincode) {
  try {
    // Replace with actual geocoding API (Google Geocoding API, OpenStreetMap, etc.)
    // This is a mock implementation
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    
    if (response.data && response.data[0] && response.data[0].Status === 'Success') {
      const postOffice = response.data[0].PostOffice[0];
      // Note: This API doesn't provide exact coordinates
      // You'll need to use Google Geocoding API or similar for precise coordinates
      return {
        lat: parseFloat(postOffice.Latitude || 18.5204), // Default to Pune coordinates
        lng: parseFloat(postOffice.Longitude || 73.8567),
        district: postOffice.District,
        state: postOffice.State
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
}

// Search branches by PIN code
router.get('/search', async (req, res) => {
  try {
    const { pincode } = req.query;
    
    if (!pincode || pincode.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 6-digit PIN code'
      });
    }

    // Get coordinates for the PIN code
    const location = await getCoordinatesFromPincode(pincode);
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Invalid PIN code or location not found'
      });
    }

    // Filter branches within reasonable distance (50km radius)
    const nearbyBranches = branchData.map(branch => {
      const distance = calculateDistance(
        location.lat, location.lng,
        branch.lat, branch.lng
      );
      return { ...branch, distance };
    })
    .filter(branch => branch.distance <= 50) // Within 50km
    .sort((a, b) => a.distance - b.distance) // Sort by distance
    .slice(0, 10); // Limit to 10 results

    if (nearbyBranches.length === 0) {
      return res.json({
        success: false,
        message: 'No Bank of Maharashtra branches found within 50km of this PIN code'
      });
    }

    res.json({
      success: true,
      branches: nearbyBranches,
      location: location
    });

  } catch (error) {
    console.error('Error searching branches:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;