import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Circle, StandaloneSearchBox, useLoadScript } from '@react-google-maps/api';
import { useAuthStore } from '../store/auth.store';
import Navbar from '../components/Navbar';

const defaultCenter = {
  lat: 13.184,
  lng: 74.9345
};

const UNSAFE_RADIUS = 50;
const ALERT_THRESHOLD = 100;
const libraries = ['places', 'geometry', 'drawing'];

const getSafetyColor = (level) => {
  switch (level) {
    case 1: return '#FFD700'; // Yellow for warning
    case 2: return '#FF6B6B'; // Light red for caution
    case 3: return '#FF0000'; // Dark red for unsafe
    default: return '#00FF00'; // Green for safe
  }
};

const Maps = () => {
  const { unsafeLocations, fetchUnsafeLocations, markLocationAsUnsafe } = useAuthStore();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLocationLevel, setSelectedLocationLevel] = useState(1);
  const [isNearUnsafe, setIsNearUnsafe] = useState(false);
  const [mapMode, setMapMode] = useState('unsafe');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [searchBox, setSearchBox] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    fetchUnsafeLocations();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(newLocation);
          setCurrentLocation(newLocation);
          checkProximityToUnsafeAreas(newLocation);
        },
        (error) => {
          console.error(error);
          setCenter(defaultCenter);
          setCurrentLocation(defaultCenter);
        }
      );
    }
  }, [fetchUnsafeLocations]);

  const handleMapClick = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

    if (mapMode === 'unsafe') {
      setSelectedLocation(newLocation);
    } else if (mapMode === 'location') {
      setSelectedLocation(newLocation);
    }
  };

  const markAsUnsafe = async () => {
    if (selectedLocation) {
      try {
        const result = await markLocationAsUnsafe(selectedLocation.lat, selectedLocation.lng, selectedLocationLevel);
        console.log('Marked location with safety level:', result.safetyLevel);
        setSelectedLocation(null);
        setSelectedLocationLevel(1);
        await fetchUnsafeLocations();
      } catch (error) {
        console.error('Failed to mark location:', error);
      }
    }
  };

  const checkProximityToUnsafeAreas = (location) => {
    if (!unsafeLocations) return;
    const isNear = unsafeLocations.some(unsafeLocation => {
      const distance = getDistance(
        location.lat,
        location.lng,
        unsafeLocation.lat,
        unsafeLocation.lng
      );
      return distance <= ALERT_THRESHOLD;
    });
    setIsNearUnsafe(isNear);
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getMapOptions = () => {
    if (!window.google) return {};

    return {
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_BOTTOM
      },
      fullscreenControl: false,
      locationButton: true,
      locationButtonOptions: {
        position: window.google.maps.ControlPosition.RIGHT_BOTTOM
      }
    };
  };

  const toggleMapMode = (mode) => {
    setMapMode(mode);
    setSelectedLocation(null);
  };

  const confirmLocationSet = () => {
    if (selectedLocation && mapMode === 'location') {
      setCurrentLocation(selectedLocation);
      setCenter(selectedLocation);
      checkProximityToUnsafeAreas(selectedLocation);
      setSelectedLocation(null);
    }
  };

  const onSearchBoxLoad = (ref) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      setCenter(newLocation);
      setCurrentLocation(newLocation);
      checkProximityToUnsafeAreas(newLocation);
    }
  };

  if (loadError) {
    return (
      <div className="h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-full">
          <div className="text-red-600">
            Error loading maps. Please check your internet connection and try again.
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded || !window.google) {
    return (
      <div className="h-screen">
        <Navbar />
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500 mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading Map...</div>
          <div className="text-sm text-gray-500 mt-2">Please wait while we set things up</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-6 relative bottom-24">
        <div className="h-full bg-white rounded-lg shadow-lg">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
            <h1 className="text-2xl font-bold text-white">Safety Map</h1>
            <p className="text-blue-100 mt-1">Mark and view unsafe areas in your vicinity</p>
          </div>

          <div className="flex flex-col lg:flex-row h-[calc(100%-4rem)]">
            <div className="lg:w-3/4 h-full relative">
              <div className="absolute top-4 right-4 z-10 w-72">
                <StandaloneSearchBox
                  onLoad={onSearchBoxLoad}
                  onPlacesChanged={onPlacesChanged}
                >
                  <input
                    type="text"
                    placeholder="Search location..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </StandaloneSearchBox>
              </div>
              {isLoaded && window.google && (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={center}
                  zoom={13}
                  onClick={handleMapClick}
                  options={getMapOptions()}
                >
                  {currentLocation && (
                    <Marker
                      position={currentLocation}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 15,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 3,
                      }}
                    />
                  )}

                  {selectedLocation && mapMode === 'location' && (
                    <Marker
                      position={selectedLocation}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 12,
                        fillColor: "#00FF00",
                        fillOpacity: 0.9,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 3,
                      }}
                    />
                  )}

                  {selectedLocation && mapMode === 'unsafe' && (
                    <>
                      <Circle
                        center={selectedLocation}
                        radius={UNSAFE_RADIUS + 10}
                        options={{
                          fillColor: getSafetyColor(selectedLocationLevel),
                          fillOpacity: 0.1,
                          strokeColor: getSafetyColor(selectedLocationLevel),
                          strokeOpacity: 0.3,
                          strokeWeight: 8,
                        }}
                      />
                      <Circle
                        center={selectedLocation}
                        radius={UNSAFE_RADIUS}
                        options={{
                          fillColor: getSafetyColor(selectedLocationLevel),
                          fillOpacity: 0.2,
                          strokeColor: getSafetyColor(selectedLocationLevel),
                          strokeOpacity: 0.6,
                          strokeWeight: 2,
                        }}
                      />
                      <Marker
                        position={selectedLocation}
                        icon={{
                          path: window.google.maps.SymbolPath.CIRCLE,
                          scale: 10,
                          fillColor: getSafetyColor(selectedLocationLevel),
                          fillOpacity: 1,
                          strokeColor: "#FFFFFF",
                          strokeWeight: 2,
                        }}
                      />
                    </>
                  )}

                  {unsafeLocations && unsafeLocations.map((location, index) => (
                    <React.Fragment key={index}>
                      <Circle
                        center={{ lat: location.lat, lng: location.lng }}
                        radius={UNSAFE_RADIUS + 10}
                        options={{
                          fillColor: getSafetyColor(location.safetyLevel),
                          fillOpacity: 0.1,
                          strokeColor: getSafetyColor(location.safetyLevel),
                          strokeOpacity: 0.3,
                          strokeWeight: 8,
                        }}
                      />
                      <Circle
                        center={{ lat: location.lat, lng: location.lng }}
                        radius={UNSAFE_RADIUS}
                        options={{
                          fillColor: getSafetyColor(location.safetyLevel),
                          fillOpacity: 0.2,
                          strokeColor: getSafetyColor(location.safetyLevel),
                          strokeOpacity: 0.6,
                          strokeWeight: 2,
                        }}
                      />
                      <Marker
                        position={{ lat: location.lat, lng: location.lng }}
                        icon={{
                          path: window.google.maps.SymbolPath.CIRCLE,
                          scale: 10,
                          fillColor: getSafetyColor(location.safetyLevel),
                          fillOpacity: 1,
                          strokeColor: "#FFFFFF",
                          strokeWeight: 2,
                        }}
                      />
                    </React.Fragment>
                  ))}
                </GoogleMap>
              )}
            </div>

            <div className="lg:w-1/4 h-full p-4 overflow-y-auto">
              <div className="space-y-4">

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Map Mode</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleMapMode('location')}
                      className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${mapMode === 'location'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      Set Location
                    </button>
                    <button
                      onClick={() => toggleMapMode('unsafe')}
                      className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${mapMode === 'unsafe'
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      Mark Unsafe
                    </button>
                  </div>
                </div>

                {mapMode === 'unsafe' && selectedLocation && (
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedLocationLevel(1)}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${selectedLocationLevel === 1
                          ? 'bg-yellow-500 text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        Warning (Yellow)
                      </button>
                      <button
                        onClick={() => setSelectedLocationLevel(2)}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${selectedLocationLevel === 2
                          ? 'bg-red-300 text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        Caution (Light Red)
                      </button>
                      <button
                        onClick={() => setSelectedLocationLevel(3)}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${selectedLocationLevel === 3
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        Unsafe (Dark Red)
                      </button>
                    </div>
                    <button
                      onClick={markAsUnsafe}
                      className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
                    >
                      Mark Selected Area
                    </button>
                  </div>
                )}

                {mapMode === 'location' && selectedLocation && (
                  <button
                    onClick={confirmLocationSet}
                    className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
                  >
                    Confirm New Location
                  </button>
                )}

                {isNearUnsafe && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          Warning: You are near an unsafe area!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">Instructions</h3>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full mr-2 text-xs">1</span>
                      Select mode: Set Location or Mark Unsafe
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full mr-2 text-xs">2</span>
                      Click on the map to {mapMode === 'unsafe' ? 'select an unsafe area' : 'select your new location'}
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full mr-2 text-xs">3</span>
                      Click confirm to save your selection
                    </li>
                  </ol>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">Map Legend</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-gray-600">Current Location</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-600">Selected Location</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-gray-600">Unsafe Area</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;