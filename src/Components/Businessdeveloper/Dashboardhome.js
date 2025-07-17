// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import CountUp from 'react-countup';
// import {
//   Send,
//   CalendarCheck,
//   Users,
//   ClipboardList,
//   FileSignature,
//   CheckCircle,
// } from 'lucide-react';

// const Dashboardhome = () => {
//   const [stats, setStats] = useState({
//     applications: 0,
//     interviews: 0,
//     candidates: 0,
//     clientForms: 0,
//     totalPositions: 0,
//     positionsWithoutCandidates: 0,
//     positionsClosed: 0,
//   });

//   const [startCount, setStartCount] = useState(false);

//   useEffect(() => {
//     const fetchAllStats = async () => {
//       try {
//         const [recruitmentsRes, clientFormsRes, candidatesRes] = await Promise.all([
//           axios.get('https://skilviu.com/backend/api/v1/recruitments'),
//           axios.get('https://skilviu.com/backend/api/v1/clientforms'),
//           axios.get('https://skilviu.com/backend/api/v1/candidates'),
//         ]);

//         const recruitments = recruitmentsRes.data;
//         const clientForms = clientFormsRes.data.data.data || [];
//         const candidates = candidatesRes.data;

//         const applications = recruitments.length;
//         const interviews = recruitments.filter(r => r.interviewScheduled === true).length;
//         const totalPositions = new Set(recruitments.map(r => r.position)).size;

//         // Calculate positionsWithoutCandidates
//         const positionToCandidates = recruitments.reduce((map, item) => {
//           const pos = item.position;
//           if (!map[pos]) map[pos] = [];
//           if (item.candidate) map[pos].push(item.candidate);
//           return map;
//         }, {});
//         const positionsWithoutCandidates = Object.values(positionToCandidates).filter(
//           arr => arr.length === 0
//         ).length;

//         // Count closed positions
//         const positionsClosed = recruitments.filter(r => r.status === 'closed').length;

//         setStats({
//           applications,
//           interviews,
//           candidates: candidates.length,
//           clientForms: clientForms.length,
//           totalPositions,
//           positionsWithoutCandidates,
//           positionsClosed,
//         });

//         setStartCount(true);
//       } catch (error) {
//         console.error('Failed to fetch dashboard stats:', error);
//       }
//     };

//     fetchAllStats();
//   }, []);

//   return (
//     <div className="bg-white rounded-xl shadow p-6 md:p-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-10">
//         Welcome to the Business Developer Dashboard
//       </h1>

//       {/* Overview Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
//         <OverviewCard
//           icon={<ClipboardList className="w-6 h-6 text-purple-600" />}
//           label="No. of Clients"
//           value={stats.clientForms}
//           colorClass="text-purple-600 bg-purple-100"
//           startCount={startCount}
//         />
//         <OverviewCard
//           icon={<FileSignature className="w-6 h-6 text-pink-600" />}
//           label="No. of Positions"
//           value={stats.totalPositions}
//           colorClass="text-pink-600 bg-pink-100"
//           startCount={startCount}
//         />
//         <OverviewCard
//           icon={<Users className="w-6 h-6 text-green-600" />}
//           label="No. of Candidates"
//           value={stats.candidates}
//           colorClass="text-green-600 bg-green-100"
//           startCount={startCount}
//         />
//         <OverviewCard
//           icon={<CalendarCheck className="w-6 h-6 text-yellow-600" />}
//           label="Interviews Scheduled"
//           value={stats.interviews}
//           colorClass="text-yellow-600 bg-yellow-100"
//           startCount={startCount}
//         />
//         <OverviewCard
//           icon={<Send className="w-6 h-6 text-blue-600" />}
//           label="Positions without Candidates"
//           value={stats.positionsWithoutCandidates}
//           colorClass="text-blue-600 bg-blue-100"
//           startCount={startCount}
//         />
//         <OverviewCard
//           icon={<CheckCircle className="w-6 h-6 text-red-600" />}
//           label="Positions Closed"
//           value={stats.positionsClosed}
//           colorClass="text-red-600 bg-red-100"
//           startCount={startCount}
//         />
//       </div>

