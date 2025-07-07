import React from 'react';
import { motion } from 'framer-motion';
import network from "../Assets/network.gif";

function ITnetwork() {
  return (
    <div className="bg-gray-100 text-gray-800 font-sans">
      {/* Header */}
      <div className="bg-blue-500 px-8 py-4">
        <h1 className="h-16 text-white text-4xl font-bold ml-28">
          IT Network Design, Implementation & Support
        </h1>
      </div>

      {/* Content */}
      <div className="bg-white text-gray-800 px-8 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left Side */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Tagline */}
            <div className="border-l-4 border-blue-600 pl-4 mb-6">
              <motion.p
                className="italic text-gray-600 text-lg"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                We understand the sensitivity of executive searches
              </motion.p>
            </div>

            {/* Main Text */}
            <motion.p
              className="mb-6 leading-relaxed text-justify"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              At Skilviu, we recognize that effective communication is the backbone
              of any successful organization. Our commitment lies in delivering
              comprehensive IT network solutions that cover every aspect, from
              meticulous design to seamless implementation and ongoing support. By
              leveraging our expertise, we ensure that your communication
              infrastructure is robust, reliable, and tailored to meet the specific
              demands of your business. Our goal is to enhance connectivity and
              collaboration within your organization, ultimately driving productivity
              and success.
            </motion.p>

            {/* Subservices */}
            <motion.h2
              className="text-xl font-semibold mb-4"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Network
            </motion.h2>
            <motion.ul
              className="list-decimal ml-6 space-y-2 text-gray-700"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <li>Design</li>
              <li>Implementation</li>
              <li>Support</li>
            </motion.ul>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            className="flex justify-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={network}
              alt="IT Network Illustration"
              className="w-full max-w-md h-auto object-contain"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ITnetwork;
