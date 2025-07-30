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

//   // ========================= STATUS HELPERS =========================
//   const getCurrentProcessStatus = (candidate) => {
//     const stages = [
//       { label: 'Screening', key: 'screening' },
//       { label: 'HR Interview', key: 'hr_interview' },
//       { label: 'Client CV Review', key: 'client_cv_review' },
//       { label: 'Client Interview', key: 'client_interview' },
//       { label: 'Offer Letter', key: 'offer_letter' },
//     ];

//     // Check if rejected
//     if (candidate.process_stages?.rejected === 'completed') {
//       return 'Rejected';
//     }

//     let lastCompleted = -1;
//     stages.forEach((stage, index) => {
//       const stageStatus = candidate.process_stages?.[stage.key];
//       if (stageStatus === 'completed') {
//         lastCompleted = index;
//       }
//     });

//     if (lastCompleted === stages.length - 1) {
//       return 'Process Complete';
//     } else if (lastCompleted >= 0) {
//       return `Pending: ${stages[lastCompleted + 1].label}`;
//     } else {
//       return 'Pending: Screening';
//     }
//   };

//   // ========================= API METHODS =========================

//   /**
//    * Creates a process tracker for a candidate if it doesn't exist
//    * @param {number} candidateId - The candidate ID
//    */
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

//   /**
//    * Updates candidate status and creates process tracker if needed
//    * @param {Object} candidate - The candidate object
//    * @param {string} newStatus - The new status to set
//    */
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

//   /**
//    * Updates a specific process stage for a candidate
//    * @param {number} candidateId - The candidate ID
//    * @param {string} stage - The stage to update
//    * @param {string} status - The status value (always 'completed')
//    */
//   const handleProcessStageChange = async (candidateId, stage, status) => {
//     try {
//       console.log(`🔄 Updating stage ${stage} for candidate ${candidateId} to completed`);
      
//       // Send only the field that's being updated (works with your backend's 'sometimes' validation)
//       const updateData = {
//         [stage]: 'completed'
//       };

//       const response = await fetch(`https://skilviu.com/backend/api/v1/updateprocess-tracker/${candidateId}`, {
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

//       // Use the fresh data from backend response to ensure consistency
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

//       console.log(`✅ Process stage ${stage} marked as completed for candidate ${candidateId}`);
      
//     } catch (err) {
//       console.error('Failed to update tracker:', err);
//       setError(`Failed to update process tracker: ${err.message}`);
//     }
//   };

//   // ========================= RENDER CONDITIONS =========================
//   if (loading) {
//     return (
//       <div className="p-6 max-w-7xl mx-auto">
//         <div className="text-center py-10 text-gray-600">Loading candidate data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 max-w-7xl mx-auto">
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
//       <div className="p-6 max-w-7xl mx-auto">
//         <div className="text-center py-10">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Select a Position</h2>
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
//       <div className="p-6 max-w-7xl mx-auto">
//         <button
//           onClick={() => navigate('/hrteamdashboard/positions')}
//           className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Positions
//         </button>

//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">No Candidates Found</h2>
//           <p className="text-gray-600 mb-4">
//             No candidates have applied for <strong>{filteredData.jobTitle}</strong>
//             {filteredData.clientName && <span> at <strong>{filteredData.clientName}</strong></span>}
//           </p>

//           <div className="bg-white border rounded-lg p-4 mb-4">
//             <h3 className="font-medium text-gray-800 mb-2">Debug Information:</h3>
//             <div className="text-sm text-gray-600 space-y-1">
//               <p><strong>Searched Job Title:</strong> {filteredData.debugInfo.searchedJobTitle}</p>
//               <p><strong>Searched Client:</strong> {filteredData.debugInfo.searchedClientName || 'Any'}</p>
//               <p><strong>Total Candidates in Database:</strong> {filteredData.debugInfo.totalCandidatesInDb}</p>
//               {filteredData.debugInfo.matchingRecruitmentIds && (
//                 <p><strong>Found Recruitment IDs:</strong> {filteredData.debugInfo.matchingRecruitmentIds.join(', ')}</p>
//               )}
//               <p><strong>Available Job Titles:</strong> {filteredData.debugInfo.availableJobs?.join(', ') || 'None'}</p>
//             </div>
//           </div>

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

//   const { recruitment, candidates: positionCandidates, jobTitle: displayJobTitle, clientName: displayClientName } = filteredData;

//   // ========================= MAIN RENDER =========================
//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Header with Back Navigation */}
//       <div className="mb-6">
//         <button
//           onClick={() => navigate('/hrteamdashboard/positions')}
//           className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Positions
//         </button>

