// import React, { useState } from 'react';

// const defaultFormData = {
//   candidateName: '',
//   email: '',
//   mobile: '',
//   currentCompany: '',
//   yearsOfExperience: '',
//   relevantExperience: '',
//   currentCTC: '',
//   expectedCTC: '',
//   noticePeriod: '',
//   currentLocation: '',
//   preferredLocation: '',
//   availableForInterview: '',
//   preferredCompany: '',
//   hasPreferredCompany: '',
//   remarks: '',
//   resume: null,
// };

// function Candidateform() {
//   const [formData, setFormData] = useState(defaultFormData);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;

//     if (name === 'mobile') {
//       const digitsOnly = value.replace(/\D/g, '');
//       if (digitsOnly.length <= 10) {
//         setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
//       }
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: type === 'file' ? files[0] : value,
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value) data.append(key, value);
//     });

//     try {
//       const response = await fetch('https://skilviu.com/backend/api/v1/candidates', {
//         method: 'POST',
//         body: data,
//       });

//       if (!response.ok) throw new Error('Form submission failed.');

//       const result = await response.json();
//       console.log('Success:', result);
//       alert('Form submitted successfully!');
//       setFormData(defaultFormData);
//     } catch (error) {
//       console.error(error);
//       alert('There was an error submitting the form.');
//     }
//   };

//   const inputFields = [
//     { label: 'Candidate Name', name: 'candidateName', type: 'text', required: true },
//     { label: 'Email ID', name: 'email', type: 'email', required: true },
//     { label: 'Mobile Number', name: 'mobile', type: 'tel', maxLength: 10, required: true },
//     { label: 'Current Company', name: 'currentCompany', type: 'text', required: true },
//     { label: 'Years of Experience', name: 'yearsOfExperience', type: 'number', required: true },
//     { label: 'Relevant Experience', name: 'relevantExperience', type: 'number', required: true },
//     { label: 'Current CTC', name: 'currentCTC', type: 'text' },
//     { label: 'Expected CTC', name: 'expectedCTC', type: 'text' },
//     { label: 'Notice Period', name: 'noticePeriod', type: 'text', required: true },
//     { label: 'Current Location', name: 'currentLocation', type: 'text', required: true },
//     { label: 'Preferred Location', name: 'preferredLocation', type: 'text' },
//     { label: 'Available for Interview', name: 'availableForInterview', type: 'text' },
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
//           🧾 Candidate Form
//         </h1>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {inputFields.map(({ label, name, type, maxLength, required }) => (
//             <div key={name} className="flex flex-col">
//               <label htmlFor={name} className="mb-2 text-sm font-semibold text-gray-700">
//                 {label} {required && <span className="text-red-500">*</span>}
//               </label>
//               <input
//                 id={name}
//                 name={name}
//                 type={type}
//                 value={formData[name]}
//                 onChange={handleChange}
//                 maxLength={maxLength}
//                 required={required}
//                 className="border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           ))}

//           {/* Remarks */}
//           <div className="md:col-span-2 flex flex-col">
//             <label htmlFor="remarks" className="mb-2 text-sm font-semibold text-gray-700">
//               Remarks
//             </label>
//             <textarea
//               id="remarks"
//               name="remarks"
//               rows={3}
//               value={formData.remarks}
//               onChange={handleChange}
//               className="border border-gray-300 rounded-md px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Resume Upload */}
//           <div className="md:col-span-2 flex flex-col">
//             <label htmlFor="resume" className="mb-2 text-sm font-semibold text-gray-700">
//               CV / Resume Attachment <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="resume"
//               name="resume"
//               type="file"
//               accept=".pdf,.doc,.docx"
//               onChange={handleChange}
//               required
//               className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Accepted format: PDF, DOC, DOCX. Max size: 2MB.
//             </p>
//           </div>

//           {/* Preferred Company Section */}
//           <div className="md:col-span-2 flex flex-col">
//             <label className="mb-2 text-sm font-semibold text-gray-700">
//               Would you like to apply for other preferred company?
//             </label>
//             <div className="flex gap-6 mb-4">
//               {['yes', 'no'].map((val) => (
//                 <label key={val} className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="hasPreferredCompany"
//                     value={val}
//                     checked={formData.hasPreferredCompany === val}
//                     onChange={() =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         hasPreferredCompany: val,
//                         ...(val === 'no' ? { preferredCompany: '' } : {}),
//                       }))
//                     }
//                     className="text-indigo-600 focus:ring-indigo-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">
//                     {val === 'yes' ? 'Yes' : 'No'}
//                   </span>
//                 </label>
//               ))}
//             </div>

//             {formData.hasPreferredCompany === 'yes' && (
//               <div className="flex flex-col">
//                 <label htmlFor="preferredCompany" className="mb-2 text-sm font-semibold text-gray-700">
//                   Preferred Company Name
//                 </label>
//                 <input
//                   id="preferredCompany"
//                   name="preferredCompany"
//                   type="text"
//                   value={formData.preferredCompany}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div className="md:col-span-2 flex justify-end mt-6">
//             <button
//               type="submit"
//               className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Candidateform;




import React, { useState, useEffect, useRef } from 'react';

