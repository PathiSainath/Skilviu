import React, { useState, useEffect } from 'react';
import { Phone, Mail, Building2, Calendar, User, Briefcase, Users } from 'lucide-react';

function Referredfriend() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferralsWithDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch referrals
        const referralsResponse = await fetch('https://skilviu.com/backend/api/v1/refer-a-friend');
        if (!referralsResponse.ok) {
          throw new Error(`HTTP error! status: ${referralsResponse.status}`);
        }
        
        const referralsData = await referralsResponse.json();
        console.log('Referrals API Response:', referralsData); // Debug log
        
        if (!referralsData.success) {
          setError(referralsData.message || 'Failed to load referrals');
          return;
        }

        const referralsList = referralsData.data || [];
        console.log('Referrals List:', referralsList); // Debug log

        // Fetch additional data to get candidate names and job details
        const [candidatesResponse, jobsResponse] = await Promise.all([
          fetch('https://skilviu.com/backend/api/v1/candidates'),
          fetch('https://skilviu.com/backend/api/v1/recruitments')
        ]);

        const candidatesData = await candidatesResponse.json();
        const jobsData = await jobsResponse.json();

        console.log('Candidates API Response:', candidatesData); // Debug log
        console.log('Jobs API Response:', jobsData); // Debug log

        // Process candidates data - handle different response structures
        let candidates = [];
        if (Array.isArray(candidatesData)) {
          candidates = candidatesData;
        } else if (candidatesData.data && Array.isArray(candidatesData.data)) {
          candidates = candidatesData.data;
        } else if (candidatesData.success && candidatesData.data && Array.isArray(candidatesData.data)) {
          candidates = candidatesData.data;
        }

        console.log('Processed Candidates:', candidates); // Debug log
        
        // Process jobs data - handle different response structures
        let jobs = [];
        if (Array.isArray(jobsData)) {
          jobs = jobsData;
        } else if (jobsData.data && Array.isArray(jobsData.data)) {
          jobs = jobsData.data;
        } else if (jobsData.success && jobsData.data && Array.isArray(jobsData.data)) {
          jobs = jobsData.data;
        }

        console.log('Processed Jobs:', jobs); // Debug log

        // Enhance referrals with candidate names and job details
        const enhancedReferrals = referralsList.map(referral => {
          console.log('Processing referral:', referral); // Debug log
          
          // Try different ID field variations for candidate matching
          const candidate = candidates.find(c => 
            c.id === referral.candidate_id || 
            c.candidate_id === referral.candidate_id ||
            String(c.id) === String(referral.candidate_id) ||
            String(c.candidate_id) === String(referral.candidate_id)
          );
          
          console.log(`Looking for candidate with ID ${referral.candidate_id}:`, candidate); // Debug log
          
          // Try different ID field variations for job matching
          const job = jobs.find(j => 
            j.job_id === referral.job_id || 
            j.id === referral.job_id ||
            String(j.job_id) === String(referral.job_id) ||
            String(j.id) === String(referral.job_id)
          );
          
          console.log(`Looking for job with ID ${referral.job_id}:`, job); // Debug log

          return {
            ...referral,
            candidate_name: candidate?.candidate_name || candidate?.name || `Candidate ID: ${referral.candidate_id}`,
            candidate_email: candidate?.email || candidate?.candidate_email || 'N/A',
            job_title: job?.job_title || job?.title || `Job ID: ${referral.job_id}`,
            job_location: job?.job_location || job?.location || 'Location Not Available',
            company_name: job?.client_name || job?.company || job?.company_name || 'Company Not Available'
          };
        });

        console.log('Enhanced Referrals:', enhancedReferrals); // Debug log
        setReferrals(enhancedReferrals);
      } catch (err) {
        console.error('Error fetching referrals with details:', err);
        setError('Failed to fetch referral data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReferralsWithDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <span className="ml-4 text-lg text-gray-600">Loading referred friends...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold mb-2">Error Loading Data</p>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="mr-2 w-6 h-6 text-indigo-600" />
              Referred Friends ({referrals.length})
            </h1>
            <p className="text-gray-600 mt-2">
              Contact details of friends referred by candidates for manual outreach
            </p>
          </div>

          <div className="p-6">
            {referrals.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
                <p className="text-gray-600">
                  When candidates refer friends for jobs, they will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <User className="inline w-4 h-4 mr-2" />
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <User className="inline w-4 h-4 mr-2" />
                        Friend Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Phone className="inline w-4 h-4 mr-2" />
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Mail className="inline w-4 h-4 mr-2" />
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Briefcase className="inline w-4 h-4 mr-2" />
                        Job Applied
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Building2 className="inline w-4 h-4 mr-2" />
                        Preferred Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Calendar className="inline w-4 h-4 mr-2" />
                        Date Referred
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {referrals.map((referral, index) => (
                      <tr key={referral.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-indigo-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              {/* ✅ REMOVED ID DISPLAY - Only showing name and email */}
                              <div className="text-sm font-medium text-gray-900">
                                {referral.candidate_name}
                              </div>
                              {referral.candidate_email && referral.candidate_email !== 'N/A' && (
                                <div className="text-sm text-gray-500">
                                  {referral.candidate_email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {referral.friend_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-green-600" />
                            <a 
                              href={`tel:${referral.friend_contact}`}
                              className="text-sm text-green-600 hover:text-green-800 font-medium"
                            >
                              {referral.friend_contact}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {referral.friend_email ? (
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-blue-600" />
                              <a 
                                href={`mailto:${referral.friend_email}`}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                              >
                                {referral.friend_email}
                              </a>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {referral.job_title}
                          </div>
                          <div className="text-sm text-gray-500">
                            📍 {referral.job_location}
                          </div>
                          <div className="text-sm text-gray-500">
                            🏢 {referral.company_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {referral.preferred_company || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {referral.date_referred ? 
                            new Date(referral.date_referred).toLocaleDateString() :
                            referral.created_at ? 
                            new Date(referral.created_at).toLocaleDateString() : 
                            new Date().toLocaleDateString()
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {referrals.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Referrals: <strong>{referrals.length}</strong></span>
                <span>
                  With Email: <strong>
                    {referrals.filter(r => r.friend_email && r.friend_email !== '-').length}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Referredfriend;
