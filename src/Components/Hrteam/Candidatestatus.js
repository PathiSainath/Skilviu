// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function Candidatestatus() {
//   const [candidates, setCandidates] = useState([]);
//   const [recruitments, setRecruitments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [expandedCandidate, setExpandedCandidate] = useState(null);
//   const [showTrackerModal, setShowTrackerModal] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [candidatesRes, recruitmentsRes] = await Promise.all([
//           axios.get('https://skilviu.com/backend/api/v1/candidates'),
//           axios.get('https://skilviu.com/backend/api/v1/recruitments'),
//         ]);

//         const candidatesWithTrackers = await Promise.all(
//           candidatesRes.data.map(async (c) => {
//             try {
//               const trackerRes = await axios.get(`https://skilviu.com/backend/api/v1/process-tracker/${c.id}`);
//               return {
//                 ...c,
//                 process_stages: trackerRes.data || {},
//               };
//             } catch {
//               return { ...c, process_stages: {} };
//             }
//           })
//         );

//         setCandidates(candidatesWithTrackers);
//         setRecruitments(recruitmentsRes.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Failed to fetch data:', err);
//         setError('Failed to load data. Please try again.');
//         setLoading(false);
//       }
//     };


//     fetchAll();
//   }, []);

//   const handleStatusChange = (candidate, newStatus) => {
//     // Use the correct ID field - check which one exists
//     const candidateId = candidate.candidate_id || candidate.id;

//     if (!candidateId) {
//       console.error('Candidate ID is missing:', candidate);
//       setError('Candidate ID is missing.');
//       return;
//     }

//     axios.put(`https://skilviu.com/backend/api/v1/candidates/${candidateId}`, {
//       // candidate_name: candidate.candidate_name,
//       // email: candidate.email,
//       // job_id: candidate.job_id,
//       // // ... any other required fields
//       status: newStatus,
//     })
//       .then(() => {
//         setCandidates((prev) =>
//           prev.map((c) => {
//             const cId = c.candidate_id || c.id;
//             return cId === candidateId
//               ? { ...c, status: newStatus }
//               : c;
//           })
//         );
//         if (newStatus === 'Selected') {
//           setSelectedCandidate({ ...candidate, status: newStatus });
//           setShowTrackerModal(true);
//         }
//       })
//       .catch((error) => {
//         console.error('Failed to update status:', error);
//         setError('Failed to update candidate status. Please check your network connection.');
//       });
//   };

// const handleProcessStageChange = async (candidateId, stage, status) => {
//   try {
//     await axios.put(`https://skilviu.com/backend/api/v1/process-tracker/${candidateId}`, {
//       stage,
//       status,
//     });

//     setCandidates((prev) =>
//       prev.map((c) => {
//         const cId = c.candidate_id || c.id;
//         return cId === candidateId
//           ? {
//               ...c,
//               process_stages: {
//                 ...c.process_stages,
//                 [stage]: status,
//               },
//             }
//           : c;
//       })
//     );
//   } catch (err) {
//     console.error('Failed to update tracker:', err);
//     setError('Failed to update process tracker.');
//   }
// };


//   if (loading) return <p className="p-4 text-gray-600">Loading data...</p>;
//   if (error) return <p className="p-4 text-red-600">{error}</p>;

//   // Group candidates by job_id
//   const groupedCandidates = {};
//   candidates.forEach((candidate) => {
//     const jobId = candidate.job_id;
//     if (jobId) {
//       if (!groupedCandidates[jobId]) groupedCandidates[jobId] = [];
//       groupedCandidates[jobId].push(candidate);
//     }
//   });

//   const getRecruitmentById = (jobId) => {
//     return recruitments.find((r) => r.id === jobId || r.job_id === jobId);
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-3xl font-bold text-gray-800 mb-10">
//         Candidate Status
//       </h2>

//       {Object.entries(groupedCandidates).map(([jobId, candidatesList]) => {
//         const recruitment = getRecruitmentById(parseInt(jobId));
//         const jobTitle = recruitment?.job_title || `Job ID: ${jobId}`;
//         const jobDescription =
//           recruitment?.job_description ||
//           'No job description available for this position.';
//         const clientName = recruitment?.client_name || '';
//         const experience = recruitment
//           ? `${recruitment.min_experience || 0}-${recruitment.max_experience || 0} years`
//           : '';
//         const location = recruitment?.job_location || '';
//         const packageRange = recruitment?.package || recruitment?.budget || '';

//         return (
//           <div
//             key={jobId}
//             className="mb-10 border rounded-xl shadow-sm hover:shadow-md transition bg-white"
//           >
//             <div className="grid grid-cols-1 lg:grid-cols-2">
//               {/* Job Info */}
//               <div className="p-6 border-r border-gray-200 lg:border-b-0 border-b">
//                 <div className="mb-4">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                     {jobTitle}
//                   </h3>
//                 </div>

//                 <div className="text-gray-700 text-sm">
//                   <h4 className="font-medium text-gray-800 mb-3">
//                     Job Description:
//                   </h4>
//                   <div className="whitespace-pre-line leading-relaxed bg-gray-50 p-3 rounded-lg">
//                     {jobDescription}
//                   </div>
//                 </div>

