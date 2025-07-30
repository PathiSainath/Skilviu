// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';

// function Careers() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

  
//   useEffect(() => {
//     fetch('https://skilviu.com/backend/api/v1/recruitments')
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("API Response:", data); // Helpful debug
//         setJobs(Array.isArray(data) ? data : data.data || []); // Robust fallback
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching recruitment data:', error);
//         setLoading(false);
//       });
//   }, []);


//   const handleApplyNow = (job) => {
//     navigate('/candidateform', { state: { job_id: job.job_id, job_title: job.job_title } });
//   };


//   const handleRefer = (job) => {
//     navigate('/refer', { state: { jobTitle: job.job_title } });
//   };

//   return (
//     <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
//       <motion.div
//         className="bg-blue-500 px-8 py-6 h-24"
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <h1 className="text-white text-4xl font-bold ml-4 sm:ml-28">Careers</h1>
//       </motion.div>

//       <div className="px-6 py-10">
//         {loading ? (
//           <p className="text-center text-lg text-gray-600">Loading job openings...</p>
//         ) : jobs.length === 0 ? (
//           <p className="text-center text-lg text-gray-600">No job openings available.</p>
//         ) : (
//           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             {jobs.map((job) => (
//               <motion.div
//                 key={job.id}
//                 className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-800">{job.job_title}</h2>
//                   <p className="text-gray-500 text-sm mb-1"><strong>Location:</strong> {job.job_location}</p>
//                   <p className="text-gray-500 text-sm mb-1"><strong>Industry:</strong> {job.type_of_industry}</p>
//                   <p className="text-gray-500 text-sm mb-1"><strong>Skills:</strong> {job.skills_required || 'N/A'}</p>
//                   {/* <p className="text-gray-500 text-sm mb-2"><strong>Package:</strong> {job.package || 'N/A'}</p> */}
//                   <p className="text-gray-600 text-sm line-clamp-3">
//                     <strong>Job Description:</strong> {job.job_description}
//                   </p>
//                 </div>


//                 <div className="mt-4 flex flex-wrap gap-3">
//                   <button
//                     // onClick={() => navigate(`/jobs/${job.id}`)}
//                     onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}
//                     className="bg-blue-500 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm"
//                   >
//                     READ MORE
//                   </button>
//                   <button
//                     onClick={() => handleApplyNow(job)}  // Pass job here
//                     className="bg-green-600 hover:bg-green-800 text-white rounded-xl px-4 py-2 text-sm"
//                   >
//                     APPLY NOW
//                   </button>

//                   <button
//                     onClick={() => handleRefer(job)}
//                     className="bg-blue-500 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm"
//                   >
//                     REFER TO A FRIEND
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Careers;





import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://skilviu.com/backend/api/v1/recruitments')
      .then((res) => res.json())
      .then((data) => {
        setJobs(Array.isArray(data) ? data : data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching recruitment data:', error);
        setLoading(false);
      });
  }, []);

  const handleApplyNow = (job) => {
    navigate('/candidateform', { state: { job_id: job.job_id, job_title: job.job_title } });
  };

  const handleRefer = (job) => {
    navigate('/refer', { state: { jobTitle: job.job_title } });
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
        {loading ? (
          <p className="text-center text-lg text-gray-600">Loading job openings...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No job openings available.</p>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {currentJobs.map((job) => (
                <motion.div
                  key={job.id}
                  className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{job.job_title}</h2>
                    <p className="text-gray-500 text-sm mb-1"><strong>Location:</strong> {job.job_location}</p>
                    <p className="text-gray-500 text-sm mb-1"><strong>Industry:</strong> {job.type_of_industry}</p>
                    <p className="text-gray-500 text-sm mb-1"><strong>Skills:</strong> {job.skills_required || 'N/A'}</p>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      <strong>Job Description:</strong> {job.job_description}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}
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
          </>
        )}
      </div>
    </div>
  );
}

export default Careers;
