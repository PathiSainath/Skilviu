// import React, { useEffect, useState } from 'react';
// import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Users, Building2, MapPin, Clock, DollarSign } from 'lucide-react';

// function Candidatestatus() {
//   const { jobTitle } = useParams();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const clientName = searchParams.get('client');

//   const [candidates, setCandidates] = useState([]);
//   const [recruitments, setRecruitments] = useState([]);
//   const [filteredData, setFilteredData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showTrackerModal, setShowTrackerModal] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);

//   // Define process stages order for enforcement
//   const orderedStages = ['screening', 'hr_interview', 'client_cv_review', 'client_interview', 'offer_letter'];

//   // ========================= DATA FETCHING =========================
//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [candidatesRes, recruitmentsRes] = await Promise.all([
//           fetch('https://skilviu.com/backend/api/v1/candidates').then(res => res.json()),
//           fetch('https://skilviu.com/backend/api/v1/recruitments').then(res => res.json()),
//         ]);

//         const candidatesData = Array.isArray(candidatesRes) ? candidatesRes :
//           candidatesRes?.data && Array.isArray(candidatesRes.data) ? candidatesRes.data : [];

//         const recruitmentsData = Array.isArray(recruitmentsRes) ? recruitmentsRes :
//           recruitmentsRes?.data && Array.isArray(recruitmentsRes.data) ? recruitmentsRes.data : [];

//         const candidatesWithTrackers = await Promise.all(
//           candidatesData.map(async (c) => {
//             const candidateId = c.candidate_id || c.id;
//             try {
//               const trackerRes = await fetch(`https://skilviu.com/backend/api/v1/process-tracker/${candidateId}`);
//               if (trackerRes.ok) {
//                 const trackerData = await trackerRes.json();
//                 return { ...c, process_stages: trackerData || {} };
//               } else {
//                 return { ...c, process_stages: {} };
//               }
//             } catch {
//               return { ...c, process_stages: {} };
//             }
//           })
//         );

//         setCandidates(candidatesWithTrackers);
//         setRecruitments(recruitmentsData);
//         filterDataByPosition(candidatesWithTrackers, recruitmentsData);

//       } catch (err) {
//         console.error('Failed to fetch data:', err);
//         setError('Failed to load data. Please try again.');
//         setCandidates([]);
//         setRecruitments([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [jobTitle, clientName]);

//   // ========================= FILTERING LOGIC =========================
//   const filterDataByPosition = (candidatesData, recruitmentsData) => {
//     if (!jobTitle) {
//       setFilteredData(null);
//       return;
//     }

//     const decodedJobTitle = decodeURIComponent(jobTitle);
//     const decodedClientName = clientName ? decodeURIComponent(clientName) : null;

//     console.log('🔍 Filtering for:', { decodedJobTitle, decodedClientName });

//     const matchingRecruitments = recruitmentsData.filter(r => {
//       const rJobTitle = r.job_title || r.position || r.jobTitle || r.title || '';
//       const rClientName = r.client_name || r.clientName || r.client || '';

//       const jobMatches = rJobTitle.toLowerCase().includes(decodedJobTitle.toLowerCase()) ||
//         decodedJobTitle.toLowerCase().includes(rJobTitle.toLowerCase()) ||
//         rJobTitle.toLowerCase() === decodedJobTitle.toLowerCase();

//       const clientMatches = !decodedClientName ||
//         rClientName.toLowerCase().includes(decodedClientName.toLowerCase()) ||
//         decodedClientName.toLowerCase().includes(rClientName.toLowerCase()) ||
//         rClientName.toLowerCase() === decodedClientName.toLowerCase();

//       return jobMatches && clientMatches;
//     });

//     if (matchingRecruitments.length === 0) {
//       setFilteredData({
//         recruitment: null,
//         candidates: [],
//         jobTitle: decodedJobTitle,
//         clientName: decodedClientName,
//         debugInfo: {
//           searchedJobTitle: decodedJobTitle,
//           searchedClientName: decodedClientName,
//           availableJobs: recruitmentsData.map(r => r.job_title || r.position),
//           availableClients: recruitmentsData.map(r => r.client_name)
//         }
//       });
//       return;
//     }

//     const jobIds = [
//       ...matchingRecruitments.map(r => r.id),
//       ...matchingRecruitments.map(r => r.job_id).filter(Boolean),
//       ...matchingRecruitments.map(r => r.recruitment_id).filter(Boolean)
//     ];

//     const matchingCandidates = candidatesData.filter(c => {
//       const candidateJobId = c.job_id || c.recruitment_id || c.jobId;
//       return jobIds.includes(candidateJobId) ||
//         jobIds.includes(Number(candidateJobId)) ||
//         jobIds.includes(String(candidateJobId));
//     });

//     const primaryRecruitment = matchingRecruitments[0];
//     const totalPositions = matchingRecruitments.reduce((sum, r) =>
//       sum + (Number(r.no_of_positions) || 1), 0
//     );

//     setFilteredData({
//       recruitment: {
//         ...primaryRecruitment,
//         total_positions: totalPositions
//       },
//       candidates: matchingCandidates,
//       jobTitle: decodedJobTitle,
//       clientName: decodedClientName,
//       debugInfo: {
//         matchingRecruitmentIds: matchingRecruitments.map(r => r.id),
//         searchedJobTitle: decodedJobTitle,
//         searchedClientName: decodedClientName,
//         totalCandidatesInDb: candidatesData.length,
//         matchingCandidatesFound: matchingCandidates.length
//       }
//     });
//   };

//   // ========================= NAVIGATION HELPER =========================
//   const handleAddCandidate = () => {
//     if (filteredData && filteredData.recruitment) {
//       // Navigate to candidate form with job details pre-filled
//       navigate('/hrteamdashboard/candidateform-page', {
//         state: {
//           preSelectedJobId: filteredData.recruitment.job_id || filteredData.recruitment.id,
//           jobTitle: filteredData.jobTitle,
//           clientName: filteredData.clientName,
//           location: filteredData.recruitment.location
//         }
//       });
//     } else {
//       // Fallback navigation without pre-selection
//       navigate('/hrteamdashboard/candidateform-page');
//     }
//   };

//   // ========================= STATUS HELPERS =========================
//   const getCurrentProcessStatus = (candidate) => {
//     if (!candidate.process_stages) return 'Pending: Screening';

//     // Check if rejected
//     if (candidate.process_stages.rejected === 'rejected') return 'Rejected';

//     // Count completed stages in order
//     let lastCompleted = -1;
//     for (let i = 0; i < orderedStages.length; i++) {
//       if (candidate.process_stages[orderedStages[i]] === 'completed') {
//         lastCompleted = i;
//       } else {
//         break; // Stop at first non-completed stage
//       }
//     }

//     if (lastCompleted === orderedStages.length - 1) return 'Process Complete';
//     if (lastCompleted >= 0) {
//       const nextStage = orderedStages[lastCompleted + 1];
//       const stageLabel = nextStage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
//       return `Pending: ${stageLabel}`;
//     }
//     return 'Pending: Screening';
//   };