//                 {recruitment && (
//                   <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
//                     {recruitment.skills_required && (
//                       <div>
//                         <span className="font-medium">Skills:</span>{' '}
//                         {recruitment.skills_required}
//                       </div>
//                     )}
//                     {recruitment.notice_period && (
//                       <div>
//                         <span className="font-medium">Notice Period:</span>{' '}
//                         {recruitment.notice_period}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Candidate List */}
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h4 className="text-lg font-semibold text-gray-800">
//                     Candidates Applied
//                   </h4>
//                   <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                     {candidatesList.length} candidate
//                     {candidatesList.length !== 1 ? 's' : ''}
//                   </span>
//                 </div>

//                 <div className="space-y-3 max-h-96 overflow-y-auto">
//                   {candidatesList.map((candidate) => {
//                     // Use the correct ID field for the key
//                     const candidateKey = candidate.candidate_id || candidate.id;

//                     return (
//                       <div key={candidateKey}>
//                         <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
//                           <div className="flex flex-col gap-3">
//                             <div className="text-sm">
//                               <div className="font-medium text-gray-800">
//                                 {candidate.candidate_name}
//                               </div>
//                               <div className="text-gray-600">
//                                 {candidate.email}
//                               </div>
//                             </div>

//                             <button
//                               onClick={() =>
//                                 handleStatusChange(candidate, 'Selected')
//                               }
//                               className={`px-3 py-1 text-sm rounded-md ${candidate.status === 'Selected'
//                                 ? 'bg-green-100 text-green-800'
//                                 : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
//                                 }`}
//                             >
//                               {candidate.status === 'Selected'
//                                 ? 'Selected'
//                                 : 'Select Candidate'}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}

//       {Object.keys(groupedCandidates).length === 0 && (
//         <div className="text-center py-8 text-gray-500">
//           No candidates found.
//         </div>
//       )}

//       {/* Modal */}
//       {showTrackerModal && selectedCandidate && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold text-gray-800">
//                 Hiring Process Tracker for {selectedCandidate.candidate_name}
//               </h3>
//               <button
//                 onClick={() => setShowTrackerModal(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="space-y-4">
//               {[
//                 {
//                   label: 'Screen Candidate',
//                   key: 'screening',
//                   description: 'Initial candidate screening and evaluation',
//                 },
//                 {
//                   label: 'L1 Interview - Team Lead',
//                   key: 'l1_interview',
//                   description:
//                     'If shortlisted, share with team lead to take the L1 interview',
//                 },
//                 {
//                   label: 'Client CV Review',
//                   key: 'client_review',
//                   description:
//                     'If shortlisted from team lead, share with client',
//                 },
//                 {
//                   label: 'Client Interview',
//                   key: 'client_interview',
//                   description:
//                     'Client will check the CV, if selected they will schedule interviews',
//                 },
//                 {
//                   label: 'Offer Letter',
//                   key: 'offer_letter',
//                   description: 'If selected, will share the offer letter',
//                 },
//               ].map((step, index) => (
//                 <React.Fragment key={step.key}>
//                   <div className="flex items-start gap-3">
//                     <div
//                       className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${selectedCandidate.process_stages?.[step.key] ===
//                         'completed'
//                         ? 'bg-green-500'
//                         : selectedCandidate.process_stages?.[step.key] ===
//                           'in_progress'
//                           ? 'bg-blue-500'
//                           : 'bg-gray-300'
//                         }`}
//                     ></div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-sm font-medium text-gray-800">
//                           {step.label}
//                         </span>
//                         <select
//                           value={
//                             selectedCandidate.process_stages?.[step.key] ||
//                             'pending'
//                           }
//                           onChange={(e) =>
//                             handleProcessStageChange(
//                               selectedCandidate.candidate_id || selectedCandidate.id,
//                               step.key,
//                               e.target.value
//                             )
//                           }
//                           className="text-xs border rounded px-2 py-1 bg-white"
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="in_progress">In Progress</option>
//                           <option value="completed">Completed</option>
//                           <option value="scheduled">Scheduled</option>
//                           <option value="shared">CV Shared</option>
//                           <option value="under_review">Under Review</option>
//                           <option value="prepared">Prepared</option>
//                           <option value="sent">Sent</option>
//                           <option value="accepted">Accepted</option>
//                           <option value="rejected">Rejected</option>
//                         </select>
//                       </div>
//                       <p className="text-xs text-gray-600">{step.description}</p>
//                     </div>
//                   </div>

//                   {index < 4 && (
//                     <div className="ml-1.5 w-0.5 h-4 bg-gray-300"></div>
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>

//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => setShowTrackerModal(false)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Candidatestatus;







