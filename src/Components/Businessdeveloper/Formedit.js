import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Formedit() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [jdFile, setJdFile] = useState(null); // ⬅️ Added for new file


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://skilviu.com/backend/api/v1/recruitments');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();

        // Add this console to inspect the response:
        console.log("API response:", data);

        // Adjust based on the actual structure
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

  const handleEditClick = (job) => {
    setEditingJob({ ...job });
    setJdFile(null); // ⬅️ Reset any previously selected file
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditingJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingJob || !editingJob.job_id) {
      alert('Error: Missing job ID.');
      return;
    }

    try {
      const formData = new FormData();

      for (const key in editingJob) {
        formData.append(key, editingJob[key]);
      }

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

      const updated = res.data;
      setJobs((prev) =>
        prev.map((job) =>
          job.job_id === editingJob.job_id ? updated.data : job
        )
      );
      alert('Job updated successfully');
      setEditingJob(null);
      setJdFile(null);
    } catch (err) {
      console.error(err.response || err);
      alert('Update failed. See console for details.');
    }
  };

  const closeModal = () => {
    setEditingJob(null);
    setJdFile(null);
  };

  if (loading) return <div className="p-6 text-center">Loading jobs...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">All Job List</h1>

      <table className="min-w-full bg-white shadow rounded overflow-hidden text-sm">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="px-4 py-2">Job Title</th>
            <th className="px-4 py-2">Client</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {jobs.map((job) => (
            <tr key={job.job_id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{job.job_title}</td>
              <td className="px-4 py-2">{job.client_name}</td>
              <td className="px-4 py-2">{job.job_location}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEditClick(job)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.job_id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Job</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
              {[
                'client_id',
                'client_name',
                'job_title',
                'min_experience',
                'max_experience',
                'preferred_company',
                'type_of_industry',
                'notice_period',
                'benefit',
                'budget',
                'package',
                'qualification',
                'skills_required',
                'job_location',
                'timings',
                'no_of_positions',
                'working_days',
                'diversity_preference',
                'hiring_type',
                'work_mode',
                'interview_process',
                'key_responsibilities',
                'job_description',
              ].map((field) => (
                <div key={field} className="col-span-1">
                  <label className="block mb-1 text-sm capitalize">
                    {field.replace(/_/g, ' ')}
                  </label>

                  {['skills_required', 'key_responsibilities', 'job_description'].includes(field) ? (
                    <textarea
                      name={field}
                      value={editingJob[field] || ''}
                      onChange={handleModalChange}
                      rows={5}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={editingJob[field] || ''}
                      onChange={handleModalChange}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>
              ))}

              {/* PDF Upload Field */}
              <div className="col-span-2">
                <label className="block mb-1 text-sm">Upload New JD PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setJdFile(e.target.files[0])}
                  className="w-full p-2 border rounded"
                />
                {editingJob.jd_document_path && (
                  <p className="text-xs mt-1 text-gray-500">
                    Current file: {editingJob.jd_document_path.split('/').pop()}
                  </p>
                )}
              </div>

              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
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
