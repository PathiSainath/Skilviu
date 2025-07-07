// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { ArrowRightCircle } from 'lucide-react';

// import bg1 from '../Assets/bg-slider.jpg';
// import bg2 from '../Assets/bg-slider1.jpg';
// import Testimonials from './Testimonials';
// import VisionMission from './VisionMission';
// import home from "../Assets/home.jpg";
// import staffing from "../Assets/it-non-it.jpg";
// import payroll from "../Assets/payroll.jpg";
// import staturity from "../Assets/staturity.jpg";
// import network from "../Assets/human-capital.jpg";
// import Getintouch from './Getintouch';

// export default function Home() {
//   const slides = [
//     {
//       image: bg1,
//       title: 'EXPERT HR SOLUTIONS FOR MODERN BUSINESSES',
//       subtitle: 'Our team of professionals is committed to providing exceptional and tailored service.',
//     },
//     {
//       image: bg2,
//       title: 'EMPOWERING FUTURE WITH SKILVIU',
//       subtitle: 'We help you grow with innovative workforce strategies and smart HR tools.',
//     },
//   ];

//   const serviceList = [
//     {
//       title: 'Staffing Services',
//       img: staffing,
//       link: "/Staffing",
//     },
//     {
//       title: 'Payroll Services',
//       img: payroll,
//       link: "/Payroll",
//     },
//     {
//       title: 'IT Hardware Asset Management',
//       img: staturity,
//       link: "/Itmanagement",
//     },
//     {
//       title: 'IT Network Design, Implementation & Support',
//       img: network,
//       link: "/network",
//     },
//   ];

//   const textVariants = {
//     hidden: { opacity: 0, x: -60 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
//   };

//   const buttonVariants = {
//     hidden: { opacity: 0, y: 40 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } },
//   };

//   const leftSlideVariants = {
//     hidden: { opacity: 0, x: -60 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
//   };

//   const rightSlideVariants = {
//     hidden: { opacity: 0, x: 60 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
//   };

//   const serviceVariants = {
//     hidden: { opacity: 0, x: 60 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
//   };

//   return (
//     <div className="w-full">
//       {/* Swiper Section */}
//       <div className="h-screen">
//         <Swiper
//           pagination={{ clickable: true }}
//           modules={[Pagination]}
//           loop
//           className="w-full h-full"
//         >
//           {slides.map((slide, index) => (
//             <SwiperSlide key={index}>
//               <div
//                 className="relative w-full h-screen bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
//                 style={{ backgroundImage: `url(${slide.image})` }}
//               >
//                 <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none digital-noise z-0"></div>

//                 <motion.h1
//                   className="text-white text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg max-w-3xl z-10"
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   variants={textVariants}
//                 >
//                   {slide.title}
//                 </motion.h1>

//                 <motion.p
//                   className="text-white text-lg md:text-xl mb-6 drop-shadow-md max-w-2xl z-10"
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   variants={textVariants}
//                 >
//                   {slide.subtitle}
//                 </motion.p>

//                 <motion.button
//                   className="z-10 bg-blue-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition"
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   variants={buttonVariants}
//                 >
//                   CONTACT US <span className="ml-2">{">"}</span>
//                 </motion.button>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* About Us Section */}
//       <section className="bg-white px-6 py-12 md:py-20 md:px-12">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={leftSlideVariants}
//           >
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
//               About <span className="text-blue-600">Us</span>
//             </h2>
//             <p className="text-gray-700 mb-4">
//               At Skilviu, we pride ourselves on being agile in nature, adapting quickly to the ever-evolving business landscape to meet your unique needs...
//             </p>
//             <p className="text-gray-700 mb-4">
//               Our commitment to core values underpins everything we do...
//             </p>
//             <p className="text-gray-700 mb-4">
//               By committing to these principles, we ensure that every interaction and placement reflects our dedication...
//             </p>
//             <p className="text-gray-700 mb-4">
//               At Skilviu Soft Solutions, we understand that every organization’s success is driven by skilled professionals.
//               As a forward-thinking startup specializing in Staffing, Payroll, IT Asset Management, and IT Networking services,
//               our mission is to support our client’s growth and efficiency by providing tailored and high-quality solutions.
//             </p>
//             <Link
//               to="/about"
//               className="inline-block bg-blue-600 text-white px-6 py-2 rounded transform transition duration-300 ease-in-out hover:bg-blue-700 hover:scale-105"
//             >
//               READ MORE
//             </Link>
//           </motion.div>

//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={rightSlideVariants}
//           >
//             <img
//               src={home}
//               alt="Team working with data charts in a meeting room"
//               className="w-5/6 h-auto shadow-md mx-auto"
//             />
//           </motion.div>
//         </div>
//       </section>

//       {/* Vision & Mission Section */}
//       <VisionMission />

//       {/* Services Section */}
//       <div className="w-full py-16 bg-gray-100 text-black">
//         <motion.h2
//           className="text-center text-3xl font-bold mb-6 text-blue-700"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={serviceVariants}
//         >
//           Our Services
//         </motion.h2>
//         <motion.p
//           className="text-center text-lg mb-10 -mt-2"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={serviceVariants}
//         >
//           We are providing world-class service to our clients.
//         </motion.p>

