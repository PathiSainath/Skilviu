// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Send,
//   CalendarCheck,
//   Users,
//   ClipboardList,
//   FileSignature,
// } from 'lucide-react';

// const Dashboardhome = () => {
//   const [stats, setStats] = useState({
//     applications: 0,
//     interviews: 0,
//     candidates: 0,
//     clientForms: 0,
//     totalPositions: 0,
//   });

//   const currentDay = 18;

//   useEffect(() => {
//     const fetchAllStats = async () => {
//       try {
//         const [recruitmentsRes, clientFormsRes, candidatesRes] = await Promise.all([
//           axios.get('https://skilviu.com/backend/api/v1/recruitments'),
//           axios.get('https://skilviu.com/backend/api/v1/clientforms'),
//           axios.get('https://skilviu.com/backend/api/v1/candidates'),
//         ]);

//         const recruitments = recruitmentsRes.data;
//         const clientForms = clientFormsRes.data;
//         const candidates = candidatesRes.data;

//         const applications = recruitments.length;
//         const interviews = recruitments.filter(r => r.interviewScheduled === true).length;
//         const totalPositions = new Set(recruitments.map(r => r.position)).size;

//         setStats({
//           applications,
//           interviews,
//           candidates: candidates.length,
//           clientForms: clientForms.length,
//           totalPositions,
//         });
//       } catch (error) {
//         console.error('Failed to fetch dashboard stats:', error);
//       }
//     };

//     fetchAllStats();
//   }, []);

//   return (
//     <div className="bg-white rounded-xl shadow p-4 sm:p-6 md:p-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">
//         Welcome to the HR Team Dashboard
//       </h1>

//       {/* Overview Cards */}
//       <div className="px-4 sm:px-0">
//         <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-10">
//           {/* <OverviewCard
//             icon={<Send className="w-6 h-6" />}
//             label="Applications"
//             value={stats.applications}
//             colorClass="text-blue-600 bg-blue-100"
//           /> */}
//           {/* <OverviewCard
//             icon={<CalendarCheck className="w-6 h-6" />}
//             label="Interviews"
//             value={stats.interviews}
//             colorClass="text-yellow-600 bg-yellow-100"
//           /> */}
//           <OverviewCard
//             icon={<ClipboardList className="w-6 h-6" />}
//             label="No.of Clients"
//             value={stats.clientForms}
//             colorClass="text-purple-600 bg-purple-100"
//           />
//           <OverviewCard
//             icon={<Users className="w-6 h-6" />}
//             label="No.of Candidates"
//             value={stats.candidates}
//             colorClass="text-green-600 bg-green-100"
//           />
//           <OverviewCard
//             icon={<FileSignature className="w-6 h-6" />}
//             label="No.of Positions"
//             value={stats.totalPositions}
//             colorClass="text-pink-600 bg-pink-100"
//           />
//         </div>
//       </div>

//       {/* Traffic Light Indicator */}
//       <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 shadow">
//         <h2 className="text-lg font-semibold text-gray-700 mb-4">
//           Vacancy Status
//         </h2>

//         <div className="w-full overflow-x-auto">
//           <div className="relative h-4 sm:h-6 min-w-[200px] rounded overflow-hidden shadow flex">
//             <div className="w-1/3 bg-green-500" />
//             <div className="w-1/3 bg-yellow-500" />
//             <div className="w-1/3 bg-red-500" />

//             {/* Marker Line */}
//             <div
//               className="absolute top-0 bottom-0 w-1 bg-black"
//               style={{ left: `${(currentDay / 30) * 100}%` }}
//             />
//           </div>
//         </div>

//         <p className="text-sm text-gray-700 mt-3">
//           Current Day: <span className="font-semibold">{currentDay}</span> / 30
//         </p>
//       </div>
//     </div>
//   );
// };

// // Reusable Overview Card Component
// const OverviewCard = ({ icon, label, value, colorClass }) => {
//   const [textColor, bgColor] = colorClass.split(' ');
//   return (
//     <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center">
//       <div className={`p-3 rounded-full mb-3 ${bgColor}`}>
//         <div className={`${textColor}`}>{icon}</div>
//       </div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className={`text-xl font-bold ${textColor}`}>{value}</p>
//     </div>
//   );
// };

