import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Formedit() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [actionLoading, setActionLoading] = useState({}); // Track loading for individual actions

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://skilviu.com/backend/api/v1/recruitments/admin/all');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();

        console.log("API response:", data);
        console.log("Total jobs fetched:", data.total_count);
        console.log("Active jobs:", data.active_count);
        console.log("Inactive jobs:", data.inactive_count);

        const jobList = Array.isArray(data) ? data : data.data || [];
        setJobs(jobList);
        
        if (data.total_count && jobList.length !== data.total_count) {
          console.warn(`⚠️ Expected ${data.total_count} jobs but got ${jobList.length}. Check data structure.`);
        }
        
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

  // Enhanced reopen job function using the new service endpoint
  const handleReopenJob = async (job_id) => {
    const confirmed = window.confirm('Are you sure you want to reopen this closed job?');
    if (!confirmed) return;

    setActionLoading(prev => ({ ...prev, [`reopen_${job_id}`]: true }));

    try {
      console.log(`Attempting to reopen job ${job_id}`);
      
      // Use the enhanced service endpoint
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
        alert('Job reopened successfully! It will now appear on the career page.');
      } else {
        // If service endpoint fails, try fallback method
        console.log('Service endpoint failed, trying fallback...');
        await handleReopenJobFallback(job_id);
      }
    } catch (error) {
      console.error('Network error:', error);
      // Try fallback method
      await handleReopenJobFallback(job_id);
    } finally {
      setActionLoading(prev => ({ ...prev, [`reopen_${job_id}`]: false }));
    }
  };

  // Fallback reopen method
  const handleReopenJobFallback = async (job_id) => {
    try {
      const currentJob = jobs.find(job => job.job_id === job_id);
      if (!currentJob) {
        alert('Job not found');
        return;
      }

      const formData = new FormData();
      formData.append('is_active', true);
      formData.append('status', 'open');
      formData.append('auto_close_reason', '');
      formData.append('auto_closed_at', '');

      // Add required fields
      ['client_id', 'client_name', 'job_title', 'job_location', 'no_of_positions',
       'type_of_industry', 'notice_period', 'benefit', 'budget', 'package',
       'qualification', 'skills_required', 'hiring_type', 'work_mode',
       'key_responsibilities', 'job_description'].forEach(field => {
        if (currentJob[field] !== null && currentJob[field] !== undefined && currentJob[field] !== '') {
          formData.append(field, currentJob[field]);
        }
      });

      const res = await fetch(`https://skilviu.com/backend/api/v1/recruitments/${job_id}?_method=PUT`, {
        method: 'POST',
        body: formData,
      });

      const responseData = await res.json();

      if (res.ok) {
        await refreshJobs();
        alert('Job reopened successfully using fallback method!');
      } else {
        throw new Error(responseData.message || 'Fallback method failed');
      }
    } catch (error) {
      console.error('Fallback reopen failed:', error);
      alert(`Failed to reopen job: ${error.message}`);
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
        alert('Job closed successfully');
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

  const handleEditClick = (job) => {
    setEditingJob({ ...job });
    setJdFile(null);
  };

  const handleModalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingJob((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // Enhanced update with better auto-reopen integration
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingJob || !editingJob.job_id) {
      alert('Error: Missing job ID.');
      return;
    }

    // Validation
    const requiredFields = ['job_title', 'client_name', 'job_location', 'no_of_positions'];
    const missingFields = requiredFields.filter(field => 
      !editingJob[field] || editingJob[field].toString().trim() === ''
    );
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (editingJob.no_of_positions && (isNaN(editingJob.no_of_positions) || parseInt(editingJob.no_of_positions) <= 0)) {
      alert('Number of positions must be a positive number');
      return;
    }

    setActionLoading(prev => ({ ...prev, 'update': true }));

    try {
      const originalJob = jobs.find(job => job.job_id === editingJob.job_id);
      
      // Check if this might trigger auto-reopen
      const willAutoReopen = originalJob && 
                            originalJob.is_active === false && 
                            parseInt(editingJob.no_of_positions) > parseInt(originalJob.no_of_positions || 0);

      const formData = new FormData();

      // Add all job fields
      for (const key in editingJob) {
        if (key !== 'created_at' && key !== 'updated_at') {
          const value = editingJob[key];
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        }
      }

      // Add file if selected
      if (jdFile) {
        formData.append('jd_document_file', jdFile);
      }

      const res = await axios.post(
        `https://skilviu.com/backend/api/v1/recruitments/${editingJob.job_id}?_method=PUT`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Update response:', res.data);

      // Refresh jobs list
      await refreshJobs();
      
      // Show appropriate success message
      if (res.data.auto_reopen_result && res.data.auto_reopen_result.success) {
        alert('Job updated and automatically reopened due to increased positions! It will now appear on the career page.');
      } else if (willAutoReopen) {
        alert('Job updated successfully! Auto-reopen may take a moment to process.');
      } else if (res.data.message && res.data.message.includes('automatically reopened')) {
        alert(res.data.message);
      } else {
        alert('Job updated successfully');
      }
      
      setEditingJob(null);
      setJdFile(null);
    } catch (err) {
      console.error('Update error details:', err.response || err);
      
      let errorMessage = 'Update failed';
      if (err.response?.data) {
        if (err.response.data.errors) {
          const validationErrors = Object.entries(err.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          errorMessage = `Validation errors:\n${validationErrors}`;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
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
        
        {/* Job Statistics */}
        <div className="flex gap-4">
          <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-center">
            <div className="text-xs font-medium">Active Jobs</div>
            <div className="text-lg font-bold">{activeJobs.length}</div>
          </div>
          <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-center">
            <div className="text-xs font-medium">Closed Jobs</div>
            <div className="text-lg font-bold">{closedJobs.length}</div>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-center">
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
                    <div className="text-xs text-red-600">🔒 Closed Job</div>
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
                        CLOSED
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
                      ACTIVE
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => handleEditClick(job)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                      title="Edit Job"
                    >
                      Edit
                    </button>
                    
                    {/* Show appropriate action button based on job status */}
                    {job.is_active === false ? (
                      <button
                        onClick={() => handleReopenJob(job.job_id)}
                        disabled={actionLoading[`reopen_${job.job_id}`]}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                        title="Reopen Job"
                      >
                        {actionLoading[`reopen_${job.job_id}`] ? '...' : 'Reopen'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCloseJob(job.job_id)}
                        disabled={actionLoading[`close_${job.job_id}`]}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                        title="Close Job"
                      >
                        {actionLoading[`close_${job.job_id}`] ? '...' : 'Close'}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(job.job_id)}
                      disabled={actionLoading[`delete_${job.job_id}`]}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                      title="Delete Job"
                    >
                      {actionLoading[`delete_${job.job_id}`] ? '...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Edit Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Edit Job 
                {editingJob.is_active === false && (
                  <span className="ml-2 text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                    CLOSED JOB
                  </span>
                )}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Auto-reopen Alert */}
              {editingJob.is_active === false && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    🚀 <strong>Auto-Reopen Feature:</strong> Increasing the number of positions will automatically reopen this job and make it visible on the career page!
                  </p>
                </div>
              )}

              {/* Job Status Control Section */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Job Status Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={editingJob.is_active !== false}
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
                  <div>
                    <label className="block mb-1 text-sm font-medium">Closure Reason</label>
                    <input
                      type="text"
                      name="auto_close_reason"
                      value={editingJob.auto_close_reason || ''}
                      onChange={handleModalChange}
                      placeholder="Reason for closure"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Main Job Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { field: 'client_id', label: 'Client ID', type: 'number', required: false },
                  { field: 'client_name', label: 'Client Name *', type: 'text', required: true },
                  { field: 'job_title', label: 'Job Title *', type: 'text', required: true },
                  { field: 'min_experience', label: 'Min Experience', type: 'number', required: false },
                  { field: 'max_experience', label: 'Max Experience', type: 'number', required: false },
                  { field: 'preferred_company', label: 'Preferred Company', type: 'text', required: false },
                  { field: 'type_of_industry', label: 'Type of Industry', type: 'text', required: false },
                  { field: 'notice_period', label: 'Notice Period', type: 'text', required: false },
                  { field: 'benefit', label: 'Benefit', type: 'text', required: false },
                  { field: 'budget', label: 'Budget', type: 'text', required: false },
                  { field: 'package', label: 'Package', type: 'text', required: false },
                  { field: 'job_location', label: 'Job Location *', type: 'text', required: true },
                  { field: 'timings', label: 'Timings', type: 'text', required: false },
                  { field: 'no_of_positions', label: 'Number of Positions *', type: 'number', required: true },
                  { field: 'working_days', label: 'Working Days', type: 'number', required: false },
                  { field: 'diversity_preference', label: 'Diversity Preference', type: 'text', required: false },
                  { field: 'hiring_type', label: 'Hiring Type', type: 'text', required: false },
                  { field: 'work_mode', label: 'Work Mode', type: 'text', required: false },
                ].map(({ field, label, type, required }) => (
                  <div key={field}>
                    <label className="block mb-1 text-sm font-medium">
                      {label}
                      {field === 'no_of_positions' && editingJob.is_active === false && (
                        <span className="text-green-600 text-xs ml-1">
                          (Increase to auto-reopen job)
                        </span>
                      )}
                    </label>
                    <input
                      type={type}
                      name={field}
                      value={editingJob[field] || ''}
                      onChange={handleModalChange}
                      required={required}
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                        required && (!editingJob[field] || editingJob[field].toString().trim() === '') 
                          ? 'border-red-300 bg-red-50' 
                          : ''
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Text Areas */}
              <div className="space-y-4">
                {[
                  { field: 'qualification', label: 'Qualification' },
                  { field: 'skills_required', label: 'Skills Required' },
                  { field: 'interview_process', label: 'Interview Process' },
                  { field: 'key_responsibilities', label: 'Key Responsibilities' },
                  { field: 'job_description', label: 'Job Description' },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label className="block mb-1 text-sm font-medium">{label}</label>
                    <textarea
                      name={field}
                      value={editingJob[field] || ''}
                      onChange={handleModalChange}
                      rows={4}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              {/* PDF Upload Field */}
              <div>
                <label className="block mb-1 text-sm font-medium">Upload New JD PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setJdFile(e.target.files[0])}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                {editingJob.jd_document_path && (
                  <p className="text-xs mt-1 text-gray-500">
                    Current file: {editingJob.jd_document_path.split('/').pop()}
                  </p>
                )}
                {jdFile && (
                  <p className="text-xs mt-1 text-green-600">
                    New file selected: {jdFile.name}
                  </p>
                )}
              </div>

              {/* Modal Footer */}
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
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading.update ? 'Updating...' : 'Update Job'}
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