import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Candidatestatus() {
  const [candidates, setCandidates] = useState([]);
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [candidatesRes, recruitmentsRes] = await Promise.all([
          axios.get('https://skilviu.com/backend/api/v1/candidates'),
          axios.get('https://skilviu.com/backend/api/v1/recruitments'),
        ]);

        const candidatesWithTrackers = await Promise.all(
          candidatesRes.data.map(async (c) => {
            try {
              const trackerRes = await axios.get(`https://skilviu.com/backend/api/v1/process-tracker/${c.id}`);
              return {
                ...c,
                process_stages: trackerRes.data || {},
              };
            } catch {
              return { ...c, process_stages: {} };
            }
          })
        );

        setCandidates(candidatesWithTrackers);
        setRecruitments(recruitmentsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleStatusChange = (candidate, newStatus) => {
    const candidateId = candidate.candidate_id || candidate.id;

    if (!candidateId) {
      setError('Candidate ID is missing.');
      return;
    }

    axios
      .put(`https://skilviu.com/backend/api/v1/candidates/${candidateId}`, {
        status: newStatus,
      })
      .then(() => {
        setCandidates((prev) =>
          prev.map((c) => {
            const cId = c.candidate_id || c.id;
            return cId === candidateId ? { ...c, status: newStatus } : c;
          })
        );

        if (newStatus === 'Selected') {
          setSelectedCandidate({ ...candidate, status: newStatus });
          setShowTrackerModal(true);
        }
      })
      .catch((error) => {
        console.error('Failed to update status:', error);
        setError('Failed to update candidate status. Please check your network connection.');
      });
  };

  const handleProcessStageChange = async (candidateId, stage, status) => {
    try {
      await axios.put(`https://skilviu.com/backend/api/v1/process-tracker/${candidateId}`, {
        stage,
        status,
      });

      setCandidates((prev) =>
        prev.map((c) => {
          const cId = c.candidate_id || c.id;
          return cId === candidateId
            ? {
                ...c,
                process_stages: {
                  ...c.process_stages,
                  [stage]: status,
                },
              }
            : c;
        })
      );
    } catch (err) {
      console.error('Failed to update tracker:', err);
      setError('Failed to update process tracker.');
    }
  };

  if (loading) return <p className="p-4 text-gray-600">Loading data...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  const groupedCandidates = {};
  candidates.forEach((candidate) => {
    const jobId = candidate.job_id;
    if (jobId) {
      if (!groupedCandidates[jobId]) groupedCandidates[jobId] = [];
      groupedCandidates[jobId].push(candidate);
    }
  });

  const getRecruitmentById = (jobId) => {
    return recruitments.find((r) => r.id === jobId || r.job_id === jobId);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">Candidate Status</h2>

      {Object.entries(groupedCandidates).map(([jobId, candidatesList]) => {
        const recruitment = getRecruitmentById(parseInt(jobId));
        const jobTitle = recruitment?.job_title || `Job ID: ${jobId}`;
        const jobDescription = recruitment?.job_description || 'No job description available for this position.';

        return (
          <div key={jobId} className="mb-10 border rounded-xl shadow-sm bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-6 border-r border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{jobTitle}</h3>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded mb-3 whitespace-pre-line">
                  {jobDescription}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Candidates Applied</h4>
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {candidatesList.length} candidate{candidatesList.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {candidatesList.map((candidate) => {
                    const candidateKey = candidate.candidate_id || candidate.id;

                    return (
                      <div key={candidateKey} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                        <div className="text-sm">
                          <div className="font-medium text-gray-800">{candidate.candidate_name}</div>
                          <div className="text-gray-600">{candidate.email}</div>
                        </div>

                        <button
                          onClick={() => handleStatusChange(candidate, 'Selected')}
                          className={`mt-2 px-3 py-1 text-sm rounded-md ${
                            candidate.status === 'Selected'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          {candidate.status === 'Selected' ? 'Selected' : 'Select Candidate'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {showTrackerModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Hiring Process Tracker for {selectedCandidate.candidate_name}
              </h3>
              <button onClick={() => setShowTrackerModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Screening', key: 'screening', description: 'Initial screening process' },
                { label: 'HR Interview', key: 'hr_interview', description: 'Interview with HR team' },
                { label: 'Client CV Review', key: 'client_cv_review', description: 'Client reviewing candidate CV' },
                { label: 'Client Interview', key: 'client_interview', description: 'Interview with client' },
                { label: 'Offer Letter', key: 'offer_letter', description: 'Final offer letter stage' },
              ].map((step, index) => (
                <React.Fragment key={step.key}>
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                        selectedCandidate.process_stages?.[step.key] === 'completed'
                          ? 'bg-green-500'
                          : selectedCandidate.process_stages?.[step.key] === 'in_progress'
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-800">{step.label}</span>
                        <select
                          value={selectedCandidate.process_stages?.[step.key] || 'pending'}
                          onChange={(e) =>
                            handleProcessStageChange(
                              selectedCandidate.candidate_id || selectedCandidate.id,
                              step.key,
                              e.target.value
                            )
                          }
                          className="text-xs border rounded px-2 py-1 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="shared">CV Shared</option>
                          <option value="under_review">Under Review</option>
                          <option value="prepared">Prepared</option>
                          <option value="sent">Sent</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      <p className="text-xs text-gray-600">{step.description}</p>
                    </div>
                  </div>

                  {index < 4 && <div className="ml-1.5 w-0.5 h-4 bg-gray-300"></div>}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTrackerModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Candidatestatus;