// export default Dashboardhome;






import React, { useEffect, useState } from 'react';
import { Users, ClipboardList, FileSignature } from 'lucide-react';
import axios from 'axios';
import Positions from './Positions';

const Dashboardhome = () => {
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    candidates: 0,
    clientForms: 0,
    totalPositions: 0,
  });

  const [showPositions, setShowPositions] = useState(false);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        // Fetch counts directly from backend endpoints that return counts
        const [recruitmentsCountRes, interviewsCountRes, candidatesCountRes, clientsCountRes, positionsCountRes] = 
          await Promise.all([
            axios.get('https://skilviu.com/backend/api/v1/recruitments/count'),
            axios.get('https://skilviu.com/backend/api/v1/recruitments/interviews/count'),
            axios.get('https://skilviu.com/backend/api/v1/candidates/count'),
            axios.get('https://skilviu.com/backend/api/v1/clientforms/count'),
            axios.get('https://skilviu.com/backend/api/v1/positions/count')
          ]);

        setStats({
          applications: recruitmentsCountRes.data.count || 0,
          interviews: interviewsCountRes.data.count || 0,
          candidates: candidatesCountRes.data.count || 0,
          clientForms: clientsCountRes.data.count || 0,
          totalPositions: positionsCountRes.data.count || 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Fallback to fetching full data if count endpoints don't exist
        fetchFullDataAsFallback();
      }
    };

    // Fallback function if count endpoints don't exist
    const fetchFullDataAsFallback = async () => {
      try {
        const [recruitmentsRes, clientFormsRes, candidatesRes] = await Promise.all([
          axios.get('https://skilviu.com/backend/api/v1/recruitments'),
          axios.get('https://skilviu.com/backend/api/v1/clientforms'),
          axios.get('https://skilviu.com/backend/api/v1/candidates'),
        ]);

        const recruitments = recruitmentsRes.data;
        const clientForms = clientFormsRes.data.data.data || [];
        const candidates = candidatesRes.data;

        setStats({
          applications: recruitments.length,
          interviews: recruitments.filter(r => r.interviewScheduled).length,
          candidates: candidates.length,
          clientForms: clientForms.length, // Assuming each form is for a unique client
          totalPositions: new Set(recruitments.map(r => r.position)).size,
        });
      } catch (fallbackError) {
        console.error('Fallback data fetch failed:', fallbackError);
      }
    };

    fetchAllStats();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Welcome to the HR Team Dashboard
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-10">
        <OverviewCard
          icon={<ClipboardList className="w-6 h-6" />}
          label="No. of Clients"
          value={stats.clientForms}
          colorClass="text-purple-600 bg-purple-100"
          onClick={() => console.log('Clients card clicked')}
        />
        <OverviewCard
          icon={<Users className="w-6 h-6" />}
          label="No. of Candidates"
          value={stats.candidates}
          colorClass="text-green-600 bg-green-100"
          onClick={() => console.log('Candidates card clicked')}
        />
        <OverviewCard
          icon={<FileSignature className="w-6 h-6" />}
          label="No. of Positions"
          value={stats.totalPositions}
          colorClass="text-pink-600 bg-pink-100"
          onClick={() => setShowPositions(prev => !prev)}
        />
      </div>

      {/* Conditional rendering of Positions */}
      {showPositions && (
        <div className="mt-8">
          <Positions />
        </div>
      )}
    </div>
  );
};

// Overview Card Component
const OverviewCard = ({ icon, label, value, colorClass, onClick }) => {
  const [textColor, bgColor] = colorClass.split(' ');
  return (
    <div
      onClick={onClick}
      className="bg-white w-full h-40 rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center text-center cursor-pointer"
    >
      <div className={`p-3 rounded-full mb-3 ${bgColor}`}>
        <div className={`${textColor}`}>{icon}</div>
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
};

export default Dashboardhome;