//   // Helper: disable Select button if any process stage is started
//   const hasProcessStarted = (candidate) => {
//     if (!candidate.process_stages) return false;
//     return Object.values(candidate.process_stages).some(val => val && val.length > 0);
//   };

//   // ========================= API METHODS =========================
//   const createProcessTrackerIfNotExists = async (candidateId) => {
//     try {
//       console.log(`🔄 Checking if tracker exists for candidate ${candidateId}`);

//       const checkResponse = await fetch(`https://skilviu.com/backend/api/v1/process-tracker/${candidateId}`);

//       if (checkResponse.status === 404) {
//         console.log(`📝 Creating new process tracker for candidate ${candidateId}`);

//         const createResponse = await fetch('https://skilviu.com/backend/api/v1/process-tracker', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             candidate_id: parseInt(candidateId),
//             screening: null,
//             hr_interview: null,
//             client_cv_review: null,
//             client_interview: null,
//             offer_letter: null,
//             rejected: null,
//           }),
//         });

//         if (!createResponse.ok && createResponse.status !== 409) {
//           const errorText = await createResponse.text();
//           throw new Error(`Failed to create process tracker: ${createResponse.status} - ${errorText}`);
//         }

//         console.log(`✅ Process tracker created/exists for candidate ${candidateId}`);

//       } else if (checkResponse.ok) {
//         console.log(`✅ Process tracker already exists for candidate ${candidateId}`);
//       }

//     } catch (error) {
//       console.error('Error with process tracker:', error);
//     }
//   };

//   const handleStatusChange = async (candidate, newStatus) => {
//     const candidateId = candidate.candidate_id || candidate.id;

//     if (!candidateId) {
//       setError('Candidate ID is missing.');
//       return;
//     }

//     try {
//       console.log(`🔄 Updating candidate ${candidateId} status to ${newStatus}`);

//       const response = await fetch(`https://skilviu.com/backend/api/v1/candidates/${candidateId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to update status: ${response.status} - ${errorText}`);
//       }

//       // Update candidate status in all state arrays
//       const updateCandidateStatus = (candidatesList) =>
//         candidatesList.map((c) => {
//           const cId = c.candidate_id || c.id;
//           return cId === candidateId ? { ...c, status: newStatus } : c;
//         });

//       setCandidates(prev => updateCandidateStatus(prev));

//       if (filteredData) {
//         setFilteredData(prev => ({
//           ...prev,
//           candidates: updateCandidateStatus(prev.candidates)
//         }));
//       }

//       // When candidate is selected, create process tracker and show modal
//       if (newStatus === 'Selected') {
//         await createProcessTrackerIfNotExists(candidateId);
//         setSelectedCandidate({ ...candidate, status: newStatus });
//         setShowTrackerModal(true);
//       }

//       console.log(`✅ Candidate ${candidateId} status updated to ${newStatus}`);

//     } catch (error) {
//       console.error('Failed to update status:', error);
//       setError(`Failed to update candidate status: ${error.message}`);
//     }
//   };

//   // const handleProcessStageChange = async (candidateId, stage, status) => {
//   //   try {
//   //     console.log(`🔄 Updating stage ${stage} for candidate ${candidateId} to ${status}`);

//   //     const updateData = { [stage]: status };

//   //     const response = await fetch(`https://skilviu.com/backend/api/v1/updateprocess-tracker/${candidateId}`, {
//   //       method: 'PUT',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify(updateData),
//   //     });

//   //     if (!response.ok) {
//   //       const errorText = await response.text();
//   //       console.error('API Error:', errorText);
//   //       throw new Error(`Failed to update tracker: ${response.status} - ${errorText}`);
//   //     }

//   //     const result = await response.json();
//   //     console.log(`✅ Stage update successful:`, result);

//   //     const freshStages = result.data;

//   //     const updateProcessStage = (candidatesList) =>
//   //       candidatesList.map((c) => {
//   //         const cId = c.candidate_id || c.id;
//   //         return parseInt(cId) === parseInt(candidateId)
//   //           ? {
//   //             ...c,
//   //             process_stages: {
//   //               screening: freshStages.screening,
//   //               hr_interview: freshStages.hr_interview,
//   //               client_cv_review: freshStages.client_cv_review,
//   //               client_interview: freshStages.client_interview,
//   //               offer_letter: freshStages.offer_letter,
//   //               rejected: freshStages.rejected,
//   //             },
//   //           }
//   //           : c;
//   //       });

//   //     // Update all state arrays
//   //     setCandidates(prev => updateProcessStage(prev));

//   //     if (filteredData) {
//   //       setFilteredData(prev => ({
//   //         ...prev,
//   //         candidates: updateProcessStage(prev.candidates)
//   //       }));
//   //     }

//   //     // Update selected candidate in modal
//   //     setSelectedCandidate((prev) => ({
//   //       ...prev,
//   //       process_stages: {
//   //         screening: freshStages.screening,
//   //         hr_interview: freshStages.hr_interview,
//   //         client_cv_review: freshStages.client_cv_review,
//   //         client_interview: freshStages.client_interview,
//   //         offer_letter: freshStages.offer_letter,
//   //         rejected: freshStages.rejected,
//   //       },
//   //     }));

//   //     console.log(`✅ Process stage ${stage} marked as ${status} for candidate ${candidateId}`);

//   //   } catch (err) {
//   //     console.error('Failed to update tracker:', err);
//   //     setError(`Failed to update process tracker: ${err.message}`);
//   //   }
//   // };

//   // In your candidatestatus component, update this method:
//   const handleProcessStageChange = async (candidateId, stage, status) => {
//     try {
//       console.log(`🔄 Updating stage ${stage} for candidate ${candidateId} to ${status}`);

//       const updateData = { [stage]: status };

//       // Use the auto-close endpoint instead of regular update
//       const response = await fetch(`https://skilviu.com/backend/api/v1/process-tracker/${candidateId}/with-job-check`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updateData),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('API Error:', errorText);
//         throw new Error(`Failed to update tracker: ${response.status} - ${errorText}`);
//       }

//       const result = await response.json();
//       console.log(`✅ Stage update successful:`, result);

//       // Check if job was auto-closed
//       if (result.job_auto_closed) {
//         // Show notification that job was closed
//         alert(`✅ ${result.job_closure_message}`);
//       }

//       const freshStages = result.data;

//       const updateProcessStage = (candidatesList) =>
//         candidatesList.map((c) => {
//           const cId = c.candidate_id || c.id;
//           return parseInt(cId) === parseInt(candidateId)
//             ? {
//               ...c,
//               process_stages: {
//                 screening: freshStages.screening,
//                 hr_interview: freshStages.hr_interview,
//                 client_cv_review: freshStages.client_cv_review,
//                 client_interview: freshStages.client_interview,
//                 offer_letter: freshStages.offer_letter,
//                 rejected: freshStages.rejected,
//               },
//             }
//             : c;
//         });

//       // Update all state arrays
//       setCandidates(prev => updateProcessStage(prev));

