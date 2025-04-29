import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import logo from '../assets/sehat.png';
import { MapIcon, DocumentTextIcon, ClipboardDocumentListIcon, BookOpenIcon, HeartIcon } from '@heroicons/react/24/outline';
import MapDrawer from './MapDrawer';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMapDrawerOpen, setIsMapDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="h-16" />
            </Link>

            <div className="flex items-center gap-4">
              {user && (
                <span className="text-gray-700 font-medium">
                  Hi, {user.name}
                </span>
              )}
              <button
                onClick={toggleDrawer}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg
                  className="h-8 w-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-20"></div>

      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
            onClick={toggleDrawer}
          />

          <div className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-end mb-8">
                <button
                  onClick={toggleDrawer}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <svg
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {user && (
                <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-md">
                      <span className="text-2xl font-bold text-white">
                        {user.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 space-y-2 overflow-y-auto">
                {user?.role !== 'doctor' && (
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/profile')}>
                      <ListItemIcon>
                        <AccountCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                    </ListItemButton>
                  </ListItem>
                )}

                {user?.role !== 'doctor' && (
                  <Link
                    to="/appointment"
                    className="flex items-center gap-3 p-4 hover:bg-gray-100 rounded-xl text-gray-700 transition-all duration-200 hover:shadow-sm"
                    onClick={toggleDrawer}
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Book Appointment</span>
                  </Link>
                )}

                {user?.role !== 'doctor' && (
                  <button
                    onClick={() => {
                      setIsMapDrawerOpen(true);
                      toggleDrawer();
                    }}
                    className="flex items-center gap-3 p-4 hover:bg-gray-100 rounded-xl text-gray-700 w-full transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Map Features</span>
                  </button>
                )}

                {user?.role === 'user' && (
                  <Link
                    to="/safety"
                    className="flex items-center gap-3 p-4 hover:bg-gray-100 rounded-xl text-gray-700 transition-all duration-200 hover:shadow-sm"
                    onClick={toggleDrawer}
                  >
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <svg
                        className="h-5 w-5 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Doc Vault</span>
                  </Link>
                )}

                {user?.role === 'doctor' && (
                  <Link
                    to="/doctor/dashboard"
                    className="flex items-center gap-3 p-4 hover:bg-gray-100 rounded-xl text-gray-700 transition-all duration-200 hover:shadow-sm"
                    onClick={toggleDrawer}
                  >
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <svg
                        className="h-5 w-5 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Dashboard</span>
                  </Link>
                )}

                {user?.role === 'doctor' && (
                  <Link
                    to="/doctor/prescriptions"
                    className="flex items-center gap-3 p-4 hover:bg-gray-100 rounded-xl text-gray-700 transition-all duration-200 hover:shadow-sm"
                    onClick={toggleDrawer}
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ClipboardDocumentListIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium">Prescriptions</span>
                  </Link>
                )}

                {user?.role === 'doctor' && (
                  <Link
                    to="/diagnosis"
                    className="flex items-center gap-3 p-4 hover:bg-gray-100 rounded-xl text-gray-700 transition-all duration-200 hover:shadow-sm"
                    onClick={toggleDrawer}
                  >
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <svg
                        className="h-5 w-5 text-cyan-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Image Analyzer</span>
                  </Link>
                )}

                {user && user.role !== 'doctor' && (
                  <Link
                    to="/health-form"
                    className="flex items-center gap-3 p-4 hover:bg-gray-100 rounded-xl text-gray-700 transition-all duration-200 hover:shadow-sm"
                    onClick={toggleDrawer}
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Health Card</span>
                  </Link>
                )}

                {user && user.role !== 'doctor' && (
                  <Link
                    to="/schemes"
                    className="flex items-center gap-3 p-4 hover:bg-gray-100 rounded-xl text-gray-700 transition-all duration-200 hover:shadow-sm"
                    onClick={toggleDrawer}
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BookOpenIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="font-medium">Schemes</span>
                  </Link>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-200">
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="flex items-center gap-3 p-4 hover:bg-red-50 rounded-xl text-red-600 w-full transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="p-2 bg-red-100 rounded-lg">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-3 p-4 hover:bg-gray-100 rounded-xl text-gray-700 transition-all duration-200 hover:shadow-sm"
                    onClick={toggleDrawer}
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Login/Signup</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <MapDrawer
        isOpen={isMapDrawerOpen}
        setIsOpen={setIsMapDrawerOpen}
      />
    </>
  );
};

export default Navbar;