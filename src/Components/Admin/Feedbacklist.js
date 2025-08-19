import React, { useEffect, useState } from 'react';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('https://skilviu.com/backend/api/v1/feedbacks');
        const data = await response.json();
        setFeedbacks(data.data || []); // backend returns { message, data: [...] }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <p className="p-4">Loading feedbacks...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Contact Feedbacks</h2>

      {feedbacks.length === 0 ? (
        <p className="text-gray-500">No feedbacks found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg shadow-lg bg-white">
              <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                <tr>
                  <th className="px-4 py-3 border text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 border text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 border text-left text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="px-4 py-3 border text-left text-sm font-semibold text-gray-700">
                    Message
                  </th>
                  <th className="px-4 py-3 border text-left text-sm font-semibold text-gray-700">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb, index) => (
                  <tr
                    key={fb.id}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="px-4 py-3 border text-sm text-gray-700">
                      {fb.first_name} {fb.last_name}
                    </td>
                    <td className="px-4 py-3 border text-sm text-gray-700">
                      {fb.email}
                    </td>
                    <td className="px-4 py-3 border text-sm text-gray-700">
                      {fb.phone_number || '-'}
                    </td>
                    <td className="px-4 py-3 border text-sm text-gray-700 whitespace-pre-line max-w-lg">
                      {fb.message}
                    </td>
                    <td className="px-4 py-3 border text-sm text-gray-500">
                      {new Date(fb.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="border rounded-lg shadow-sm p-4 bg-white"
              >
                <p className="text-sm">
                  <span className="font-semibold">Name: </span>
                  {fb.first_name} {fb.last_name}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Email: </span>
                  {fb.email}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Phone: </span>
                  {fb.phone_number || '-'}
                </p>
                <p className="text-sm whitespace-pre-line">
                  <span className="font-semibold">Message: </span>
                  {fb.message}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(fb.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackList;
