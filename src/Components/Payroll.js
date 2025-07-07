import React from 'react';
import { motion } from 'framer-motion';
import payrollImage from '../Assets/payroll.gif';

function Payroll() {
  return (
    <div className="bg-gray-100 text-gray-800 font-sans">
      {/* Header */}
      <div className="bg-blue-500 px-8 py-4">
        <h1 className="h-16 text-white text-4xl font-bold ml-28">Payroll Services</h1>
      </div>

      {/* Content Section */}
      <div className="bg-white text-gray-800 font-sans px-8 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left Content */}
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
                Transforming payroll complexity into clarity, one paycheck at a time.
              </motion.p>
            </div>

            {/* Description */}
            <motion.p
              className="mb-6 leading-relaxed text-justify"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Payroll is a fundamental aspect of every organization, directly impacting employee satisfaction and overall operational efficiency. At Skilviu, we recognize that payroll encompasses more than just distributing salaries; it’s about guaranteeing that employees are compensated accurately and on time, reflecting their hard work and dedication. Our meticulous approach to payroll management ensures that every detail is handled with precision and punctuality. By prioritizing accuracy and timeliness, we aim to build trust and reliability, underscoring our commitment to excellence in every facet of our services.
            </motion.p>

            {/* Services List */}
            <motion.h2
              className="text-xl font-semibold mb-4"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Our Payroll Services Include:
            </motion.h2>
            <motion.ul
              className="list-decimal ml-6 space-y-2 text-gray-700"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <li>
                <strong>Payroll Processing:</strong> Comprehensive payroll calculations, including wages, deductions, and benefits.
              </li>
              <li>
                <strong>Tax Management:</strong> Calculation, filing, and remittance of payroll taxes, ensuring compliance with all tax obligations.
              </li>
              <li>
                <strong>Employee Self-Service Portal:</strong> A user-friendly portal where employees can access their payslips, tax documents, and personal information.
              </li>
              <li>
                <strong>Reporting and Analytics:</strong> Detailed payroll reports that provide insights into labor costs, overtime, and more to help you make informed decisions.
              </li>
              <li>
                <strong>Year-End Services:</strong> Preparation and distribution of W-2s and other necessary year-end tax documents for your employees.
              </li>
            </motion.ul>
          </motion.div>

          {/* Right Side - Image and Paragraph */}
          <motion.div
            className="flex flex-col items-center space-y-6"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={payrollImage}
              alt="Payroll Illustration"
              className="w-full max-w-md h-auto object-contain"
            />
            <motion.p
              className="text-justify text-gray-700"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Partner with Skilviu for your Payroll Services and experience peace of mind knowing your payroll is in expert hands. We’re committed to helping you create a smooth payroll experience that supports your workforce and contributes to your organization’s success!
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Payroll;
