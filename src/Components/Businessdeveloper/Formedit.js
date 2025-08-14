// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function Formedit() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingJob, setEditingJob] = useState(null);
//   const [jdFile, setJdFile] = useState(null); // ⬅️ Added for new file


//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch('https://skilviu.com/backend/api/v1/recruitments');
//         if (!response.ok) throw new Error('Failed to fetch jobs');
//         const data = await response.json();

//         // Add this console to inspect the response:
//         console.log("API response:", data);

//         // Adjust based on the actual structure
//         const jobList = Array.isArray(data) ? data : data.data || [];
//         setJobs(jobList);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load jobs.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   const handleDelete = async (job_id) => {
//     const confirmed = window.confirm('Are you sure you want to delete this job?');
//     if (!confirmed) return;

//     try {
//       const res = await fetch(`https://skilviu.com/backend/api/v1/recruitments/${job_id}`, {
//         method: 'DELETE',
//       });
//       if (res.ok) {
//         setJobs((prevJobs) => prevJobs.filter((job) => job.job_id !== job_id));
//         alert('Job deleted successfully');
//       } else {
//         alert('Failed to delete job');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('An error occurred while deleting the job');
//     }
//   };

//   const handleEditClick = (job) => {
//     setEditingJob({ ...job });
//     setJdFile(null); // ⬅️ Reset any previously selected file
//   };

//   const handleModalChange = (e) => {
//     const { name, value } = e.target;
//     setEditingJob((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     if (!editingJob || !editingJob.job_id) {
//       alert('Error: Missing job ID.');
//       return;
//     }

//     try {
//       const formData = new FormData();

//       for (const key in editingJob) {
//         formData.append(key, editingJob[key]);
//       }

//       if (jdFile) {
//         formData.append('jd_document_file', jdFile);
//       }

//       const res = await axios.post(
//         `https://skilviu.com/backend/api/v1/recruitments/${editingJob.job_id}?_method=PUT`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       const updated = res.data;
//       setJobs((prev) =>
//         prev.map((job) =>
//           job.job_id === editingJob.job_id ? updated.data : job
//         )
//       );
//       alert('Job updated successfully');
//       setEditingJob(null);
//       setJdFile(null);
//     } catch (err) {
//       console.error(err.response || err);
//       alert('Update failed. See console for details.');
//     }
//   };

//   const closeModal = () => {
//     setEditingJob(null);
//     setJdFile(null);
//   };

//   if (loading) return <div className="p-6 text-center">Loading jobs...</div>;
//   if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-6">All Job List</h1>

//       <table className="min-w-full bg-white shadow rounded overflow-hidden text-sm">
//         <thead className="bg-blue-800 text-white">
//           <tr>
//             <th className="px-4 py-2">Job Title</th>
//             <th className="px-4 py-2">Client</th>
//             <th className="px-4 py-2">Location</th>
//             <th className="px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="text-gray-700">
//           {jobs.map((job) => (
//             <tr key={job.job_id} className="border-t hover:bg-gray-50">
//               <td className="px-4 py-2">{job.job_title}</td>
//               <td className="px-4 py-2">{job.client_name}</td>
//               <td className="px-4 py-2">{job.job_location}</td>
//               <td className="px-4 py-2 space-x-2">
//                 <button
//                   onClick={() => handleEditClick(job)}
//                   className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(job.job_id)}
//                   className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal */}
//       {editingJob && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-screen overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">Edit Job</h2>
//             <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
//               {[
//                 'client_id',
//                 'client_name',
//                 'job_title',
//                 'min_experience',
//                 'max_experience',
//                 'preferred_company',
//                 'type_of_industry',
//                 'notice_period',
//                 'benefit',
//                 'budget',
//                 'package',
//                 'qualification',
//                 'skills_required',
//                 'job_location',
//                 'timings',
//                 'no_of_positions',
//                 'working_days',
//                 'diversity_preference',
//                 'hiring_type',
//                 'work_mode',
//                 'interview_process',
//                 'key_responsibilities',
//                 'job_description',
//               ].map((field) => (
//                 <div key={field} className="col-span-1">
//                   <label className="block mb-1 text-sm capitalize">
//                     {field.replace(/_/g, ' ')}
//                   </label>

//                   {['skills_required', 'key_responsibilities', 'job_description'].includes(field) ? (
//                     <textarea
//                       name={field}
//                       value={editingJob[field] || ''}
//                       onChange={handleModalChange}
//                       rows={5}
//                       className="w-full p-2 border rounded"
//                     />
//                   ) : (
//                     <input
//                       type="text"
//                       name={field}
//                       value={editingJob[field] || ''}
//                       onChange={handleModalChange}
//                       className="w-full p-2 border rounded"
//                     />
//                   )}
//                 </div>
//               ))}

//               {/* PDF Upload Field */}
//               <div className="col-span-2">
//                 <label className="block mb-1 text-sm">Upload New JD PDF</label>
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) => setJdFile(e.target.files[0])}
//                   className="w-full p-2 border rounded"
//                 />
//                 {editingJob.jd_document_path && (
//                   <p className="text-xs mt-1 text-gray-500">
//                     Current file: {editingJob.jd_document_path.split('/').pop()}
//                   </p>
//                 )}
//               </div>