//       if (filteredData) {
//         setFilteredData(prev => ({
//           ...prev,
//           candidates: updateProcessStage(prev.candidates)
//         }));
//       }

//       // Update selected candidate in modal
//       setSelectedCandidate((prev) => ({
//         ...prev,
//         process_stages: {
//           screening: freshStages.screening,
//           hr_interview: freshStages.hr_interview,
//           client_cv_review: freshStages.client_cv_review,
//           client_interview: freshStages.client_interview,
//           offer_letter: freshStages.offer_letter,
//           rejected: freshStages.rejected,
//         },
//       }));

//       console.log(`✅ Process stage ${stage} marked as ${status} for candidate ${candidateId}`);

//     } catch (err) {
//       console.error('Failed to update tracker:', err);
//       setError(`Failed to update process tracker: ${err.message}`);
//     }
//   };

//   // ========================= RENDER CONDITIONS =========================
//   if (loading) {
//     return (
//       <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//         <div className="text-center py-10 text-gray-600">Loading candidate data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <p className="text-red-600">{error}</p>
//           <button
//             onClick={() => setError('')}
//             className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
//           >
//             Dismiss
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!filteredData) {
//     return (
//       <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//         <div className="text-center py-10">
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Select a Position</h2>
//           <p className="text-gray-600 mb-6">Please select a specific position to view candidates.</p>
//           <button
//             onClick={() => navigate('/hrteamdashboard/positions')}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Go Back to Positions
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (filteredData && filteredData.candidates.length === 0 && filteredData.debugInfo) {
//     return (
//       <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//         <button
//           onClick={() => navigate('/hrteamdashboard/positions')}
//           className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Positions
//         </button>

//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
//           <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">No Candidates Found</h2>
//           <p className="text-gray-600 mb-4 text-sm sm:text-base">
//             No candidates have applied for <strong>{filteredData.jobTitle}</strong>
//             {filteredData.clientName && <span> at <strong>{filteredData.clientName}</strong></span>}
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <button
//               onClick={() => navigate('/hrteamdashboard/positions')}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Go Back to Positions
//             </button>
//             <button
//               onClick={handleAddCandidate}
//               className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//             >
//               Add New Candidate
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const { recruitment, candidates: positionCandidates, jobTitle: displayJobTitle, clientName: displayClientName } = filteredData;

//   // ========================= MAIN RENDER =========================
//   return (
//     <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//       {/* Header with Back Navigation */}
//       <div className="mb-6">
//         <button
//           onClick={() => navigate('/hrteamdashboard/positions')}
//           className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Positions
//         </button>

//         {/* Mobile-optimized header */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
//             {displayJobTitle}
//           </h1>

//           {/* Stats and Add Button - Mobile responsive */}
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
//             <div className="flex gap-3 w-full sm:w-auto">
//               <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-center flex-1 sm:flex-none">
//                 <div className="text-xs sm:text-sm font-medium">Open Positions</div>
//                 <div className="text-lg sm:text-xl font-bold">{recruitment?.total_positions || 1}</div>
//               </div>
//               <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-center flex-1 sm:flex-none">
//                 <div className="text-xs sm:text-sm font-medium">Applications</div>
//                 <div className="text-lg sm:text-xl font-bold">{positionCandidates.length}</div>
//               </div>
//             </div>
//             <button
//               onClick={handleAddCandidate}
//               className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
//             >
//               Add Candidate
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile-first responsive layout */}
//       <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
//         {/* Left Side: Job Description */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col"
//           style={{ height: 'auto', minHeight: '300px', maxHeight: 'calc(100vh - 200px)' }}>
//           <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
//             <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Job Details</h2>
//             {displayClientName && (
//               <div className="flex items-center gap-2 text-gray-600">
//                 <Building2 className="w-4 h-4" />
//                 <span className="font-medium text-sm sm:text-base">{displayClientName}</span>
//               </div>
//             )}
//           </div>

//           <div className="p-4 sm:p-6 overflow-y-auto flex-1">
//             {/* Job Basic Info - Mobile responsive grid */}
//             <div className="space-y-4 mb-6">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
//                 {recruitment?.location && (
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <MapPin className="w-4 h-4" />
//                     <span className="text-xs sm:text-sm">{recruitment.location}</span>
//                   </div>
//                 )}
//                 {recruitment?.experience_required && (
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Clock className="w-4 h-4" />
//                     <span className="text-xs sm:text-sm">{recruitment.experience_required} experience</span>
//                   </div>
//                 )}
//                 {recruitment?.salary_range && (
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <DollarSign className="w-4 h-4" />
//                     <span className="text-xs sm:text-sm">{recruitment.salary_range}</span>
//                   </div>
//                 )}
//                 {recruitment?.employment_type && (
//                   <div className="text-gray-600 text-xs sm:text-sm">
//                     <span className="font-medium">Type:</span> {recruitment.employment_type}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Job Description */}
//             {recruitment?.job_description && (
//               <div className="mb-6">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
//                 <div className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 sm:p-4 rounded-lg">
//                   {recruitment.job_description}
//                 </div>
//               </div>
//             )}

//             {/* Requirements */}
//             {recruitment?.requirements && (
//               <div className="mb-6">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
//                 <div className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 sm:p-4 rounded-lg">
//                   {recruitment.requirements}
//                 </div>
//               </div>
//             )}

//             {/* Skills */}
//             {recruitment?.skills_required && (
//               <div className="mb-6">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Skills Required</h3>
//                 <div className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 sm:p-4 rounded-lg">
//                   {recruitment.skills_required}
//                 </div>
//               </div>
//             )}

//             {/* Additional Info */}
//             <div className="space-y-3 text-xs sm:text-sm text-gray-600">
//               {recruitment?.deadline && (
//                 <div>
//                   <span className="font-medium">Application Deadline:</span> {recruitment.deadline}
//                 </div>
//               )}
//               {recruitment?.created_at && (
//                 <div>
//                   <span className="font-medium">Posted On:</span> {new Date(recruitment.created_at).toLocaleDateString()}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right Side: Candidates Applied */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col"
//           style={{ height: 'auto', minHeight: '300px', maxHeight: 'calc(100vh - 200px)' }}>
//           <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
//                 <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
//                   Candidates Applied
//                 </h2>
//               </div>
//               <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
//                 {positionCandidates.length}
//               </span>
//             </div>
//           </div>

//           <div className="overflow-y-auto flex-1 p-4 sm:p-6">
//             {positionCandidates.length === 0 ? (
//               <div className="text-center py-10 text-gray-500">
//                 <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
//                 <div>
//                   <p className="mb-2 text-sm sm:text-base">No candidates found for this position.</p>
//                   <button
//                     onClick={handleAddCandidate}
//                     className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
//                   >
//                     Add First Candidate
//                   </button>
//                   {filteredData.debugInfo && (
//                     <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg mt-4">
//                       <p><strong>Debug:</strong> Searched for job_id in [{filteredData.debugInfo.matchingRecruitmentIds?.join(', ')}]</p>
//                       <p>Total candidates in DB: {filteredData.debugInfo.totalCandidatesInDb}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {positionCandidates.map((candidate) => {
//                   const candidateKey = candidate.candidate_id || candidate.id;
//                   const isSelected = candidate.status === 'Selected';
//                   const processStarted = hasProcessStarted(candidate);

//                   return (
//                     <div
//                       key={candidateKey}
//                       className={`border rounded-lg p-3 sm:p-4 transition-all ${isSelected
//                         ? 'border-green-200 bg-green-50'
//                         : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
//                         }`}
//                     >
//                       {/* Candidate Header - Mobile responsive */}
//                       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
//                         <div className="flex-1 min-w-0">
//                           <h3 className="font-semibold text-gray-800 text-base sm:text-lg truncate">{candidate.candidate_name}</h3>
//                           <p className="text-gray-600 text-xs sm:text-sm truncate">{candidate.email}</p>
//                           <p className="text-gray-600 text-xs sm:text-sm">{candidate.mobile_number}</p>
//                           <p className="text-xs text-gray-400 mt-1">Applied to Job ID: {candidate.job_id}</p>
//                         </div>

//                         {/* Action buttons - Mobile responsive */}
//                         <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-2">
//                           <button
//                             onClick={() => handleStatusChange(candidate, 'Selected')}
//                             disabled={isSelected || processStarted}
//                             className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md font-medium transition-colors flex-1 sm:flex-none ${isSelected || processStarted
//                               ? 'bg-green-100 text-green-800 cursor-default'
//                               : 'bg-blue-600 text-white hover:bg-blue-700'
//                               }`}
//                           >
//                             {isSelected ? '✓ Selected' : 'Select'}
//                           </button>

//                           {(isSelected || processStarted) && (
//                             <div className="text-xs text-center flex-1 sm:flex-none">
//                               <div className="mb-1 font-medium text-gray-700">Current Status:</div>
//                               <div className={`font-medium ${getCurrentProcessStatus(candidate) === 'Rejected'
//                                 ? 'text-red-700'
//                                 : 'text-purple-700'
//                                 }`}>
//                                 {getCurrentProcessStatus(candidate)}
//                               </div>
//                               <button
//                                 onClick={() => {
//                                   setSelectedCandidate(candidate);
//                                   setShowTrackerModal(true);
//                                 }}
//                                 className="mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 w-full sm:w-auto"
//                               >
//                                 Update Process
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Candidate Details Grid - Mobile responsive */}
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
//                         <div className="flex justify-between">
//                           <span className="font-medium">Experience:</span>
//                           <span>{candidate.years_experience} years</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="font-medium">Current Company:</span>
//                           <span className="truncate ml-2">{candidate.current_company || 'Not specified'}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="font-medium">Current CTC:</span>
//                           <span>{candidate.current_ctc || 'Not specified'}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="font-medium">Expected CTC:</span>
//                           <span>{candidate.expected_ctc || 'Not specified'}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="font-medium">Notice Period:</span>
//                           <span>{candidate.notice_period || 'Not specified'}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="font-medium">Location:</span>
//                           <span className="truncate ml-2">{candidate.current_location || 'Not specified'}</span>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Process Tracker Modal - Mobile optimized */}
//       {showTrackerModal && selectedCandidate && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
//           <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
//             {/* Modal Header */}
//             <div className="flex justify-between items-center p-4 sm:p-6 border-b">
//               <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 truncate pr-2">
//                 Hiring Process Tracker - {selectedCandidate.candidate_name}
//               </h3>
//               <button
//                 onClick={() => setShowTrackerModal(false)}
//                 className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl p-1"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Modal Content - Scrollable */}
//             <div className="overflow-y-auto flex-1 p-4 sm:p-6">
//               {/* Candidate Summary - Mobile responsive */}
//               <div className="mb-6 sm:mb-8 border p-4 sm:p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
//                 <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Candidate Summary</h4>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm">
//                   <div>
//                     <div className="font-medium text-gray-800 mb-2">Contact Information</div>
//                     <div className="space-y-1 text-gray-600">
//                       <div><strong>Email:</strong> <span className="break-all">{selectedCandidate.email}</span></div>
//                       <div><strong>Mobile:</strong> {selectedCandidate.mobile_number}</div>
//                       <div><strong>Location:</strong> {selectedCandidate.current_location}</div>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="font-medium text-gray-800 mb-2">Professional Details</div>
//                     <div className="space-y-1 text-gray-600">
//                       <div><strong>Company:</strong> {selectedCandidate.current_company}</div>
//                       <div><strong>Experience:</strong> {selectedCandidate.years_experience} years</div>
//                       <div><strong>Relevant Exp:</strong> {selectedCandidate.relevant_experience} years</div>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="font-medium text-gray-800 mb-2">Compensation & Availability</div>
//                     <div className="space-y-1 text-gray-600">
//                       <div><strong>Current CTC:</strong> {selectedCandidate.current_ctc}</div>
//                       <div><strong>Expected CTC:</strong> {selectedCandidate.expected_ctc}</div>
//                       <div><strong>Notice Period:</strong> {selectedCandidate.notice_period}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Process Stages - Mobile responsive grid */}
//               <div className="mb-6">
//                 <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Hiring Process Stages</h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
//                   {[
//                     { label: 'Screening', key: 'screening', color: 'blue', icon: '📋' },
//                     { label: 'HR Interview', key: 'hr_interview', color: 'green', icon: '👥' },
//                     { label: 'Client CV Review', key: 'client_cv_review', color: 'yellow', icon: '📄' },
//                     { label: 'Client Interview', key: 'client_interview', color: 'purple', icon: '🤝' },
//                     { label: 'Offer Letter', key: 'offer_letter', color: 'red', icon: '📝' },
//                     { label: 'Rejected', key: 'rejected', color: 'gray', icon: '🚫' },
//                   ].map((step, idx) => {
//                     const currentValue = selectedCandidate.process_stages?.[step.key];
//                     const isRejected = selectedCandidate.process_stages?.rejected === 'rejected';
//                     const offerLetterDone = selectedCandidate.process_stages?.offer_letter === 'completed';
//                     const candidateId = selectedCandidate.candidate_id || selectedCandidate.id;

