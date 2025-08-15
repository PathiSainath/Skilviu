import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const navigate = useNavigate();

  // Fixed useEffect with proper error handling and dependency array
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching jobs from career page...');
        
        // Try multiple API endpoints to ensure we get active jobs
        let response;
        let data;
        
        // Method 1: Try with active_only parameter
        try {
          response = await fetch('https://skilviu.com/backend/api/v1/recruitments?active_only=1');
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          data = await response.json();
          console.log('Method 1 success:', data);
        } catch (error1) {
          console.log('Method 1 failed, trying method 2...');
          
          // Method 2: Try with just active parameter
          response = await fetch('https://skilviu.com/backend/api/v1/recruitments?active=1');
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          data = await response.json();
          console.log('Method 2 success:', data);
        }
        
        console.log('API Response Structure:', data);
        
        // Handle different response structures
        let jobsData = [];
        if (Array.isArray(data)) {
          jobsData = data;
        } else if (data.data && Array.isArray(data.data)) {
          jobsData = data.data;
        } else if (data.success && data.data && Array.isArray(data.data)) {
          jobsData = data.data;
        } else {
          console.error('Unexpected data structure:', data);
          throw new Error('Invalid data structure from API');
        }
        
        console.log('Jobs data extracted:', jobsData);
        
        // Filter for active jobs with multiple safety checks
        const activeJobs = jobsData.filter(job => {
          // Check multiple conditions for active jobs
          const isActive = job.is_active === true || job.is_active === 1 || job.is_active === '1';
          const hasPositions = job.no_of_positions && parseInt(job.no_of_positions) > 0;
          const isNotClosed = job.status !== 'closed' && job.auto_close_reason === null;
          
          console.log(`Job ${job.job_id} (${job.job_title}):`, {
            is_active: job.is_active,
            no_of_positions: job.no_of_positions,
            status: job.status,
            auto_close_reason: job.auto_close_reason,
            shouldShow: isActive && hasPositions && isNotClosed
          });
          
          return isActive && hasPositions && isNotClosed;
        });
        
        console.log(`Filtered ${activeJobs.length} active jobs from ${jobsData.length} total jobs`);
        console.log('Active jobs:', activeJobs.map(job => ({ id: job.job_id, title: job.job_title, is_active: job.is_active })));
        
        setJobs(activeJobs);
        
      } catch (error) {
        console.error('Error fetching recruitment data:', error);
        setError(`Failed to load jobs: ${error.message}`);
        setJobs([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []); // Empty dependency array - runs once on mount

  // Function to manually refresh jobs (useful for testing)
  const refreshJobs = () => {
    console.log('Manually refreshing jobs...');
    setLoading(true);
    // Trigger useEffect by updating a dependency or call fetchJobs directly
    const fetchJobs = async () => {
      // ... same logic as above ...
    };
    fetchJobs();
  };

  const handleApplyNow = (job) => {
    navigate('/candidateform', { state: { job_id: job.job_id, job_title: job.job_title } });
  };

  const handleRefer = (job) => {
    navigate(`/refer/${job.job_id}`, {
      state: {
        job_id: job.job_id,
        job_title: job.job_title,
        job_location: job.job_location,
        client_name: job.client_name
      }
    });
  };

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      <motion.div
        className="bg-blue-500 px-8 py-6 h-24"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-white text-4xl font-bold ml-4 sm:ml-28">Careers</h1>
      </motion.div>

      <div className="px-6 py-10">
        {/* Debug Information - Remove in production */}
        <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Loading: {loading.toString()}</p>
          <p>Jobs Count: {jobs.length}</p>
          <p>Error: {error || 'None'}</p>
          <button 
            onClick={refreshJobs}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Jobs
          </button>
        </div>

        {loading ? (
          <p className="text-center text-lg text-gray-600">Loading job openings...</p>
        ) : error ? (
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <button 
              onClick={refreshJobs}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">No job openings available at the moment.</p>
            <button 
              onClick={refreshJobs}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {currentJobs.map((job) => (
                <motion.div
                  key={job.job_id}
                  className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{job.job_title}</h2>
                    <p className="text-gray-500 text-sm mb-1"><strong>Location:</strong> {job.job_location}</p>
                    <p className="text-gray-500 text-sm mb-1"><strong>Industry:</strong> {job.type_of_industry}</p>
                    <p className="text-gray-500 text-sm mb-1"><strong>Positions:</strong> {job.no_of_positions}</p>
                    <p className="text-gray-500 text-sm mb-1"><strong>Skills:</strong> {job.skills_required || 'N/A'}</p>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      <strong>Job Description:</strong> {job.job_description}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate(`/jobs/${job.job_id}`, { state: { job } })}
                      className="bg-blue-500 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm"
                    >
                      READ MORE
                    </button>
                    <button
                      onClick={() => handleApplyNow(job)}
                      className="bg-green-600 hover:bg-green-800 text-white rounded-xl px-4 py-2 text-sm"
                    >
                      APPLY NOW
                    </button>
                    <button
                      onClick={() => handleRefer(job)}
                      className="bg-blue-500 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm"
                    >
                      REFER TO A FRIEND
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center gap-4">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg text-sm ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                >
                  Previous
                </button>

                <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg text-sm ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Careers;
