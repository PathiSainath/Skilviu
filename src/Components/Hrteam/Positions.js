// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Positions = () => {
//   const [positions, setPositions] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPositions = async () => {
//       try {
//         const res = await axios.get('https://skilviu.com/backend/api/v1/recruitments');
//         const data = res.data;

//         // Group positions by job title and client name
//         const grouped = data.reduce((acc, item) => {
//           const jobTitle = item.job_title || item.position || 'Unknown';
//           const clientName = item.client_name || 'Unknown Client';
//           const count = Number(item.no_of_positions) || 1;
//           const key = `${jobTitle}__${clientName}`;

//           if (!acc[key]) {
//             acc[key] = { jobTitle, clientName, count: 0 };
//           }

//           acc[key].count += count;
//           return acc;
//         }, {});

//         const formatted = Object.values(grouped);
//         setPositions(formatted);
//       } catch (error) {
//         console.error('Error fetching positions:', error);
//       }
//     };

//     fetchPositions();
//   }, []);

//   const handleCardClick = (index, jobTitle) => {
//     setSelectedIndex(index);
//     navigate(`/Hrteamdashboard/candidatestatus/${encodeURIComponent(jobTitle)}`);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold text-gray-800 mb-6">Open Positions</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {positions.map((pos, index) => (
//           <div
//             key={index}
//             onClick={() => handleCardClick(index, pos.jobTitle)}
//             className={`border rounded-xl p-4 text-center shadow-md transition-all cursor-pointer ${
//               selectedIndex === index
//                 ? 'border-blue-500 ring-2 ring-blue-300'
//                 : 'border-gray-200 hover:border-blue-300'
//             }`}
//           >
//             <div className="text-lg font-bold text-gray-800 mb-2">{pos.jobTitle}</div>
//             <div className="text-md text-gray-500 italic mb-2">{pos.clientName}</div>
//             <div className="inline-block bg-blue-50 text-sm text-blue-700 rounded-full px-3 py-1">
//               {pos.count} position{pos.count > 1 ? 's' : ''}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Positions;






import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('Fetching positions from API...');
        const res = await axios.get('https://skilviu.com/backend/api/v1/recruitments');
        
        // ✅ Debug: Log the raw response
        console.log('Raw API Response:', res);
        console.log('Response data:', res.data);
        console.log('Data type:', typeof res.data);
        console.log('Is array:', Array.isArray(res.data));
        
        // ✅ Handle different response structures
        let data;
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          data = res.data.data;
        } else if (res.data && res.data.recruitments && Array.isArray(res.data.recruitments)) {
          data = res.data.recruitments;
        } else if (res.data && res.data.results && Array.isArray(res.data.results)) {
          data = res.data.results;
        } else {
          // Try to find any array in the response
          const findArray = (obj) => {
            if (Array.isArray(obj)) return obj;
            if (typeof obj === 'object' && obj !== null) {
              for (let key in obj) {
                const result = findArray(obj[key]);
                if (result) return result;
              }
            }
            return null;
          };
          data = findArray(res.data) || [];
        }

        console.log('Processed data:', data);
        console.log('Data length:', data.length);
        
        // ✅ Set debug info for display
        setDebugInfo({
          totalRecords: data.length,
          sampleRecord: data[0] || null,
          responseStructure: Object.keys(res.data || {})
        });

        if (!data || data.length === 0) {
          setError('No recruitment data found in API response');
          setPositions([]);
          return;
        }

        // ✅ Enhanced: Better grouping and counting logic with more field variations
        const grouped = data.reduce((acc, item, index) => {
          console.log(`Processing item ${index}:`, item);
          
          // Try multiple field names for job title
          const jobTitle = item.job_title || 
                          item.position || 
                          item.jobTitle || 
                          item.title || 
                          item.role || 
                          'Unknown Position';
          
          // Try multiple field names for client
          const clientName = item.client_name || 
                            item.clientName || 
                            item.client || 
                            item.company || 
                            item.organization || 
                            'Unknown Client';
          
          // Try multiple field names for position count
          const count = Number(item.no_of_positions) || 
                       Number(item.noOfPositions) || 
                       Number(item.positions) || 
                       Number(item.count) || 
                       Number(item.openings) || 
                       1;
          
          const key = `${jobTitle}__${clientName}`;

          if (!acc[key]) {
            acc[key] = { 
              jobTitle, 
              clientName, 
              count: 0,
              id: item.id || item._id || index,
              status: item.status || item.recruitment_status || 'Active',
              // Store original item for debugging
              originalItem: item
            };
          }

          acc[key].count += count;
          return acc;
        }, {});

        console.log('Grouped data:', grouped);

        const formatted = Object.values(grouped).sort((a, b) => b.count - a.count);
        console.log('Final formatted positions:', formatted);
        
        setPositions(formatted);
        
        if (formatted.length === 0) {
          setError('No positions could be processed from the data');
        }

      } catch (error) {
        console.error('Error fetching positions:', error);
        setError(`Failed to fetch positions: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const handleCardClick = (index, jobTitle, clientName) => {
    setSelectedIndex(index);
    const encodedJobTitle = encodeURIComponent(jobTitle);
    const encodedClientName = encodeURIComponent(clientName);
    navigate(`/Hrteamdashboard/candidatestatus/${encodedJobTitle}?client=${encodedClientName}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-gray-600">Loading positions...</div>
      </div>
    );
  }

  // ✅ Enhanced error display with debug info
  if (error || positions.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Open Positions</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-red-800 font-medium">Error:</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {debugInfo && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="text-gray-800 font-medium mb-2">Debug Information:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Total Records:</strong> {debugInfo.totalRecords}</p>
              <p><strong>Response Structure:</strong> {debugInfo.responseStructure.join(', ')}</p>
              {debugInfo.sampleRecord && (
                <div>
                  <strong>Sample Record Fields:</strong>
                  <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto">
                    {JSON.stringify(Object.keys(debugInfo.sampleRecord), null, 2)}
                  </pre>
                  <strong>Sample Record Data:</strong>
                  <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto max-h-40 overflow-y-auto">
                    {JSON.stringify(debugInfo.sampleRecord, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="text-center py-8 text-gray-500">
          {positions.length === 0 ? 'No positions found' : 'Unable to load positions'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Open Positions</h1>
        <div className="text-sm text-gray-500">
          Total: {positions.reduce((sum, pos) => sum + pos.count, 0)} positions
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {positions.map((pos, index) => (
          <div
            key={`${pos.jobTitle}-${pos.clientName}-${index}`}
            onClick={() => handleCardClick(index, pos.jobTitle, pos.clientName)}
            className={`border rounded-xl p-4 text-center shadow-md transition-all cursor-pointer hover:shadow-lg ${
              selectedIndex === index
                ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
              {pos.jobTitle}
            </div>
            <div className="text-md text-gray-500 italic mb-3 line-clamp-1">
              {pos.clientName}
            </div>
            <div className="inline-block bg-blue-50 text-sm text-blue-700 rounded-full px-3 py-1 font-medium">
              {pos.count} position{pos.count > 1 ? 's' : ''}
            </div>
            <div className="mt-2">
              <span className={`inline-block w-2 h-2 rounded-full ${
                pos.status === 'Active' ? 'bg-green-400' : 'bg-gray-400'
              }`}></span>
              <span className="ml-1 text-xs text-gray-500">{pos.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Positions;