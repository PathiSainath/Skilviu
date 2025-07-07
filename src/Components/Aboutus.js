import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import Framer Motion for animations
import about from "../Assets/about.jpeg";
import Hr1 from "../Assets/Hr1.png";
import naveenkumar from "../Assets/naveenkumar.png";
import prem from "../Assets/prem.jpeg";
import avatar from "../Assets/avatar.png";
import Getintouch from './Getintouch';
// import lokesh from "../Assets/lokesh.jpeg";
// import sravani from "../Assets/sravani.jpeg";
// import naveena from "../Assets/naveena.jpeg";
// import maneeja from "../Assets/maneeja.jpeg";
// import Mansvi from "../Assets/Mansvi.jpeg";

// Team Data
const teamMembers = [
  { name: "Mr. Naveen Kumar Indla", title: "CEO & Managing Director", image: naveenkumar },
  { name: "Mrs. Sandhya Rani", title: "Managing Director", image: avatar },
  { name: "Mr. Premanath Tirumal Raju", title: "HR Director", image: prem },
  // { name: "Mrs. Sravani", title: "Head of Customer Relations", image: sravani },
  // { name: "Mrs. Naveena P", title: "Human Resources & Administrative Executive", image: naveena },
  // { name: "Ms. Maneeja", title: "Human Resources Coordinator", image: maneeja },
  // { name: "Ms. Manaswi", title: "Business Developer", image: Mansvi },
  // { name: "Mr. Lokesh", title: "Accounts Admin", image: lokesh },
];

// Team Profile Component
const TeamProfile = () => {
  const getProfileLink = (name) => {
    switch (name) {
      case "Mr. Naveen Kumar Indla":
        return "/profile1";
      case "Mrs. Sandhya Rani":
        return "/profile2";
      case "Mr. Premanath Tirumal Raju":
        return "/profile3";
      case "Mrs. Sravani":
        return "/profile4";
      case "Mrs. Naveena P":
        return "/profile5";
      case "Ms. Maneeja":
        return "/profile6";
      case "Ms. Manaswi":
        return "/profile7";
      case "Mr. Lokesh":
        return "/profile8";
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 py-10 px-5">
      <motion.h2
        className="text-3xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }} // Slower transition
        viewport={{ once: true, amount: 0.1 }} // Faster trigger
      >
        Meet Our Team
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {teamMembers.map((member, index) => {
          const profileLink = getProfileLink(member.name);
          return (
            <motion.div
              key={index}
              className="flex items-center bg-white rounded-2xl shadow-md p-4 gap-4 transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
              initial={{ opacity: 0, x: 100 }} // All items come from right to left
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }} // Slower transition
              viewport={{ once: true, amount: 0.1 }} // Faster trigger
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 object-cover rounded-full shadow-md flex-shrink-0"
              />
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.title}</p>
                {profileLink ? (
                  <Link
                    to={profileLink}
                    className="mt-2 text-blue-500 text-sm hover:underline inline-block"
                  >
                    Read more →
                  </Link>
                ) : (
                  <button className="mt-2 text-blue-500 text-sm hover:underline">
                    Read more →
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Aboutus Page
function Aboutus() {
  const steps = [
    { icon: "📁", title: "Understanding Client Requirements" },
    { icon: "🛣️", title: "Design Road Map To Clients Requirements" },
    { icon: "🧭", title: "Skill Mapping With Identified Resources" },
    { icon: "📝", title: "Interview Process" },
    { icon: "✅", title: "On Boarding Process" },
  ];

  return (
    <div className="bg-gray-100 text-gray-800 font-sans">
      {/* Header Section */}
      <motion.div
        className="bg-blue-500 px-8 py-4"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }} // Slower transition
        viewport={{ once: true, amount: 0.1 }} // Faster trigger
      >
        <h1 className="h-16 text-white text-4xl font-bold ml-28">About Us</h1>
      </motion.div>

      {/* About Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }} // Slower transition
          viewport={{ once: true, amount: 0.1 }}
        >
          <p className="text-gray-600 mb-6">
            Join us at Skilviu, where innovation meets integrity, and talent meets opportunity
          </p>
          <p className="mb-6">
            Our staffing and recruitment process uniquely combines deep industry expertise and forward-thinking vision. We’re dedicated to not just sourcing talented and capable individuals who meet your needs but also to forming a reliable partnership that supports your organization’s long-term success.
          </p>
          <div className="border-l-4 border-blue-600 bg-white p-4 mb-8 shadow-sm">
            <em className="text-gray-700">
              We believe that skilled professionals are the key architects of organization success and exponential growth
            </em>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Why choose Skilviu</h2>
          <p>
            We harness state-of-the-art technology to meticulously pinpoint top-tier talent, ensuring we find the best fit for your organization’s unique needs. Our advanced algorithms and data-driven approach streamline the recruitment process.
          </p>
        </motion.div>

        {/* Right Image - About */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }} // Slower transition
          viewport={{ once: true, amount: 0.1 }}
        >
          <img
            src={about}
            alt="About Skilviu"
            className="shadow-md max-w-[70%] h-auto"
          />
        </motion.div>
      </div>

      {/* Hiring Process Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        {/* Left Side - Image */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }} // Slower transition
          viewport={{ once: true, amount: 0.1 }}
        >
          <img
            src={Hr1}
            alt="Hiring Process Illustration"
            className="shadow-md mt-5 mr-8 max-w-[80%] h-auto"
          />
        </motion.div>

        {/* Right Side - Steps */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }} // Slower transition
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="text-3xl ml-5 font-semibold mb-8">Our Hiring Process</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 h-12 ml-5 bg-blue-500 text-white text-2xl flex items-center justify-center rounded-full shadow-md">
                  {step.icon}
                </div>
                <p className="text-lg font-semibold text-gray-800">{step.title}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <motion.h2
          className="text-3xl font-semibold mb-4"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }} // Slower transition
          viewport={{ once: true, amount: 0.1 }}
        >
          Introducing the Skilviu Soft Solutions Team
        </motion.h2>
        <motion.p
          className="text-lg text-gray-700 mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }} // Slower transition
          viewport={{ once: true, amount: 0.1 }}
        >
          At Skilviu Soft Solutions, we take immense pride in our highly skilled and dedicated team, committed to delivering exceptional services and innovative solutions. Each member brings a unique set of skills and experiences, enabling us to achieve excellence in every project we undertake.
        </motion.p>

        {/* Team Profiles */}
        <TeamProfile />

        {/* Commitment Section */}
        <div className="mt-12 w-full max-w-5xl mx-auto">
          <motion.h3
            className="text-2xl font-semibold text-gray-900 mb-2 w-full"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }} // Slower transition
            viewport={{ once: true, amount: 0.1 }}
          >
            Our Commitment
          </motion.h3>
          <motion.p
            className="text-base md:text-lg text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }} // Slower transition
            viewport={{ once: true, amount: 0.1 }}
          >
            At Skilviu Soft Solutions, we are committed to delivering high-quality services and solutions to our clients. Our team’s collective expertise and dedication drive us to achieve excellence in every aspect of our work. We are passionate about what we do, and we strive to exceed our clients’ expectations with each project.
          </motion.p>
        </div>

        {/* <div className="w-full max-w-screen-2xl mx-auto">
          <Getintouch />
        </div> */}

      </div>
    </div>
  );
}

export default Aboutus;
