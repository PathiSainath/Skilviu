import React from 'react';
import { motion } from 'framer-motion';  // Import Framer Motion
import avatar from "../Assets/avatar.png";

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

function Profile2() {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* Header Section */}
      <motion.div
        className="bg-blue-500 px-4 sm:px-8 py-6"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold ml-0 sm:ml-16 md:ml-28 text-center sm:text-left">
          Mrs. Sandhya Rani
        </h1>
      </motion.div>

      {/* Profile Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <hr className="mb-10" />

        <div className="flex flex-col items-center">
          {/* Image */}
          <motion.img
            src={avatar}
            alt="Mrs. Sandhya Rani"
            className="w-64 h-auto mb-8 rounded shadow-md"
            initial="hidden"
            animate="visible"
            variants={imageVariants}
          />

          {/* Text */}
          <motion.p
            className="text-base sm:text-lg leading-relaxed text-center max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            With her exceptional organizational skills and keen attention to detail, Mrs. Sandhya Rani
            ensures the seamless execution of our business operations. Her dedication to efficiency
            and excellence is a cornerstone of our success.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default Profile2;