//       {/* Project Status Section */}
//       <div className="bg-gray-50 rounded-2xl p-6 shadow mt-20">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">Project Status</h2>

//         <div className="space-y-6">
//           <StatusBar label="Good" color="green" width="70%" />
//           <StatusBar label="Auction" color="yellow" width="50%" />
//           <StatusBar label="Warning" color="red" width="30%" />
//         </div>
//       </div>
//     </div>
//   );
// };

// // OverviewCard Component
// const OverviewCard = ({ icon, label, value, colorClass, startCount }) => (
//   <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center">
//     <div className={`p-3 rounded-full mb-3 ${colorClass}`}>{icon}</div>
//     <p className="text-sm text-gray-500">{label}</p>
//     <p className={`text-xl font-bold ${colorClass.split(' ')[0]}`}>
//       {startCount ? <CountUp end={value} duration={2} /> : 0}
//     </p>
//   </div>
// );

// // StatusBar Component
// const StatusBar = ({ label, color, width }) => (
//   <div>
//     <p className="text-sm text-gray-700 mb-2 font-medium">{label}</p>
//     <div className={`w-full h-4 bg-${color}-200 rounded-full overflow-hidden`}>
//       <div
//         className={`h-full bg-${color}-500 transition-all duration-500`}
//         style={{ width }}
//       />
//     </div>
//   </div>
// );

// export default Dashboardhome;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CountUp from 'react-countup';
import {
  Send,
  CalendarCheck,
  Users,
  ClipboardList,
  FileSignature,
  CheckCircle,
  X,
} from 'lucide-react';