//                     // Determine if checkbox is checked
//                     const isChecked = (step.key === 'rejected' && isRejected) ||
//                       (step.key !== 'rejected' && currentValue === 'completed');

//                     // Determine if checkbox can be clicked (ordered progression logic)
//                     let canCheck = false;
//                     if (isRejected || offerLetterDone) {
//                       // If rejected or process complete, only allow unchecking rejected
//                       canCheck = step.key === 'rejected' && isChecked;
//                     } else if (step.key === 'rejected') {
//                       // Can always reject if not already completed offer letter
//                       canCheck = true;
//                     } else {
//                       // For normal stages, check if previous stage is completed or if it's the first stage
//                       if (idx === 0) {
//                         canCheck = true; // First stage always available
//                       } else {
//                         const prevStageKey = orderedStages[idx - 1];
//                         canCheck = selectedCandidate.process_stages?.[prevStageKey] === 'completed';
//                       }
//                     }

//                     return (
//                       <div key={step.key} className={`p-3 sm:p-4 border-2 rounded-lg transition-all ${isChecked
//                         ? (step.key === 'rejected' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50')
//                         : 'border-gray-200 bg-gray-50 hover:border-gray-300'
//                         }`}>
//                         <div className="text-center mb-3">
//                           <div className="text-xl sm:text-2xl mb-2">{step.icon}</div>
//                           <div className="text-xs sm:text-sm font-medium text-gray-800">
//                             {step.label}
//                           </div>
//                         </div>

