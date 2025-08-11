// import React, { useState, useEffect, useRef } from 'react';

// function CandidateFormPage() {
//   const [formData, setFormData] = useState({
//     job_id: '',
//     candidate_name: '',
//     email: '',
//     mobile_number: '',
//     current_company: '',
//     years_experience: '',
//     relevant_experience: '',
//     current_ctc: '',
//     expected_ctc: '',
//     notice_period: '',
//     current_location: '',
//     preferred_location: '',
//     available_for_interview: '',
//     preferred_company: '',
//     has_preferred_company: '',
//     remarks: '',
//     resume_path: null,
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [jobs, setJobs] = useState([]);
//   const [isLoadingJobs, setIsLoadingJobs] = useState(true);
//   const resumeInputRef = useRef(null);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         setIsLoadingJobs(true);
//         const response = await fetch('https://skilviu.com/backend/api/v1/recruitments');
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
        
//         // Ensure data is an array, handle different response structures
//         if (Array.isArray(data)) {
//           setJobs(data);
//         } else if (data && Array.isArray(data.data)) {
//           setJobs(data.data);
//         } else if (data && Array.isArray(data.jobs)) {
//           setJobs(data.jobs);
//         } else {
//           console.warn('Unexpected API response structure:', data);
//           setJobs([]);
//         }
//       } catch (error) {
//         console.error('Error fetching jobs:', error);
//         setJobs([]); // Ensure jobs is always an array
//         alert('Unable to fetch jobs. Please try again later.');
//       } finally {
//         setIsLoadingJobs(false);
//       }
//     };
    
//     fetchJobs();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'file' ? files[0] : value,
//     }));

//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setErrors({});
//     setSubmitSuccess(false);

//     if (!formData.resume_path) {
//       setErrors(prev => ({ ...prev, resume: ['Resume file is required.'] }));
//       setIsSubmitting(false);
//       return;
//     }

//     if (formData.resume_path.size > 2 * 1024 * 1024) {
//       setErrors(prev => ({
//         ...prev,
//         resume: ['Resume must be smaller than 2MB.']
//       }));
//       setIsSubmitting(false);
//       return;
//     }

//     const formDataToSend = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value) {
//         if (key === 'resume_path') {
//           formDataToSend.append('resume', value, value.name); // backend expects 'resume'
//         } else {
//           formDataToSend.append(key, value);
//         }
//       }
//     });

//     try {
//       const response = await fetch('https://skilviu.com/backend/api/v1/candidates', {
//         method: 'POST',
//         body: formDataToSend,
//         headers: {
//           'Accept': 'application/json'
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         if (response.status === 422) {
//           setErrors(data.errors || {});
//         } else {
//           alert(data.message || 'Something went wrong. Please try again.');
//         }
//         throw new Error('Submission failed');
//       }

//       setSubmitSuccess(true);

//       setFormData({
//         job_id: '',
//         candidate_name: '',
//         email: '',
//         mobile_number: '',
//         current_company: '',
//         years_experience: '',
//         relevant_experience: '',
//         current_ctc: '',
//         expected_ctc: '',
//         notice_period: '',
//         current_location: '',
//         preferred_location: '',
//         available_for_interview: '',
//         preferred_company: '',
//         has_preferred_company: '',
//         remarks: '',
//         resume_path: null,
//       });

//       if (resumeInputRef.current) resumeInputRef.current.value = null;

//     } catch (error) {
//       console.error('Submission error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getFieldError = (fieldName) =>
//     errors[fieldName] ? (
//       <div className="text-red-500 text-xs mt-1">{errors[fieldName][0]}</div>
//     ) : null;

//   return (
//     <div className="min-h-screen bg-white py-10">
//       <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">🧾 Candidate Form</h1>

//         {submitSuccess && (
//           <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
//             Candidate submitted successfully!
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Job Dropdown */}
//           <div className="flex flex-col">
//             <label htmlFor="job_id" className="mb-2 text-sm font-semibold text-gray-700">
//               Select Job <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="job_id"
//               name="job_id"
//               value={formData.job_id}
//               onChange={handleChange}
//               required
//               disabled={isLoadingJobs}
//               className="border border-gray-300 rounded-md px-4 py-3 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
//             >
//               <option value="">
//                 {isLoadingJobs ? 'Loading jobs...' : 'Select a job'}
//               </option>
//               {Array.isArray(jobs) && jobs.map((job) => (
//                 <option key={job.job_id} value={job.job_id}>
//                   {job.job_title}
//                 </option>
//               ))}
//             </select>
//             {getFieldError('job_id')}
//             {!isLoadingJobs && jobs.length === 0 && (
//               <div className="text-amber-600 text-xs mt-1">
//                 No jobs available. Please try refreshing the page.
//               </div>
//             )}
//           </div>

