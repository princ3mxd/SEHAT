import { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, DirectionsRenderer, Circle, Marker } from '@react-google-maps/api';
import { useAuthStore } from '../store/auth.store';
import Navbar from '../components/Navbar';

const defaultCenter = {
  lat: 13.184,
  lng: 74.9345
};

const UNSAFE_RADIUS = 50;

const libraries = ['places', 'geometry'];

const AllRoutes = () => {
  const [map, setMap] = useState(null);
  const [origin, setOrigin] = useState(`${defaultCenter.lat},${defaultCenter.lng}`); 
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [initialLoading, setInitialLoading] = useState(true);

  const { unsafeLocations, fetchUnsafeLocations } = useAuthStore();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    fetchUnsafeLocations();
    setCenter(defaultCenter);
  }, [fetchUnsafeLocations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };


  const findAllRoutes = () => {
    if (!origin || !destination) {
      setError('Please enter both locations');
      return;
    }

    setLoading(true);
    setError(null);
    setRoutes([]);

    const directionsService = new window.google.maps.DirectionsService();

    const routingOptions = [
      { travelMode: 'DRIVING', avoidHighways: false, label: 'Driving', color: '#0000FF' },
      { travelMode: 'DRIVING', avoidHighways: true, label: 'Driving (Avoid Highways)', color: '#00FF00' },
      { travelMode: 'TWO_WHEELER', avoidHighways: false, label: 'Two-Wheeler', color: '#FF00FF' },
      { travelMode: 'TWO_WHEELER', avoidHighways: true, label: 'Two-Wheeler (Avoid Highways)', color: '#FFFF00' },
      { travelMode: 'WALKING', avoidHighways: false, label: 'Walking', color: '#FFA500' },
      { travelMode: 'BICYCLING', avoidHighways: false, label: 'Bicycling', color: '#800080' },
      { travelMode: 'TRANSIT', avoidHighways: false, label: 'Transit', color: '#00FFFF' },
    ];

    let allRoutes = [];

    const processMode = (modeIndex) => {
      if (modeIndex >= routingOptions.length) {
        setLoading(false);
        setRoutes(allRoutes);
        if (allRoutes.length === 0) {
          setError('No routes available between the specified locations.');
          return;
        }

        const bounds = new window.google.maps.LatLngBounds();
        allRoutes.forEach(route => {
          route.route.legs[0].steps.forEach((step) => {
            bounds.extend(step.start_location);
            bounds.extend(step.end_location);
          });
        });
        map?.fitBounds(bounds);
        return;
      }

      const currentOption = routingOptions[modeIndex];

      const request = {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode[currentOption.travelMode],
        provideRouteAlternatives: true,
        optimizeWaypoints: true,
        avoidHighways: currentOption.avoidHighways,
        avoidTolls: false,
        unitSystem: window.google.maps.UnitSystem.METRIC
      };

      console.log(`Fetching routes for mode: ${currentOption.travelMode}, avoidHighways: ${currentOption.avoidHighways}`);

      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          console.log(`Found ${result.routes.length} routes for mode: ${currentOption.travelMode}`);
          result.routes.forEach((route, index) => {
            allRoutes.push({
              route: {
                ...result,
                routes: [route]
              },
              color: currentOption.color,
              label: `${currentOption.label}${result.routes.length > 1 ? ` (${index + 1})` : ''}`
            });
          });
        } else {
          console.error(`Direction service failed for ${currentOption.travelMode}:`, status);
        }

        processMode(modeIndex + 1);
      });
    };

    processMode(0);
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

  if (!isLoaded || initialLoading) {
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
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-6 relative bottom-24">
        <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
            <h1 className="text-2xl font-bold text-white">All Routes Finder</h1>
            <p className="text-blue-100 mt-1">View all possible routes to your destination</p>
          </div>

          <div className="flex flex-col lg:flex-row h-[calc(100%-4rem)]">
            <div className="lg:w-3/4 h-full">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={center}
                zoom={13}
                onLoad={handleMapLoad}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true,
                }}
              >
                {routes.map((routeData, index) => (
                  <DirectionsRenderer
                    key={index}
                    directions={routeData.route}
                    options={{
                      suppressMarkers: false,
                      preserveViewport: false,
                      polylineOptions: {
                        strokeColor: routeData.color,
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                      },
                    }}
                  />
                ))}

                {unsafeLocations.map((location, index) => (
                  <div key={index}>
                    <Marker
                      position={{ lat: location.lat, lng: location.lng }}
                      icon={{
                        path: window.google?.maps?.SymbolPath?.CIRCLE || 'CIRCLE',
                        scale: 10,
                        fillColor: "#FF0000",
                        fillOpacity: 0.7,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 2,
                      }}
                    />
                    <Circle
                      center={{ lat: location.lat, lng: location.lng }}
                      radius={UNSAFE_RADIUS}
                      options={{
                        fillColor: '#FF000080',
                        fillOpacity: 0.6,
                        strokeColor: '#FF4444',
                        strokeOpacity: 0.5,
                        strokeWeight: 1,
                      }}
                    />
                  </div>
                ))}
              </GoogleMap>
            </div>

            <div className="lg:w-1/4 p-6 bg-gray-50 border-l border-gray-200 overflow-y-auto">
              <div className="space-y-6">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter start location"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Enter destination"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />

                  <button
                    onClick={findAllRoutes}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md disabled:bg-gray-400"
                  >
                    {loading ? 'Finding Routes...' : 'Find All Routes'}
                  </button>
                </div>
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">Instructions</h3>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full mr-2 text-xs">1</span>
                      Enter your starting location
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full mr-2 text-xs">2</span>
                      Enter your destination
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full mr-2 text-xs">3</span>
                      Click Find All Routes to see all possible routes
                    </li>
                  </ol>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">Map Legend</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-gray-600">Route Start/End Points</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-gray-600">Unsafe Area</span>
                    </div>
                    {routes.map((routeData, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-4 h-4 mr-2" style={{ backgroundColor: routeData.color }}></div>
                        <span className="text-gray-600">{routeData.label}</span>
                      </div>
                    ))}
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

export default AllRoutes;