//         <div className="flex items-center justify-between">
//           <h1 className="text-3xl font-bold text-gray-800">{displayJobTitle}</h1>
//           <div className="flex items-center gap-4">
//             <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-center">
//               <div className="text-sm font-medium">Open Positions</div>
//               <div className="text-xl font-bold">{recruitment?.total_positions || 1}</div>
//             </div>
//             <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-center">
//               <div className="text-sm font-medium">Applications</div>
//               <div className="text-xl font-bold">{positionCandidates.length}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Two Column Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Left Side: Job Description */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
//           <div className="p-6 border-b border-gray-200 bg-gray-50">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Details</h2>
//             {displayClientName && (
//               <div className="flex items-center gap-2 text-gray-600">
//                 <Building2 className="w-4 h-4" />
//                 <span className="font-medium">{displayClientName}</span>
//               </div>
//             )}
//           </div>

//           <div className="p-6 overflow-y-auto flex-1">
//             {/* Job Basic Info */}
//             <div className="space-y-4 mb-6">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 {recruitment?.location && (
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <MapPin className="w-4 h-4" />
//                     <span>{recruitment.location}</span>
//                   </div>
//                 )}
//                 {recruitment?.experience_required && (
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Clock className="w-4 h-4" />
//                     <span>{recruitment.experience_required} experience</span>
//                   </div>
//                 )}
//                 {recruitment?.salary_range && (
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <DollarSign className="w-4 h-4" />
//                     <span>{recruitment.salary_range}</span>
//                   </div>
//                 )}
//                 {recruitment?.employment_type && (
//                   <div className="text-gray-600">
//                     <span className="font-medium">Type:</span> {recruitment.employment_type}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Job Description */}
//             {recruitment?.job_description && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
//                 <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
//                   {recruitment.job_description}
//                 </div>
//               </div>
//             )}

//             {/* Requirements */}
//             {recruitment?.requirements && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
//                 <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
//                   {recruitment.requirements}
//                 </div>
//               </div>
//             )}

//             {/* Skills */}
//             {recruitment?.skills_required && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills Required</h3>
//                 <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
//                   {recruitment.skills_required}
//                 </div>
//               </div>
//             )}

//             {/* Additional Info */}
//             <div className="space-y-3 text-sm text-gray-600">
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
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
//           <div className="p-6 border-b border-gray-200 bg-gray-50">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Users className="w-5 h-5 text-gray-600" />
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   Candidates Applied
//                 </h2>
//               </div>
//               <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                 {positionCandidates.length}
//               </span>
//             </div>
//           </div>

//           <div className="overflow-y-auto flex-1 p-6">
//             {positionCandidates.length === 0 ? (
//               <div className="text-center py-10 text-gray-500">
//                 <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//                 <div>
//                   <p className="mb-2">No candidates found for this position.</p>
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

//                   return (
//                     <div
//                       key={candidateKey}
//                       className={`border rounded-lg p-4 transition-all ${isSelected
//                           ? 'border-green-200 bg-green-50'
//                           : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
//                         }`}
//                     >
//                       {/* Candidate Header */}
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <h3 className="font-semibold text-gray-800 text-lg">{candidate.candidate_name}</h3>
//                           <p className="text-gray-600 text-sm">{candidate.email}</p>
//                           <p className="text-gray-600 text-sm">{candidate.mobile_number}</p>
//                           <p className="text-xs text-gray-400 mt-1">Applied to Job ID: {candidate.job_id}</p>
//                         </div>
//                         <div className="flex flex-col items-end gap-2">
//                           <button
//                             onClick={() => handleStatusChange(candidate, 'Selected')}
//                             disabled={isSelected}
//                             className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${isSelected
//                                 ? 'bg-green-100 text-green-800 cursor-default'
//                                 : 'bg-blue-600 text-white hover:bg-blue-700'
//                               }`}
//                           >
//                             {isSelected ? '✓ Selected' : 'Select'}
//                           </button>

