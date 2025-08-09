import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Phone, Navigation, Info } from 'lucide-react';
import MainNavbar from '../components/MainNavbar';
import ServicesNavbar from '../components/ServicesNavbar';
import L from 'leaflet';
import branchesData from '../../../server/data/branches-maharashtra.json';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function BranchLocator() {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nearbyBranches, setNearbyBranches] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Use the imported branch data from JSON file
  const branchData = branchesData.branches;

  useEffect(() => {
    // Initialize map when component mounts
    const initMap = () => {
      if (mapRef.current && !mapInstanceRef.current) {
        try {
          mapInstanceRef.current = L.map(mapRef.current, {
            center: [19.7515, 75.7139], // Center of Maharashtra
            zoom: 7,
            zoomControl: true,
            scrollWheelZoom: true
          });
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
          }).addTo(mapInstanceRef.current);

          console.log('Map initialized successfully');
        } catch (error) {
          console.error('Error initializing map:', error);
          setError('Failed to load map. Please refresh the page.');
        }
      }
    };

    // Small delay to ensure the DOM element is ready
    const timer = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSearch = async () => {
    if (!pincode.trim() || pincode.length !== 6) {
      setError('Please enter a valid 6-digit PIN code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Filter branches by PIN code with multiple matching strategies
      const filtered = branchData.filter(branch => {
        // Exact PIN code match (highest priority)
        if (branch.pincode === pincode) return true;
        
        // Match first 3 digits (postal circle)
        const branchArea = branch.pincode.substring(0, 3);
        const searchArea = pincode.substring(0, 3);
        return branchArea === searchArea;
      });

      if (filtered.length === 0) {
        // Try with first 2 digits for wider search
        const widerSearch = branchData.filter(branch => {
          const branchArea = branch.pincode.substring(0, 2);
          const searchArea = pincode.substring(0, 2);
          return branchArea === searchArea;
        });

        if (widerSearch.length === 0) {
          setError(`No Bank of Maharashtra branches found near PIN code ${pincode}. Please try a different PIN code.`);
          setNearbyBranches([]);
          setLoading(false);
          return;
        }

        setNearbyBranches(widerSearch.slice(0, 10)); // Limit to 10 results for wider search
      } else {
        // Sort results: exact PIN match first, then by city name
        filtered.sort((a, b) => {
          if (a.pincode === pincode && b.pincode !== pincode) return -1;
          if (a.pincode !== pincode && b.pincode === pincode) return 1;
          return a.city.localeCompare(b.city);
        });

        setNearbyBranches(filtered);
      }

      if (mapInstanceRef.current) {
        // Clear existing markers
        mapInstanceRef.current.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });

        // Add markers for nearby branches
        const markers = [];
        const branchesToShow = filtered.length > 0 ? filtered : branchData.filter(branch => {
          const branchArea = branch.pincode.substring(0, 2);
          const searchArea = pincode.substring(0, 2);
          return branchArea === searchArea;
        }).slice(0, 10);

        branchesToShow.forEach((branch, index) => {
          const isExactMatch = branch.pincode === pincode;
          
          // Use different colored markers for exact matches
          const markerHtml = `
            <div class="p-3 min-w-80 max-w-sm">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="font-bold text-sm text-gray-900">${branch.name}</h3>
                ${isExactMatch ? '<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Exact Match</span>' : ''}
              </div>
              <div class="space-y-1 text-xs text-gray-600 mb-3">
                <p><strong>Address:</strong> ${branch.address}</p>
                <p><strong>Phone:</strong> ${branch.phone}</p>
                <p><strong>IFSC:</strong> <span class="font-mono">${branch.ifsc}</span></p>
                <p><strong>Type:</strong> ${branch.type}</p>
                <p><strong>City:</strong> ${branch.city}, ${branch.district}</p>
              </div>
              <div class="flex gap-2">
                <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}', '_blank')" 
                  class="flex-1 px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors">
                  Get Directions
                </button>
                <button onclick="window.open('tel:${branch.phone}', '_self')" 
                  class="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors">
                  Call
                </button>
              </div>
            </div>
          `;

          const marker = L.marker([branch.lat, branch.lng])
            .bindPopup(markerHtml, {
              maxWidth: 350,
              className: 'custom-popup'
            })
            .addTo(mapInstanceRef.current);
          
          markers.push(marker);
        });

        // Fit map to show all markers
        if (markers.length === 1) {
          mapInstanceRef.current.setView([branchesToShow[0].lat, branchesToShow[0].lng], 13);
        } else if (markers.length > 1) {
          const group = L.featureGroup(markers);
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        }
      }
    } catch (error) {
      setError('Error searching for branches. Please try again.');
      console.error('Search error:', error);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setPincode('');
    setNearbyBranches([]);
    setError('');
    
    if (mapInstanceRef.current) {
      // Clear markers and reset map view
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
      mapInstanceRef.current.setView([19.7515, 75.7139], 7);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <ServicesNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Find Bank of Maharashtra Branches
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Locate the nearest Bank of Maharashtra branches and ATMs across Maharashtra. 
              Enter your PIN code to find branches in your area with detailed information and directions.
            </p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter PIN Code
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter 6-digit PIN code (e.g., 411005, 400001)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  disabled={loading || !pincode || pincode.length !== 6}
                  className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <Search size={20} />
                  {loading ? 'Searching...' : 'Find Branches'}
                </button>
                {nearbyBranches.length > 0 && (
                  <button
                    onClick={resetSearch}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Information Card */}
          {nearbyBranches.length === 0 && !error && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <Info size={24} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    How to use the Branch Locator
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Search Features:</h4>
                      <ul className="text-blue-700 space-y-1 text-sm">
                        <li>• Enter your 6-digit PIN code</li>
                        <li>• Find exact matches and nearby branches</li>
                        <li>• View {branchData.length}+ branches across Maharashtra</li>
                        <li>• Get complete branch information</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Available Information:</h4>
                      <ul className="text-blue-700 space-y-1 text-sm">
                        <li>• Branch addresses and phone numbers</li>
                        <li>• IFSC codes for online transfers</li>
                        <li>• Branch types (Main/Regional/Branch)</li>
                        <li>• Interactive map with directions</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-100 rounded-md">
                    <h5 className="font-medium text-blue-800 mb-1">Sample PIN Codes to Try:</h5>
                    <p className="text-blue-700 text-sm">
                      411005 (Pune), 400001 (Mumbai), 422001 (Nashik), 440001 (Nagpur), 431001 (Aurangabad)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-orange-600" />
                <h2 className="text-lg font-semibold">
                  {nearbyBranches.length > 0 
                    ? `Bank of Maharashtra branches near PIN: ${pincode} (${nearbyBranches.length} found)`
                    : 'Interactive Branch Locator Map'
                  }
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {nearbyBranches.length > 0 
                  ? 'Click on any marker to view detailed branch information and get directions'
                  : 'Enter a PIN code above to see branch locations on the map'
                }
              </p>
            </div>
            
            <div 
              ref={mapRef} 
              className="w-full h-96"
              style={{ minHeight: '500px' }}
            />
          </div>

          {/* Branch Results List */}
          {nearbyBranches.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Branch Details ({nearbyBranches.length} found)
              </h3>
              <div className="space-y-4">
                {nearbyBranches.map((branch, index) => (
                  <div key={branch.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{branch.name}</h4>
                          {branch.pincode === pincode && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Exact Match
                            </span>
                          )}
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {branch.type}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-start gap-2">
                              <MapPin size={14} className="mt-0.5 text-gray-500 flex-shrink-0" />
                              <span>{branch.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-gray-500" />
                              <span>{branch.phone}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 font-medium">IFSC:</span>
                              <span className="font-mono text-gray-900">{branch.ifsc}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 font-medium">Location:</span>
                              <span>{branch.city}, {branch.district}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-fit">
                        <button
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`, '_blank')}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm transition-colors"
                        >
                          <Navigation size={14} />
                          Get Directions
                        </button>
                        <button
                          onClick={() => window.open(`tel:${branch.phone}`, '_self')}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm transition-colors"
                        >
                          <Phone size={14} />
                          Call Branch
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Additional Help?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Customer Care</h4>
                <p className="text-gray-600 text-sm mb-2">
                  For branch-specific queries:
                </p>
                <p className="text-orange-600 font-medium">1800-233-4526</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Online Banking</h4>
                <p className="text-gray-600 text-sm">
                  Access internet banking and mobile banking services from any branch location.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Coverage</h4>
                <p className="text-gray-600 text-sm">
                  {branchData.length}+ branches across all districts of Maharashtra state.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}