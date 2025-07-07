// import React from 'react';
// import { motion } from 'framer-motion';
// import staffing from "../Assets/staffing.gif";
// import Executivesearch from "../Assets/Executivesearch.png";

// function Staffing() {
//   return (
//     <div className="bg-gray-100 text-gray-800 font-sans">
//       {/* Header */}
//       <div className="bg-blue-500 px-8 py-4">
//         <h1 className="h-16 text-white text-4xl font-bold ml-28">Staffing Service</h1>
//       </div>

//       {/* Staffing Details Section */}
//       <div className="bg-white text-gray-800 font-sans px-8 py-12">
//         {/* Tagline */}
//         <div className="border-l-4 border-blue-600 pl-4 mb-6">
//           <motion.p
//             className="italic text-gray-600 text-lg"
//             initial={{ x: -100, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.6 }}
//           >
//             Staffing solutions that transform potential into performance
//           </motion.p>
//         </div>

//         {/* Content Grid */}
//         <div className="grid md:grid-cols-2 gap-10 items-start">
//           {/* Left Content */}
//           <motion.div
//             initial={{ x: -100, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.6 }}
//           >
//             <p className="mb-6 leading-relaxed text-justify">
//               We see staffing as a crucial pillar for driving an organization’s
//               success. We understand that the right talent can propel your
//               business to new heights, and that’s why we prioritize both IT and
//               Non-IT staffing services. Our approach is not one-size-fits-all; we
//               take the time to understand your unique needs and tailor our
//               staffing solutions accordingly. Whether you’re looking for
//               technical experts to innovate your IT infrastructure or versatile
//               professionals to support your non-IT functions, our customized
//               solutions are designed to meet your specific requirements and
//               contribute to your long-term success.
//             </p>
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Our Current Services</h2>

//               <div className="space-y-6 text-gray-700">
//                 <div>
//                   <h3 className="text-lg font-bold text-blue-600 mb-2">PERMANENT STAFFING</h3>
//                   <p>
//                     We help organizations build strong, long-term teams by identifying and placing top-tier talent in permanent roles.
//                     Our thorough screening process ensures that candidates align with your company’s values, goals, and culture, resulting in stable and productive employment relationships.
//                   </p>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-bold text-blue-600 mb-2">CONTRACTUAL / C2H</h3>
//                   <p>
//                     Our Contractual and Contract-to-Hire (C2H) solutions provide the flexibility to scale your workforce based on project needs or budget.
//                     Whether you need specialists for short-term assignments or want to evaluate talent before making full-time offers, we provide reliable professionals ready to hit the ground running.
//                   </p>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-bold text-blue-600 mb-2">EXECUTIVE SEARCH</h3>
//                   <p className="mb-4">
//                     Our Executive Search service is tailored for leadership and niche roles that demand experienced, high-performing individuals.
//                     We conduct confidential and strategic recruitment to attract senior-level professionals who drive business innovation and strategic success.
//                   </p>

//                   {/* Image below EXECUTIVE SEARCH */}
//                   <div className="w-full px-2 sm:px-4 md:px-0">
//                     <img
//                       src={Executivesearch}
//                       alt="Recruitment Process Flowchart"
//                       className="w-full max-w-3xl mx-auto rounded shadow-md"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Right Side - Image */}
//           <motion.div
//             className="flex justify-center"
//             initial={{ x: 100, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.6 }}
//           >
//             <img
//               src={staffing}
//               alt="Staffing Illustration"
//               className="w-full max-w-md h-auto object-contain"
//             />
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Staffing;


import React from 'react';
import { motion } from 'framer-motion';
import staffing from "../Assets/staffing.gif";
import Executivesearch from "../Assets/Executivesearch.png";
import Permanentstaffing from "../Assets/bg-slider1.jpg";
import Contractualstaffing from "../Assets/Contractualstaffing.png";

function Staffing() {
  return (
    <div className="bg-gray-100 text-gray-800 font-sans">
      {/* Header */}
      <div className="bg-blue-500 px-4 md:px-8 py-6">
        <h1 className="text-white text-3xl md:text-4xl font-bold ml-0 md:ml-28">Staffing Services</h1>
      </div>

      {/* Tagline and GIF */}
      <div className="bg-white px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text Section */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="border-l-4 border-blue-500 pl-4 mb-6">
              <h2 className="italic text-gray-700 text-lg">
                Staffing solutions that transform potential into performance
              </h2>
            </div>

            <motion.p
              className="leading-relaxed text-justify"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              In today's competitive landscape, aligning the right talent with the right opportunity is not just important—it's critical.
              Our staffing solutions are built to elevate your workforce with precision and purpose. We specialize in both IT and Non-IT domains,
              delivering custom recruitment strategies that match your culture and long-term vision.
            </motion.p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="flex justify-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={staffing}
              alt="Staffing Illustration"
              className="w-full max-w-sm md:max-w-md h-auto object-contain mt-6 md:mt-0"
            />
          </motion.div>
        </div>
      </div>

      {/* Permanent Staffing */}
      <div className="bg-gray-50 px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            className="flex justify-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src={Permanentstaffing} alt="Permanent Staffing" className="w-full max-w-sm md:max-w-md rounded shadow-lg" />
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-bold text-blue-600 mb-3">PERMANENT STAFFING</h3>
            <p className="leading-relaxed text-justify">
              Build the foundation of your organization with high-quality, permanent hires. Our team rigorously screens candidates to ensure a perfect fit for your company’s mission, culture, and vision.
              From tech specialists to corporate professionals, we help secure talent that’s not only skilled but also committed to your organization’s future.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contractual / C2H */}
      <div className="bg-white px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-bold text-blue-600 mb-3">CONTRACTUAL / C2H</h3>
            <p className="leading-relaxed text-justify">
              Flexibility is key in an evolving business environment. Our Contractual and Contract-to-Hire solutions offer agile staffing options—scale up or down with ease.
              We supply experienced professionals who are ready to contribute from day one, and you have the option to bring them on full-time once they prove to be the right fit.
            </p>
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src={Contractualstaffing} alt="Contractual Staffing" className="w-full max-w-sm md:max-w-md rounded shadow-lg" />
          </motion.div>
        </div>
      </div>

      {/* Executive Search */}
      <div className="bg-gray-50 px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            className="flex justify-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src={Executivesearch} alt="Executive Search" className="w-full max-w-sm md:max-w-md rounded shadow-lg" />
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-bold text-blue-600 mb-3">EXECUTIVE SEARCH</h3>
            <p className="leading-relaxed text-justify">
              Leadership shapes the future. Our Executive Search service is crafted for sourcing high-caliber leaders who bring vision, experience, and transformation.
              We conduct discreet and strategic recruitment to place individuals in key roles who will shape your business direction and build competitive advantages.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Staffing;
