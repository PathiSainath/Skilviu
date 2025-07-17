// import React from 'react';
// import { motion } from 'framer-motion';
// import thinkgrey from "../Assets/thinkgrey.jpg";
// import Ecologo from "../Assets/Ecologo.png";
// import Soul from "../Assets/Soul.jpeg";
// import degefy from "../Assets/degefy.png";
// import socialmedia from "../Assets/socialmedia.png";
// import nokhatech from "../Assets/nokhatech.png";
// import Dc from "../Assets/Dc.jpeg";
// import Wadpack from "../Assets/Wadpack.png";
// import Asw from "../Assets/Asw.png";
// import Ficus from "../Assets/Ficus.jpg";
// import Infotech from "../Assets/Infotech.png";
// import Riyo from "../Assets/Riyo.png";
// import Medimind from "../Assets/Medimind.png";
// import Techteam from "../Assets/Techteam.png";
// import Getintouch from './Getintouch';

// function Clients() {
//   const logos = [
//     Wadpack, Asw, Ficus, thinkgrey, Medimind ,Ecologo, nokhatech, degefy, socialmedia,
//     Soul, Dc, Infotech, Riyo, Techteam
//   ];

//   const evenLogos = logos.filter((_, index) => index % 2 === 0);

//   return (
//     <div className="bg-gray-50 text-gray-800 font-sans">
//       {/* Header */}
//       <motion.div
//         className="bg-blue-500 px-8 py-4 h-24"
//         initial={{ opacity: 0, y: -40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1.0 }}
//       >
//         <h1 className="text-white text-4xl font-bold ml-4 md:ml-28">Our Clients</h1>
//       </motion.div>

//       <div className="px-6 md:px-20 py-12">
//         {/* First Scroll: All Logos */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, ease: "easeInOut" }}
//           className="mb-16"
//         >
//           <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
//             Clients Who Believed in Us
//           </h2>

//           <div className="relative overflow-hidden bg-white rounded-xl shadow-lg py-8">
//             <motion.div
//               className="flex space-x-8"
//               animate={{ x: ["0%", "-50%"] }}
//               transition={{
//                 x: {
//                   repeat: Infinity,
//                   repeatType: "loop",
//                   duration: 20,
//                   ease: "linear",
//                 },
//               }}
//             >
//               {logos.concat(logos).map((logo, index) => (
//                 <div
//                   key={index}
//                   className="flex-shrink-0 flex items-center justify-center p-4 bg-gray-50 border shadow-sm rounded-lg min-w-[200px] h-32"
//                 >
//                   <img
//                     src={logo}
//                     alt={`Client logo ${index + 1}`}
//                     className="h-20 w-auto max-w-full object-contain"
//                   />
//                 </div>
//               ))}
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Second Scroll: Even Index Logos */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, ease: "easeInOut" }}
//           className="mb-16"
//         >
//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
//             Strategic Collaborations
//           </h2>

//           <div className="relative overflow-hidden bg-white rounded-xl shadow-lg py-8">
//             <motion.div
//               className="flex space-x-8"
//               animate={{ x: ["0%", "-50%"] }}
//               transition={{
//                 x: {
//                   repeat: Infinity,
//                   repeatType: "loop",
//                   duration: 22,
//                   ease: "linear",
//                 },
//               }}
//             >
//               {evenLogos.concat(evenLogos).map((logo, index) => (
//                 <div
//                   key={index}
//                   className="flex-shrink-0 flex items-center justify-center p-4 bg-gray-50 border shadow-sm rounded-lg min-w-[200px] h-32"
//                 >
//                   <img
//                     src={logo}
//                     alt={`Even logo ${index}`}
//                     className="h-20 w-auto max-w-full object-contain"
//                   />
//                 </div>
//               ))}
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Sectors We Serve Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, ease: "easeInOut" }}
//         >
//           <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
//             Sectors We Serve
//           </h2>
//           <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
//             <div className="space-y-4">
//               {[
//                 "IT & Software Services",
//                 "Digital Marketing",
//                 "Manufacturing",
//                 "Sales & Marketing",
//                 "Banking & Insurance"
//               ].map((sector, index) => (
//                 <div key={index} className="flex items-center space-x-3">
//                   <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                   <span className="text-gray-700 text-lg">{sector}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="space-y-4">
//               {[
//                 "Business Services",
//                 "Interior Designing",
//                 "Construction",
//                 "Entertainment & Amusement Park",
//                 "Customer Support"
//               ].map((sector, index) => (
//                 <div key={index} className="flex items-center space-x-3">
//                   <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                   <span className="text-gray-700 text-lg">{sector}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Get in Touch Section */}
//       <div className="w-full max-w-screen-2xl mx-auto">
//         <Getintouch />
//       </div>
//     </div>
//   );
// }