//               <div className="col-span-2 flex justify-end gap-3 mt-4">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   Update
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// export default Formedit;


import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Formedit() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [jdFile, setJdFile] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // UPDATED: Use the admin endpoint to fetch ALL jobs (including closed ones)
        const response = await fetch('https://skilviu.com/backend/api/v1/recruitments/admin/all');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();

        console.log("API response:", data);
        console.log("Total jobs fetched:", data.total_count);
        console.log("Active jobs:", data.active_count);
        console.log("Inactive jobs:", data.inactive_count);

        const jobList = Array.isArray(data) ? data : data.data || [];
        setJobs(jobList);
        
        // Verify we got all expected jobs
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

  const handleDelete = async (job_id) => {
    const confirmed = window.confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;

    try {
      const res = await fetch(`https://skilviu.com/backend/api/v1/recruitments/${job_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setJobs((prevJobs) => prevJobs.filter((job) => job.job_id !== job_id));
        alert('Job deleted successfully');
      } else {
        alert('Failed to delete job');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the job');
    }
  };

  // Handle reopening closed jobs
  const handleReopenJob = async (job_id) => {
    const confirmed = window.confirm('Are you sure you want to reopen this closed job?');
    if (!confirmed) return;

    try {
      const res = await fetch(`https://skilviu.com/backend/api/v1/job-closure/${job_id}/reopen`, {
        method: 'POST',
      });
      
      if (res.ok) {
        // Refresh the jobs list
        const response = await fetch('https://skilviu.com/backend/api/v1/recruitments/admin/all');
        const data = await response.json();
        const jobList = Array.isArray(data) ? data : data.data || [];
        setJobs(jobList);
        alert('Job reopened successfully');
      } else {
        const errorData = await res.json();
        alert(`Failed to reopen job: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while reopening the job');
    }
  };

  // Handle manual job closure
  const handleCloseJob = async (job_id) => {
    const reason = prompt('Enter reason for closing this job:');
    if (!reason) return;

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
        // Refresh the jobs list
        const response = await fetch('https://skilviu.com/backend/api/v1/recruitments/admin/all');
        const data = await response.json();
        const jobList = Array.isArray(data) ? data : data.data || [];
        setJobs(jobList);
        alert('Job closed successfully');
      } else {
        const errorData = await res.json();
        alert(`Failed to close job: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while closing the job');
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingJob || !editingJob.job_id) {
      alert('Error: Missing job ID.');
      return;
    }

    try {
      const formData = new FormData();

      // Add all job fields to formData
      for (const key in editingJob) {
        if (key !== 'created_at' && key !== 'updated_at') {
          formData.append(key, editingJob[key]);
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

      // Refresh the entire job list to get latest status
      const response = await fetch('https://skilviu.com/backend/api/v1/recruitments/admin/all');
      const data = await response.json();
      const jobList = Array.isArray(data) ? data : data.data || [];
      setJobs(jobList);
      
      alert('Job updated successfully');
      setEditingJob(null);
      setJdFile(null);
    } catch (err) {
      console.error(err.response || err);
      alert(`Update failed: ${err.response?.data?.message || err.message}`);
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
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                        title="Reopen Job"
                      >
                        Reopen
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCloseJob(job.job_id)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-xs"
                        title="Close Job"
                      >
                        Close
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(job.job_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      title="Delete Job"
                    >
                      Delete
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
                  { field: 'client_id', label: 'Client ID', type: 'number' },
                  { field: 'client_name', label: 'Client Name', type: 'text' },
                  { field: 'job_title', label: 'Job Title', type: 'text' },
                  { field: 'min_experience', label: 'Min Experience', type: 'number' },
                  { field: 'max_experience', label: 'Max Experience', type: 'number' },
                  { field: 'preferred_company', label: 'Preferred Company', type: 'text' },
                  { field: 'type_of_industry', label: 'Type of Industry', type: 'text' },
                  { field: 'notice_period', label: 'Notice Period', type: 'text' },
                  { field: 'benefit', label: 'Benefit', type: 'text' },
                  { field: 'budget', label: 'Budget', type: 'text' },
                  { field: 'package', label: 'Package', type: 'text' },
                  { field: 'job_location', label: 'Job Location', type: 'text' },
                  { field: 'timings', label: 'Timings', type: 'text' },
                  { field: 'no_of_positions', label: 'Number of Positions', type: 'number' },
                  { field: 'working_days', label: 'Working Days', type: 'number' },
                  { field: 'diversity_preference', label: 'Diversity Preference', type: 'text' },
                  { field: 'hiring_type', label: 'Hiring Type', type: 'text' },
                  { field: 'work_mode', label: 'Work Mode', type: 'text' },
                ].map(({ field, label, type }) => (
                  <div key={field}>
                    <label className="block mb-1 text-sm font-medium">
                      {label}
                      {field === 'no_of_positions' && editingJob.is_active === false && (
                        <span className="text-red-600 text-xs ml-1">
                          (Increase to reopen job)
                        </span>
                      )}
                    </label>
                    <input
                      type={type}
                      name={field}
                      value={editingJob[field] || ''}
                      onChange={handleModalChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Update Job
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
