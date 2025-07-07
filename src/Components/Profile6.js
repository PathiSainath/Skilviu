import React from 'react';
import { motion } from 'framer-motion';
import maneeja from "../Assets/maneeja.jpeg";

// Animation Variants
const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

function Profile6() {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* Header Section */}
      <motion.div
        className="bg-blue-500 px-8 py-6"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <h1 className="h-16 text-white text-4xl font-bold ml-28">
          Ms. Maneeja
        </h1>
      </motion.div>

      {/* Profile Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <hr className="mb-10" />

        <div className="flex flex-col items-center">
          {/* Image */}
          <motion.img
            src={maneeja}
            alt="Ms. Maneeja"
            className="w-64 h-72 mb-8 rounded shadow-md"
            initial="hidden"
            animate="visible"
            variants={imageVariants}
          />

          {/* Text */}
          <motion.p
            className="text-lg leading-relaxed text-center max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            Ms. Maneeja is the meticulous planner behind our successful projects. Her ability to coordinate and manage projects efficiently ensures that we consistently meet our clients’ expectations.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default Profile6;
