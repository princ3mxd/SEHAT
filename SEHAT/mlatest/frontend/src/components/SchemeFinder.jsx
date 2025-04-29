import React, { useState } from 'react';
import { womenSchemes } from '../data/schemes';
import Navbar from './Navbar';

const SchemeFinder = () => {
  const [userInfo, setUserInfo] = useState({
    age: '',
    caste: '',
    isBPL: false,
    state: '',
    annualIncome: '',
    isPregnant: false,
    hasChildren: false
  });

  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const findSchemes = () => {
    setIsLoading(true);
    // Simulate loading time for better UX
    setTimeout(() => {
      // Basic filtering logic
      let schemes = womenSchemes.filter(scheme => {
        // Filter by BPL status if specified
        if (userInfo.isBPL && !scheme.bpl) {
          return false;
        }
        
        // Filter by caste if specified
        if (userInfo.caste && scheme.caste !== 'All' && scheme.caste !== userInfo.caste) {
          return false;
        }

        // Filter by state if specified
        if (userInfo.state && !scheme.states.includes('All') && !scheme.states.includes(userInfo.state)) {
          return false;
        }

        // Filter by pregnancy status
        if (userInfo.isPregnant && !scheme.forPregnant) {
          return false;
        }

        // Filter by children status
        if (userInfo.hasChildren && !scheme.forChildren) {
          return false;
        }
        
        return true;
      });

      // Sort schemes by relevance
      schemes.sort((a, b) => {
        // Prioritize state-specific schemes
        if (userInfo.state) {
          if (a.states.includes(userInfo.state) && !b.states.includes(userInfo.state)) return -1;
          if (!a.states.includes(userInfo.state) && b.states.includes(userInfo.state)) return 1;
        }
        
        // Prioritize schemes matching BPL status
        if (userInfo.isBPL) {
          if (a.bpl && !b.bpl) return -1;
          if (!a.bpl && b.bpl) return 1;
        }
        
        // Prioritize schemes matching caste
        if (userInfo.caste) {
          if (a.caste === userInfo.caste && b.caste !== userInfo.caste) return -1;
          if (a.caste !== userInfo.caste && b.caste === userInfo.caste) return 1;
        }

        // Prioritize pregnancy-related schemes
        if (userInfo.isPregnant) {
          if (a.forPregnant && !b.forPregnant) return -1;
          if (!a.forPregnant && b.forPregnant) return 1;
        }

        // Prioritize children-related schemes
        if (userInfo.hasChildren) {
          if (a.forChildren && !b.forChildren) return -1;
          if (!a.forChildren && b.forChildren) return 1;
        }
        
        return 0;
      });

      // Take top 5 schemes
      setFilteredSchemes(schemes.slice(0, 5));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Women's Scheme</span>
              <span className="block text-purple-600">Finder</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Find the most suitable government schemes based on your profile
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={userInfo.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
                <select
                  name="caste"
                  value={userInfo.caste}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Caste</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OBC">OBC</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  name="state"
                  value={userInfo.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income (₹)</label>
                <input
                  type="number"
                  name="annualIncome"
                  value={userInfo.annualIncome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your annual income"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isBPL"
                    checked={userInfo.isBPL}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Below Poverty Line (BPL)
                  </label>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPregnant"
                    checked={userInfo.isPregnant}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Currently Pregnant
                  </label>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasChildren"
                    checked={userInfo.hasChildren}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Have Children
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={findSchemes}
                disabled={isLoading}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Finding Schemes...
                  </>
                ) : (
                  'Find Suitable Schemes'
                )}
              </button>
            </div>
          </div>

          {filteredSchemes.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchemes.map(scheme => (
                  <div key={scheme.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-purple-600">{scheme.name}</h3>
                        <div className="flex space-x-2">
                          {scheme.bpl && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              BPL
                            </span>
                          )}
                          {scheme.forPregnant && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                              Pregnancy
                            </span>
                          )}
                          {scheme.forChildren && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Children
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{scheme.description}</p>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-700">Eligibility:</h4>
                          <p className="text-gray-600 text-sm">{scheme.eligibility}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Benefits:</h4>
                          <p className="text-gray-600 text-sm">{scheme.benefits}</p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <a
                          href={scheme.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                        >
                          Learn More
                          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemeFinder;