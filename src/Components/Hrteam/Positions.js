// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Positions = () => {
//     const [positions, setPositions] = useState([]);
//     const [selectedIndex, setSelectedIndex] = useState(null);

//     useEffect(() => {
//         const fetchPositions = async () => {
//             try {
//                 const res = await axios.get('https://skilviu.com/backend/api/v1/recruitments');
//                 const data = res.data;

//                 // Group by job_title + client_name
//                 const grouped = data.reduce((acc, item) => {
//                     const jobTitle = item.job_title || item.position || 'Unknown';
//                     const client = item.client_name || 'Unknown Client';
//                     const count = Number(item.no_of_positions) || 1;
//                     const key = `${jobTitle}__${client}`;

//                     if (!acc[key]) {
//                         acc[key] = {
//                             jobTitle,
//                             clientName: client,
//                             count: 0,
//                         };
//                     }

//                     acc[key].count += count;
//                     return acc;
//                 }, {});

//                 const formatted = Object.values(grouped).map(item => ({
//                     ...item,
//                     initials: getInitials(item.jobTitle),
//                 }));

//                 setPositions(formatted);
//             } catch (error) {
//                 console.error('Error fetching positions:', error);
//             }
//         };

//         fetchPositions();
//     }, []);

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-semibold text-gray-800 mb-6">Open Positions</h1>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {positions.map((pos, index) => (
//                     <div
//                         key={index}
//                         onClick={() => setSelectedIndex(index)}
//                         className={`border rounded-xl p-4 text-center shadow-md transition-all cursor-pointer
//       ${selectedIndex === index
//                                 ? 'border-blue-500 ring-2 ring-blue-300'
//                                 : 'border-gray-200 hover:border-blue-300'
//                             }`}
//                     >
//                         <div className="text-lg font-bold text-gray-800 mb-2">{pos.jobTitle}</div> {/* job title at top */}
//                         <div className="text-md text-gray-500 italic mb-2">{pos.clientName}</div> {/* client name below */}
//                         <div className="inline-block bg-blue-50 text-sm text-blue-700 rounded-full px-3 py-1">
//                             {pos.count} position{pos.count > 1 ? 's' : ''}
//                         </div>
//                     </div>
//                 ))}

//             </div>
//         </div>
//     );
// };

// // Helper to get initials from job title
// const getInitials = (str) => {
//     const words = str.trim().split(' ');
//     if (words.length === 1) return words[0][0]?.toUpperCase() || '';
//     return (words[0][0] + words[1][0]).toUpperCase();
// };

// export default Positions;




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await axios.get('https://skilviu.com/backend/api/v1/recruitments');
        const data = res.data;

        // Group positions by job title and client name
        const grouped = data.reduce((acc, item) => {
          const jobTitle = item.job_title || item.position || 'Unknown';
          const clientName = item.client_name || 'Unknown Client';
          const count = Number(item.no_of_positions) || 1;
          const key = `${jobTitle}__${clientName}`;

          if (!acc[key]) {
            acc[key] = { jobTitle, clientName, count: 0 };
          }

          acc[key].count += count;
          return acc;
        }, {});

        const formatted = Object.values(grouped);
        setPositions(formatted);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchPositions();
  }, []);

  const handleCardClick = (index, jobTitle) => {
    setSelectedIndex(index);
    navigate(`/Hrteamdashboard/candidatestatus/${encodeURIComponent(jobTitle)}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Open Positions</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {positions.map((pos, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index, pos.jobTitle)}
            className={`border rounded-xl p-4 text-center shadow-md transition-all cursor-pointer ${
              selectedIndex === index
                ? 'border-blue-500 ring-2 ring-blue-300'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-lg font-bold text-gray-800 mb-2">{pos.jobTitle}</div>
            <div className="text-md text-gray-500 italic mb-2">{pos.clientName}</div>
            <div className="inline-block bg-blue-50 text-sm text-blue-700 rounded-full px-3 py-1">
              {pos.count} position{pos.count > 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Positions;