const Dashboardhome = () => {
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    candidates: 0,
    clientForms: 0,
    totalPositions: 0,
    positionsWithoutCandidates: 0,
    positionsClosed: 0,
    projectStatus: {
      warning: 0,
      auction: 0,
      good: 0,
    },
  });

  const [startCount, setStartCount] = useState(false);
  const [recruitments, setRecruitments] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [recruitmentsRes, clientFormsRes, candidatesRes] = await Promise.all([
          axios.get('https://skilviu.com/backend/api/v1/recruitments'),
          axios.get('https://skilviu.com/backend/api/v1/clientforms'),
          axios.get('https://skilviu.com/backend/api/v1/candidates'),
        ]);

        const recruitments = recruitmentsRes.data;
        setRecruitments(recruitments);

        const clientForms = clientFormsRes.data.data.data || [];
        const candidates = candidatesRes.data;

        const applications = recruitments.length;
        const interviews = recruitments.filter(r => r.interviewScheduled === true).length;
        const totalPositions = new Set(recruitments.map(r => r.position)).size;

        const positionToCandidates = recruitments.reduce((map, item) => {
          const pos = item.position;
          if (!map[pos]) map[pos] = [];
          if (item.candidate) map[pos].push(item.candidate);
          return map;
        }, {});
        const positionsWithoutCandidates = Object.values(positionToCandidates).filter(
          arr => arr.length === 0
        ).length;

        const positionsClosed = recruitments.filter(r => r.status === 'closed').length;

        let warning = 0, auction = 0, good = 0;
        recruitments.forEach(r => {
          const np = r.notice_period?.toLowerCase() || '';
          if (np.includes('immediate')) warning++;
          else if (np.includes('10') || np.includes('15')) auction++;
          else if (
            np.includes('15 to 30') ||
            np.includes('1 month') ||
            np.includes('30') ||
            np.includes('more')
          ) good++;
        });

        setStats({
          applications,
          interviews,
          candidates: candidates.length,
          clientForms: clientForms.length,
          totalPositions,
          positionsWithoutCandidates,
          positionsClosed,
          projectStatus: { warning, auction, good },
        });

        setStartCount(true);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    fetchAllStats();
  }, []);

  const getPercentage = (count) => {
    const total =
      stats.projectStatus.warning +
      stats.projectStatus.auction +
      stats.projectStatus.good;
    if (total === 0) return '0%';
    return `${Math.round((count / total) * 100)}%`;
  };

  const openModalForCategory = (category) => {
    const filtered = recruitments.filter((r) => {
      const period = r.notice_period?.toLowerCase() || '';
      if (category === 'Warning') return period.includes('immediate');
      if (category === 'Auction') return period.includes('10') || period.includes('15');
      return (
        period.includes('15 to 30') ||
        period.includes('1 month') ||
        period.includes('30') ||
        period.includes('more')
      );
    });

    setModalData(filtered);
    setModalTitle(category);
    setShowModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">
        Welcome to the Business Developer Dashboard
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        <OverviewCard icon={<ClipboardList className="w-6 h-6 text-purple-600" />} label="No. of Clients" value={stats.clientForms} colorClass="text-purple-600 bg-purple-100" startCount={startCount} />
        <OverviewCard icon={<FileSignature className="w-6 h-6 text-pink-600" />} label="No. of Positions" value={stats.totalPositions} colorClass="text-pink-600 bg-pink-100" startCount={startCount} />
        <OverviewCard icon={<Users className="w-6 h-6 text-green-600" />} label="No. of Candidates" value={stats.candidates} colorClass="text-green-600 bg-green-100" startCount={startCount} />
        <OverviewCard icon={<CalendarCheck className="w-6 h-6 text-yellow-600" />} label="Interviews Scheduled" value={stats.interviews} colorClass="text-yellow-600 bg-yellow-100" startCount={startCount} />
        <OverviewCard icon={<Send className="w-6 h-6 text-blue-600" />} label="Positions without Candidates" value={stats.positionsWithoutCandidates} colorClass="text-blue-600 bg-blue-100" startCount={startCount} />
        <OverviewCard icon={<CheckCircle className="w-6 h-6 text-red-600" />} label="Positions Closed" value={stats.positionsClosed} colorClass="text-red-600 bg-red-100" startCount={startCount} />
      </div>

      {/* Project Status Section */}
      <div className="bg-gray-50 rounded-2xl p-6 shadow mt-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Project Status</h2>

        <div className="space-y-6">
          <div onClick={() => openModalForCategory('Warning')}>
            <StatusBar label="Warning" color="red" width={getPercentage(stats.projectStatus.warning)} />
          </div>
          <div onClick={() => openModalForCategory('Auction')}>
            <StatusBar label="Auction" color="yellow" width={getPercentage(stats.projectStatus.auction)} />
          </div>
          <div onClick={() => openModalForCategory('Good')}>
            <StatusBar label="Good" color="green" width={getPercentage(stats.projectStatus.good)} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-semibold mb-4">Recruitments: {modalTitle}</h3>
            {modalData.length > 0 ? (
              <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                {modalData.map((item, idx) => (
                  <li key={idx} className="border p-3 rounded-md shadow-sm">
                    <p className="font-medium text-gray-800">{item.job_title}</p>
                    <p className="text-sm text-gray-600">Notice Period: {item.notice_period}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No records found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// OverviewCard Component
const OverviewCard = ({ icon, label, value, colorClass, startCount }) => (
  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center">
    <div className={`p-3 rounded-full mb-3 ${colorClass}`}>{icon}</div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-xl font-bold ${colorClass.split(' ')[0]}`}>
      {startCount ? <CountUp end={value} duration={2} /> : 0}
    </p>
  </div>
);

// StatusBar Component
const StatusBar = ({ label, color, width }) => (
  <div className="cursor-pointer">
    <p className="text-sm text-gray-700 mb-2 font-medium">{label}</p>
    <div className={`w-full h-4 bg-${color}-200 rounded-full overflow-hidden`}>
      <div
        className={`h-full bg-${color}-500 transition-all duration-500`}
        style={{ width }}
      />
    </div>
  </div>
);

export default Dashboardhome;
