import { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, DirectionsRenderer, Circle, Marker } from '@react-google-maps/api';
import { useAuthStore } from '../store/auth.store';
import Navbar from '../components/Navbar';
const defaultCenter = {
  lat: 10.7275,
  lng: 76.2900
};

const UNSAFE_RADIUS = 50;
const BUFFER_DISTANCE = 50;
const libraries = ['places', 'geometry', 'drawing'];

const calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = point1.lat * Math.PI / 180;
  const φ2 = point2.lat * Math.PI / 180;
  const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
  const Δλ = (point2.lng - point1.lng) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500 mb-4"></div>
    <div className="text-xl font-semibold text-gray-700">Loading Map...</div>
    <div className="text-sm text-gray-500 mt-2">Please wait while map is loading..</div>
  </div>
);

const SafeRoute = () => {
  const [initialLoading, setInitialLoading] = useState(true);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [center, setCenter] = useState(defaultCenter);

  const { unsafeLocations, fetchUnsafeLocations } = useAuthStore();

  useEffect(() => {
    fetchUnsafeLocations();

    const fetchCurrentLocation = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/geolocation/v1/geolocate?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              considerIp: true,
              wifiAccessPoints: [],
              cellTowers: [],
            }),
          }
        );

        if (!response.ok) throw new Error('Failed to fetch location');

        const data = await response.json();
        const newLocation = {
          lat: data.location.lat,
          lng: data.location.lng,
        };

        setCenter(newLocation);
        setError(null);
      } catch (err) {
        console.error("Location fetch error:", err);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            () => setCenter(defaultCenter),
            {
              enableHighAccuracy: true,
              timeout: 30000,
              maximumAge: 5000
            }
          );
        } else {
          setCenter(defaultCenter);
        }
      }
    };

    fetchCurrentLocation();
    const intervalId = setInterval(fetchCurrentLocation, 30000);
    return () => clearInterval(intervalId);
  }, [fetchUnsafeLocations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const isPointNearUnsafe = (point) => {
    if (!point) return false;
    const lat = typeof point.lat === 'function' ? point.lat() : point.lat;
    const lng = typeof point.lng === 'function' ? point.lng() : point.lng;

    return unsafeLocations.some(unsafe => {
      if (unsafe.safetyLevel !== 3) return false;

      const distance = calculateDistance(
        { lat, lng },
        { lat: unsafe.lat, lng: unsafe.lng }
      );
      return distance <= (UNSAFE_RADIUS + BUFFER_DISTANCE);
    });
  };

  const isRouteSafe = (route) => {
    if (!route?.legs?.[0]?.steps) return false;

    for (const step of route.legs[0].steps) {
      if (isPointNearUnsafe(step.start_location) || isPointNearUnsafe(step.end_location)) {
        return false;
      }

      if (step.path) {
        for (const point of step.path) {
          if (isPointNearUnsafe(point)) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const findRoute = useCallback(() => {
    if (!origin || !destination) {
      setError('Please enter both locations');
      return;
    }

    setLoading(true);
    setError(null);

    const directionsService = new window.google.maps.DirectionsService();

    const routingOptions = [
      { travelMode: 'DRIVING', avoidHighways: false },
      { travelMode: 'DRIVING', avoidHighways: true },
      { travelMode: 'WALKING' },
      { travelMode: 'BICYCLING' },
      { travelMode: 'TRANSIT' }
    ];

    let attemptCount = 0;

    const tryNextOption = () => {
      if (attemptCount >= routingOptions.length) {
        setLoading(false);
        setError('No safe route found. All routes pass through unsafe areas (marked in dark red). You can travel through yellow and light red areas.');
        return;
      }

      const option = routingOptions[attemptCount];
      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode[option.travelMode],
          avoidHighways: option.avoidHighways || false,
          provideRouteAlternatives: true
        },
        (result, status) => {
          if (status === 'OK') {
            const safeRoute = result.routes.find(isRouteSafe);
            if (safeRoute) {
              setDirections({
                ...result,
                routes: [safeRoute]
              });
              setLoading(false);
              return;
            }
          } else {
            setError(`Failed to find route: ${status}`);
            setLoading(false);
            return;
          }
          attemptCount++;
          tryNextOption();
        }
      );
    };

    tryNextOption();
  }, [origin, destination]);

  if (loadError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-600 text-center p-4">
          Error loading maps. Please check your internet connection and try again.
        </div>
      </div>
    );
  }

  if (!isLoaded || initialLoading) {
    return (
      <div className="h-screen">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-6 relative bottom-24">
        <div className="h-full bg-white rounded-lg shadow-lg">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
            <h1 className="text-2xl font-bold text-white">Safe Route Finder</h1>
            <p className="text-blue-100 mt-1">Find the safest route to your destination</p>
          </div>

          <div className="flex flex-col lg:flex-row h-[calc(100%-4rem)]">
            <div className="lg:w-3/4 h-full">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={center}
                zoom={15}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true,
                }}
              >
                {directions && (
                  <DirectionsRenderer
                    directions={directions}
                    options={{
                      suppressMarkers: false,
                      preserveViewport: false,
                    }}
                  />
                )}

                {unsafeLocations.map((location, index) => (
                  <div key={index}>
                    <Marker
                      position={{ lat: location.lat, lng: location.lng }}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 7,
                        fillColor: location.safetyLevel === 3 ? "#FF0000" :
                          location.safetyLevel === 2 ? "#FF6B6B" : "#FFD700",
                        fillOpacity: 0.9,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 2,
                      }}
                    />
                    <Circle
                      center={{ lat: location.lat, lng: location.lng }}
                      radius={UNSAFE_RADIUS}
                      options={{
                        fillColor: location.safetyLevel === 3 ? '#FF000080' :
                          location.safetyLevel === 2 ? '#FF6B6B80' : '#FFD70080',
                        fillOpacity: 0.8,
                        strokeColor: location.safetyLevel === 3 ? '#FF4444' :
                          location.safetyLevel === 2 ? '#FF8E8E' : '#FFE44D',
                        strokeOpacity: 0.5,
                        strokeWeight: 1,
                      }}
                    />
                  </div>
                ))}
              </GoogleMap>
            </div>

            <div className="lg:w-1/4 p-6 bg-gray-50 border-l border-gray-200">
              <div className="space-y-6">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter start location"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Enter destination"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />

                  <button
                    onClick={findRoute}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                             transition-colors duration-200 disabled:bg-gray-400"
                  >
                    {loading ? 'Finding Route...' : 'Find Safe Route'}
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">Map Legend</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                      <span>Warning Area (Level 1) - Safe to travel</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-red-300 mr-2"></div>
                      <span>Caution Area (Level 2) - Safe to travel</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
                      <span>Unsafe Area (Level 3) - Route will avoid</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                      <span>Safe Route</span>
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

export default SafeRoute;