//                           {isSelected && (
//                             <div className="text-xs text-center">
//                               <div className="mb-1 font-medium text-gray-700">Current Status:</div>
//                               <div className={`font-medium ${
//                                 getCurrentProcessStatus(candidate) === 'Rejected' 
//                                   ? 'text-red-700' 
//                                   : 'text-purple-700'
//                               }`}>
//                                 {getCurrentProcessStatus(candidate)}
//                               </div>
//                               <button
//                                 onClick={() => {
//                                   setSelectedCandidate(candidate);
//                                   setShowTrackerModal(true);
//                                 }}
//                                 className="mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200"
//                               >
//                                 Update Process
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Candidate Details Grid */}
//                       <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
//                         <div className="flex justify-between">
//                           <span className="font-medium">Experience:</span>
//                           <span>{candidate.years_experience} years</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="font-medium">Current Company:</span>
//                           <span>{candidate.current_company || 'Not specified'}</span>
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
//                           <span>{candidate.current_location || 'Not specified'}</span>
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

//       {/* Process Tracker Modal */}
//       {showTrackerModal && selectedCandidate && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-2xl font-semibold text-gray-800">
//                 Hiring Process Tracker - {selectedCandidate.candidate_name}
//               </h3>
//               <button onClick={() => setShowTrackerModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
//                 ✕
//               </button>
//             </div>

//             {/* Candidate Summary */}
//             <div className="mb-8 border p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
//               <h4 className="text-lg font-semibold text-gray-800 mb-4">Candidate Summary</h4>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
//                 <div>
//                   <div className="font-medium text-gray-800 mb-2">Contact Information</div>
//                   <div className="space-y-1 text-gray-600">
//                     <div><strong>Email:</strong> {selectedCandidate.email}</div>
//                     <div><strong>Mobile:</strong> {selectedCandidate.mobile_number}</div>
//                     <div><strong>Location:</strong> {selectedCandidate.current_location}</div>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-800 mb-2">Professional Details</div>
//                   <div className="space-y-1 text-gray-600">
//                     <div><strong>Company:</strong> {selectedCandidate.current_company}</div>
//                     <div><strong>Experience:</strong> {selectedCandidate.years_experience} years</div>
//                     <div><strong>Relevant Exp:</strong> {selectedCandidate.relevant_experience} years</div>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-800 mb-2">Compensation & Availability</div>
//                   <div className="space-y-1 text-gray-600">
//                     <div><strong>Current CTC:</strong> {selectedCandidate.current_ctc}</div>
//                     <div><strong>Expected CTC:</strong> {selectedCandidate.expected_ctc}</div>
//                     <div><strong>Notice Period:</strong> {selectedCandidate.notice_period}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Process Stages */}
//             <div className="mb-6">
//               <h4 className="text-lg font-semibold text-gray-800 mb-6">Hiring Process Stages</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {[
//                   { label: 'Screening', key: 'screening', color: 'blue', icon: '📋' },
//                   { label: 'HR Interview', key: 'hr_interview', color: 'green', icon: '👥' },
//                   { label: 'Client CV Review', key: 'client_cv_review', color: 'yellow', icon: '📄' },
//                   { label: 'Client Interview', key: 'client_interview', color: 'purple', icon: '🤝' },
//                   { label: 'Offer Letter', key: 'offer_letter', color: 'red', icon: '📝' },
//                   { label: 'Rejected', key: 'rejected', color: 'gray', icon: '🚫' },
//                 ].map((step) => {
//                   const currentValue = selectedCandidate.process_stages?.[step.key];
//                   const isCompleted = currentValue === 'completed';
//                   const candidateId = selectedCandidate.candidate_id || selectedCandidate.id;

//                   return (
//                     <div key={step.key} className={`p-4 border-2 rounded-lg transition-all ${
//                       isCompleted 
//                         ? (step.key === 'rejected' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50')
//                         : 'border-gray-200 bg-gray-50 hover:border-gray-300'
//                     }`}>
//                       <div className="text-center mb-3">
//                         <div className="text-2xl mb-2">{step.icon}</div>
//                         <div className="text-sm font-medium text-gray-800">
//                           {step.label}
//                         </div>
//                       </div>
                      
//                       <div className="flex justify-center">
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <input
//                             type="checkbox"
//                             checked={isCompleted}
//                             onChange={(e) => {
//                               if (e.target.checked) {
//                                 handleProcessStageChange(candidateId, step.key, 'rejected');
//                               }
//                             }}
//                             className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
//                           />
//                           <span className={`text-sm font-medium ${
//                             isCompleted 
//                               ? (step.key === 'rejected' ? 'text-red-700' : 'text-green-700')
//                               : 'text-gray-600'
//                           }`}>
//                             {isCompleted ? 'Completed ✓' : 'Mark Complete'}
//                           </span>
//                         </label>
//                       </div>
                      