const defaultFormData = {
  job_id: '',
  candidate_name: '',
  email: '',
  mobile_number: '',
  current_company: '',
  years_experience: '',
  relevant_experience: '',
  current_ctc: '',
  expected_ctc: '',
  notice_period: '',
  current_location: '',
  preferred_location: '',
  available_for_interview: '',
  preferred_company: '',
  has_preferred_company: '',
  remarks: '',
  resume: null,
};

function CandidateFormPage() {
  const [formData, setFormData] = useState(defaultFormData);
  const [jobs, setJobs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const resumeRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://skilviu.com/backend/api/v1/recruitments');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error(error);
        alert('Failed to load job listings.');
      }
    };
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === 'mobile_number') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'file' ? files[0] : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSubmitSuccess(false);

    if (!formData.resume) {
      setErrors((prev) => ({ ...prev, resume: ['Resume file is required.'] }));
      setIsSubmitting(false);
      return;
    }

    if (formData.resume.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: ['Resume must be under 2MB.'] }));
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        data.append(key === 'resume' ? 'resume' : key, value);
      }
    });

    try {
      const response = await fetch('https://skilviu.com/backend/api/v1/candidates', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(result.errors || {});
        } else {
          alert(result.message || 'Something went wrong.');
        }
        throw new Error('Submission failed.');
      }

      setSubmitSuccess(true);
      setFormData(defaultFormData);
      if (resumeRef.current) resumeRef.current.value = null;
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    { label: 'Candidate Name', name: 'candidate_name', type: 'text', required: true },
    { label: 'Email ID', name: 'email', type: 'email', required: true },
    { label: 'Mobile Number', name: 'mobile_number', type: 'tel', maxLength: 10, required: true },
    { label: 'Current Company', name: 'current_company', type: 'text' },
    { label: 'Years of Experience', name: 'years_experience', type: 'number' },
    { label: 'Relevant Experience', name: 'relevant_experience', type: 'number' },
    { label: 'Current CTC', name: 'current_ctc', type: 'text' },
    { label: 'Expected CTC', name: 'expected_ctc', type: 'text' },
    { label: 'Notice Period', name: 'notice_period', type: 'text' },
    { label: 'Current Location', name: 'current_location', type: 'text', required: true },
    { label: 'Preferred Location', name: 'preferred_location', type: 'text' },
    { label: 'Available for Interview', name: 'available_for_interview', type: 'date' },
  ];

  const getFieldError = (field) =>
    errors[field] && <div className="text-red-500 text-xs mt-1">{errors[field][0]}</div>;

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">🧾 Candidate Form</h1>

        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            Candidate submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="job_id" className="mb-2 text-sm font-semibold text-gray-700">
              Select Job <span className="text-red-500">*</span>
            </label>
            <select
              id="job_id"
              name="job_id"
              value={formData.job_id}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-4 py-3 text-sm"
            >
              <option value="">Select a job</option>
              {jobs.map((job) => (
                <option key={job.job_id} value={job.job_id}>
                  {job.job_title} (Job ID: {job.job_id})
                </option>
              ))}
            </select>
            {getFieldError('job_id')}
          </div>

          {inputFields.map(({ label, name, type, required, maxLength }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="mb-2 text-sm font-semibold text-gray-700">
                {label}
                {required && <span className="text-red-500"> *</span>}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                maxLength={maxLength}
                required={required}
                className="border border-gray-300 rounded-md px-4 py-3 text-sm"
              />
              {getFieldError(name)}
            </div>
          ))}

          {/* Remarks */}
          <div className="md:col-span-2 flex flex-col">
            <label htmlFor="remarks" className="mb-2 text-sm font-semibold text-gray-700">
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              rows={3}
              value={formData.remarks}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-3 text-sm resize-y"
            />
            {getFieldError('remarks')}
          </div>

          {/* Resume Upload */}
          <div className="md:col-span-2 flex flex-col">
            <label htmlFor="resume" className="mb-2 text-sm font-semibold text-gray-700">
              CV / Resume Attachment <span className="text-red-500">*</span>
            </label>
            <input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              ref={resumeRef}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Accepted format: PDF, DOC, DOCX (max 2MB)</p>
            {getFieldError('resume')}
          </div>

          {/* Preferred Company */}
          <div className="md:col-span-2 flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Would you like to apply for another preferred company?
            </label>
            <div className="flex gap-6 mb-4">
              {['yes', 'no'].map((value) => (
                <label key={value} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="has_preferred_company"
                    value={value}
                    checked={formData.has_preferred_company === value}
                    onChange={handleChange}
                    className="text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">{value === 'yes' ? 'Yes' : 'No'}</span>
                </label>
              ))}
            </div>
            {getFieldError('has_preferred_company')}

            {formData.has_preferred_company === 'yes' && (
              <div className="flex flex-col">
                <label htmlFor="preferred_company" className="mb-2 text-sm font-semibold text-gray-700">
                  Preferred Company Name
                </label>
                <input
                  id="preferred_company"
                  name="preferred_company"
                  type="text"
                  value={formData.preferred_company}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-3 text-sm"
                />
                {getFieldError('preferred_company')}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CandidateFormPage;