//           {/* Text Inputs */}
//           {[
//             { label: 'Candidate Name', name: 'candidate_name', type: 'text', required: true },
//             { label: 'Email ID', name: 'email', type: 'email', required: true },
//             { label: 'Mobile Number', name: 'mobile_number', type: 'tel', required: true },
//             { label: 'Current Company', name: 'current_company', type: 'text' },
//             { label: 'Years of Experience', name: 'years_experience', type: 'number' },
//             { label: 'Relevant Experience', name: 'relevant_experience', type: 'number' },
//             { label: 'Current CTC', name: 'current_ctc', type: 'text' },
//             { label: 'Expected CTC', name: 'expected_ctc', type: 'text' },
//             { label: 'Notice Period', name: 'notice_period', type: 'text' },
//             { label: 'Current Location', name: 'current_location', type: 'text', required: true },
//             { label: 'Preferred Location', name: 'preferred_location', type: 'text' },
//             { label: 'Available for Interview', name: 'available_for_interview', type: 'date' },
//           ].map(({ label, name, type, required }) => (
//             <div key={name} className="flex flex-col">
//               <label htmlFor={name} className="mb-2 text-sm font-semibold text-gray-700">
//                 {label}{required && <span className="text-red-500"> *</span>}
//               </label>
//               <input
//                 id={name}
//                 name={name}
//                 type={type}
//                 value={formData[name]}
//                 onChange={handleChange}
//                 required={required}
//                 className="border border-gray-300 rounded-md px-4 py-3 text-sm"
//               />
//               {getFieldError(name)}
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
//               className="border border-gray-300 rounded-md px-4 py-3 text-sm resize-y"
//             />
//             {getFieldError('remarks')}
//           </div>

//           {/* Resume Upload */}
//           <div className="md:col-span-2 flex flex-col">
//             <label htmlFor="resume_path" className="mb-2 text-sm font-semibold text-gray-700">
//               CV / Resume Attachment <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="resume_path"
//               name="resume_path"
//               type="file"
//               accept=".pdf,.doc,.docx"
//               onChange={handleChange}
//               ref={resumeInputRef}
//               className="border border-gray-300 rounded-md px-4 py-2 text-sm"
//             />
//             <p className="text-xs text-gray-500 mt-1">Accepted format: PDF, DOC, DOCX (max 2MB)</p>
//             {getFieldError('resume')}
//           </div>

//           {/* Preferred Company */}
//           <div className="md:col-span-2 flex flex-col">
//             <label className="mb-2 text-sm font-semibold text-gray-700">
//               Would you like to apply for another preferred company?
//             </label>
//             <div className="flex gap-6 mb-4">
//               {['yes', 'no'].map((value) => (
//                 <label key={value} className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="has_preferred_company"
//                     value={value}
//                     checked={formData.has_preferred_company === value}
//                     onChange={handleChange}
//                     className="text-indigo-600"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">{value === 'yes' ? 'Yes' : 'No'}</span>
//                 </label>
//               ))}
//             </div>
//             {getFieldError('has_preferred_company')}

//             {formData.has_preferred_company === 'yes' && (
//               <div className="flex flex-col">
//                 <label htmlFor="preferred_company" className="mb-2 text-sm font-semibold text-gray-700">
//                   Preferred Company Name
//                 </label>
//                 <input
//                   id="preferred_company"
//                   name="preferred_company"
//                   type="text"
//                   value={formData.preferred_company}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded-md px-4 py-3 text-sm"
//                 />
//                 {getFieldError('preferred_company')}
//               </div>
//             )}
//           </div>

//           {/* Submit */}
//           <div className="md:col-span-2 flex justify-end mt-6">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               onClick={handleSubmit}
//               className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CandidateFormPage;





