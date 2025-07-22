import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function Jobdetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // First, try to get job data from navigation state
    if (location.state?.job) {
      setJob(location.state.job);
    } else {
      // If no state data, fetch the specific job from API
      const fetchJobDetails = async () => {
        try {
          // Fetch the specific job by ID
          const response = await fetch(`https://skilviu.com/backend/api/v1/recruitments/${id}`);
          if (!response.ok) throw new Error('Failed to fetch job details');
          const data = await response.json();

          console.log('Fetched job data:', data);
          setJob(data);
        } catch (err) {
          console.error('Error fetching job details:', err);
          setError('Job details could not be loaded.');
        }
      };

      fetchJobDetails();
    }
  }, [id, location.state]);

  const handleApplyNow = () => {
    navigate('/candidateform', { state: { job_id: job.job_id, job_title: job.job_title } });
  };


  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  if (!job) {
    return <div className="p-10 text-center text-gray-600">Loading job details...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6 lg:px-20">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">{job.job_title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm mb-10">
          <Info label="Company Name" value={job.client_name} />
          <Info label="Location" value={job.job_location} />
          <Info label="Industry" value={job.type_of_industry} />
          <Info label="Hiring Type" value={job.hiring_type || 'N/A'} />
          <Info label="Experience Required" value={`${job.min_experience} - ${job.max_experience} years`} />
          <Info label="Number of Positions" value={job.no_of_positions ?? 'N/A'} />
          <Info label="Package" value={job.package ? `₹${parseFloat(job.package).toLocaleString('en-IN')} per annum` : 'N/A'} />
          <Info
            label="Posted On"
            value={job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
          />
        </div>

        {/* <Section title="Skills Required">
          <ul className="list-disc list-inside space-y-1">
            {job.skills_required?.split(',').map((skill, i) => (
              <li key={i}>{skill.trim()}</li>
            ))}
          </ul>
        </Section> */}

        <Section title="Skills Required">
          <ul className="list-disc list-inside space-y-1">
            {job.skills_required
              ?.split('.')
              .map((sentence, i) => sentence.trim())
              .filter(sentence => sentence.length > 0)
              .map((sentence, i) => (
                <li key={i}>{sentence}.</li>
              ))}
          </ul>
        </Section>


        {job.benefit?.trim() && (
          <Section title="Benefits">
            <ul className="list-disc list-inside space-y-1">
              {job.benefit.split(',').map((b, i) => (
                <li key={i}>{b.trim()}</li>
              ))}
            </ul>
          </Section>
        )}

        <Section title="Job Description">
          <div className="prose max-w-none whitespace-pre-wrap leading-relaxed text-gray-700">
            {job.job_description}
          </div>
        </Section>

        <div className="mb-10">
          <button
            onClick={handleApplyNow}
            className="w-full sm:w-auto bg-blue-800 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-xl transition duration-200"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Small reusable components
const Info = ({ label, value }) => (
  <p>
    <strong>{label}:</strong> {value}
  </p>
);

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="text-gray-600">{children}</div>
  </div>
);

export default Jobdetails;
