import React from 'react';
import { motion } from 'framer-motion';
import Itmanagement from "../Assets/Itmanagement.gif";

function ITmanagement() {
  return (
    <div className="bg-gray-100 text-gray-800 font-sans">
      {/* Header */}
      <div className="bg-blue-500 px-8 py-4">
        <h1 className="h-16 text-white text-4xl font-bold ml-28">
          IT Hardware Asset Management
        </h1>
      </div>

      {/* Main Content */}
      <div className="bg-white text-gray-800 px-8 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left Section */}
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
                Transforming complexity into clarity—one regulation at a time.
              </motion.p>
            </div>

            {/* Description */}
            <motion.p
              className="mb-6 leading-relaxed text-justify"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              IT Asset Management is crucial for both budget planning and resource
              availability within any organization. At Skilviu, we recognize that
              having a firm grip on IT assets is key to making informed and strategic
              decisions. By maintaining comprehensive oversight of our IT hardware,
              we ensure not only that resources are optimally utilized but also that
              they are readily available when needed. This vigilant management
              supports high availability of IT hardware, reducing downtime and
              enhancing operational efficiency. Effective control of IT assets allows
              us to anticipate needs, allocate resources wisely, and ultimately drive
              better outcomes for the organization.
            </motion.p>

            {/* Subservices List */}
            <motion.h2
              className="text-xl font-semibold mb-4"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Asset management subservices:
            </motion.h2>
            <motion.ul
              className="list-decimal ml-6 space-y-2 text-gray-700"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <li>Audit as a service</li>
              <li>On-site asset management support</li>
              <li>On-premises tools or cloud solutions.</li>
            </motion.ul>
          </motion.div>

          {/* Right Section - Image */}
          <motion.div
            className="flex justify-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={Itmanagement}
              alt="IT Asset Management Illustration"
              className="w-full max-w-md h-auto object-contain"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ITmanagement;
