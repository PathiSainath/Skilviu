import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function Footer() {
  return (
    <>
      <footer className="bg-[#2b3a4b] text-white py-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-xl font-bold mb-4">ABOUT US</h3>
            <p className="text-sm leading-relaxed">
              We understand that finding the right fit is crucial, and we are committed to being with you every step of the way,
              providing ongoing support and guidance in your journey to build an exceptional team.
            </p>
            <div className="flex mt-6 space-x-4">
              {/* Social Media Icons with Links */}
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full hover:bg-black hover:cursor-pointer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full hover:bg-black hover:cursor-pointer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/skilviu_at_life/?utm_source=qr&igsh=c3FtOThzMTBtNXp4#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full hover:bg-black hover:cursor-pointer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/company/skilviu_soft_solutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full hover:bg-black hover:cursor-pointer"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">CONTACT INFO</h3>
            <p><span className="font-bold">Address:</span> A-302, Satya Apartments, <br />
              Beside the Hotel Golkonda, <br />
              Masabtank, Hyderabad -500028.</p>
            <p className="mt-2"><span className="font-bold">Email:</span> info@skilviu.com</p>
            <p><span className="font-bold">Landline:</span> 04031695228</p>
            <p><span className="font-bold">Phone:</span> +91 70754 98151,<br />+91 70754 98529</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">QUICK LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-white hover:text-blue-400 hover:cursor-pointer hover:underline">
                <Link to="/Staffing">• Staffing Services</Link>
              </li>
              <li className="text-white hover:text-blue-400 hover:cursor-pointer hover:underline">
                <Link to="/Payroll">• Payroll Services</Link>
              </li>
              <li className="text-white hover:text-blue-400 hover:cursor-pointer hover:underline">
                <Link to="/Itmanagement">• IT Hardware Asset Management</Link>
              </li>
              <li className="text-white hover:text-blue-400 hover:cursor-pointer hover:underline">
                <Link to="/network">• IT Network Design, Implementation & Support</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-500 mt-12 pt-4 text-center text-sm text-gray-400">
          © 2025 Copyrights Skilviu
        </div>
      </footer>

      {/* Floating WhatsApp Icon */}
      <a
        href="https://wa.me/917075498151"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition">
          <FaWhatsapp size={28} />
        </div>
      </a>
    </>
  );
}

export default Footer;