//         <div className="max-w-7xl mx-auto px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
//           {serviceList.map((service, index) => (
//             <motion.div
//               key={index}
//               className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               variants={serviceVariants}
//             >
//               <Link to={service.link} className="relative block group cursor-pointer">
//                 <img
//                   src={service.img}
//                   alt={service.title}
//                   className="w-full h-56 object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-center items-center">
//                   <span className="text-white text-6xl font-thin">+</span>
//                 </div>
//               </Link>
//               <div className="p-5">
//                 <h2 className="text-lg font-semibold mb-2">{service.title}</h2>
//                 <Link
//                   to={service.link}
//                   className="text-blue-600 font-medium flex items-center gap-2 hover:underline"
//                 >
//                   <ArrowRightCircle className="w-4 h-4 text-sky-500" />
//                   Read More
//                 </Link>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <motion.div
//           className="flex justify-center mt-10"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={buttonVariants}
//         >
//           <Link
//             to="/services"
//             className="bg-blue-600 text-white px-8 py-3 rounded-md text-sm font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105"
//           >
//             Read More Services
//           </Link>
//         </motion.div>
//       </div>

//       {/* Testimonials Section */}
//       <div className="mt-0">
//         <Testimonials />
//       </div>

//       <div className="mt-0">
//         <Getintouch />
//       </div>

//     </div>
//   );
// }




import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightCircle } from 'lucide-react';

// Assets
import bg1 from '../Assets/bg-slider.jpg';
import bg2 from '../Assets/bg-slider1.jpg';
import home from "../Assets/home.jpg";
import staffing from "../Assets/it-non-it.jpg";
import payroll from "../Assets/payroll.jpg";
import staturity from "../Assets/staturity.jpg";
import network from "../Assets/human-capital.jpg";

// Components
import Testimonials from './Testimonials';
import VisionMission from './VisionMission';
import Getintouch from './Getintouch';

export default function Home() {
  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } }
  };

  const slideVariants = {
    left: {
      hidden: { opacity: 0, x: -60 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
    },
    right: {
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
    }
  };

  // Data
  const slides = [
    {
      image: bg1,
      title: 'EXPERT HR SOLUTIONS FOR MODERN BUSINESSES',
      subtitle: 'Our team of professionals is committed to providing exceptional and tailored service.',
    },
    {
      image: bg2,
      title: 'EMPOWERING FUTURE WITH SKILVIU',
      subtitle: 'We help you grow with innovative workforce strategies and smart HR tools.',
    },
  ];

  const services = [
    {
      title: 'Staffing Services',
      img: staffing,
      link: "/staffing",
    },
    {
      title: 'Payroll Services',
      img: payroll,
      link: "/payroll",
    },
    {
      title: 'IT Hardware Asset Management',
      img: staturity,
      link: "/itmanagement",
    },
    {
      title: 'IT Network Design, Implementation & Support',
      img: network,
      link: "/network",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Slider Section */}
      <section className="h-screen">
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination]}
          loop
          className="w-full h-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div 
                className="relative w-full h-screen bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none digital-noise z-0" />
                
                <motion.h1
                  className="text-white text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg max-w-3xl z-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={textVariants}
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  className="text-white text-lg md:text-xl mb-8 drop-shadow-md max-w-2xl z-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={textVariants}
                >
                  {slide.subtitle}
                </motion.p>

                <motion.button
                  className="z-10 bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-md font-semibold transition-all duration-300"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={buttonVariants}
                  onClick={() => window.location.href = '/contact'} // Update with your preferred routing method
                >
                  CONTACT US <span className="ml-2">&gt;</span>
                </motion.button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* About Us Section */}
      <section className="bg-white py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideVariants.left}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              About <span className="text-blue-600">Us</span>
            </h2>
            <div className="space-y-4 text-gray-700 mb-6">
              <p>At Skilviu, we pride ourselves on being agile in nature, adapting quickly to the ever-evolving business landscape to meet your unique needs.</p>
              <p>Our commitment to core values underpins everything we do.</p>
              <p>By committing to these principles, we ensure that every interaction and placement reflects our dedication.</p>
              <p>At Skilviu Soft Solutions, we understand that every organization's success is driven by skilled professionals. As a forward-thinking startup specializing in Staffing, Payroll, IT Asset Management, and IT Networking services, our mission is to support our client's growth and efficiency by providing tailored and high-quality solutions.</p>
            </div>
            <Link
              to="/about"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-all duration-300 hover:scale-105"
            >
              READ MORE <span className="ml-2">&gt;</span>
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideVariants.right}
            className="flex justify-center"
          >
            <img
              src={home}
              alt="Team working together"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <VisionMission />

      {/* Services Section */}
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariants}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-700 mb-2">Our Services</h2>
            <p className="text-gray-600">We provide world-class services to our clients</p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideVariants.right}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 h-full flex flex-col">
                  <Link to={service.link} className="relative block group">
                    <img
                      src={service.img}
                      alt={service.title}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                      <span className="text-white text-4xl">+</span>
                    </div>
                  </Link>
                  <div className="p-6 flex-grow">
                    <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                    <Link
                      to={service.link}
                      className="text-blue-600 font-medium inline-flex items-center gap-2 hover:underline"
                    >
                      <ArrowRightCircle className="w-4 h-4" />
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex justify-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={buttonVariants}
          >
            <Link
              to="/services"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium uppercase tracking-wide transition-all duration-300 hover:scale-105"
            >
              View All Services <span className="ml-2">&gt;</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Get in Touch Section */}
      <Getintouch />
    </div>
  );
}