import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function CandidateFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get pre-filled data from navigation state
  const {
    preSelectedJobId,
    jobTitle,
    clientName,
    location: jobLocation,
    returnPath,
    shouldRefreshOnReturn
  } = location.state || {};

  const [formData, setFormData] = useState({
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
    resume_path: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const resumeInputRef = useRef(null);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoadingJobs(true);
        const response = await fetch('https://skilviu.com/backend/api/v1/recruitments');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Ensure data is an array, handle different response structures
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data && Array.isArray(data.data)) {
          setJobs(data.data);
        } else if (data && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          console.warn('Unexpected API response structure:', data);
          setJobs([]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
        alert('Unable to fetch jobs. Please try again later.');
      } finally {
        setIsLoadingJobs(false);
      }
    };
    
    fetchJobs();
  }, []);

  // Pre-fill form with data from navigation state
  useEffect(() => {
    if (preSelectedJobId && jobs.length > 0) {
      console.log('🔄 Pre-filling form with job:', { preSelectedJobId, jobTitle });
      
      // Find the matching job in the jobs array
      const matchingJob = jobs.find(job => 
        job.job_id === preSelectedJobId || 
        job.id === preSelectedJobId ||
        String(job.job_id) === String(preSelectedJobId) ||
        String(job.id) === String(preSelectedJobId)
      );

      if (matchingJob) {
        setFormData(prev => ({
          ...prev,
          job_id: matchingJob.job_id || matchingJob.id
        }));
        console.log('✅ Job pre-selected:', matchingJob.job_title);
      } else {
        console.warn('❌ No matching job found for ID:', preSelectedJobId);
        console.log('Available jobs:', jobs.map(j => ({ id: j.job_id || j.id, title: j.job_title })));
      }
    }
  }, [preSelectedJobId, jobs]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSubmitSuccess(false);

    if (!formData.resume_path) {
      setErrors(prev => ({ ...prev, resume: ['Resume file is required.'] }));
      setIsSubmitting(false);
      return;
    }

    if (formData.resume_path.size > 2 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        resume: ['Resume must be smaller than 2MB.']
      }));
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        if (key === 'resume_path') {
          formDataToSend.append('resume', value, value.name);
        } else {
          formDataToSend.append(key, value);
        }
      }
    });

    try {
      const response = await fetch('https://skilviu.com/backend/api/v1/candidates', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(data.errors || {});
        } else {
          alert(data.message || 'Something went wrong. Please try again.');
        }
        throw new Error('Submission failed');
      }

      setSubmitSuccess(true);
      console.log('✅ Candidate submitted successfully');

      // Clear form data
      setFormData({
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
        resume_path: null,
      });

      if (resumeInputRef.current) resumeInputRef.current.value = null;

      // Navigate back to the candidate status page with refresh flag
      setTimeout(() => {
        if (returnPath && shouldRefreshOnReturn) {
          console.log('🔄 Returning to:', returnPath);
          navigate(returnPath, {
            state: { refreshData: true }
          });
        } else {
          navigate('/hrteamdashboard/positions');
        }
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) =>
    errors[fieldName] ? (
      <div className="text-red-500 text-xs mt-1">{errors[fieldName][0]}</div>
    ) : null;

  const handleGoBack = () => {
    if (returnPath) {
      navigate(returnPath);
    } else {
      navigate('/hrteamdashboard/positions');
    }
  };

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Back to Positions Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/hrteamdashboard/positions')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Positions
          </button>
        </div>

        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">🧾 Candidate Form</h1>
          {returnPath && (
            <button
              onClick={handleGoBack}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              ← Back to Job
            </button>
          )}
        </div>

        {/* Show pre-selected job info */}
        {jobTitle && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Adding candidate for:</strong> {jobTitle}
              {clientName && <span> at <strong>{clientName}</strong></span>}
            </div>
          </div>
        )}

        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            Candidate submitted successfully! Redirecting back to job page...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              disabled={isLoadingJobs}
              className={`border border-gray-300 rounded-md px-4 py-3 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
                preSelectedJobId ? 'bg-blue-50 border-blue-300' : ''
              }`}
            >
              <option value="">
                {isLoadingJobs ? 'Loading jobs...' : 'Select a job'}
              </option>
              {Array.isArray(jobs) && jobs.map((job) => (
                <option key={job.job_id || job.id} value={job.job_id || job.id}>
                  {job.job_title} {job.client_name ? `- ${job.client_name}` : ''}
                </option>
              ))}
            </select>
            {getFieldError('job_id')}
            {!isLoadingJobs && jobs.length === 0 && (
              <div className="text-amber-600 text-xs mt-1">
                No jobs available. Please try refreshing the page.
              </div>
            )}
            {preSelectedJobId && (
              <div className="text-blue-600 text-xs mt-1">
                Job pre-selected based on your previous selection
              </div>
            )}
          </div>

          {/* Text Inputs */}
          {[
            { label: 'Candidate Name', name: 'candidate_name', type: 'text', required: true },
            { label: 'Email ID', name: 'email', type: 'email', required: true },
            { label: 'Mobile Number', name: 'mobile_number', type: 'tel', required: true },
            { label: 'Current Company', name: 'current_company', type: 'text' },
            { label: 'Years of Experience', name: 'years_experience', type: 'number' },
            { label: 'Relevant Experience', name: 'relevant_experience', type: 'number' },
            { label: 'Current CTC', name: 'current_ctc', type: 'text' },
            { label: 'Expected CTC', name: 'expected_ctc', type: 'text' },
            { label: 'Notice Period', name: 'notice_period', type: 'text' },
            { label: 'Current Location', name: 'current_location', type: 'text', required: true },
            { label: 'Preferred Location', name: 'preferred_location', type: 'text' },
            { label: 'Available for Interview', name: 'available_for_interview', type: 'date' },
          ].map(({ label, name, type, required }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="mb-2 text-sm font-semibold text-gray-700">
                {label}{required && <span className="text-red-500"> *</span>}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
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
            <label htmlFor="resume_path" className="mb-2 text-sm font-semibold text-gray-700">
              CV / Resume Attachment <span className="text-red-500">*</span>
            </label>
            <input
              id="resume_path"
              name="resume_path"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              ref={resumeInputRef}
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

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end mt-6 gap-4">
            {returnPath && (
              <button
                type="button"
                onClick={handleGoBack}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// CRITICAL: Make sure this export statement exists
export default CandidateFormPage;
