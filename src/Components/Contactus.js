import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from 'lucide-react';
import { motion } from 'framer-motion';

function Contactus() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    try {
      const response = await fetch(
        'https://skilviu.com/backend/api/v1/submit-feedback',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      // Get response safely
      const data = await response.json().catch(() => ({}));
      console.log('Response status:', response.status, 'Response body:', data);

      if (response.ok) {
        setStatusMessage(data.message || 'Feedback submitted successfully!');
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          message: '',
        });
      } else {
        setStatusMessage(data.message || 'Failed to submit feedback.');
      }
    } catch (err) {
      console.error('Error:', err);
      setStatusMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen">
      {/* Header */}
      <motion.div
        className="bg-blue-500 px-8 py-6 h-24"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-white text-4xl font-bold ml-4 md:ml-28">Contact Us</h1>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 p-6 md:p-10">
        {/* Left Side - Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">Contact us</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions, wish to share your thoughts, or require more
            information about Skilviu, please don’t hesitate to reach out to us!
          </p>

          <hr className="border-t border-gray-300 mb-6" />

          <h3 className="text-xl font-semibold mb-4">Our Location</h3>
          <div className="flex items-start mb-4">
            <MapPin className="text-blue-500 mr-3 mt-1" />
            <p>
              A-302, Satya Apartments,<br />
              Beside the Hotel Golkonda,<br />
              Masabtank, Hyderabad -500028
            </p>
          </div>

          <div className="flex items-center mb-4">
            <Phone className="text-blue-500 mr-3" />
            <p>
              04031695228.<br />
              +91 70754 98551, +91 70754 98529
            </p>
          </div>

          <div className="flex items-center mb-4">
            <Mail className="text-blue-500 mr-3" />
            <a href="mailto:info@skilviu.com" className="text-blue-600 hover:underline">
              info@skilviu.com
            </a>
          </div>

          <div className="flex items-center mb-4">
            <Clock className="text-blue-500 mr-3" />
            <p>
              Monday–Saturday: 9:00AM–7:00PM<br />
              Sunday: CLOSED
            </p>
          </div>

          {/* Social Icons with Links */}
          <div className="flex space-x-4 mt-6">
            <motion.div className="bg-gray-400 rounded-full p-2 cursor-pointer hover:bg-blue-500" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                <Facebook className="text-white w-5 h-5" />
              </a>
            </motion.div>
            <motion.div className="bg-gray-400 rounded-full p-2 cursor-pointer hover:bg-blue-500" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
                <Twitter className="text-white w-5 h-5" />
              </a>
            </motion.div>
            <motion.div className="bg-gray-400 rounded-full p-2 cursor-pointer hover:bg-blue-500" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <a href="https://www.instagram.com/skilviu_at_life/?utm_source=qr&igsh=c3FtOThzMTBtNXp4#" target="_blank" rel="noopener noreferrer">
                <Instagram className="text-white w-5 h-5" />
              </a>
            </motion.div>
            <motion.div className="bg-gray-400 rounded-full p-2 cursor-pointer hover:bg-blue-500" whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <a href="https://www.linkedin.com/company/skilviu_soft_solutions/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="text-white w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Feedback Form */}
        <motion.div
          className="bg-gray-50 p-6 rounded shadow-sm"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-6">Feedback form</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <motion.input
              name="first_name"
              type="text"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              whileFocus={{ scale: 1.02 }}
              required
            />
            <motion.input
              name="last_name"
              type="text"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              whileFocus={{ scale: 1.02 }}
              required
            />
            <motion.input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              whileFocus={{ scale: 1.02 }}
              required
            />
            <motion.input
              name="phone_number"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              whileFocus={{ scale: 1.02 }}
              required
            />
            <motion.textarea
              name="message"
              rows="4"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border p-2 rounded resize-none"
              whileFocus={{ scale: 1.02 }}
              required
            />
            <motion.button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </motion.button>
            {statusMessage && (
              <p className="text-sm mt-2 text-center text-green-600">{statusMessage}</p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Contactus;
