// import React, { useEffect, useState } from 'react';
// import {
//   ClipboardList,
//   FileSignature,
//   NotebookText,
//   Bell,
//   User,
//   LogOut,
//   Send,
//   CalendarCheck,
//   Users,
// } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [candidates, setCandidates] = useState([]);

//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/api/candidates')
//       .then((res) => setCandidates(res.data))
//       .catch((err) => console.error('Candidate fetch error:', err));
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   const chartData = [
//     { month: 'Jan', applications: 20 },
//     { month: 'Feb', applications: 35 },
//     { month: 'Mar', applications: 50 },
//     { month: 'Apr', applications: 40 },
//     { month: 'May', applications: 60 },
//     { month: 'Jun', applications: 45 },
//   ];

//   const clientForms = 10;
//   const totalPositions = 25;

//   return (
//     <div className="flex min-h-screen bg-gray-50 p-6 font-sans">
//       {/* Sidebar */}
//       <aside className="w-56 bg-white shadow rounded-2xl p-4 mr-6 flex flex-col justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-blue-900 mb-8">Skilviu</h2>
//           <nav className="space-y-5 text-sm">
//             <Link to="/admindashboard" className="flex items-center text-purple-600 font-semibold">
//               <User className="mr-2 w-4 h-4" /> Overview
//             </Link>
//             <Link to="clientform-page" className="flex items-center text-gray-500">
//               <ClipboardList className="mr-2 w-4 h-4" /> CO FORM
//             </Link>
//             <Link to="recruitment-page" className="flex items-center text-gray-500">
//               <FileSignature className="mr-2 w-4 h-4" /> CR FORM
//             </Link>
//             <Link to="candidateform-page" className="flex items-center text-gray-500">
//               <NotebookText className="mr-2 w-4 h-4" /> Candidate Form
//             </Link>
//             {/* <div className="flex items-center text-gray-400 cursor-not-allowed">
//               <Bell className="mr-2 w-4 h-4" /> News
//             </div> */}
//           </nav>
//         </div>
//         <button onClick={handleLogout} className="flex items-center text-red-600 font-semibold mt-8">
//           <LogOut className="mr-2 w-4 h-4" /> Logout
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1">
//         <header className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
//           <input
//             type="text"
//             placeholder="Search something here..."
//             className="w-1/3 p-2 rounded-full border border-gray-300 text-sm"
//           />
//         </header>

//         {/* Overview Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
//           <OverviewCard
//             icon={<Send className="text-blue-600 w-6 h-6" />}
//             label="Applications"
//             value={candidates.length}
//             color="blue"
//           />
//           <OverviewCard
//             icon={<CalendarCheck className="text-yellow-600 w-6 h-6" />}
//             label="Interviews"
//             value={Math.floor(candidates.length / 2)}
//             color="yellow"
//           />
//           <OverviewCard
//             icon={<Users className="text-green-600 w-6 h-6" />}
//             label="Candidates"
//             value={candidates.length}
//             color="green"
//           />
//           <OverviewCard
//             icon={<ClipboardList className="text-purple-600 w-6 h-6" />}
//             label="Client Forms"
//             value={clientForms}
//             color="purple"
//           />
//           <OverviewCard
//             icon={<FileSignature className="text-pink-600 w-6 h-6" />}
//             label="No.of Positions"
//             value={totalPositions}
//             color="pink"
//           />
//         </div>

//         {/* Chart */}
//         <div className="bg-white rounded-2xl p-6 shadow mb-6">
//           <h2 className="text-md font-bold mb-4 text-gray-700">Vacancy Stats</h2>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="applications"
//                   stroke="#6366F1"
//                   strokeWidth={3}
//                   dot={{ r: 4 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Recent Candidates */}
//         <div>
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Candidate Submissions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             {candidates.slice(0, 3).map((c, idx) => (
//               <div key={idx} className="bg-white p-4 rounded-xl shadow">
//                 <p className="font-semibold text-gray-800">{c.candidateName}</p>
//                 <p className="text-sm text-gray-500">{c.email}</p>
//                 <p className="text-xs text-gray-400">{c.currentLocation}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       {/* Profile Sidebar */}
//       <aside className="w-72 bg-white rounded-2xl shadow p-6 ml-6 hidden lg:block">
//         <div className="flex flex-col items-center text-center">
//           <img
//             src="https://i.pravatar.cc/100"
//             alt="Profile"
//             className="w-24 h-24 rounded-full mb-4"
//           />
//           <h3 className="text-xl font-semibold">Candidate Name</h3>
//           <p className="text-sm text-gray-500 mb-4">Frontend Developer</p>

//           <div className="grid grid-cols-3 gap-2 mb-4">
//             <SkillStat label="React" value="85%" color="green" />
//             <SkillStat label="UI/UX" value="70%" color="yellow" />
//             <SkillStat label="Testing" value="60%" color="blue" />
//           </div>

//           <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Activity</h4>
//           <ul className="text-xs text-gray-500 space-y-2">
//             <li>Interview scheduled with ABC Corp</li>
//             <li>Profile shortlisted for 2 roles</li>
//           </ul>
//         </div>
//       </aside>
//     </div>
//   );
// };

// // Overview Card Component
// const OverviewCard = ({ icon, label, value, color }) => (
//   <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center">
//     <div className={`bg-${color}-100 p-3 rounded-full mb-2`}>
//       {icon}
//     </div>
//     <p className="text-sm text-gray-500">{label}</p>
//     <p className={`text-${color}-600 text-xl font-bold`}>{value}</p>
//   </div>
// );

// // Skill Stat Component
// const SkillStat = ({ label, value, color }) => (
//   <div className="text-center">
//     <div className={`text-${color}-500 font-bold`}>{value}</div>
//     <p className="text-xs text-gray-400">{label}</p>
//   </div>
// );

// export default AdminDashboard;


import React from 'react';
import Adminsidebar from './Adminsidebar';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar stays fixed */}
      <div className="w-60 bg-white shadow">
        <Adminsidebar />
      </div>
    </div>
  );
};

export default AdminDashboard;
