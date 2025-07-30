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
//   X,
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
//     projectStatus: {
//       immediate: 0,
//       shortTerm: 0,
//       longTerm: 0,
//     },
//   });

//   const [recruitments, setRecruitments] = useState([]);
//   const [startCount, setStartCount] = useState(false);
//   const [modalData, setModalData] = useState([]);
//   const [modalTitle, setModalTitle] = useState('');
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchAllStats = async () => {
//       try {
//         const [recruitmentsRes, clientFormsRes, candidatesRes] = await Promise.all([
//           axios.get('https://skilviu.com/backend/api/v1/recruitments'),
//           axios.get('https://skilviu.com/backend/api/v1/clientforms'),
//           axios.get('https://skilviu.com/backend/api/v1/candidates'),
//         ]);

//         // ✅ Fix: Safely access nested data
//         const recruitments = recruitmentsRes?.data?.data || [];
//         const clientForms = clientFormsRes?.data?.data?.data || [];
//         const candidates = candidatesRes?.data?.data || [];

//         setRecruitments(recruitments);

//         const applications = recruitments.length;
//         const interviews = recruitments.filter(r => r.interviewScheduled === true).length;

//         const totalPositions = recruitments.reduce(
//           (sum, r) => sum + (r.no_of_positions || 0),
//           0
//         );

//         const positionToCandidates = recruitments.reduce((map, item) => {
//           const pos = item.job_title;
//           if (!map[pos]) map[pos] = [];
//           if (item.candidate) map[pos].push(item.candidate);
//           return map;
//         }, {});

//         const positionsWithoutCandidates = Object.values(positionToCandidates).filter(
//           arr => arr.length === 0
//         ).length;

//         const positionsClosed = recruitments.filter(r => r.status === 'closed').length;

//         let immediateCount = 0;
//         let shortTermCount = 0;
//         let longTermCount = 0;

//         recruitments.forEach(r => {
//           const period = r.notice_period?.toLowerCase() || '';

//           if (period.includes('immediate')) {
//             immediateCount++;
//           } else if (period.includes('10') || period.includes('15')) {
//             shortTermCount++;
//           } else if (
//             period.includes('15 to 30') ||
//             period.includes('1 month') ||
//             period.includes('more') ||
//             period.includes('30')
//           ) {
//             longTermCount++;
//           }
//         });

//         setStats({
//           applications,
//           interviews,
//           candidates: candidates.length,
//           clientForms: clientForms.length,
//           totalPositions,
//           positionsWithoutCandidates,
//           positionsClosed,
//           projectStatus: {
//             immediate: immediateCount,
//             shortTerm: shortTermCount,
//             longTerm: longTermCount,
//           },
//         });

//         setStartCount(true);
//       } catch (error) {
//         console.error('Failed to fetch dashboard stats:', error);
//       }
//     };

//     fetchAllStats();
//   }, []);

//   const getPercentage = (count) => {
//     const total =
//       stats.projectStatus.immediate +
//       stats.projectStatus.shortTerm +
//       stats.projectStatus.longTerm;
//     if (total === 0) return '0%';
//     return `${Math.round((count / total) * 100)}%`;
//   };

//   const openModalForCategory = (category) => {
//     const filtered = recruitments.filter((r) => {
//       const period = r.notice_period?.toLowerCase() || '';
//       if (category === 'Immediate') return period.includes('immediate');
//       if (category === 'ShortTerm') return period.includes('10') || period.includes('15');
//       return (
//         period.includes('15 to 30') ||
//         period.includes('1 month') ||
//         period.includes('30') ||
//         period.includes('more')
//       );
//     });

//     setModalData(filtered);
//     setModalTitle(
//       category === 'Immediate' ? 'Warning ' :
//       category === 'ShortTerm' ? 'Auction ' :
//       'Good '
//     );
//     setShowModal(true);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow p-6 md:p-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-10">
//         Welcome to the Admin Dashboard
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
//           <div onClick={() => openModalForCategory('Immediate')}>
//             <StatusBar
//               label="Warning"
//               color="red"
//               width={getPercentage(stats.projectStatus.immediate)}
//             />
//           </div>
//           <div onClick={() => openModalForCategory('ShortTerm')}>
//             <StatusBar
//               label="Auction"
//               color="yellow"
//               width={getPercentage(stats.projectStatus.shortTerm)}
//             />
//           </div>
//           <div onClick={() => openModalForCategory('LongTerm')}>
//             <StatusBar
//               label="Good"
//               color="green"
//               width={getPercentage(stats.projectStatus.longTerm)}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 relative">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
//             >
//               <X className="w-6 h-6" />
//             </button>
//             <h3 className="text-xl font-semibold mb-4">{modalTitle}</h3>
//             {modalData.length > 0 ? (
//               <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
//                 {modalData.map((item, idx) => (
//                   <li key={idx} className="border p-3 rounded-md shadow-sm">
//                     <p className="font-medium text-gray-800">{item.job_title}</p>
//                     <p className="text-sm text-gray-600">Notice Period: {item.notice_period}</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-600">No records found.</p>
//             )}
//           </div>
//         </div>
//       )}
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
// const StatusBar = ({ label, color, width }) => {
//   const colorMap = {
//     red: ['bg-red-200', 'bg-red-500'],
//     yellow: ['bg-yellow-200', 'bg-yellow-500'],
//     green: ['bg-green-200', 'bg-green-500'],
//   };

//   const [bgBase, bgFill] = colorMap[color] || ['bg-gray-200', 'bg-gray-500'];

//   return (
//     <div className="cursor-pointer">
//       <p className="text-sm text-gray-700 mb-2 font-medium">{label}</p>
//       <div className={`w-full h-4 ${bgBase} rounded-full overflow-hidden`}>
//         <div
//           className={`h-full ${bgFill} transition-all duration-500`}
//           style={{ width }}
//         />
//       </div>
//     </div>
//   );
// };

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
      immediate: 0,
      shortTerm: 0,
      longTerm: 0,
    },
  });

  const [recruitments, setRecruitments] = useState([]);
  const [startCount, setStartCount] = useState(false);
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

        const recruitments = recruitmentsRes?.data?.data || [];
        const clientForms = clientFormsRes?.data?.data?.data || [];

        let candidates = [];
        if (Array.isArray(candidatesRes.data)) candidates = candidatesRes.data;
        else if (Array.isArray(candidatesRes.data?.data)) candidates = candidatesRes.data.data;
        else if (Array.isArray(candidatesRes.data?.data?.data)) candidates = candidatesRes.data.data.data;

        setRecruitments(recruitments);

        const applications = recruitments.length;
        const interviews = recruitments.filter(r => r.interviewScheduled === true).length;
        const totalPositions = recruitments.reduce((sum, r) => sum + (r.no_of_positions || 0), 0);

        const positionToCandidates = recruitments.reduce((map, item) => {
          const pos = item.job_title;
          if (!map[pos]) map[pos] = [];
          if (item.candidate) map[pos].push(item.candidate);
          return map;
        }, {});

        const positionsWithoutCandidates = Object.values(positionToCandidates).filter(arr => arr.length === 0).length;
        const positionsClosed = recruitments.filter(r => r.status === 'closed').length;

        let immediateCount = 0;
        let shortTermCount = 0;
        let longTermCount = 0;

        recruitments.forEach(r => {
          const period = r.notice_period?.toLowerCase() || '';
          if (period.includes('immediate')) immediateCount++;
          else if (period.includes('10') || period.includes('15')) shortTermCount++;
          else if (
            period.includes('15 to 30') ||
            period.includes('1 month') ||
            period.includes('30') ||
            period.includes('more')
          ) longTermCount++;
        });

        setStats({
          applications,
          interviews,
          candidates: candidates.length,
          clientForms: clientForms.length,
          totalPositions,
          positionsWithoutCandidates,
          positionsClosed,
          projectStatus: {
            immediate: immediateCount,
            shortTerm: shortTermCount,
            longTerm: longTermCount,
          },
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
      stats.projectStatus.immediate +
      stats.projectStatus.shortTerm +
      stats.projectStatus.longTerm;
    if (total === 0) return '0%';
    return `${Math.round((count / total) * 100)}%`;
  };

  const openModalForCategory = (category) => {
    const filtered = recruitments.filter((r) => {
      const period = r.notice_period?.toLowerCase() || '';
      if (category === 'Warning') return period.includes('immediate');
      if (category === 'Caution') return period.includes('10') || period.includes('15');
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

  const openClientsModal = async () => {
    try {
      const res = await axios.get('https://skilviu.com/backend/api/v1/clientforms');
      const clientForms = res?.data?.data?.data || [];

      setModalData(clientForms);
      setModalTitle('Client Details');
      setShowModal(true);
    } catch (err) {
      console.error('Failed to fetch client details', err);
    }
  };

  const openCandidatesModal = async () => {
    try {
      const res = await axios.get('https://skilviu.com/backend/api/v1/candidates');

      let candidates = [];
      if (Array.isArray(res.data)) candidates = res.data;
      else if (Array.isArray(res.data?.data)) candidates = res.data.data;
      else if (Array.isArray(res.data?.data?.data)) candidates = res.data.data.data;

      setModalData(candidates);
      setModalTitle('Candidate Details');
      setShowModal(true);
    } catch (err) {
      console.error('Failed to fetch candidate details', err);
    }
  };

  const openPositionsModal = () => {
    setModalData(recruitments);
    setModalTitle('Position Details');
    setShowModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">
        Welcome to the Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        <OverviewCard
          icon={<ClipboardList className="w-6 h-6 text-purple-600" />}
          label="No. of Clients"
          value={stats.clientForms}
          colorClass="text-purple-600 bg-purple-100"
          startCount={startCount}
          onClick={openClientsModal}
        />
        <OverviewCard
          icon={<FileSignature className="w-6 h-6 text-pink-600" />}
          label="No. of Positions"
          value={stats.totalPositions}
          colorClass="text-pink-600 bg-pink-100"
          startCount={startCount}
          onClick={openPositionsModal}
        />
        <OverviewCard
          icon={<Users className="w-6 h-6 text-green-600" />}
          label="No. of Candidates"
          value={stats.candidates}
          colorClass="text-green-600 bg-green-100"
          startCount={startCount}
          onClick={openCandidatesModal}
        />
        <OverviewCard
          icon={<CalendarCheck className="w-6 h-6 text-yellow-600" />}
          label="Interviews Scheduled"
          value={stats.interviews}
          colorClass="text-yellow-600 bg-yellow-100"
          startCount={startCount}
        />
        <OverviewCard
          icon={<Send className="w-6 h-6 text-blue-600" />}
          label="Positions without Candidates"
          value={stats.positionsWithoutCandidates}
          colorClass="text-blue-600 bg-blue-100"
          startCount={startCount}
        />
        <OverviewCard
          icon={<CheckCircle className="w-6 h-6 text-red-600" />}
          label="Positions Closed"
          value={stats.positionsClosed}
          colorClass="text-red-600 bg-red-100"
          startCount={startCount}
        />
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 shadow mt-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Project Status</h2>
        <div className="space-y-6">
          <div onClick={() => openModalForCategory('Warning')}>
            <StatusBar label="Warning" color="red" width={getPercentage(stats.projectStatus.immediate)} />
          </div>
          <div onClick={() => openModalForCategory('Caution')}>
            <StatusBar label="Caution" color="yellow" width={getPercentage(stats.projectStatus.shortTerm)} />
          </div>
          <div onClick={() => openModalForCategory('Good')}>
            <StatusBar label="Good" color="green" width={getPercentage(stats.projectStatus.longTerm)} />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">
              {modalTitle}
            </h3>

            {modalTitle === 'Client Details' ? (
              <ul className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
                {modalData.map((client, idx) => (
                  <li key={idx} className="border rounded-xl p-4 shadow">
                    <p className="font-semibold text-lg">{client.company_name}</p>
                    <p className="text-sm"><strong>Email:</strong> {client.email || 'N/A'}</p>
                    <p className="text-sm"><strong>Website:</strong> {client.website || 'N/A'}</p>
                    <p className="text-sm"><strong>Phone:</strong> {client.phone || 'N/A'}</p>
                  </li>
                ))}
              </ul>
            ) : modalTitle === 'Candidate Details' ? (
              <ul className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
                {modalData.map((candidate, idx) => (
                  <li key={idx} className="border rounded-xl p-4 shadow">
                    <p className="font-semibold text-lg">{candidate.candidate_name || 'Unnamed'}</p>
                    <p className="text-sm"><strong>Email:</strong> {candidate.email || 'N/A'}</p>
                    <p className="text-sm"><strong>Phone:</strong> {candidate.mobile_number || 'N/A'}</p>
                  </li>
                ))}
              </ul>
            ) : modalTitle === 'Position Details' || modalTitle === 'Warning' || modalTitle === 'Caution' || modalTitle === 'Good' ? (
              <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {modalData.length > 0 ? modalData.map((item, idx) => (
                  <li key={idx} className="border rounded-lg p-4 shadow">
                    <p className="font-semibold text-md">{item.job_title}</p>
                    <p className="text-sm"><strong>No. of Positions:</strong> {item.no_of_positions}</p>
                    <p className="text-sm"><strong>Notice Period:</strong> {item.notice_period}</p>
                    <p className="text-sm"><strong>Status:</strong> {item.status}</p>
                  </li>
                )) : <p>No data available.</p>}
              </ul>
            ) : (
              <p>No data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const OverviewCard = ({ icon, label, value, colorClass, startCount, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center cursor-pointer"
  >
    <div className={`p-3 rounded-full mb-3 ${colorClass}`}>{icon}</div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-xl font-bold ${colorClass.split(' ')[0]}`}>
      {startCount ? <CountUp end={value} duration={2} /> : 0}
    </p>
  </div>
);

const StatusBar = ({ label, color, width }) => {
  const colorMap = {
    red: ['bg-red-200', 'bg-red-500'],
    yellow: ['bg-yellow-200', 'bg-yellow-500'],
    green: ['bg-green-200', 'bg-green-500'],
  };

  const [bgBase, bgFill] = colorMap[color] || ['bg-gray-200', 'bg-gray-500'];

  return (
    <div className="cursor-pointer">
      <p className="text-sm text-gray-700 mb-2 font-medium">{label}</p>
      <div className={`w-full h-4 ${bgBase} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${bgFill} transition-all duration-500`}
          style={{ width }}
        />
      </div>
    </div>
  );
};

export default Dashboardhome;
