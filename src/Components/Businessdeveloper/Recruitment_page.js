import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecruitmentPage = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    client_name: '',
    job_title: '',
    min_experience: '',
    max_experience: '',
    min_experience_other: '',
    max_experience_other: '',
    preferred_company: '',
    type_of_industry: '',
    notice_period: '',
    benefit: [],
    other_benefit: '',
    budget: '',
    package: '',
    qualification: '',
    skills_required: '',
    job_location: '',
    timings: '',
    no_of_positions: '',
    working_days: '',
    diversity_preference: '',
    diversity_other: '',
    hiring_type: '',
    work_mode: '',
    interview_process: '',
    key_responsibilities: '',
    job_description: '',
    jd_document_path: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get('https://skilviu.com/backend/api/v1/clientforms')
      .then((res) => {
        if (res.data.status && Array.isArray(res.data.data.data)) {
          setClients(res.data.data.data);
        } else {
          console.error("Client list not found in response:", res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching clients:', err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBenefitsChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const benefit = checked
        ? [...prev.benefit, value]
        : prev.benefit.filter((item) => item !== value);
      return { ...prev, benefit };
    });
  };

  const handleOtherBenefitChange = (e) => {
    setFormData((prev) => ({ ...prev, other_benefit: e.target.value }));
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        jd_document_path: file.name,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.client_id) newErrors.client_id = 'Client is required';
    if (!formData.client_name) newErrors.client_name = 'Client is required';
    if (!formData.job_title) newErrors.job_title = 'Job title is required';
    if (!formData.min_experience) newErrors.min_experience = 'Minimum experience is required';
    if (!formData.max_experience) newErrors.max_experience = 'Maximum experience is required';
    if (!formData.type_of_industry) newErrors.type_of_industry = 'Industry type is required';
    if (!formData.notice_period) newErrors.notice_period = 'Notice period is required';
    if (!formData.qualification) newErrors.qualification = 'Qualification is required';
    if (!formData.skills_required) newErrors.skills_required = 'Skills are required';
    if (!formData.budget) newErrors.budget = 'Budget is required';
    if (!formData.package) newErrors.package = 'Package is required';
    if (!formData.job_location) newErrors.job_location = 'Job location is required';
    if (!formData.work_mode) newErrors.work_mode = 'Work mode is required';
    if (!formData.hiring_type) newErrors.hiring_type = 'Hiring type is required';
    if (!formData.no_of_positions) newErrors.no_of_positions = 'Number of positions is required';
    if (!formData.job_description) newErrors.job_description = 'Job description is required';
    if (!formData.key_responsibilities) newErrors.key_responsibilities = 'Key responsibilities are required';

    if (formData.min_experience === 'Other' && !formData.min_experience_other) {
      newErrors.min_experience_other = 'Please specify minimum experience';
    }

    if (formData.max_experience === 'Other' && !formData.max_experience_other) {
      newErrors.max_experience_other = 'Please specify maximum experience';
    }

    if (formData.diversity_preference === 'Other' && !formData.diversity_other) {
      newErrors.diversity_other = 'Please specify diversity preference';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareSubmissionData = () => {
    let benefitsString = formData.benefit
      .filter((b) => b !== 'Others')
      .join(', ');

    if (formData.benefit.includes('Others') && formData.other_benefit) {
      benefitsString += (benefitsString ? ', ' : '') + formData.other_benefit;
    }

    const minExp = formData.min_experience === 'Other'
      ? formData.min_experience_other
      : formData.min_experience;

    const maxExp = formData.max_experience === 'Other'
      ? formData.max_experience_other
      : formData.max_experience;

    const diversity = formData.diversity_preference === 'Other'
      ? formData.diversity_other
      : formData.diversity_preference;

    return {
      client_id: formData.client_id,
      client_name: formData.client_name,
      job_title: formData.job_title,
      min_experience: minExp,
      max_experience: maxExp,
      preferred_company: formData.preferred_company,
      type_of_industry: formData.type_of_industry,
      notice_period: formData.notice_period,
      benefit: benefitsString,
      budget: formData.budget,
      package: formData.package,
      qualification: formData.qualification,
      skills_required: formData.skills_required,
      job_location: formData.job_location,
      timings: formData.timings,
      no_of_positions: formData.no_of_positions,
      working_days: formData.working_days,
      diversity_preference: diversity,
      hiring_type: formData.hiring_type,
      work_mode: formData.work_mode,
      interview_process: formData.interview_process,
      key_responsibilities: formData.key_responsibilities,
      job_description: formData.job_description,
      jd_document_path: formData.jd_document_path,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResponseMessage('');
    setSuccessMessage('');
    setErrors({});
    setIsSubmitting(true);

    if (!validateForm()) {
      setResponseMessage('❌ Please fix the validation errors below.');
      setIsSubmitting(false);
      return;
    }

    const submissionData = prepareSubmissionData();

    try {
      const response = await axios.post(
        'https://skilviu.com/backend/api/v1/recruitments',
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.status === 201) {
        // ✅ Use the success message returned by Laravel
        setSuccessMessage(`✅ ${response.data.message}`);

        setFormData({
          client_id: '',
          client_name: '',
          job_title: '',
          min_experience: '',
          max_experience: '',
          min_experience_other: '',
          max_experience_other: '',
          preferred_company: '',
          type_of_industry: '',
          notice_period: '',
          benefit: [],
          other_benefit: '',
          budget: '',
          package: '',
          qualification: '',
          skills_required: '',
          job_location: '',
          timings: '',
          no_of_positions: '',
          working_days: '',
          diversity_preference: '',
          diversity_other: '',
          hiring_type: '',
          work_mode: '',
          interview_process: '',
          key_responsibilities: '',
          job_description: '',
          jd_document_path: '',
        });
      } else {
        setResponseMessage(response.data.message || '❌ Something went wrong.');
      }

    } catch (error) {
      console.error('Submission error:', error);

      if (error.response?.status === 422 && error.response.data?.errors) {
        setErrors(error.response.data.errors);
        setResponseMessage('❌ Please fix the validation errors.');
      } else if (error.response?.status === 500) {
        setResponseMessage('❌ Server error. Please try again later.');
      } else {
        setResponseMessage('❌ Network error. Please check your internet connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const getFieldError = (fieldName) => {
    if (errors[fieldName]) {
      return (
        <div className="text-red-500 text-xs mt-1">
          {Array.isArray(errors[fieldName]) ? errors[fieldName][0] : errors[fieldName]}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          📋 Client Requirement
        </h1>

        {successMessage && (
          <div className="mb-6 text-sm font-medium p-3 rounded-lg border text-green-600 bg-green-100 border-green-300">
            {successMessage}
          </div>
        )}

        {responseMessage && (
          <div className="mb-6 text-sm font-medium p-3 rounded-lg border text-red-600 bg-red-100 border-red-300">
            {responseMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Selection */}
          <div className="mb-4 relative z-20">
            <label htmlFor="client_id" className="block font-medium mb-1 text-sm">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              name="client_id"
              id="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white shadow"
              required
            >
              <option value="">Select a client</option>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company_name}
                  </option>
                ))
              ) : (
                <option disabled>Loading clients...</option>
              )}
            </select>
            {getFieldError('client_id')}
          </div>

          <div className="flex flex-col col-span-1">
            <label htmlFor="client_name" className="mb-2 text-sm font-semibold text-gray-700">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
              required
            />
            {getFieldError('client_name')}
          </div>

          {/* Basic Fields */}
          {[
            { label: 'Job Title', name: 'job_title', required: true },
            { label: 'Type of Industry', name: 'type_of_industry', required: true },
            { label: 'To By Join By', name: 'notice_period', required: true },
            { label: 'Qualification', name: 'qualification', required: true },
            { label: 'Skills Required', name: 'skills_required', required: true }
          ].map(({ label, name, required }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="mb-2 text-sm font-semibold text-gray-700">
                {label}{required && <span className="text-red-500"> *</span>}
              </label>
              <input
                type="text"
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
                required={required}
              />
              {getFieldError(name)}
            </div>
          ))}

          {/* Experience */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Required Years of Experience <span className="text-red-500">*</span></label>

            <div className="flex gap-4">
              {/* Minimum Experience */}
              <div className="flex flex-col w-1/2">
                <select
                  id="min_experience"
                  name="min_experience"
                  value={formData.min_experience}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full bg-white"
                  required
                >
                  <option value="">Minimum</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} year{i + 1 !== 1 ? 's' : ''}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>

                {formData.min_experience === 'Other' && (
                  <input
                    type="text"
                    name="min_experience_other"
                    placeholder="Enter minimum experience"
                    value={formData.min_experience_other || ''}
                    onChange={handleChange}
                    className="mt-2 border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
                  />
                )}
                {getFieldError('min_experience')}
                {getFieldError('min_experience_other')}
              </div>

              {/* Maximum Experience */}
              <div className="flex flex-col w-1/2">
                <select
                  id="max_experience"
                  name="max_experience"
                  value={formData.max_experience}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full bg-white"
                  required
                >
                  <option value="">Maximum</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} year{i + 1 !== 1 ? 's' : ''}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>

                {formData.max_experience === 'Other' && (
                  <input
                    type="text"
                    name="max_experience_other"
                    placeholder="Enter maximum experience"
                    value={formData.max_experience_other || ''}
                    onChange={handleChange}
                    className="mt-2 border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
                  />
                )}
                {getFieldError('max_experience')}
                {getFieldError('max_experience_other')}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="md:col-span-2">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Benefits <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['Cab', 'Food', 'Incentives', 'Health Insurance', 'Gym Membership', 'Provident fund', 'Paid Time Off', 'Bonus', 'Retirement Fund', 'Others'].map((benefit) => (
                <label key={benefit} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={benefit}
                    checked={formData.benefit.includes(benefit)}
                    onChange={handleBenefitsChange}
                    className="form-checkbox text-blue-600"
                  />
                  <span>{benefit}</span>
                </label>
              ))}
            </div>

            {formData.benefit.includes('Others') && (
              <input
                type="text"
                placeholder="Please specify other benefits"
                value={formData.other_benefit || ''}
                onChange={handleOtherBenefitChange}
                className="border border-gray-300 rounded-md px-4 py-2 text-sm mt-4 w-full"
              />
            )}
            {getFieldError('benefit')}
          </div>

          {/* Budget and Package */}
          <div className="flex flex-col md:flex-row md:space-x-4 md:col-span-2">
            <div className="flex flex-col md:w-1/2">
              <label htmlFor="budget" className="mb-2 text-sm font-semibold text-gray-700">Budget<span className="text-red-500"> *</span></label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
                required
              />
              {getFieldError('budget')}
            </div>

            <div className="flex flex-col md:w-1/2 mt-4 md:mt-0">
              <label htmlFor="package" className="mb-2 text-sm font-semibold text-gray-700">Package<span className="text-red-500"> *</span></label>
              <input
                type="text"
                id="package"
                name="package"
                value={formData.package}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
                required
              />
              {getFieldError('package')}
            </div>
          </div>

          {/* Hiring Process Section */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4 border-b pb-2">📌 Hiring Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">Job Location <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="job_location"
                  value={formData.job_location}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
                  required
                />
                {getFieldError('job_location')}
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">Work Timings</label>
                <input
                  type="text"
                  name="timings"
                  value={formData.timings}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
                />
                {getFieldError('timings')}
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">Work Mode <span className="text-red-500">*</span></label>
                <select
                  name="work_mode"
                  value={formData.work_mode}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
                  required
                >
                  <option value="" disabled>Please select</option>
                  {['Hybrid', 'Remote', 'On-Site', 'Work From Client Office', 'Others'].map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
                {getFieldError('work_mode')}
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">No. of Working Days</label>
                <select
                  name="working_days"
                  value={formData.working_days}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
                >
                  <option value="" disabled>Select days</option>
                  {Array.from({ length: 7 }, (_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                {getFieldError('working_days')}
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">Hiring Type <span className="text-red-500">*</span></label>
                <select
                  name="hiring_type"
                  value={formData.hiring_type}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
                  required
                >
                  <option value="" disabled>Please select</option>
                  {['Full Time', 'Part Time', 'Internship', 'Temporary Employment', 'Others'].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {getFieldError('hiring_type')}
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">No. of Positions <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="no_of_positions"
                  value={formData.no_of_positions}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
                  required
                />
                {getFieldError('no_of_positions')}
              </div>
            </div>
          </div>

          {/* Diversity Section */}
          <div className="flex flex-col md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-4 border-b pb-2">Diversity</h2>
            <div className="flex space-x-6">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="radio"
                  name="diversity_preference"
                  value="Male"
                  onChange={handleChange}
                  checked={formData.diversity_preference === 'Male'}
                  className="mr-2"
                />
                Male
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="radio"
                  name="diversity_preference"
                  value="Female"
                  onChange={handleChange}
                  checked={formData.diversity_preference === 'Female'}
                  className="mr-2"
                />
                Female
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="radio"
                  name="diversity_preference"
                  value="Other"
                  onChange={handleChange}
                  checked={formData.diversity_preference === 'Other'}
                  className="mr-2"
                />
                Other
              </label>
            </div>
            {formData.diversity_preference === 'Other' && (
              <div className="mt-3">
                <label htmlFor="diversity_other" className="text-sm font-medium text-gray-700 mb-2">
                  Please Specify
                </label>
                <input
                  type="text"
                  name="diversity_other"
                  id="diversity_other"
                  value={formData.diversity_other}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
                />
                {getFieldError('diversity_other')}
              </div>
            )}
            {getFieldError('diversity_preference')}
          </div>

          {/* Interview Process */}
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="interview_process" className="mb-2 text-sm font-semibold text-gray-700">Interview Process</label>
            <textarea
              name="interview_process"
              rows={3}
              value={formData.interview_process}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-3 text-sm resize-y w-full"
            />
            {getFieldError('interview_process')}
          </div>

          {/* Job Description */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 text-sm font-semibold text-gray-700">Job Description <span className="text-red-500">*</span></label>
            <textarea
              name="job_description"
              rows={5}
              value={formData.job_description}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-3 text-sm resize-y w-full"
              required
            />
            {getFieldError('job_description')}
          </div>

          {/* Key Responsibility */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 text-sm font-semibold text-gray-700">Key Responsibility<span className="text-red-500">*</span></label>
            <textarea
              name="key_responsibilities"
              rows={4}
              value={formData.key_responsibilities}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-3 text-sm resize-y w-full"
              required
            />
            {getFieldError('key_responsibilities')}
          </div>

          {/* Upload JD or Key Responsibility File */}
          <div className="flex flex-col md:col-span-1">
            <label className="mb-2 text-sm font-semibold text-gray-700">Upload JD or Key Responsibility File</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleDocumentChange}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full"
            />
            <small className="text-xs text-gray-500">Accepted: PDF, DOC, DOCX</small>
            {getFieldError('jd_document_path')}
          </div>

          {/* Preferred Company */}
          <div className="flex flex-col md:col-span-2">
            <label htmlFor="preferred_company" className="mb-2 text-sm font-semibold text-gray-700">Preferred Company</label>
            <input
              type="text"
              id="preferred_company"
              name="preferred_company"
              value={formData.preferred_company}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-3 text-sm w-full"
            />
            {getFieldError('preferred_company')}
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruitmentPage;






