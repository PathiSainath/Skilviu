import React, { useRef } from "react";
import { FaAtom, FaTrophy } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import bgpattern from "../Assets/bgpattern.png";

const VisionMission = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const isLeftInView = useInView(leftRef, { amount: 0.5, once: true });
  const isRightInView = useInView(rightRef, { amount: 0.5, once: true });

  const leftVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const rightVariant = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <div
      className="text-white min-h-96 py-32 px-6 md:px-20 lg:px-32 flex items-center"
      style={{
        backgroundColor: "#2d2f44",
        backgroundImage: `url(${bgpattern})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="grid md:grid-cols-2 gap-16 w-full">
        {/* Vision Section */}
        <motion.div
          ref={leftRef}
          variants={leftVariant}
          initial="hidden"
          animate={isLeftInView ? "visible" : "hidden"}
          className="flex items-start space-x-4"
        >
          <div className="bg-blue-500 rounded-full p-4">
            <FaAtom className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Our Vision</h2>
            <p className="text-gray-300">
              Our aim is to become the most trusted and forward-thinking
              recruitment partner globally. We’re dedicated to upholding the
              highest standards of excellence in our services, celebrating
              diversity, and empowering professionals across the world.
            </p>
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          ref={rightRef}
          variants={rightVariant}
          initial="hidden"
          animate={isRightInView ? "visible" : "hidden"}
          className="flex items-start space-x-4"
        >
          <div className="bg-blue-500 rounded-full p-4">
            <FaTrophy className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
            <p className="text-gray-300">
              To empower individuals and organizations with innovative
              skill-building solutions that unlock potential and drive
              meaningful change in a constantly evolving world.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VisionMission;
