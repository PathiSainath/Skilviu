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

      setSelectedCandidate((prev) => ({
        ...prev,
        process_stages: {
          ...prev.process_stages,
          [stage]: status,
        },
      }));
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

      {/* Tracker Modal */}
      {showTrackerModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Hiring Process Tracker
              </h3>
              <button onClick={() => setShowTrackerModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            {/* Candidate Details in Two Columns */}
            <div className="mb-8 border p-6 rounded-lg bg-gray-50">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Candidate Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-700">
                <div><strong>Name:</strong> {selectedCandidate.candidate_name}</div>
                <div><strong>Email:</strong> {selectedCandidate.email}</div>
                <div><strong>Mobile:</strong> {selectedCandidate.mobile_number}</div>
                <div><strong>Company:</strong> {selectedCandidate.current_company}</div>
                <div><strong>Experience:</strong> {selectedCandidate.years_experience} yrs</div>
                <div><strong>Relevant Experience:</strong> {selectedCandidate.relevant_experience} yrs</div>
                <div><strong>Current CTC:</strong> {selectedCandidate.current_ctc}</div>
                <div><strong>Expected CTC:</strong> {selectedCandidate.expected_ctc}</div>
                <div><strong>Notice Period:</strong> {selectedCandidate.notice_period}</div>
                <div><strong>Location:</strong> {selectedCandidate.current_location}</div>
              </div>
            </div>

            {/* Horizontal Process Tracker */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Process Stages</h4>
              <div className="flex flex-wrap gap-8 justify-center">
                {[
                  { label: 'Screening', key: 'screening' },
                  { label: 'HR Interview', key: 'hr_interview' },
                  { label: 'Client CV Review', key: 'client_cv_review' },
                  { label: 'Client Interview', key: 'client_interview' },
                  { label: 'Offer Letter', key: 'offer_letter' },
                ].map((step, index) => {
                  const currentValue = selectedCandidate.process_stages?.[step.key] || 'pending';
                  const candidateId = selectedCandidate.candidate_id || selectedCandidate.id;

                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className="text-sm font-medium text-gray-800 mb-2 text-center">
                        {step.label}
                      </div>
                      <div className="flex flex-col gap-2">
                        {['pending', 'completed'].map((status) => (
                          <label key={status} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="radio"
                              name={`${step.key}_${candidateId}`}
                              value={status}
                              checked={currentValue === status}
                              onChange={() =>
                                handleProcessStageChange(candidateId, step.key, status)
                              }
                              className="text-blue-600"
                            />
                            <span className={`${status === 'completed' ? 'text-green-600' : 'text-gray-600'}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
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




