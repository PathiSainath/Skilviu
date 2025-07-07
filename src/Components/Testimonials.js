import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Giridhar Vysetty',
    text: `Skilviu Soft Solutions proved to be a valuable partner in our talent acquisition journey. They went beyond traditional recruitment, providing insightful industry trends and strategic hiring advice. Srinivas Manney’s dedication and expertise were instrumental in securing a top-notch candidate. We’re grateful for their exceptional service.`,
  },
  {
    name: 'Vysetty Sridhar',
    text: `Skilviu Soft Solutions exceeded my expectations. They quickly grasped our unique hiring needs and provided a pool of highly qualified candidates. Special thanks to Naveen Kumar Indla for his guidance throughout the recruitment process, ensuring a seamless transition for our new hire. I highly recommend their services to other businesses.`,
  },
];

const Testimonials = () => {
  // Variants for animation
  const textBoxVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const textBoxRightVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className="bg-gray-100 py-12 px-4">
      {/* Heading with threshold effect */}
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-center mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}  // Ensure it triggers only once when in view
        variants={headingVariants}
      >
        Our Partners Says
      </motion.h2>

      {/* Testimonial Cards with threshold effect */}
      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}  // Trigger animation when 25% of the element is in view
            variants={index % 2 === 0 ? textBoxVariants : textBoxRightVariants}
          >
            <p className="text-gray-700 mb-6">{testimonial.text}</p>
            <div className="text-cyan-500 text-4xl mb-2">”</div>
            <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
