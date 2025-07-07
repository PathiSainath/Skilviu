import React from 'react';
import staffing from "../Assets/it-non-it.jpg";
import payroll from "../Assets/payroll.jpg";
import it from "../Assets/staturity.jpg";
import network from "../Assets/human-capital.jpg";
import { ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Getintouch from './Getintouch';

function Services() {
  const serviceList = [
    {
      img: staffing,
      title: "Staffing Services",
      link: "/Staffing",
    },
    {
      img: payroll,
      title: "Payroll Services",
      link: "/Payroll",
    },
    {
      img: it,
      title: "IT Hardware Asset Management",
      link: "/Itmanagement",
    },
    {
      img: network,
      title: "IT Network Design, Implementation & Support",
      link: "/network",
    },
  ];

  return (
    <div className="bg-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <motion.div
        className="bg-blue-500 px-8 py-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="h-16 text-white text-4xl font-bold ml-28">Our Services</h1>
      </motion.div>

      {/* Card Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {serviceList.map((service, index) => (
          <motion.div
            key={index}
            className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Link to={service.link} className="relative block group cursor-pointer">
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-56 object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-center items-center">
                <span className="text-white text-7xl font-thin">+</span>
              </div>
            </Link>
            <div className="p-5">
              <h2 className="text-lg font-semibold mb-2">{service.title}</h2>
              <Link
                to={service.link}
                className="text-blue-600 font-medium flex items-center gap-2 hover:underline"
              >
                <ArrowRightCircle className="w-4 h-4 text-sky-500" />
                Read More
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-screen-2xl mx-auto">
        <Getintouch />
      </div>

    </div>
  );
}

export default Services;