// export default Clients;


import React from 'react';
import { motion } from 'framer-motion';

import thinkgrey from "../Assets/thinkgrey.jpg";
import Ecologo from "../Assets/Ecologo.png";
import Soul from "../Assets/Soul.jpeg";
import degefy from "../Assets/degefy.png";
import socialmedia from "../Assets/socialmedia.png";
import nokhatech from "../Assets/nokhatech.png";
import Dc from "../Assets/Dc.jpeg";
import Wadpack from "../Assets/Wadpack.png";
import Asw from "../Assets/Asw.png";
import Ficus from "../Assets/Ficus.jpg";
import Infotech from "../Assets/Infotech.png";
import Riyo from "../Assets/Riyo.png";
import Medimind from "../Assets/Medimind.png";
import Techteam from "../Assets/Techteam.png";

import Getintouch from './Getintouch';

function Clients() {
  const logos = [
    Wadpack, Asw, Ficus, thinkgrey, Medimind, Ecologo, nokhatech,
    degefy, socialmedia, Soul, Dc, Infotech, Riyo, Techteam
  ];

  // Remove Medimind from second scroll logos explicitly
  const secondScrollLogos = logos.filter(logo => logo !== Medimind);
  const evenSecondScrollLogos = secondScrollLogos.filter((_, index) => index % 2 === 0);
  const extendedEvenLogos = [...evenSecondScrollLogos, secondScrollLogos[1]];

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <motion.div
        className="bg-blue-500 px-8 py-4 h-24"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0 }}
      >
        <h1 className="text-white text-4xl font-bold ml-4 md:ml-28">Our Clients</h1>
      </motion.div>

      <div className="px-6 md:px-20 py-12">
        {/* First Scroll: All Logos */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Clients Who Believed in Us
          </h2>

          <div className="relative overflow-hidden bg-white rounded-xl shadow-lg py-8">
            <motion.div
              className="flex"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 60,
                  ease: "linear",
                },
              }}
              style={{
                width: `${(logos.length * 2) * 220}px`,
              }}
            >
              {logos.concat(logos).map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center justify-center p-4 bg-gray-50 border shadow-sm rounded-lg min-w-[200px] h-32 mx-2"
                >
                  <img
                    src={logo}
                    alt={`Client logo ${index + 1}`}
                    className="h-20 w-auto max-w-full object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Second Scroll: Even Index Logos (without Medimind) + 1 more */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            {/* Strategic Collaborations */}
          </h2>

          <div className="relative overflow-hidden bg-white rounded-xl shadow-lg py-8">
            <motion.div
              className="flex"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 60,
                  ease: "linear",
                },
              }}
              style={{
                width: `${(extendedEvenLogos.length * 2) * 220}px`,
              }}
            >
              {extendedEvenLogos.concat(extendedEvenLogos).map((logo, index) => (
                <div
                  key={`even-${index}`}
                  className="flex-shrink-0 flex items-center justify-center p-4 bg-gray-50 border shadow-sm rounded-lg min-w-[200px] h-32 mx-2"
                >
                  <img
                    src={logo}
                    alt={`Even logo ${index}`}
                    className="h-20 w-auto max-w-full object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Sectors We Serve Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Sectors We Serve
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="space-y-4">
              {[
                "IT & Software Development",
                "Digital Marketing",
                "Manufacturing",
                "Sales & Marketing",
                "Banking & Insurance"
              ].map((sector, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg">{sector}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                "Business Services",
                "Interior Designing",
                "Construction",
                "Entertainment & Amusement Park",
                "Customer Support"
              ].map((sector, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg">{sector}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Get in Touch Section */}
      <div className="w-full max-w-screen-2xl mx-auto">
        <Getintouch />
      </div>
    </div>
  );
}

export default Clients;
