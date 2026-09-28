import { useEffect, useState, useRef } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout, useDecodeToken } from "../_sevices/auth";
import logodpm from '../assets/logo-DPM-Unuja.png'


export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const rawUser = localStorage.getItem("userInfo");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  
  let userInfo;
  try {
    userInfo = rawUser ? JSON.parse(rawUser) : { username: "", role: "" };
  } catch (error) {
    console.error("Failed to parse userInfo from localStorage:", error);
    userInfo = { username: "", role: "" };
  }
  
  const decodedData = useDecodeToken(token);
  const userInitial = userInfo?.username ? userInfo.username.charAt(0).toUpperCase() : "";

  useEffect(() => {
    if (!token || !decodedData || !decodedData.success) {
      navigate("/login");
    }

    const role = userInfo?.role;
    if (role !== "admin") {
      alert("Access denied. Admins only.");
      navigate("/login");
    }
  }, [token, decodedData, navigate, userInfo?.role]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (token) {
      await logout({ token, userInfo });
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className="antialiased bg-gray-50 dark:bg-gray-900">
        {/* Navbar */}
        <nav className="bg-blue-900 border-b border-gray-200 fixed top-0 left-0 w-full z-50 shadow-sm">
          <div className="px-3 sm:px-4 lg:px-6 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
                {/* Menu garis tiga */}
                <button
                  onClick={toggleSidebar}
                  className="md:hidden p-2 p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                  aria-label="Toggle sidebar"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>

                {/* Logo */}
                <Link to="/admin" className="flex items-center space-x-1 sm:space-x-3 pr-9">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-900 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-105">
                    <img
                    src={logodpm}
                    />
                  </div>
                  <span className="hidden sm:block text-lg lg:text-xl font-semibold text-gray-100 ">DPM U</span>
                </Link>
              </div>

              {/* Right Side Icons */}
              <div className="flex items-center space-x-1 sm:space-x-2">

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 focus:outline-none group"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 text-white flex items-center justify-center font-semibold text-sm sm:text-lg hover:opacity-80 transition-all duration-200 group-hover:ring-2 group-hover:ring-blue-300">
                      {userInitial}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-gray-100 rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-blue-900 text-gray-100 flex items-center justify-center font-semibold text-xl flex-shrink-0">
                            {userInitial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{userInfo?.email}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{userInfo?.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 w-64 sm:w-72 lg:w-64 h-screen pt-16 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 bg-white border-r border-gray-200 shadow-lg md:shadow-none`}
          aria-label="Sidenav"
        >
          <div className="overflow-y-auto py-4 px-3 h-full bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">

            {/* Navigation Links */}
            <ul className="space-y-1">
              <li>
                <Link
                  to="/admin"
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive("/admin")
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                  }`}
                >
                  <svg className={`w-5 h-5 transition-colors duration-200 ${
                    isActive("/admin") ? "text-blue-900" : "text-gray-500 group-hover:text-blue-900"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <span className="ml-3">Dashboard</span>
                  {isActive("/admin") && (
                    <div className="ml-auto w-1 h-6 bg-blue-900 rounded-l"></div>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/users"
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive("/admin/users")
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                  }`}
                >
                  <svg className={`w-5 h-5 transition-colors duration-200 ${
                    isActive("/admin/users") ? "text-blue-900" : "text-gray-500 group-hover:text-blue-900"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                  </svg>
                  <span className="ml-3">Users</span>
                  {isActive("/admin/users") && (
                    <div className="ml-auto w-1 h-6 bg-blue-900 rounded-l"></div>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/beritadpm"
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive("/admin/beritadpm")
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                  }`}
                >
                  <svg className={`w-5 h-5 transition-colors duration-200 ${
                    isActive("/admin/beritadpm") ? "text-blue-900" : "text-gray-500 group-hover:text-blue-900"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd"></path>
                    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path>
                  </svg>
                  <span className="ml-3">Berita</span>
                  {isActive("/admin/beritadpm") && (
                    <div className="ml-auto w-1 h-6 bg-blue-900 rounded-l"></div>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/kritik_dpm"
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive("/admin/kritik_dpm")
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                  }`}
                >
                  <svg className={`w-5 h-5 transition-colors duration-200 ${
                    isActive("/admin/kritik_dpm") ? "text-blue-900" : "text-gray-500 group-hover:text-blue-900"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-3">Kritik dan Saran</span>
                  {isActive("/admin/kritik_dpm") && (
                    <div className="ml-auto w-1 h-6 bg-blue-900 rounded-l"></div>
                  )}
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <div className="my-4 border-t border-gray-200"></div>

            {/* Additional Links */}
            <ul className="space-y-1">
              <li>
                <Link
                  to="/admin/pengaduan"
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive("/admin/pengaduan")
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                  }`}
                >
                  <svg className={`w-5 h-5 transition-colors duration-200 ${
                    isActive("/admin/pengaduan") ? "text-blue-900" : "text-gray-500 group-hover:text-blue-900"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-3">Pengaduan</span>
                  {isActive("/admin/pengaduan") && (
                    <div className="ml-auto w-1 h-6 bg-blue-900 rounded-l"></div>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/produkHukum"
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive("/admin/produkHukum")
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                  }`}
                >
                  <svg className={`w-5 h-5 transition-colors duration-200 ${
                    isActive("/admin/produkHukum") ? "text-blue-900" : "text-gray-500 group-hover:text-blue-900"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-3">Produk Hukum</span>
                  {isActive("/admin/produkHukum") && (
                    <div className="ml-auto w-1 h-6 bg-blue-900 rounded-l"></div>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/keputusan"
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive("/admin/keputusan")
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                  }`}
                >
                  <svg className={`w-5 h-5 transition-colors duration-200 ${
                    isActive("/admin/keputusan") ? "text-blue-900" : "text-gray-500 group-hover:text-blue-900"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-3">Keputusan</span>
                  {isActive("/admin/keputusan") && (
                    <div className="ml-auto w-1 h-6 bg-blue-900 rounded-l"></div>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/strukturdpm"
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive("/admin/strukturdpm")
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                  }`}
                >
                  <svg className={`w-5 h-5 transition-colors duration-200 ${
                    isActive("/admin/strukturdpm") ? "text-blue-900" : "text-gray-500 group-hover:text-blue-900"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                  </svg>
                  <span className="ml-3">Struktur</span>
                  {isActive("/admin/strukturdpm") && (
                    <div className="ml-auto w-1 h-6 bg-blue-900 rounded-l"></div>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/tentangdpm"
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive("/admin/tentangdpm")
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                  }`}
                >
                  <svg className={`w-5 h-5 transition-colors duration-200 ${
                    isActive("/admin/tentangdpm") ? "text-blue-900" : "text-gray-500 group-hover:text-blue-900"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-3">Tentang DPM U</span>
                  {isActive("/admin/tentangdpm") && (
                    <div className="ml-auto w-1 h-6 bg-blue-900 rounded-l"></div>
                  )}
                </Link>
              </li>
            </ul>
            {/* Logout Button */}
            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 group"
              >
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="p-3 sm:p-4 md:ml-64 lg:ml-64 h-auto pt-16 sm:pt-20 transition-all duration-300">
          <div className="rounded-lg h-auto px-2 sm:px-4 pt-4 pb-6">
            <Outlet />
          </div>
        </main>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 md:hidden backdrop-blur-sm transition-opacity duration-300"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          ></div>
        )}
      </div>

      {/* Custom Styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 9999px;
        }

        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }

        ::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 9999px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
      `}</style>
    </>
  );
}