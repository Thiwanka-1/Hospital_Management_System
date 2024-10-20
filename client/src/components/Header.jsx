import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import logo from "./logo.png";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import axios for API call

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null); // State to store doctor profile
  const dropdownRef = useRef(null);

  // Fetch the doctor's profile if the current user is a doctor
  useEffect(() => {
    if (currentUser && currentUser.isDoctor) {
      const fetchDoctorProfile = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/doctors/doc/${currentUser._id}`
          );
          setDoctorProfile(response.data); // Store doctor profile information
        } catch (error) {
          console.error("Error fetching doctor profile:", error);
        }
      };
      fetchDoctorProfile();
    }
  }, [currentUser]);

  // Toggle dropdown visibility for user profile
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Toggle mobile menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine the profile link based on user role and ID
  const getProfileLink = () => {
    if (currentUser.isAdmin) {
      return "/admin-profile";
    } else if (currentUser.isDoctor) {
      return `/doctor-profile/${currentUser._id}`; // Pass doctor ID for the profile link
    } else {
      return `/profile`; // Pass user ID for normal profile link
    }
  };

  // Get the profile picture for user/doctor
  const getProfilePicture = () => {
    if (currentUser.isDoctor && doctorProfile) {
      return doctorProfile.profilePicture || "/default-profile.png"; // Use doctor profile picture
    } else {
      return currentUser.profilePicture || "/default-profile.png"; // Use user profile picture
    }
  };

  return (
    <div className="bg-white shadow-md z-50"> {/* Improved background and shadow */}
      <div className="flex justify-between items-center max-w-full mx-auto py-4 px-9 h-20"> {/* Increased padding */}
        {/* Left Section: Logo */}
        <div className="flex items-center space-x-1">
          <Link to="/">
            <img src={logo} alt="MediZen Logo" className="h-12 md:h-16" />
          </Link>
        </div>

        {/* Right Section: Navigation Links */}
        <div className="hidden md:flex gap-5 items-center relative">
          <ul className="flex gap-5 items-center">
            <li>
              <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-indigo-600 transition">About Us</Link>
            </li>
            <li>
              <Link to="/patient-treatment" className="hover:text-indigo-600 transition">My Treatment</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-600 transition">Contact Us</Link>
            </li>
            <li>
              <Link to="/adds" className="hover:text-indigo-600 transition">Chat Us</Link>
            </li>
            
            {/* Dropdown for Health Dashboards */}
            <li className="relative">
              <button onClick={toggleDropdown} className="hover:text-indigo-600 transition focus:outline-none">
                Health Dashboards
              </button>
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10"
                >
                  <Link
                    to="/MDashboard"
                    className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
                    onClick={() => { setDropdownOpen(false); }} // Close dropdown on link click
                  >
                    Physical Dashboard
                  </Link>
                  <Link
                    to="/MeDashboard"
                    className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
                    onClick={() => { setDropdownOpen(false); }} // Close dropdown on link click
                  >
                    Mental Dashboard
                  </Link>
                </div>
              )}
            </li>

            {currentUser ? (
              <li>
                <Link to={getProfileLink()} className="relative">
                  <img
                    src={getProfilePicture()} // Get profile picture dynamically
                    alt="profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/sign-in" className="hover:text-indigo-600 transition">Sign In</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Burger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-slate-100 h-auto z-50">
          <ul className="flex flex-col space-y-2 p-4 items-end"> {/* Align items to the right */}
            <li>
              <Link to="/" onClick={() => { setMenuOpen(false); }} className="hover:text-indigo-600 transition">Home</Link>
            </li>
            <li>
              <Link to="/about" onClick={() => { setMenuOpen(false); }} className="hover:text-indigo-600 transition">About Us</Link>
            </li>
            <li>
              <Link to="/patient-treatment" onClick={() => { setMenuOpen(false); }} className="hover:text-indigo-600 transition">My Treatment</Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => { setMenuOpen(false); }} className="hover:text-indigo-600 transition">Contact Us</Link>
            </li>
            <li>
              <Link to="/adds" onClick={() => { setMenuOpen(false); }} className="hover:text-indigo-600 transition">Chat Us</Link>
            </li>
            
            <li className="relative">
              <button onClick={toggleDropdown} className="hover:text-indigo-600 transition focus:outline-none">
                Health Dashboards
              </button>
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10"
                >
                  <Link
                    to="/MDashboard"
                    onClick={() => { setMenuOpen(false); setDropdownOpen(false); }} // Close dropdown on link click
                    className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
                  >
                    Physical Dashboard
                  </Link>
                  <Link
                    to="/MeDashboard"
                    onClick={() => { setMenuOpen(false); setDropdownOpen(false); }} // Close dropdown on link click
                    className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
                  >
                    Mental Dashboard
                  </Link>
                </div>
              )}
            </li>

            {currentUser ? (
              <li>
                <Link to={getProfileLink()} onClick={() => { setMenuOpen(false); }} className="relative">
                  <img
                    src={getProfilePicture()} // Get profile picture dynamically
                    alt="profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/sign-in" onClick={() => { setMenuOpen(false); }} className="hover:text-indigo-600 transition">Sign In</Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
