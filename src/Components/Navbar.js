import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from "../Assets/skilviulogo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleMobileNav = (path) => {
    navigate(path);
    setMenuOpen(false);
    setServicesOpen(false);
  };

  return (
    <div className="flex items-center h-24 justify-between px-8 py-4 bg-white text-black shadow-sm">
      {/* Logo */}
      <div className="flex items-center ml-4 lg:ml-32">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-14 w-auto cursor-pointer" />
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center space-x-6 mr-36">
        <Link to="/" className="font-semibold hover:text-blue-500">HOME</Link>
        <Link to="/about" className="font-semibold hover:text-blue-500">ABOUT US</Link>

        {/* SERVICES */}
        <div className="relative group flex items-center space-x-1">
          <Link
            to="/services"
            className="font-semibold hover:text-blue-500"
            onClick={() => setServicesOpen(!servicesOpen)}
          >
            SERVICES
          </Link>
          <ChevronDown
            size={18}
            className="cursor-pointer hover:text-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              setServicesOpen(!servicesOpen);
            }}
          />
          {servicesOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-md z-50">
              <Link to="/Staffing/1" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setServicesOpen(false)}>Staffing Services</Link>
              <Link to="/Payroll" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setServicesOpen(false)}>Payroll Services</Link>
              <Link to="/Itmanagement" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setServicesOpen(false)}>IT Hardware Asset Management</Link>
              <Link to="/network" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setServicesOpen(false)}>IT Network Design, Implementation & Support</Link>
            </div>
          )}
        </div>

        <Link to="/clients" className="font-semibold hover:text-blue-500">CLIENTS</Link>
        <Link to="/careers" className="font-semibold hover:text-blue-500">CAREERS</Link>
        <Link to="/contact" className="font-semibold hover:text-blue-500">CONTACT US</Link>

        {/* Login Button */}
        <Link to="/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 border border-blue-600 transition">
            EMPLOYEE LOGIN
          </button>
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <div className="lg:hidden flex items-center">
        <Menu className="cursor-pointer" onClick={() => setMenuOpen(true)} />
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black opacity-60" onClick={() => setMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 h-full w-72 bg-[#2e2e2e] text-white flex flex-col justify-start z-50 p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
              <X className="text-white cursor-pointer" onClick={() => setMenuOpen(false)} />
            </div>

            <p onClick={() => handleMobileNav('/')} className="font-bold cursor-pointer">HOME</p>
            <p onClick={() => handleMobileNav('/about')} className="font-bold cursor-pointer">ABOUT US</p>

            {/* Services Dropdown */}
            <div>
              <div className="flex justify-between items-center cursor-pointer font-bold" onClick={() => setServicesOpen(!servicesOpen)}>
                <span>SERVICES</span>
                <ChevronDown size={18} />
              </div>
              {servicesOpen && (
                <div className="bg-white text-black mt-2 rounded-md overflow-hidden">
                  <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleMobileNav('/Staffing/1')}>Staffing Services</p>
                  <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleMobileNav('/Payroll')}>Payroll Services</p>
                  <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleMobileNav('/Itmanagement')}>IT Hardware Asset Management</p>
                  <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleMobileNav('/network')}>IT Network Design, Implementation & Support</p>
                </div>
              )}
            </div>

            <p onClick={() => handleMobileNav('/clients')} className="font-bold cursor-pointer">CLIENTS</p>
            <p onClick={() => handleMobileNav('/careers')} className="font-bold cursor-pointer">CAREERS</p>
            <p onClick={() => handleMobileNav('/contact')} className="font-bold cursor-pointer">CONTACT US</p>

            {/* Login Button */}
            <button
              onClick={() => handleMobileNav('/login')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 border border-blue-600 transition"
            >
              EMPLOYEE LOGIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