//                         <div className="flex justify-center">
//                           <label className="flex items-center gap-2 cursor-pointer">
//                             <input
//                               type="checkbox"
//                               checked={isChecked}
//                               disabled={!canCheck}
//                               onChange={(e) => {
//                                 if (e.target.checked) {
//                                   if (step.key === 'rejected') {
//                                     handleProcessStageChange(candidateId, step.key, 'rejected');
//                                   } else {
//                                     handleProcessStageChange(candidateId, step.key, 'completed');
//                                   }
//                                 } else {
//                                   // Clear the stage status when unchecked
//                                   handleProcessStageChange(candidateId, step.key, '');
//                                 }
//                               }}
//                               className={`w-4 h-4 sm:w-5 sm:h-5 rounded focus:ring-500 ${step.key === 'rejected' ? 'text-red-600' : 'text-green-600'
//                                 }`}
//                             />
//                             <span className={`text-xs sm:text-sm font-medium ${isChecked
//                               ? (step.key === 'rejected' ? 'text-red-700' : 'text-green-700')
//                               : 'text-gray-600'
//                               }`}>
//                               {isChecked ? (step.key === 'rejected' ? 'Rejected' : 'Completed ✓') : 'Mark Complete'}
//                             </span>
//                           </label>
//                         </div>

//                         {isChecked && (
//                           <div className={`mt-2 text-xs text-center ${step.key === 'rejected' ? 'text-red-600' : 'text-green-600'
//                             }`}>
//                             {step.key === 'rejected' ? '❌ Rejected' : '✅ Stage Complete'}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end p-4 sm:p-6 border-t">
//               <button
//                 onClick={() => setShowTrackerModal(false)}
//                 className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
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
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Building2, MapPin, Clock, DollarSign } from 'lucide-react';

