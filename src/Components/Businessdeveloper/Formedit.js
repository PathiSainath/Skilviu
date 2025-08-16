import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Formedit() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://skilviu.com/backend/api/v1/recruitments/admin/all');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();

        console.log("API response:", data);
        const jobList = Array.isArray(data) ? data : data.data || [];
        setJobs(jobList);
        
      } catch (err) {
        console.error(err);
        setError('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Helper function to refresh jobs list
  const refreshJobs = async () => {
    try {
      const response = await fetch('https://skilviu.com/backend/api/v1/recruitments/admin/all');
      const data = await response.json();
      const jobList = Array.isArray(data) ? data : data.data || [];
      setJobs(jobList);
    } catch (err) {
      console.error('Error refreshing jobs:', err);
    }
  };

  const handleDelete = async (job_id) => {
    const confirmed = window.confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;

    setActionLoading(prev => ({ ...prev, [`delete_${job_id}`]: true }));

    try {
      const res = await fetch(`https://skilviu.com/backend/api/v1/recruitments/${job_id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setJobs((prevJobs) => prevJobs.filter((job) => job.job_id !== job_id));
        alert('Job deleted successfully');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Failed to delete job: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the job');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${job_id}`]: false }));
    }
  };

  // **ENHANCED: Reopen job with enhanced feedback**
  const handleReopenJob = async (job_id) => {
    const confirmed = window.confirm('Are you sure you want to reopen this closed job?');
    if (!confirmed) return;

    setActionLoading(prev => ({ ...prev, [`reopen_${job_id}`]: true }));

    try {
      console.log(`🔄 Attempting to reopen job ${job_id}`);
      
      const res = await fetch(`https://skilviu.com/backend/api/v1/${job_id}/reopen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          reason: 'Manual reopen by admin'
        }),
      });

      const responseData = await res.json();
      console.log('Reopen response:', responseData);

      if (res.ok && responseData.success) {
        await refreshJobs();
        
        // **ENHANCED: Better success feedback**
        const visibilityText = responseData.career_page_visible 
          ? '✅ Job is now VISIBLE on career page!' 
          : '⚠️ Job reopened but may not be visible yet.';
        
        alert(`🚀 Job reopened successfully!\n\n${visibilityText}`);
      } else {
        console.log('Service endpoint failed, trying fallback...');
        await handleReopenJobFallback(job_id);
      }
    } catch (error) {
      console.error('Network error:', error);
      await handleReopenJobFallback(job_id);
    } finally {
      setActionLoading(prev => ({ ...prev, [`reopen_${job_id}`]: false }));
    }
  };

  // **ENHANCED: Fallback reopen with complete data**
  const handleReopenJobFallback = async (job_id) => {
    try {
      const currentJob = jobs.find(job => job.job_id === job_id);
      if (!currentJob) {
        alert('Job not found');
        return;
      }

      console.log('🔄 Using fallback reopen method for job:', currentJob);

      // **SIMPLE: Just update the job to increase positions by 1 to trigger auto-reopen**
      const updateData = {
        ...currentJob,
        no_of_positions: parseInt(currentJob.no_of_positions) + 1, // Increase positions to trigger auto-reopen
        is_active: true,
        status: 'open',
        auto_close_reason: null,
        auto_closed_at: null
      };

      const res = await axios.put(
        `https://skilviu.com/backend/api/v1/recruitments/${job_id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (res.status === 200) {
        await refreshJobs();
        
        const autoActionResult = res.data.auto_action_result;
        if (autoActionResult && autoActionResult.success) {
          alert('🚀 Job reopened successfully using fallback method!\n\n✅ Job is now VISIBLE on career page!');
        } else {
          alert('✅ Job reopened successfully using fallback method!');
        }
      }
    } catch (error) {
      console.error('Fallback reopen failed:', error);
      alert('Failed to reopen job. Please try again.');
    }
  };

  const handleCloseJob = async (job_id) => {
    const reason = prompt('Enter reason for closing this job:');
    if (!reason) return;

    setActionLoading(prev => ({ ...prev, [`close_${job_id}`]: true }));

    try {
      const res = await fetch(`https://skilviu.com/backend/api/v1/job-closure/${job_id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidate_ids: [],
          reason: reason
        }),
      });
      
      if (res.ok) {
        await refreshJobs();
        alert('🔒 Job closed successfully');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Failed to close job: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while closing the job');
    } finally {
      setActionLoading(prev => ({ ...prev, [`close_${job_id}`]: false }));
    }
  };

  // **ENHANCED: Better edit click handling**
  const handleEditClick = (job) => {
    console.log('📝 Opening edit modal for job:', job);
    
    // **COMPLETE: Ensure all required fields have proper values**
    const completeJobData = {
      ...job,
      // Ensure required fields are never null/undefined/empty
      client_id: job.client_id || 1,
      client_name: job.client_name || 'Default Client',
      job_title: job.job_title || 'Position Title',
      type_of_industry: job.type_of_industry || 'IT',
      notice_period: job.notice_period || 'Immediate',
      benefit: job.benefit || 'Standard Benefits',
      budget: job.budget || 'Competitive',
      package: job.package || 'As per standards',
      qualification: job.qualification || 'Bachelor degree required',
      skills_required: job.skills_required || 'Relevant skills required',
      job_location: job.job_location || 'Remote',
      no_of_positions: job.no_of_positions || 1,
      hiring_type: job.hiring_type || 'Full Time',
      work_mode: job.work_mode || 'Remote',
      key_responsibilities: job.key_responsibilities || 'Key responsibilities to be defined',
      job_description: job.job_description || 'Detailed job description to be updated',
      // Optional fields with sensible defaults
      min_experience: job.min_experience || 0,
      max_experience: job.max_experience || 10,
      preferred_company: job.preferred_company || '',
      timings: job.timings || '',
      working_days: job.working_days || 5,
      diversity_preference: job.diversity_preference || '',
      interview_process: job.interview_process || ''
    };
    
    setEditingJob(completeJobData);
    setJdFile(null);
  };

  const handleModalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingJob((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // **COMPLETELY ENHANCED: Update method with auto-reopen awareness**
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingJob || !editingJob.job_id) {
      alert('Error: Missing job ID.');
      return;
    }

    console.log('🔄 Starting job update process...');
    console.log('Current job data:', editingJob);

    // **ENHANCED: Better validation with specific field checking**
    const requiredFields = [
      { field: 'client_id', message: 'Client ID is required' },
      { field: 'client_name', message: 'Client Name is required' },
      { field: 'job_title', message: 'Job Title is required' },
      { field: 'type_of_industry', message: 'Type of Industry is required' },
      { field: 'notice_period', message: 'Notice Period is required' },
      { field: 'benefit', message: 'Benefit is required' },
      { field: 'budget', message: 'Budget is required' },
      { field: 'package', message: 'Package is required' },
      { field: 'qualification', message: 'Qualification is required' },
      { field: 'skills_required', message: 'Skills Required is required' },
      { field: 'job_location', message: 'Job Location is required' },
      { field: 'no_of_positions', message: 'Number of Positions is required' },
      { field: 'hiring_type', message: 'Hiring Type is required' },
      { field: 'work_mode', message: 'Work Mode is required' },
      { field: 'key_responsibilities', message: 'Key Responsibilities is required' },
      { field: 'job_description', message: 'Job Description is required' }
    ];

    const missingFields = requiredFields.filter(({ field }) => {
      const value = editingJob[field];
      return !value || (typeof value === 'string' && value.trim() === '') || value === 0;
    });
    
    if (missingFields.length > 0) {
      alert(`❌ Please fill in the following required fields:\n\n${missingFields.map(f => f.message).join('\n')}`);
      console.log('Missing fields:', missingFields);
      return;
    }

    // **ENHANCED: Get original job data for position change detection**
    const originalJob = jobs.find(job => job.job_id === editingJob.job_id);
    const originalPositions = originalJob ? parseInt(originalJob.no_of_positions) : 0;
    const newPositions = parseInt(editingJob.no_of_positions);
    const wasClosedJob = originalJob && originalJob.is_active === false;
    const positionsIncreased = newPositions > originalPositions;

    console.log('📊 Position change analysis:', {
      originalPositions,
      newPositions,
      wasClosedJob,
      positionsIncreased,
      willTriggerAutoReopen: wasClosedJob && positionsIncreased
    });

    setActionLoading(prev => ({ ...prev, 'update': true }));

    try {
      // **CHOOSE METHOD: Use JSON for normal updates, FormData for file uploads**
      let response;
      
      if (jdFile) {
        console.log('📁 Using FormData method (file upload detected)');
        
        const formData = new FormData();
        
        // Add all fields to FormData with proper validation
        Object.entries(editingJob).forEach(([key, value]) => {
          if (key !== 'created_at' && key !== 'updated_at' && value !== null && value !== undefined) {
            formData.append(key, String(value));
          }
        });

        // Add file
        formData.append('jd_document_file', jdFile);

        // **DEBUG: Log FormData contents**
        console.log('📤 FormData contents:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}: "${value}"`);
        }

        response = await axios.put(
          `https://skilviu.com/backend/api/v1/recruitments/${editingJob.job_id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json'
            }
          }
        );
      } else {
        console.log('📝 Using JSON method (no file upload)');
        
        // **CLEAN DATA: Prepare JSON payload**
        const jsonPayload = {
          client_id: parseInt(editingJob.client_id),
          client_name: String(editingJob.client_name).trim(),
          job_title: String(editingJob.job_title).trim(),
          type_of_industry: String(editingJob.type_of_industry).trim(),
          notice_period: String(editingJob.notice_period).trim(),
          benefit: String(editingJob.benefit).trim(),
          budget: String(editingJob.budget).trim(),
          package: String(editingJob.package).trim(),
          qualification: String(editingJob.qualification).trim(),
          skills_required: String(editingJob.skills_required).trim(),
          job_location: String(editingJob.job_location).trim(),
          no_of_positions: parseInt(editingJob.no_of_positions),
          hiring_type: String(editingJob.hiring_type).trim(),
          work_mode: String(editingJob.work_mode).trim(),
          key_responsibilities: String(editingJob.key_responsibilities).trim(),
          job_description: String(editingJob.job_description).trim(),
          min_experience: parseInt(editingJob.min_experience) || 0,
          max_experience: parseInt(editingJob.max_experience) || 10,
          preferred_company: String(editingJob.preferred_company || ''),
          timings: String(editingJob.timings || ''),
          working_days: parseInt(editingJob.working_days) || 5,
          diversity_preference: String(editingJob.diversity_preference || ''),
          interview_process: String(editingJob.interview_process || ''),
          status: String(editingJob.status || 'open'),
          is_active: editingJob.is_active ? '1' : '0'
        };

        console.log('📤 Sending JSON payload:', jsonPayload);

        response = await axios.put(
          `https://skilviu.com/backend/api/v1/recruitments/${editingJob.job_id}`,
          jsonPayload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      }

      console.log('✅ Update successful:', response.data);
      await refreshJobs();
      
      // **ENHANCED: Handle different types of success responses**
      let successMessage = '✅ Job updated successfully!';
      
      if (response.data.auto_action_result && response.data.auto_action_result.success) {
        const autoResult = response.data.auto_action_result;
        
        if (autoResult.message && autoResult.message.includes('reopened')) {
          successMessage = `🚀 Job updated and automatically REOPENED!\n\n✅ Position increased from ${originalPositions} to ${newPositions}\n🌟 Job is now VISIBLE on career page!`;
          console.log('🎉 AUTO-REOPEN SUCCESS! Job is now live on career page!');
          
        } else if (autoResult.message && autoResult.message.includes('closed')) {
          successMessage = `🔒 Job updated and automatically CLOSED!\n\n📉 Positions reduced and all spots are now filled.`;
          
        } else {
          successMessage = `✅ Job updated with automatic status adjustment!\n\n${autoResult.message || ''}`;
        }
        
      } else if (wasClosedJob && positionsIncreased) {
        // Even if auto-action didn't trigger, inform about potential visibility
        successMessage = `✅ Job updated successfully!\n\n📈 Positions increased from ${originalPositions} to ${newPositions}\n👀 Check if job is now visible on career page.`;
      }
      
      // **ENHANCED: Show position change info**
      if (originalPositions !== newPositions) {
        console.log(`📊 Position change: ${originalPositions} → ${newPositions}`);
      }
      
      alert(successMessage);
      setEditingJob(null);
      setJdFile(null);

    } catch (err) {
      console.error('❌ Update failed:', err);
      
      let errorMessage = '❌ Update failed';
      
      if (err.response?.status === 422 && err.response?.data?.errors) {
        console.log('🚨 VALIDATION ERRORS:', err.response.data.errors);
        
        const validationErrors = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `❌ ${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        
        errorMessage = `❌ Validation Failed:\n\n${validationErrors}`;
        
      } else if (err.response?.data?.message) {
        errorMessage = `❌ Error: ${err.response.data.message}`;
      } else if (err.message) {
        errorMessage = `❌ ${err.message}`;
      }

      alert(errorMessage);
    } finally {
      setActionLoading(prev => ({ ...prev, 'update': false }));
    }
  };

  const closeModal = () => {
    setEditingJob(null);
    setJdFile(null);
  };

  if (loading) return <div className="p-6 text-center">Loading jobs...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

  // Calculate statistics
  const activeJobs = jobs.filter(job => job.is_active !== false);
  const closedJobs = jobs.filter(job => job.is_active === false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Job List</h1>
        
        {/* **ENHANCED: Job Statistics with better styling** */}
        <div className="flex gap-4">
          <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-center border border-green-200">
            <div className="text-xs font-medium">Active Jobs</div>
            <div className="text-lg font-bold">{activeJobs.length}</div>
          </div>
          <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-center border border-red-200">
            <div className="text-xs font-medium">Closed Jobs</div>
            <div className="text-lg font-bold">{closedJobs.length}</div>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-center border border-blue-200">
            <div className="text-xs font-medium">Total Jobs</div>
            <div className="text-lg font-bold">{jobs.length}</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded overflow-hidden text-sm">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="px-4 py-2">Job Title</th>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Positions</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {jobs.map((job) => (
              <tr key={job.job_id} className={`border-t hover:bg-gray-50 ${
                job.is_active === false ? 'bg-red-50' : ''
              }`}>
                <td className="px-4 py-2">
                  <div className="font-medium">{job.job_title}</div>
                  {job.is_active === false && (
                    <div className="text-xs text-red-600 flex items-center gap-1">
                      🔒 Closed Job
                      <span className="text-xs text-green-600">
                        (Edit to increase positions to reopen)
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">{job.client_name}</td>
                <td className="px-4 py-2">{job.job_location}</td>
                <td className="px-4 py-2">
                  <span className="font-medium">{job.no_of_positions}</span>
                </td>
                <td className="px-4 py-2">
                  {job.is_active === false ? (
                    <div className="flex flex-col">
                      <span className="text-red-600 font-medium text-xs bg-red-100 px-2 py-1 rounded">
                        🔒 CLOSED
                      </span>
                      {job.auto_close_reason && (
                        <span className="text-gray-500 text-xs mt-1">
                          {job.auto_close_reason}
                        </span>
                      )}
                      {job.auto_closed_at && (
                        <span className="text-gray-400 text-xs">
                          {new Date(job.auto_closed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-green-600 font-medium text-xs bg-green-100 px-2 py-1 rounded">
                      ✅ ACTIVE
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => handleEditClick(job)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs transition-colors"
                      title="Edit Job"
                    >
                      📝 Edit
                    </button>
                    
                    {job.is_active === false ? (
                      <button
                        onClick={() => handleReopenJob(job.job_id)}
                        disabled={actionLoading[`reopen_${job.job_id}`]}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50 transition-colors"
                        title="Reopen Job - Make it visible on career page"
                      >
                        {actionLoading[`reopen_${job.job_id}`] ? '⏳' : '🚀 Reopen'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCloseJob(job.job_id)}
                        disabled={actionLoading[`close_${job.job_id}`]}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50 transition-colors"
                        title="Close Job"
                      >
                        {actionLoading[`close_${job.job_id}`] ? '⏳' : '🔒 Close'}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(job.job_id)}
                      disabled={actionLoading[`delete_${job.job_id}`]}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50 transition-colors"
                      title="Delete Job"
                    >
                      {actionLoading[`delete_${job.job_id}`] ? '⏳' : '🗑️ Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* **ENHANCED: Edit Modal with Auto-Reopen Awareness** */}
      {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                📝 Edit Job #{editingJob.job_id}
                {editingJob.is_active === false && (
                  <span className="ml-2 text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                    🔒 CLOSED JOB
                  </span>
                )}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* **ENHANCED: Auto-Reopen Alert** */}
              {editingJob.is_active === false && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🚀</div>
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Auto-Reopen Feature</h3>
                      <p className="text-sm text-green-700 mb-2">
                        <strong>Increase the number of positions</strong> to automatically reopen this job and make it visible on the career page!
                      </p>
                      <p className="text-xs text-green-600">
                        Current positions: <strong>{editingJob.no_of_positions}</strong> → Change to a higher number to trigger auto-reopen
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Control */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">📊 Job Status Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={editingJob.is_active}
                        onChange={handleModalChange}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium">Job Active</span>
                    </label>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Status</label>
                    <select
                      name="status"
                      value={editingJob.status || 'open'}
                      onChange={handleModalChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                      <option value="paused">Paused</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* **ENHANCED: Form Fields with Better Styling** */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { field: 'client_id', label: 'Client ID *', type: 'number' },
                  { field: 'client_name', label: 'Client Name *', type: 'text' },
                  { field: 'job_title', label: 'Job Title *', type: 'text' },
                  { field: 'type_of_industry', label: 'Type of Industry *', type: 'text' },
                  { field: 'notice_period', label: 'Notice Period *', type: 'text' },
                  { field: 'benefit', label: 'Benefit *', type: 'text' },
                  { field: 'budget', label: 'Budget *', type: 'text' },
                  { field: 'package', label: 'Package *', type: 'text' },
                  { field: 'job_location', label: 'Job Location *', type: 'text' },
                  { field: 'no_of_positions', label: 'Number of Positions *', type: 'number' },
                  { field: 'hiring_type', label: 'Hiring Type *', type: 'text' },
                  { field: 'work_mode', label: 'Work Mode *', type: 'text' },
                  { field: 'min_experience', label: 'Min Experience (Years)', type: 'number' },
                  { field: 'max_experience', label: 'Max Experience (Years)', type: 'number' },
                  { field: 'preferred_company', label: 'Preferred Company', type: 'text' },
                  { field: 'timings', label: 'Timings', type: 'text' },
                  { field: 'working_days', label: 'Working Days', type: 'number' },
                  { field: 'diversity_preference', label: 'Diversity Preference', type: 'text' },
                ].map(({ field, label, type }) => (
                  <div key={field}>
                    <label className="block mb-1 text-sm font-medium">
                      {label}
                      {field === 'no_of_positions' && editingJob.is_active === false && (
                        <span className="text-green-600 text-xs ml-1">
                          (⬆️ Increase to auto-reopen job!)
                        </span>
                      )}
                    </label>
                    <input
                      type={type}
                      name={field}
                      value={editingJob[field] || ''}
                      onChange={handleModalChange}
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 transition-colors ${
                        field === 'no_of_positions' && editingJob.is_active === false 
                          ? 'border-green-300 bg-green-50' 
                          : ''
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Text Areas */}
              <div className="space-y-4">
                {[
                  { field: 'qualification', label: 'Qualification *' },
                  { field: 'skills_required', label: 'Skills Required *' },
                  { field: 'interview_process', label: 'Interview Process' },
                  { field: 'key_responsibilities', label: 'Key Responsibilities *' },
                  { field: 'job_description', label: 'Job Description *' },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label className="block mb-1 text-sm font-medium">{label}</label>
                    <textarea
                      name={field}
                      value={editingJob[field] || ''}
                      onChange={handleModalChange}
                      rows={3}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              {/* **ENHANCED: File Upload Section** */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2">📎 Job Description Document</h3>
                <label className="block mb-1 text-sm font-medium">Upload New JD PDF (Optional)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setJdFile(e.target.files[0])}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                {editingJob.jd_document_path && (
                  <p className="text-xs mt-2 text-gray-600">
                    📄 Current file: {editingJob.jd_document_path.split('/').pop()}
                  </p>
                )}
                {jdFile && (
                  <p className="text-xs mt-2 text-green-600">
                    ✅ New file selected: {jdFile.name}
                  </p>
                )}
              </div>

              {/* **ENHANCED: Submit Buttons** */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading.update}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading.update ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Updating...
                    </>
                  ) : (
                    <>
                      ✅ Update Job
                      {editingJob.is_active === false && (
                        <span className="text-xs">(May Auto-Reopen)</span>
                      )}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Formedit;