//                       {isCompleted && (
//                         <div className={`mt-2 text-xs text-center ${
//                           step.key === 'rejected' ? 'text-red-600' : 'text-green-600'
//                         }`}>
//                           {step.key === 'rejected' ? '❌ Rejected' : '✅ Stage Complete'}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowTrackerModal(false)}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

  // Define process stages order for enforcement
  const orderedStages = ['screening', 'hr_interview', 'client_cv_review', 'client_interview', 'offer_letter'];

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

  // ========================= STATUS HELPERS =========================
  const getCurrentProcessStatus = (candidate) => {
    if (!candidate.process_stages) return 'Pending: Screening';

    // Check if rejected
    if (candidate.process_stages.rejected === 'rejected') return 'Rejected';

    // Count completed stages in order
    let lastCompleted = -1;
    for (let i = 0; i < orderedStages.length; i++) {
      if (candidate.process_stages[orderedStages[i]] === 'completed') {
        lastCompleted = i;
      } else {
        break; // Stop at first non-completed stage
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

  // Helper: disable Select button if any process stage is started
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

      // Update candidate status in all state arrays
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

      // When candidate is selected, create process tracker and show modal
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

  const handleProcessStageChange = async (candidateId, stage, status) => {
    try {
      console.log(`🔄 Updating stage ${stage} for candidate ${candidateId} to ${status}`);
      
      const updateData = { [stage]: status };

      const response = await fetch(`https://skilviu.com/backend/api/v1/updateprocess-tracker/${candidateId}`, {
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

      // Update all state arrays
      setCandidates(prev => updateProcessStage(prev));

      if (filteredData) {
        setFilteredData(prev => ({
          ...prev,
          candidates: updateProcessStage(prev.candidates)
        }));
      }

      // Update selected candidate in modal
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
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-10 text-gray-600">Loading candidate data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
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
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select a Position</h2>
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
      <div className="p-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/hrteamdashboard/positions')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Positions
        </button>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Candidates Found</h2>
          <p className="text-gray-600 mb-4">
            No candidates have applied for <strong>{filteredData.jobTitle}</strong>
            {filteredData.clientName && <span> at <strong>{filteredData.clientName}</strong></span>}
          </p>

          <div className="bg-white border rounded-lg p-4 mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Debug Information:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Searched Job Title:</strong> {filteredData.debugInfo.searchedJobTitle}</p>
              <p><strong>Searched Client:</strong> {filteredData.debugInfo.searchedClientName || 'Any'}</p>
              <p><strong>Total Candidates in Database:</strong> {filteredData.debugInfo.totalCandidatesInDb}</p>
              {filteredData.debugInfo.matchingRecruitmentIds && (
                <p><strong>Found Recruitment IDs:</strong> {filteredData.debugInfo.matchingRecruitmentIds.join(', ')}</p>
              )}
              <p><strong>Available Job Titles:</strong> {filteredData.debugInfo.availableJobs?.join(', ') || 'None'}</p>
            </div>
          </div>

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

  const { recruitment, candidates: positionCandidates, jobTitle: displayJobTitle, clientName: displayClientName } = filteredData;

  // ========================= MAIN RENDER =========================
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Back Navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/hrteamdashboard/positions')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Positions
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">{displayJobTitle}</h1>
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-center">
              <div className="text-sm font-medium">Open Positions</div>
              <div className="text-xl font-bold">{recruitment?.total_positions || 1}</div>
            </div>
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-center">
              <div className="text-sm font-medium">Applications</div>
              <div className="text-xl font-bold">{positionCandidates.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Job Description */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Details</h2>
            {displayClientName && (
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{displayClientName}</span>
              </div>
            )}
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {/* Job Basic Info */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {recruitment?.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{recruitment.location}</span>
                  </div>
                )}
                {recruitment?.experience_required && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{recruitment.experience_required} experience</span>
                  </div>
                )}
                {recruitment?.salary_range && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{recruitment.salary_range}</span>
                  </div>
                )}
                {recruitment?.employment_type && (
                  <div className="text-gray-600">
                    <span className="font-medium">Type:</span> {recruitment.employment_type}
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            {recruitment?.job_description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                  {recruitment.job_description}
                </div>
              </div>
            )}

            {/* Requirements */}
            {recruitment?.requirements && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                  {recruitment.requirements}
                </div>
              </div>
            )}

            {/* Skills */}
            {recruitment?.skills_required && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills Required</h3>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                  {recruitment.skills_required}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="space-y-3 text-sm text-gray-600">
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
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Candidates Applied
                </h2>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {positionCandidates.length}
              </span>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-6">
            {positionCandidates.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <div>
                  <p className="mb-2">No candidates found for this position.</p>
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
                      className={`border rounded-lg p-4 transition-all ${isSelected
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                    >
                      {/* Candidate Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{candidate.candidate_name}</h3>
                          <p className="text-gray-600 text-sm">{candidate.email}</p>
                          <p className="text-gray-600 text-sm">{candidate.mobile_number}</p>
                          <p className="text-xs text-gray-400 mt-1">Applied to Job ID: {candidate.job_id}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => handleStatusChange(candidate, 'Selected')}
                            disabled={isSelected || processStarted}
                            className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${isSelected || processStarted
                                ? 'bg-green-100 text-green-800 cursor-default'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                          >
                            {isSelected ? '✓ Selected' : 'Select'}
                          </button>

                          {(isSelected || processStarted) && (
                            <div className="text-xs text-center">
                              <div className="mb-1 font-medium text-gray-700">Current Status:</div>
                              <div className={`font-medium ${
                                getCurrentProcessStatus(candidate) === 'Rejected' 
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
                                className="mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200"
                              >
                                Update Process
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Candidate Details Grid */}
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span className="font-medium">Experience:</span>
                          <span>{candidate.years_experience} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Current Company:</span>
                          <span>{candidate.current_company || 'Not specified'}</span>
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
                          <span>{candidate.current_location || 'Not specified'}</span>
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

      {/* Process Tracker Modal */}
      {showTrackerModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                Hiring Process Tracker - {selectedCandidate.candidate_name}
              </h3>
              <button onClick={() => setShowTrackerModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>

            {/* Candidate Summary */}
            <div className="mb-8 border p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Candidate Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="font-medium text-gray-800 mb-2">Contact Information</div>
                  <div className="space-y-1 text-gray-600">
                    <div><strong>Email:</strong> {selectedCandidate.email}</div>
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

            {/* Process Stages */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-6">Hiring Process Stages</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  const offerLetterDone = selectedCandidate.process_stages?.offer_letter === 'completed';
                  const candidateId = selectedCandidate.candidate_id || selectedCandidate.id;

                  // Determine if checkbox is checked
                  const isChecked = (step.key === 'rejected' && isRejected) || 
                                   (step.key !== 'rejected' && currentValue === 'completed');

                  // Determine if checkbox can be clicked (ordered progression logic)
                  let canCheck = false;
                  if (isRejected || offerLetterDone) {
                    // If rejected or process complete, only allow unchecking rejected
                    canCheck = step.key === 'rejected' && isChecked;
                  } else if (step.key === 'rejected') {
                    // Can always reject if not already completed offer letter
                    canCheck = true;
                  } else {
                    // For normal stages, check if previous stage is completed or if it's the first stage
                    if (idx === 0) {
                      canCheck = true; // First stage always available
                    } else {
                      const prevStageKey = orderedStages[idx - 1];
                      canCheck = selectedCandidate.process_stages?.[prevStageKey] === 'completed';
                    }
                  }

                  return (
                    <div key={step.key} className={`p-4 border-2 rounded-lg transition-all ${
                      isChecked 
                        ? (step.key === 'rejected' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50')
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}>
                      <div className="text-center mb-3">
                        <div className="text-2xl mb-2">{step.icon}</div>
                        <div className="text-sm font-medium text-gray-800">
                          {step.label}
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={!canCheck}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (step.key === 'rejected') {
                                  handleProcessStageChange(candidateId, step.key, 'rejected');
                                } else {
                                  handleProcessStageChange(candidateId, step.key, 'completed');
                                }
                              } else {
                                // Clear the stage status when unchecked
                                handleProcessStageChange(candidateId, step.key, '');
                              }
                            }}
                            className={`w-5 h-5 rounded focus:ring-500 ${
                              step.key === 'rejected' ? 'text-red-600' : 'text-green-600'
                            }`}
                          />
                          <span className={`text-sm font-medium ${
                            isChecked 
                              ? (step.key === 'rejected' ? 'text-red-700' : 'text-green-700')
                              : 'text-gray-600'
                          }`}>
                            {isChecked ? (step.key === 'rejected' ? 'Rejected' : 'Completed ✓') : 'Mark Complete'}
                          </span>
                        </label>
                      </div>
                      
                      {isChecked && (
                        <div className={`mt-2 text-xs text-center ${
                          step.key === 'rejected' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {step.key === 'rejected' ? '❌ Rejected' : '✅ Stage Complete'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowTrackerModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
