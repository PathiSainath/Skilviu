import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

function Referafriend() {
  const [formData, setFormData] = useState({
    candidate_name: '',
    candidate_id: '',
    job_id: '',
    friend_name: '',
    friend_contact: '',
    friend_email: '',
    preferred_company: '',
  });

  const [candidateDetails, setCandidateDetails] = useState(null);
  const [candidateSearchResults, setCandidateSearchResults] = useState([]);
  const [showCandidateDropdown, setShowCandidateDropdown] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [referredFriends, setReferredFriends] = useState([]); // Track referred friends
  const [totalReferrals, setTotalReferrals] = useState(0); // Track total successful referrals

  // Set maximum referrals allowed per job
  const MAX_REFERRALS_PER_JOB = 100;

  const location = useLocation();
  const { jobId } = useParams();
  const jobFromState = location.state;

  // Fetch job details from URL parameter
  useEffect(() => {
    if (jobId && !jobFromState) {
      const fetchJobDetails = async () => {
        try {
          const res = await fetch(`https://skilviu.com/backend/api/v1/recruitments/${jobId}`);
          if (!res.ok) {
            setMessage({ type: 'error', text: `Job not found (Status: ${res.status})` });
            return;
          }
          
          const data = await res.json();
          console.log('Job API response:', data);

          let job = null;
          if (data?.success && data?.data) {
            job = data.data;
          } else if (data?.job_title) {
            job = data;
          } else if (Array.isArray(data) && data.length > 0) {
            job = data[0];
          } else if (typeof data === 'object') {
            job = data;
          }

          if (job?.job_title) {
            setJobDetails({
              success: true,
              data: {
                job_title: job.job_title || 'Job Title Not Available',
                job_location: job.job_location || job.location || 'Location Not Available',
                client_name: job.client_name || job.company || job.company_name || 'Company Not Available',
              },
            });
            setFormData(prev => ({ ...prev, job_id: String(jobId) }));
          } else {
            setMessage({ type: 'error', text: 'Invalid job data format' });
          }
        } catch (error) {
          console.error('Error fetching job:', error);
          setMessage({ type: 'error', text: 'Error fetching job details' });
        }
      };
      fetchJobDetails();
    }
  }, [jobId, jobFromState]);

  // Set job details from navigation state
  useEffect(() => {
    if (jobFromState?.job_id && !jobDetails?.success) {
      console.log('Setting job from navigation state:', jobFromState);
      
      setFormData(prev => ({ 
        ...prev, 
        job_id: String(jobFromState.job_id) 
      }));
      
      setJobDetails({
        success: true,
        data: {
          job_title: jobFromState.job_title || 'Job Title Not Available',
          job_location: jobFromState.job_location || 'Location Not Available',
          client_name: jobFromState.client_name || 'Company Not Available',
        },
      });
    }
  }, [jobFromState]);

  // Search candidates by name
  useEffect(() => {
    const fetchCandidates = async () => {
      if (formData.candidate_name && formData.candidate_name.length >= 2 && !candidateDetails) {
        try {
          const res = await fetch('https://skilviu.com/backend/api/v1/candidates');
          if (!res.ok) {
            setCandidateSearchResults([]);
            setShowCandidateDropdown(false);
            return;
          }
          
          const data = await res.json();
          const candidates = Array.isArray(data) ? data : data.data || [];
          const filtered = candidates.filter(c =>
            c.candidate_name?.toLowerCase().includes(formData.candidate_name.toLowerCase())
          );

          setCandidateSearchResults(filtered);
          setShowCandidateDropdown(filtered.length > 0);
        } catch (error) {
          console.error('Error fetching candidates:', error);
          setCandidateSearchResults([]);
          setShowCandidateDropdown(false);
        }
      } else {
        setCandidateSearchResults([]);
        setShowCandidateDropdown(false);
        if (!formData.candidate_name) {
          setCandidateDetails(null);
          if (!jobId && !jobFromState) {
            setJobDetails(null);
          }
        }
      }
    };

    const timeoutId = setTimeout(fetchCandidates, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.candidate_name, candidateDetails, jobId, jobFromState]);

  // Fetch job details when candidate is selected
  useEffect(() => {
    if (candidateDetails?.job_id && !jobId && !jobFromState) {
      const fetchJobByCandidate = async () => {
        try {
          const res = await fetch(`https://skilviu.com/backend/api/v1/recruitments/${candidateDetails.job_id}`);
          if (!res.ok) return;
          
          const data = await res.json();
          let job = null;
          if (data?.success && data?.data) {
            job = data.data;
          } else if (data?.job_title) {
            job = data;
          } else if (typeof data === 'object') {
            job = data;
          }

          if (job?.job_title) {
            setJobDetails({
              success: true,
              data: {
                job_title: job.job_title || 'Job Title Not Available',
                job_location: job.job_location || 'Location Not Available',
                client_name: job.client_name || 'Company Not Available',
              },
            });
            setFormData(prev => ({ ...prev, job_id: String(candidateDetails.job_id) }));
          }
        } catch (error) {
          console.error('Error fetching job by candidate:', error);
        }
      };
      fetchJobByCandidate();
    }
  }, [candidateDetails, jobId, jobFromState]);

  const handleCandidateSelect = (candidate) => {
    setCandidateDetails(candidate);
    setFormData(prev => ({
      ...prev,
      candidate_name: candidate.candidate_name || '',
      candidate_id: candidate.id || candidate.candidate_id ? String(candidate.id || candidate.candidate_id) : '',
    }));
    // Immediately hide dropdown and clear search results
    setShowCandidateDropdown(false);
    setCandidateSearchResults([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'candidate_name') {
      setFormData(prev => ({ ...prev, candidate_name: value }));
      if (!value) {
        setCandidateDetails(null);
        setShowCandidateDropdown(false);
        setCandidateSearchResults([]);
        if (!jobId && !jobFromState) {
          setJobDetails(null);
        }
        setFormData(prev => ({
          ...prev,
          candidate_id: '',
          job_id: jobFromState?.job_id ? String(jobFromState.job_id) : (jobId ? String(jobId) : ''),
        }));
      } else if (candidateDetails && value !== candidateDetails.candidate_name) {
        // If user is typing and it doesn't match selected candidate, clear selection
        setCandidateDetails(null);
        setFormData(prev => ({
          ...prev,
          candidate_id: '',
          job_id: jobFromState?.job_id ? String(jobFromState.job_id) : (jobId ? String(jobId) : ''),
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Enhanced validation with specific error messages
    const validationErrors = [];

    if (!formData.candidate_id?.trim()) {
      validationErrors.push('Please select a candidate from the dropdown');
    }
    if (!formData.job_id?.trim()) {
      validationErrors.push('Job information is missing');
    }
    if (!formData.friend_name?.trim()) {
      validationErrors.push("Please enter your friend's name");
    }
    if (!formData.friend_contact?.trim()) {
      validationErrors.push("Please enter your friend's contact number");
    }

    // Check if maximum referrals limit reached
    if (totalReferrals >= MAX_REFERRALS_PER_JOB) {
      validationErrors.push(`You have reached the maximum limit of ${MAX_REFERRALS_PER_JOB} referrals for this job`);
    }

    // Check if this friend has already been referred in this session
    const friendKey = `${formData.friend_name.toLowerCase().trim()}-${formData.friend_contact.trim()}`;
    if (referredFriends.includes(friendKey)) {
      validationErrors.push('You have already referred this friend in this session');
    }

    if (validationErrors.length > 0) {
      setMessage({ 
        type: 'error', 
        text: validationErrors.join('. ') 
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://skilviu.com/backend/api/v1/refer-a-friend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: parseInt(formData.candidate_id),
          job_id: parseInt(formData.job_id),
          friend_name: formData.friend_name.trim(),
          friend_contact: formData.friend_contact.trim(),
          friend_email: formData.friend_email?.trim() || null,
          preferred_company: formData.preferred_company?.trim() || null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Add friend to referred list and increment total count
        setReferredFriends(prev => [...prev, friendKey]);
        setTotalReferrals(prev => prev + 1);
        
        // UPDATED SUCCESS MESSAGE - Just show friend name and job title
        setMessage({ 
          type: 'success', 
          text: `${formData.friend_name} referred successfully to ${jobDetails?.data?.job_title || 'this job'}.`
        });
        
        // Clear only friend fields, keep candidate and job info
        setFormData(prev => ({
          ...prev,
          friend_name: '',
          friend_contact: '',
          friend_email: '',
          preferred_company: '',
        }));
        
        // Auto-clear success message after 4 seconds to allow next referral
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        
      } else {
        // Handle specific error messages from backend
        if (data.message && data.message.includes('already referred')) {
          setMessage({ 
            type: 'error', 
            text: 'This friend has already been referred for this job previously. Please refer a different friend.' 
          });
        } else {
          setMessage({ type: 'error', text: data.message || 'Failed to submit referral' });
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Function to reset entire form for new candidate
  const handleReferAnotherCandidate = () => {
    setFormData({
      candidate_name: '',
      candidate_id: '',
      job_id: jobFromState?.job_id ? String(jobFromState.job_id) : (jobId ? String(jobId) : ''),
      friend_name: '',
      friend_contact: '',
      friend_email: '',
      preferred_company: '',
    });
    setCandidateDetails(null);
    setCandidateSearchResults([]);
    setShowCandidateDropdown(false);
    setReferredFriends([]);
    setTotalReferrals(0);
    setMessage({ type: '', text: '' });
  };

  // Handle input focus to show dropdown again if there are search results
  const handleInputFocus = () => {
    if (candidateSearchResults.length > 0 && !candidateDetails) {
      setShowCandidateDropdown(true);
    }
  };

  // Calculate remaining referrals
  const remainingReferrals = MAX_REFERRALS_PER_JOB - totalReferrals;
  const isLimitReached = totalReferrals >= MAX_REFERRALS_PER_JOB;

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
          🤝 Refer a Friend
        </h1>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Show referred friends count - UPDATED WITH JOB TITLE */}
        {referredFriends.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-sm font-semibold text-green-800 mb-2">
              ✅ Friends Successfully Referred to {jobDetails?.data?.job_title || 'This Job'}: {referredFriends.length}
            </h3>
            <div className="max-h-20 overflow-y-auto">
              {referredFriends.map((friendKey, index) => {
                const [name] = friendKey.split('-');
                return (
                  <span key={index} className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-1 capitalize">
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Candidate Name Field with Search */}
          <div className="flex flex-col relative">
            <label htmlFor="candidate_name" className="mb-2 text-sm font-semibold text-gray-700">
              Your Name *
            </label>
            <input
              id="candidate_name"
              name="candidate_name"
              type="text"
              value={formData.candidate_name}
              onChange={handleChange}
              onFocus={handleInputFocus}
              placeholder="Enter your name to search"
              required
              className="border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoComplete="off"
            />

            {/* Candidate Search Dropdown - Only show if no candidate is selected */}
            {showCandidateDropdown && candidateSearchResults.length > 0 && !candidateDetails && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                {candidateSearchResults.map((candidate) => (
                  <div
                    key={candidate.id || candidate.candidate_id}
                    onClick={() => handleCandidateSelect(candidate)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <p className="text-sm font-medium text-gray-800">{candidate.candidate_name || 'N/A'}</p>
                    <p className="text-xs text-gray-600">Email: {candidate.email || 'N/A'}</p>
                    <p className="text-xs text-gray-600">Location: {candidate.current_location || 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Candidate Details - Only show when candidate is selected */}
            {candidateDetails && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-green-800">
                      <strong>✓ Selected Candidate:</strong> {candidateDetails.candidate_name || 'N/A'}
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Email:</strong> {candidateDetails.email || 'N/A'}
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Location:</strong> {candidateDetails.current_location || 'N/A'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCandidateDetails(null);
                      setFormData(prev => ({
                        ...prev,
                        candidate_name: '',
                        candidate_id: '',
                        job_id: jobFromState?.job_id ? String(jobFromState.job_id) : (jobId ? String(jobId) : ''),
                      }));
                      if (!jobId && !jobFromState) {
                        setJobDetails(null);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Title and Location Display */}
          {jobDetails?.success && jobDetails?.data ? (
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-semibold text-gray-700">
                Job Title & Location *
              </label>
              <div className="border border-gray-300 rounded-md px-4 py-3 bg-gray-50">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {jobDetails.data.job_title}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  📍 <strong>Location:</strong> {jobDetails.data.job_location}
                </p>
                <p className="text-sm text-gray-600">
                  🏢 <strong>Company:</strong> {jobDetails.data.client_name}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-semibold text-gray-700">
                Job Title & Location *
              </label>
              <div className="border border-gray-300 rounded-md px-4 py-3 bg-gray-100 text-gray-500 text-sm">
                {candidateDetails || jobId ? 'Loading job details...' : 'Please select a candidate first to see their job details'}
              </div>
            </div>
          )}

          {/* Hidden fields for form submission */}
          <input type="hidden" name="candidate_id" value={formData.candidate_id || ''} />
          <input type="hidden" name="job_id" value={formData.job_id || ''} />

          {/* Friend Details Form Fields */}
          {[
            { 
              label: "Friend's Name *", 
              name: 'friend_name', 
              type: 'text', 
              placeholder: "Enter friend's name",
              required: true 
            },
            { 
              label: "Friend's Contact Number *", 
              name: 'friend_contact', 
              type: 'text',
              placeholder: 'Enter contact number',
              required: true 
            },
            { 
              label: "Friend's Email ID", 
              name: 'friend_email', 
              type: 'email', 
              placeholder: 'Enter email (optional)', 
              required: false 
            },
            { 
              label: 'Preferred Company', 
              name: 'preferred_company', 
              type: 'text', 
              placeholder: 'Company preference (optional)', 
              required: false 
            },
          ].map(({ label, name, type, placeholder, required }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="mb-2 text-sm font-semibold text-gray-700">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name] || ''}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                disabled={isLimitReached}
                className={`border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  isLimitReached ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            </div>
          ))}

          <div className="flex flex-col gap-3">
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !jobDetails?.success || !candidateDetails || isLimitReached}
              className={`font-semibold px-6 py-3 rounded-lg shadow transition ${
                loading || !jobDetails?.success || !candidateDetails || isLimitReached
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {loading ? 'Submitting...' : 
               isLimitReached ? `Limit Reached (${MAX_REFERRALS_PER_JOB} max)` : 
               'Refer This Friend'}
            </button>

            {/* Reset Button for Different Candidate */}
            {candidateDetails && (
              <button
                type="button"
                onClick={handleReferAnotherCandidate}
                className="font-semibold px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Refer as Different Candidate
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Referafriend;