function Candidatestatus() {
  const { jobTitle } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clientName = searchParams.get('client');

  const [candidates, setCandidates] = useState([]);
  const [recruitments, setRecruitments] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // UPDATED: State for simple checkbox system
  const [selectedStage, setSelectedStage] = useState(null);
  const [stageToUpdate, setStageToUpdate] = useState(null);

  // Define process stages order for enforcement
  const orderedStages = ['screening', 'hr_interview', 'client_cv_review', 'client_interview', 'offer_letter'];

  // Function to count selected students
  const getSelectedStudentsCount = () => {
    if (!candidates || candidates.length === 0) return 0;
    
    return candidates.filter(candidate => {
      const offerLetter = candidate.process_stages?.offer_letter;
      return offerLetter === 'completed';
    }).length;
  };

  // ========================= DATA FETCHING ========================= 
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [candidatesRes, recruitmentsRes] = await Promise.all([
          fetch('https://skilviu.com/backend/api/v1/candidates').then(res => res.json()),
          fetch('https://skilviu.com/backend/api/v1/recruitments').then(res => res.json()),
        ]);

        const candidatesData = Array.isArray(candidatesRes) ? candidatesRes :
          candidatesRes?.data && Array.isArray(candidatesRes.data) ? candidatesRes.data : [];

        const recruitmentsData = Array.isArray(recruitmentsRes) ? recruitmentsRes :
          recruitmentsRes?.data && Array.isArray(recruitmentsRes.data) ? recruitmentsRes.data : [];

        const candidatesWithTrackers = await Promise.all(
          candidatesData.map(async (c) => {
            const candidateId = c.candidate_id || c.id;
            try {
              const trackerRes = await fetch(`https://skilviu.com/backend/api/v1/process-tracker/${candidateId}`);
              if (trackerRes.ok) {
                const trackerData = await trackerRes.json();
                return { ...c, process_stages: trackerData || {} };
              } else {
                return { ...c, process_stages: {} };
              }
            } catch {
              return { ...c, process_stages: {} };
            }
          })
        );

        setCandidates(candidatesWithTrackers);
        setRecruitments(recruitmentsData);
        filterDataByPosition(candidatesWithTrackers, recruitmentsData);

      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please try again.');
        setCandidates([]);
        setRecruitments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [jobTitle, clientName]);

  // ========================= FILTERING LOGIC =========================
  const filterDataByPosition = (candidatesData, recruitmentsData) => {
    if (!jobTitle) {
      setFilteredData(null);
      return;
    }

    const decodedJobTitle = decodeURIComponent(jobTitle);
    const decodedClientName = clientName ? decodeURIComponent(clientName) : null;

    console.log('🔍 Filtering for:', { decodedJobTitle, decodedClientName });

    const matchingRecruitments = recruitmentsData.filter(r => {
      const rJobTitle = r.job_title || r.position || r.jobTitle || r.title || '';
      const rClientName = r.client_name || r.clientName || r.client || '';

      const jobMatches = rJobTitle.toLowerCase().includes(decodedJobTitle.toLowerCase()) ||
        decodedJobTitle.toLowerCase().includes(rJobTitle.toLowerCase()) ||
        rJobTitle.toLowerCase() === decodedJobTitle.toLowerCase();

      const clientMatches = !decodedClientName ||
        rClientName.toLowerCase().includes(decodedClientName.toLowerCase()) ||
        decodedClientName.toLowerCase().includes(rClientName.toLowerCase()) ||
        rClientName.toLowerCase() === decodedClientName.toLowerCase();

      return jobMatches && clientMatches;
    });

    if (matchingRecruitments.length === 0) {
      setFilteredData({
        recruitment: null,
        candidates: [],
        jobTitle: decodedJobTitle,
        clientName: decodedClientName,
        debugInfo: {
          searchedJobTitle: decodedJobTitle,
          searchedClientName: decodedClientName,
          availableJobs: recruitmentsData.map(r => r.job_title || r.position),
          availableClients: recruitmentsData.map(r => r.client_name)
        }
      });
      return;
    }

    const jobIds = [
      ...matchingRecruitments.map(r => r.id),
      ...matchingRecruitments.map(r => r.job_id).filter(Boolean),
      ...matchingRecruitments.map(r => r.recruitment_id).filter(Boolean)
    ];

    const matchingCandidates = candidatesData.filter(c => {
      const candidateJobId = c.job_id || c.recruitment_id || c.jobId;
      return jobIds.includes(candidateJobId) ||
        jobIds.includes(Number(candidateJobId)) ||
        jobIds.includes(String(candidateJobId));
    });

    const primaryRecruitment = matchingRecruitments[0];
    const totalPositions = matchingRecruitments.reduce((sum, r) =>
      sum + (Number(r.no_of_positions) || 1), 0
    );

    setFilteredData({
      recruitment: {
        ...primaryRecruitment,
        total_positions: totalPositions
      },
      candidates: matchingCandidates,
      jobTitle: decodedJobTitle,
      clientName: decodedClientName,
      debugInfo: {
        matchingRecruitmentIds: matchingRecruitments.map(r => r.id),
        searchedJobTitle: decodedJobTitle,
        searchedClientName: decodedClientName,
        totalCandidatesInDb: candidatesData.length,
        matchingCandidatesFound: matchingCandidates.length
      }
    });
  };

  // ========================= NAVIGATION HELPER =========================
  const handleAddCandidate = () => {
    if (filteredData && filteredData.recruitment) {
      navigate('/hrteamdashboard/candidateform-page', {
        state: {
          preSelectedJobId: filteredData.recruitment.job_id || filteredData.recruitment.id,
          jobTitle: filteredData.jobTitle,
          clientName: filteredData.clientName,
          location: filteredData.recruitment.location
        }
      });
    } else {
      navigate('/hrteamdashboard/candidateform-page');
    }
  };

  // ========================= STATUS HELPERS =========================
  const getCurrentProcessStatus = (candidate) => {
    if (!candidate.process_stages) return 'Pending: Screening';

    if (candidate.process_stages.rejected === 'rejected') return 'Rejected';

    let lastCompleted = -1;
    for (let i = 0; i < orderedStages.length; i++) {
      if (candidate.process_stages[orderedStages[i]] === 'completed') {
        lastCompleted = i;
      } else {
        break;
      }
    }

    if (lastCompleted === orderedStages.length - 1) return 'Process Complete';
    if (lastCompleted >= 0) {
      const nextStage = orderedStages[lastCompleted + 1];
      const stageLabel = nextStage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `Pending: ${stageLabel}`;
    }
    return 'Pending: Screening';
  };

  const hasProcessStarted = (candidate) => {
    if (!candidate.process_stages) return false;
    return Object.values(candidate.process_stages).some(val => val && val.length > 0);
  };

  // ========================= API METHODS =========================
  const createProcessTrackerIfNotExists = async (candidateId) => {
    try {
      console.log(`🔄 Checking if tracker exists for candidate ${candidateId}`);

      const checkResponse = await fetch(`https://skilviu.com/backend/api/v1/process-tracker/${candidateId}`);

      if (checkResponse.status === 404) {
        console.log(`📝 Creating new process tracker for candidate ${candidateId}`);

        const createResponse = await fetch('https://skilviu.com/backend/api/v1/process-tracker', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            candidate_id: parseInt(candidateId),
            screening: null,
            hr_interview: null,
            client_cv_review: null,
            client_interview: null,
            offer_letter: null,
            rejected: null,
          }),
        });

        if (!createResponse.ok && createResponse.status !== 409) {
          const errorText = await createResponse.text();
          throw new Error(`Failed to create process tracker: ${createResponse.status} - ${errorText}`);
        }

        console.log(`✅ Process tracker created/exists for candidate ${candidateId}`);

      } else if (checkResponse.ok) {
        console.log(`✅ Process tracker already exists for candidate ${candidateId}`);
      }

    } catch (error) {
      console.error('Error with process tracker:', error);
    }
  };

  const handleStatusChange = async (candidate, newStatus) => {
    const candidateId = candidate.candidate_id || candidate.id;

    if (!candidateId) {
      setError('Candidate ID is missing.');
      return;
    }

    try {
      console.log(`🔄 Updating candidate ${candidateId} status to ${newStatus}`);

      const response = await fetch(`https://skilviu.com/backend/api/v1/candidates/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update status: ${response.status} - ${errorText}`);
      }

      const updateCandidateStatus = (candidatesList) =>
        candidatesList.map((c) => {
          const cId = c.candidate_id || c.id;
          return cId === candidateId ? { ...c, status: newStatus } : c;
        });

      setCandidates(prev => updateCandidateStatus(prev));

      if (filteredData) {
        setFilteredData(prev => ({
          ...prev,
          candidates: updateCandidateStatus(prev.candidates)
        }));
      }

      if (newStatus === 'Selected') {
        await createProcessTrackerIfNotExists(candidateId);
        setSelectedCandidate({ ...candidate, status: newStatus });
        setShowTrackerModal(true);
      }

      console.log(`✅ Candidate ${candidateId} status updated to ${newStatus}`);

    } catch (error) {
      console.error('Failed to update status:', error);
      setError(`Failed to update candidate status: ${error.message}`);
    }
  };

  // UPDATED: Simple checkbox stage click handler
  const handleStageClick = (stageKey, candidateId) => {
    const currentValue = selectedCandidate.process_stages?.[stageKey];
    
    // If already completed, do nothing
    if (currentValue === 'completed' || (stageKey === 'rejected' && currentValue === 'rejected')) {
      return;
    }
    
    setStageToUpdate({ stage: stageKey, candidateId });
    setSelectedStage(stageKey);
  };

  // UPDATED: Simple submit handler
  const handleProgressSubmit = async () => {
    if (!stageToUpdate) {
      alert('Please select a stage to update');
      return;
    }

    try {
      const statusValue = stageToUpdate.stage === 'rejected' ? 'rejected' : 'completed';
      
      // Submit as 'completed' or 'rejected' for the selected stage
      await handleProcessStageChange(
        stageToUpdate.candidateId, 
        stageToUpdate.stage, 
        statusValue
      );
      
      // Reset selection
      setStageToUpdate(null);
      setSelectedStage(null);
      
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress');
    }
  };

  const handleProcessStageChange = async (candidateId, stage, status) => {
    try {
      console.log(`🔄 Updating stage ${stage} for candidate ${candidateId} to ${status}`);

      const updateData = { [stage]: status };

      const response = await fetch(`https://skilviu.com/backend/api/v1/process-tracker/${candidateId}/with-job-check`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to update tracker: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ Stage update successful:`, result);

      if (result.job_auto_closed) {
        alert(`✅ ${result.job_closure_message}`);
      }

      const freshStages = result.data;

      const updateProcessStage = (candidatesList) =>
        candidatesList.map((c) => {
          const cId = c.candidate_id || c.id;
          return parseInt(cId) === parseInt(candidateId)
            ? {
              ...c,
              process_stages: {
                screening: freshStages.screening,
                hr_interview: freshStages.hr_interview,
                client_cv_review: freshStages.client_cv_review,
                client_interview: freshStages.client_interview,
                offer_letter: freshStages.offer_letter,
                rejected: freshStages.rejected,
              },
            }
            : c;
        });

      setCandidates(prev => updateProcessStage(prev));

      if (filteredData) {
        setFilteredData(prev => ({
          ...prev,
          candidates: updateProcessStage(prev.candidates)
        }));
      }

      setSelectedCandidate((prev) => ({
        ...prev,
        process_stages: {
          screening: freshStages.screening,
          hr_interview: freshStages.hr_interview,
          client_cv_review: freshStages.client_cv_review,
          client_interview: freshStages.client_interview,
          offer_letter: freshStages.offer_letter,
          rejected: freshStages.rejected,
        },
      }));

      console.log(`✅ Process stage ${stage} marked as ${status} for candidate ${candidateId}`);

    } catch (err) {
      console.error('Failed to update tracker:', err);
      setError(`Failed to update process tracker: ${err.message}`);
    }
  };

  // ========================= RENDER CONDITIONS =========================
  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="text-center py-10 text-gray-600">Loading candidate data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setError('')}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (!filteredData) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="text-center py-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Select a Position</h2>
          <p className="text-gray-600 mb-6">Please select a specific position to view candidates.</p>
          <button
            onClick={() => navigate('/hrteamdashboard/positions')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back to Positions
          </button>
        </div>
      </div>
    );
  }

  if (filteredData && filteredData.candidates.length === 0 && filteredData.debugInfo) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/hrteamdashboard/positions')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Positions
        </button>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">No Candidates Found</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            No candidates have applied for <strong>{filteredData.jobTitle}</strong>
            {filteredData.clientName && <span> at <strong>{filteredData.clientName}</strong></span>}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/hrteamdashboard/positions')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back to Positions
            </button>
            <button
              onClick={handleAddCandidate}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add New Candidate
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { recruitment, candidates: positionCandidates, jobTitle: displayJobTitle, clientName: displayClientName } = filteredData;

  // ========================= MAIN RENDER =========================
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header with Back Navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/hrteamdashboard/positions')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Positions
        </button>

        {/* Mobile-optimized header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
            {displayJobTitle}
          </h1>

          {/* Stats and Add Button - with Selected Counter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-center flex-1 sm:flex-none">
                <div className="text-xs sm:text-sm font-medium">Open Positions</div>
                <div className="text-lg sm:text-xl font-bold">{recruitment?.total_positions || 1}</div>
              </div>
              <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-center flex-1 sm:flex-none">
                <div className="text-xs sm:text-sm font-medium">Applications</div>
                <div className="text-lg sm:text-xl font-bold">{positionCandidates.length}</div>
              </div>
              {/* Selected Students Counter */}
              <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-center flex-1 sm:flex-none">
                <div className="text-xs sm:text-sm font-medium">Selected</div>
                <div className="text-lg sm:text-xl font-bold">{getSelectedStudentsCount()}</div>
              </div>
            </div>
            <button
              onClick={handleAddCandidate}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Add Candidate
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-first responsive layout */}
      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {/* Left Side: Job Description */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col"
          style={{ height: 'auto', minHeight: '300px', maxHeight: 'calc(100vh - 200px)' }}>
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Job Details</h2>
            {displayClientName && (
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="font-medium text-sm sm:text-base">{displayClientName}</span>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {/* Job Basic Info - Mobile responsive grid */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                {recruitment?.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">{recruitment.location}</span>
                  </div>
                )}
                {recruitment?.experience_required && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">{recruitment.experience_required} experience</span>
                  </div>
                )}
                {recruitment?.salary_range && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">{recruitment.salary_range}</span>
                  </div>
                )}
                {recruitment?.employment_type && (
                  <div className="text-gray-600 text-xs sm:text-sm">
                    <span className="font-medium">Type:</span> {recruitment.employment_type}
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            {recruitment?.job_description && (
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
                <div className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 sm:p-4 rounded-lg">
                  {recruitment.job_description}
                </div>
              </div>
            )}

            {/* Requirements */}
            {recruitment?.requirements && (
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
                <div className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 sm:p-4 rounded-lg">
                  {recruitment.requirements}
                </div>
              </div>
            )}

            {/* Skills */}
            {recruitment?.skills_required && (
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Skills Required</h3>
                <div className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 sm:p-4 rounded-lg">
                  {recruitment.skills_required}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="space-y-3 text-xs sm:text-sm text-gray-600">
              {recruitment?.deadline && (
                <div>
                  <span className="font-medium">Application Deadline:</span> {recruitment.deadline}
                </div>
              )}
              {recruitment?.created_at && (
                <div>
                  <span className="font-medium">Posted On:</span> {new Date(recruitment.created_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Candidates Applied */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col"
          style={{ height: 'auto', minHeight: '300px', maxHeight: 'calc(100vh - 200px)' }}>
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Candidates Applied
                </h2>
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {positionCandidates.length}
              </span>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-4 sm:p-6">
            {positionCandidates.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                <div>
                  <p className="mb-2 text-sm sm:text-base">No candidates found for this position.</p>
                  <button
                    onClick={handleAddCandidate}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                  >
                    Add First Candidate
                  </button>
                  {filteredData.debugInfo && (
                    <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg mt-4">
                      <p><strong>Debug:</strong> Searched for job_id in [{filteredData.debugInfo.matchingRecruitmentIds?.join(', ')}]</p>
                      <p>Total candidates in DB: {filteredData.debugInfo.totalCandidatesInDb}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {positionCandidates.map((candidate) => {
                  const candidateKey = candidate.candidate_id || candidate.id;
                  const isSelected = candidate.status === 'Selected';
                  const processStarted = hasProcessStarted(candidate);

                  return (
                    <div
                      key={candidateKey}
                      className={`border rounded-lg p-3 sm:p-4 transition-all ${isSelected
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                    >
                      {/* Candidate Header */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-base sm:text-lg truncate">{candidate.candidate_name}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm truncate">{candidate.email}</p>
                          <p className="text-gray-600 text-xs sm:text-sm">{candidate.mobile_number}</p>
                          <p className="text-xs text-gray-400 mt-1">Applied to Job ID: {candidate.job_id}</p>
                        </div>

                        {/* Action buttons - Mobile responsive */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-2">
                          <button
                            onClick={() => handleStatusChange(candidate, 'Selected')}
                            disabled={isSelected || processStarted}
                            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md font-medium transition-colors flex-1 sm:flex-none ${isSelected || processStarted
                              ? 'bg-green-100 text-green-800 cursor-default'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                          >
                            {isSelected ? '✓ Selected' : 'Select'}
                          </button>

                          {(isSelected || processStarted) && (
                            <div className="text-xs text-center flex-1 sm:flex-none">
                              <div className="mb-1 font-medium text-gray-700">Current Status:</div>
                              <div className={`font-medium ${getCurrentProcessStatus(candidate) === 'Rejected'
                                ? 'text-red-700'
                                : 'text-purple-700'
                                }`}>
                                {getCurrentProcessStatus(candidate)}
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedCandidate(candidate);
                                  setShowTrackerModal(true);
                                }}
                                className="mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 w-full sm:w-auto"
                              >
                                Update Process
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Candidate Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span className="font-medium">Experience:</span>
                          <span>{candidate.years_experience} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Current Company:</span>
                          <span className="truncate ml-2">{candidate.current_company || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Current CTC:</span>
                          <span>{candidate.current_ctc || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Expected CTC:</span>
                          <span>{candidate.expected_ctc || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Notice Period:</span>
                          <span>{candidate.notice_period || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Location:</span>
                          <span className="truncate ml-2">{candidate.current_location || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UPDATED: Process Tracker Modal with Simple Checkbox System */}
      {showTrackerModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 truncate pr-2">
                Hiring Process Tracker - {selectedCandidate.candidate_name}
              </h3>
              <button
                onClick={() => setShowTrackerModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              {/* Candidate Summary */}
              <div className="mb-6 sm:mb-8 border p-4 sm:p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Candidate Summary</h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm">
                  <div>
                    <div className="font-medium text-gray-800 mb-2">Contact Information</div>
                    <div className="space-y-1 text-gray-600">
                      <div><strong>Email:</strong> <span className="break-all">{selectedCandidate.email}</span></div>
                      <div><strong>Mobile:</strong> {selectedCandidate.mobile_number}</div>
                      <div><strong>Location:</strong> {selectedCandidate.current_location}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 mb-2">Professional Details</div>
                    <div className="space-y-1 text-gray-600">
                      <div><strong>Company:</strong> {selectedCandidate.current_company}</div>
                      <div><strong>Experience:</strong> {selectedCandidate.years_experience} years</div>
                      <div><strong>Relevant Exp:</strong> {selectedCandidate.relevant_experience} years</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 mb-2">Compensation & Availability</div>
                    <div className="space-y-1 text-gray-600">
                      <div><strong>Current CTC:</strong> {selectedCandidate.current_ctc}</div>
                      <div><strong>Expected CTC:</strong> {selectedCandidate.expected_ctc}</div>
                      <div><strong>Notice Period:</strong> {selectedCandidate.notice_period}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* UPDATED: Process Stages with Simple Checkbox System */}
              <div className="mb-6">
                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Hiring Process Stages</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {[
                    { label: 'Screening', key: 'screening', color: 'blue', icon: '📋' },
                    { label: 'HR Interview', key: 'hr_interview', color: 'green', icon: '👥' },
                    { label: 'Client CV Review', key: 'client_cv_review', color: 'yellow', icon: '📄' },
                    { label: 'Client Interview', key: 'client_interview', color: 'purple', icon: '🤝' },
                    { label: 'Offer Letter', key: 'offer_letter', color: 'red', icon: '📝' },
                    { label: 'Rejected', key: 'rejected', color: 'gray', icon: '🚫' },
                  ].map((step, idx) => {
                    const currentValue = selectedCandidate.process_stages?.[step.key];
                    const isRejected = selectedCandidate.process_stages?.rejected === 'rejected';
                    const candidateId = selectedCandidate.candidate_id || selectedCandidate.id;

                    const isCompleted = currentValue === 'completed' || (step.key === 'rejected' && isRejected);
                    const isSelected = selectedStage === step.key;

                    // Determine if stage can be clicked
                    let canClick = false;
                    if (isRejected) {
                      canClick = false; // Can't click anything if rejected
                    } else if (step.key === 'rejected') {
                      canClick = !isCompleted; // Can reject anytime if not already rejected
                    } else {
                      if (idx === 0) {
                        canClick = !isCompleted; // First stage can always be clicked if not completed
                      } else {
                        const prevStageKey = orderedStages[idx - 1];
                        const prevCompleted = selectedCandidate.process_stages?.[prevStageKey] === 'completed';
                        canClick = prevCompleted && !isCompleted; // Can click if previous is completed and this isn't
                      }
                    }

                    return (
                      <div 
                        key={step.key} 
                        className={`p-3 sm:p-4 border-2 rounded-lg transition-all cursor-pointer ${
                          isCompleted
                            ? (step.key === 'rejected' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50')
                            : isSelected
                              ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-200'
                              : canClick 
                                ? 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
                                : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                        }`}
                        onClick={() => canClick && handleStageClick(step.key, candidateId)}
                      >
                        <div className="text-center mb-3">
                          <div className="text-xl sm:text-2xl mb-2">{step.icon}</div>
                          <div className="text-xs sm:text-sm font-medium text-gray-800">
                            {step.label}
                          </div>
                        </div>

                        <div className="text-center">
                          {/* Checkbox/Status Indicator */}
                          <div className="mb-2">
                            {isCompleted ? (
                              <div className={`text-2xl ${step.key === 'rejected' ? 'text-red-600' : 'text-green-600'}`}>
                                {step.key === 'rejected' ? '❌' : '✅'}
                              </div>
                            ) : isSelected ? (
                              <div className="text-2xl text-blue-600">
                                📝
                              </div>
                            ) : canClick ? (
                              <div className="w-6 h-6 border-2 border-gray-400 rounded mx-auto bg-white"></div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-gray-300 rounded mx-auto bg-gray-100"></div>
                            )}
                          </div>

                          <div className={`text-xs sm:text-sm font-medium ${
                            isCompleted
                              ? (step.key === 'rejected' ? 'text-red-700' : 'text-green-700')
                              : isSelected
                                ? 'text-blue-700'
                                : canClick 
                                  ? 'text-blue-600'
                                  : 'text-gray-500'
                          }`}>
                            {isCompleted 
                              ? (step.key === 'rejected' ? 'Rejected' : 'Completed') 
                              : isSelected 
                                ? 'Selected - Click Submit'
                                : canClick 
                                  ? 'Click to Select' 
                                  : 'Waiting'
                            }
                          </div>

                          {/* Show when completed */}
                          {isCompleted && (
                            <div className="text-xs text-gray-500 mt-1">
                              ✓ Done
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Submit Button Section - Only show when a stage is selected */}
                {stageToUpdate && (
                  <div className="mt-6 p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
                    <div className="text-center">
                      <h5 className="font-semibold text-gray-800 mb-3">
                        Ready to mark "{stageToUpdate.stage.replace('_', ' ').toUpperCase()}" as completed?
                      </h5>
                      
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={handleProgressSubmit}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                        >
                          ✅ Submit & Move to Next Stage
                        </button>
                        
                        <button
                          onClick={() => {
                            setStageToUpdate(null);
                            setSelectedStage(null);
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Flow Indicator */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-700 mb-2">Current Progress:</h5>
                  <div className="flex items-center gap-2 text-sm">
                    {orderedStages.map((stage, idx) => {
                      const isCompleted = selectedCandidate.process_stages?.[stage] === 'completed';
                      const isNext = !isCompleted && (idx === 0 || selectedCandidate.process_stages?.[orderedStages[idx - 1]] === 'completed');
                      
                      return (
                        <React.Fragment key={stage}>
                          <div className={`px-2 py-1 rounded text-xs ${
                            isCompleted 
                              ? 'bg-green-100 text-green-800' 
                              : isNext 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-500'
                          }`}>
                            {isCompleted ? '✅' : isNext ? '⏳' : '⭕'} {stage.replace('_', ' ')}
                          </div>
                          {idx < orderedStages.length - 1 && (
                            <span className="text-gray-400">→</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 sm:p-6 border-t">
              <button
                onClick={() => setShowTrackerModal(false)}
                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
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
