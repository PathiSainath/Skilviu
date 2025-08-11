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
//   Bell,
//   BellRing,
//   AlertCircle,
//   Briefcase,
//   User,
// } from 'lucide-react';

// const BusinessDashboard = () => {
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
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [notificationsLoading, setNotificationsLoading] = useState(false);

//   // Current user - BDM role
//   const currentUser = {
//     id: 1,
//     username: 'bdm@skilviu.com',
//     role: 'bdm'
//   };

//   // Fetch task assignments and filter for BDM team only
//   const fetchTaskNotifications = async (showLoader = false) => {
//     if (showLoader) setNotificationsLoading(true);
    
//     try {
//       // Fetch both tasks and users to get user roles
//       const [tasksResponse, usersResponse] = await Promise.all([
//         axios.get('https://skilviu.com/backend/api/v1/task-assignments', {
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           }
//         }),
//         axios.get('https://skilviu.com/backend/api/v1/users', {
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           }
//         })
//       ]);

//       if (tasksResponse.data && tasksResponse.data.status === true && Array.isArray(tasksResponse.data.data)) {
//         // Get users data
//         const users = usersResponse.data?.data || [];
        
//         // Filter tasks for BDM team only
//         const bdmTasks = tasksResponse.data.data.filter(task => {
//           // Find the user assigned to this task
//           const assignedUser = users.find(user => user.id === task.user_id);
//           // Only show tasks assigned to BDM team members
//           return assignedUser && assignedUser.user_role.toLowerCase() === 'bdm';
//         });

//         // Convert to notification format
//         const taskNotifications = bdmTasks.map(task => {
//           const assignedUser = users.find(user => user.id === task.user_id);
//           return {
//             id: `task-${task.task_assign_id}`,
//             type: 'task_assignment',
//             priority: task.priority_level,
//             title: `New Task: ${task.job?.job_title || 'Recruitment Task'}`,
//             message: `${task.message} - Deadline: ${formatDate(task.deadline)}`,
//             time: formatRelativeTime(task.created_at),
//             read: false,
//             taskData: {
//               taskId: task.task_assign_id,
//               assignedTo: task.assigned_to,
//               jobTitle: task.job?.job_title,
//               jobLocation: task.job?.job_location,
//               deadline: task.deadline,
//               priority: task.priority_level,
//               userId: task.user_id,
//               jobId: task.job_id,
//               teamRole: assignedUser?.user_role || 'Unknown'
//             }
//           };
//         });

//         // Load read status from localStorage
//         const readNotifications = JSON.parse(localStorage.getItem('bdm_readNotifications') || '[]');
//         const updatedNotifications = taskNotifications.map(notification => ({
//           ...notification,
//           read: readNotifications.includes(notification.id)
//         }));

//         // Sort by creation date (newest first)
//         updatedNotifications.sort((a, b) => new Date(b.time) - new Date(a.time));
        
//         setNotifications(updatedNotifications);
//         setUnreadCount(updatedNotifications.filter(n => !n.read).length);
//       }
//     } catch (error) {
//       console.error('Error fetching BDM task notifications:', error);
//       setNotifications([]);
//       setUnreadCount(0);
//     } finally {
//       if (showLoader) setNotificationsLoading(false);
//     }
//   };

//   // Format date helper
//   const formatDate = (dateString) => {
//     if (!dateString) return 'No deadline';
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   // Format relative time helper
//   const formatRelativeTime = (dateString) => {
//     if (!dateString) return 'Unknown time';
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     if (diffInHours < 24) return `${diffInHours} hours ago`;
    
//     const diffInDays = Math.floor(diffInHours / 24);
//     return `${diffInDays} days ago`;
//   };

//   useEffect(() => {
//     const fetchAllStats = async () => {
//       try {
//         const [recruitmentsRes, clientFormsRes, candidatesRes] = await Promise.all([
//           axios.get('https://skilviu.com/backend/api/v1/recruitments'),
//           axios.get('https://skilviu.com/backend/api/v1/clientforms'),
//           axios.get('https://skilviu.com/backend/api/v1/candidates'),
//         ]);

//         const recruitments = recruitmentsRes?.data?.data || [];
//         const clientForms = clientFormsRes?.data?.data?.data || [];

//         let candidates = [];
//         if (Array.isArray(candidatesRes.data)) candidates = candidatesRes.data;
//         else if (Array.isArray(candidatesRes.data?.data)) candidates = candidatesRes.data.data;
//         else if (Array.isArray(candidatesRes.data?.data?.data)) candidates = candidatesRes.data.data.data;

//         setRecruitments(recruitments);

//         const applications = recruitments.length;
//         const interviews = recruitments.filter(r => r.interviewScheduled === true).length;
//         const totalPositions = recruitments.reduce((sum, r) => sum + (r.no_of_positions || 0), 0);

//         const positionToCandidates = recruitments.reduce((map, item) => {
//           const pos = item.job_title;
//           if (!map[pos]) map[pos] = [];
//           if (item.candidate) map[pos].push(item.candidate);
//           return map;
//         }, {});

//         const positionsWithoutCandidates = Object.values(positionToCandidates).filter(arr => arr.length === 0).length;
//         const positionsClosed = recruitments.filter(r => r.status === 'closed').length;

//         let immediateCount = 0;
//         let shortTermCount = 0;
//         let longTermCount = 0;

//         recruitments.forEach(r => {
//           const period = r.notice_period?.toLowerCase() || '';
//           if (period.includes('immediate')) immediateCount++;
//           else if (period.includes('10') || period.includes('15')) shortTermCount++;
//           else if (
//             period.includes('15 to 30') ||
//             period.includes('1 month') ||
//             period.includes('30') ||
//             period.includes('more')
//           ) longTermCount++;
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

//   // ✅ NEW: Fetch notifications on component mount to show count by default
//   useEffect(() => {
//     fetchTaskNotifications(false); // Don't show loader on initial fetch
//   }, []);

//   // Fetch fresh notifications when dropdown opens (with loader)
//   useEffect(() => {
//     if (showNotifications) {
//       fetchTaskNotifications(true); // Show loader when dropdown opens
//     }
//   }, [showNotifications]);

//   // Auto-refresh notifications every 3 minutes
//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetchTaskNotifications(false); // Background refresh without loader
//     }, 3 * 60 * 1000); // 3 minutes

//     return () => clearInterval(interval);
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
//       if (category === 'Warning') return period.includes('immediate');
//       if (category === 'Caution') return period.includes('10') || period.includes('15');
//       return (
//         period.includes('15 to 30') ||
//         period.includes('1 month') ||
//         period.includes('30') ||
//         period.includes('more')
//       );
//     });

//     setModalData(filtered);
//     setModalTitle(category);
//     setShowModal(true);
//   };

//   const openClientsModal = async () => {
//     try {
//       const res = await axios.get('https://skilviu.com/backend/api/v1/clientforms');
//       const clientForms = res?.data?.data?.data || [];

//       setModalData(clientForms);
//       setModalTitle('Client Details');
//       setShowModal(true);
//     } catch (err) {
//       console.error('Failed to fetch client details', err);
//     }
//   };

//   const openCandidatesModal = async () => {
//     try {
//       const res = await axios.get('https://skilviu.com/backend/api/v1/candidates');

//       let candidates = [];
//       if (Array.isArray(res.data)) candidates = res.data;
//       else if (Array.isArray(res.data?.data)) candidates = res.data.data;
//       else if (Array.isArray(res.data?.data?.data)) candidates = res.data.data.data;

//       setModalData(candidates);
//       setModalTitle('Candidate Details');
//       setShowModal(true);
//     } catch (err) {
//       console.error('Failed to fetch candidate details', err);
//     }
//   };

//   const openPositionsModal = () => {
//     setModalData(recruitments);
//     setModalTitle('Position Details');
//     setShowModal(true);
//   };

//   const markNotificationAsRead = (id) => {
//     setNotifications(notifications.map(notif => 
//       notif.id === id ? { ...notif, read: true } : notif
//     ));
//     setUnreadCount(prev => Math.max(0, prev - 1));
    
//     // Save to localStorage with BDM prefix
//     const readNotifications = JSON.parse(localStorage.getItem('bdm_readNotifications') || '[]');
//     if (!readNotifications.includes(id)) {
//       readNotifications.push(id);
//       localStorage.setItem('bdm_readNotifications', JSON.stringify(readNotifications));
//     }
//   };

//   const markAllAsRead = () => {
//     const allIds = notifications.map(n => n.id);
//     setNotifications(notifications.map(n => ({ ...n, read: true })));
//     setUnreadCount(0);
    
//     // Save all as read in localStorage with BDM prefix
//     const readNotifications = JSON.parse(localStorage.getItem('bdm_readNotifications') || '[]');
//     const updatedRead = [...new Set([...readNotifications, ...allIds])];
//     localStorage.setItem('bdm_readNotifications', JSON.stringify(updatedRead));
//   };

//   // Enhanced notification icon function
//   const getNotificationIcon = (type, priority) => {
//     if (type === 'task_assignment') {
//       switch (priority?.toLowerCase()) {
//         case 'urgent':
//           return <AlertCircle className="w-4 h-4 text-red-600" />;
//         case 'high':
//           return <AlertCircle className="w-4 h-4 text-red-500" />;
//         case 'medium':
//           return <Briefcase className="w-4 h-4 text-yellow-500" />;
//         case 'low':
//           return <CheckCircle className="w-4 h-4 text-green-500" />;
//         default:
//           return <User className="w-4 h-4 text-blue-500" />;
//       }
//     }
    
//     // Original notification icons for other types
//     switch (type) {
//       case 'new_candidate':
//         return <Users className="w-4 h-4 text-blue-600" />;
//       case 'interview_scheduled':
//         return <CalendarCheck className="w-4 h-4 text-green-600" />;
//       case 'position_closed':
//         return <CheckCircle className="w-4 h-4 text-red-600" />;
//       case 'new_client':
//         return <ClipboardList className="w-4 h-4 text-purple-600" />;
//       default:
//         return <Bell className="w-4 h-4 text-gray-600" />;
//     }
//   };

//   // Priority badge colors
//   const getPriorityBadge = (priority) => {
//     const colors = {
//       urgent: 'bg-red-600 text-white',
//       high: 'bg-red-500 text-white',
//       medium: 'bg-yellow-500 text-white',
//       low: 'bg-green-500 text-white'
//     };
//     return colors[priority?.toLowerCase()] || 'bg-blue-500 text-white';
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority?.toLowerCase()) {
//       case 'urgent': return 'border-l-red-600 bg-red-50';
//       case 'high': return 'border-l-red-500 bg-red-50';
//       case 'medium': return 'border-l-yellow-500 bg-yellow-50';
//       case 'low': return 'border-l-green-500 bg-green-50';
//       default: return 'border-l-blue-500 bg-blue-50';
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow p-6 md:p-8">
//       {/* Header with Notifications */}
//       <div className="flex justify-between items-center mb-10">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Welcome to the Business Dashboard
//         </h1>
        
//         {/* Notification Bell */}
//         <div className="relative">
//           <button
//             onClick={() => setShowNotifications(!showNotifications)}
//             className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             {unreadCount > 0 ? (
//               <BellRing className="w-6 h-6 text-orange-600" />
//             ) : (
//               <Bell className="w-6 h-6 text-gray-600" />
//             )}
//             {/* ✅ This badge now shows by default when there are unread notifications */}
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {unreadCount > 9 ? '9+' : unreadCount}
//               </span>
//             )}
//           </button>

//           {/* Enhanced Notifications Dropdown */}
//           {showNotifications && (
//             <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border z-50">
//               <div className="p-4 border-b">
//                 <h3 className="text-lg font-semibold text-gray-800">BDM Team Tasks</h3>
//                 {unreadCount > 0 && (
//                   <p className="text-sm text-gray-500">{unreadCount} unread notifications</p>
//                 )}
//               </div>
              
//               <div className="max-h-96 overflow-y-auto">
//                 {notificationsLoading ? (
//                   <div className="p-8 text-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//                     <p className="text-gray-500 mt-2">Loading notifications...</p>
//                   </div>
//                 ) : notifications.length > 0 ? (
//                   notifications.map((notification) => (
//                     <div
//                       key={notification.id}
//                       onClick={() => markNotificationAsRead(notification.id)}
//                       className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
//                         !notification.read ? `${getPriorityColor(notification.priority)} border-l-4` : ''
//                       }`}
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className="flex-shrink-0 mt-1">
//                           {getNotificationIcon(notification.type, notification.priority)}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-1">
//                             <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
//                               {notification.title}
//                             </p>
//                             {notification.priority && notification.type === 'task_assignment' && (
//                               <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(notification.priority)}`}>
//                                 {notification.priority.toUpperCase()}
//                               </span>
//                             )}
//                           </div>
                          
//                           <p className="text-xs text-gray-500 mt-1">
//                             {notification.message}
//                           </p>
                          
//                           {notification.taskData && (
//                             <div className="mt-2 text-xs text-gray-500 space-y-1">
//                               <div>**Assigned to:** {notification.taskData.assignedTo}</div>
//                               <div>**Team:** {notification.taskData.teamRole}</div>
//                               {notification.taskData.jobLocation && (
//                                 <div>**Location:** {notification.taskData.jobLocation}</div>
//                               )}
//                             </div>
//                           )}
                          
//                           <p className="text-xs text-gray-400 mt-2">
//                             {notification.time}
//                           </p>
//                         </div>
//                         {!notification.read && (
//                           <div className="flex-shrink-0">
//                             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="p-8 text-center text-gray-500">
//                     <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                     <p>No BDM task notifications yet</p>
//                   </div>
//                 )}
//               </div>
              
//               {notifications.length > 0 && (
//                 <div className="p-3 border-t text-center">
//                   <button 
//                     className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                     onClick={markAllAsRead}
//                   >
//                     Mark all as read
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Close notifications dropdown when clicking outside */}
//       {showNotifications && (
//         <div 
//           className="fixed inset-0 z-40" 
//           onClick={() => setShowNotifications(false)}
//         />
//       )}

//       {/* Rest of your existing dashboard content remains the same... */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
//         <OverviewCard
//           icon={<ClipboardList className="w-6 h-6 text-purple-600" />}
//           label="No. of Clients"
//           value={stats.clientForms}
//           colorClass="text-purple-600 bg-purple-100"
//           startCount={startCount}
//           onClick={openClientsModal}
//         />
//         <OverviewCard
//           icon={<FileSignature className="w-6 h-6 text-pink-600" />}
//           label="No. of Positions"
//           value={stats.totalPositions}
//           colorClass="text-pink-600 bg-pink-100"
//           startCount={startCount}
//           onClick={openPositionsModal}
//         />
//         <OverviewCard
//           icon={<Users className="w-6 h-6 text-green-600" />}
//           label="No. of Candidates"
//           value={stats.candidates}
//           colorClass="text-green-600 bg-green-100"
//           startCount={startCount}
//           onClick={openCandidatesModal}
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

//       <div className="bg-gray-50 rounded-2xl p-6 shadow mt-20">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">Project Status</h2>
//         <div className="space-y-6">
//           <div onClick={() => openModalForCategory('Warning')}>
//             <StatusBar label="Warning" color="red" width={getPercentage(stats.projectStatus.immediate)} />
//           </div>
//           <div onClick={() => openModalForCategory('Caution')}>
//             <StatusBar label="Caution" color="yellow" width={getPercentage(stats.projectStatus.shortTerm)} />
//           </div>
//           <div onClick={() => openModalForCategory('Good')}>
//             <StatusBar label="Good" color="green" width={getPercentage(stats.projectStatus.longTerm)} />
//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 relative overflow-hidden">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
//             >
//               <X className="w-6 h-6" />
//             </button>
//             <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">
//               {modalTitle}
//             </h3>

//             {modalTitle === 'Client Details' ? (
//               <ul className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
//                 {modalData.map((client, idx) => (
//                   <li key={idx} className="border rounded-xl p-4 shadow">
//                     <p className="font-semibold text-lg">{client.company_name}</p>
//                     <p className="text-sm"><strong>Email:</strong> {client.email || 'N/A'}</p>
//                     <p className="text-sm"><strong>Website:</strong> {client.website || 'N/A'}</p>
//                     <p className="text-sm"><strong>Phone:</strong> {client.phone || 'N/A'}</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : modalTitle === 'Candidate Details' ? (
//               <ul className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
//                 {modalData.map((candidate, idx) => (
//                   <li key={idx} className="border rounded-xl p-4 shadow">
//                     <p className="font-semibold text-lg">{candidate.candidate_name || 'Unnamed'}</p>
//                     <p className="text-sm"><strong>Email:</strong> {candidate.email || 'N/A'}</p>
//                     <p className="text-sm"><strong>Phone:</strong> {candidate.mobile_number || 'N/A'}</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : modalTitle === 'Position Details' || modalTitle === 'Warning' || modalTitle === 'Caution' || modalTitle === 'Good' ? (
//               <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
//                 {modalData.length > 0 ? modalData.map((item, idx) => (
//                   <li key={idx} className="border rounded-lg p-4 shadow">
//                     <p className="font-semibold text-md">{item.job_title}</p>
//                     <p className="text-sm"><strong>No. of Positions:</strong> {item.no_of_positions}</p>
//                     <p className="text-sm"><strong>Notice Period:</strong> {item.notice_period}</p>
//                     <p className="text-sm"><strong>Status:</strong> {item.status}</p>
//                   </li>
//                 )) : <p>No data available.</p>}
//               </ul>
//             ) : (
//               <p>No data available.</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const OverviewCard = ({ icon, label, value, colorClass, startCount, onClick }) => (
//   <div
//     onClick={onClick}
//     className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center cursor-pointer"
//   >
//     <div className={`p-3 rounded-full mb-3 ${colorClass}`}>{icon}</div>
//     <p className="text-sm text-gray-500">{label}</p>
//     <p className={`text-xl font-bold ${colorClass.split(' ')[0]}`}>
//       {startCount ? <CountUp end={value} duration={2} /> : 0}
//     </p>
//   </div>
// );

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

// export default BusinessDashboard;




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
  Bell,
  BellRing,
  AlertCircle,
  Briefcase,
  User
} from 'lucide-react';

const BusinessDashboard = () => {
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    candidates: 0,
    clientForms: 0,
    totalPositions: 0,
    positionsWithoutCandidates: 0,
    positionsClosed: 0,
    projectStatus: { immediate: 0, shortTerm: 0, longTerm: 0 }
  });

  const [recruitments, setRecruitments] = useState([]);
  const [startCount, setStartCount] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalTheme, setModalTheme] = useState('default');
  const [showModal, setShowModal] = useState(false);

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Fetch notifications
  const fetchTaskNotifications = async (showLoader = false) => {
    if (showLoader) setNotificationsLoading(true);
    try {
      const [tasksRes, usersRes] = await Promise.all([
        axios.get('https://skilviu.com/backend/api/v1/task-assignments'),
        axios.get('https://skilviu.com/backend/api/v1/users')
      ]);
      const users = usersRes.data?.data || [];
      if (tasksRes.data?.status && Array.isArray(tasksRes.data.data)) {
        const bdmTasks = tasksRes.data.data.filter(task => {
          const u = users.find(x => x.id === task.user_id);
          return u && u.user_role.toLowerCase() === 'bdm';
        });

        const taskNotifs = bdmTasks.map(task => {
          const assignedUser = users.find(u => u.id === task.user_id);
          return {
            id: `task-${task.task_assign_id}`,
            type: 'task_assignment',
            priority: task.priority_level,
            title: `New Task: ${task.job?.job_title || 'Recruitment Task'}`,
            message: `${task.message} - Deadline: ${formatDate(task.deadline)}`,
            time: formatRelativeTime(task.created_at),
            read: false,
            taskData: {
              assignedTo: task.assigned_to,
              jobLocation: task.job?.job_location,
              teamRole: assignedUser?.user_role || 'Unknown'
            }
          };
        });

        const readNotifs = JSON.parse(localStorage.getItem('bdm_readNotifications') || '[]');
        const updated = taskNotifs.map(n => ({ ...n, read: readNotifs.includes(n.id) }));
        setNotifications(updated);
        setUnreadCount(updated.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      if (showLoader) setNotificationsLoading(false);
    }
  };

  // Date formatters
  const formatDate = date => (!date ? 'No deadline' : new Date(date).toLocaleDateString());
  const formatRelativeTime = date => {
    if (!date) return 'Unknown';
    const d = new Date(date), now = new Date();
    const diffMin = Math.floor((now - d) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)} hrs ago`;
    return `${Math.floor(diffMin / 1440)} days ago`;
  };

  // Notification icon / style helpers
  const getNotificationIcon = (type, priority) => {
    if (type === 'task_assignment') {
      switch ((priority || '').toLowerCase()) {
        case 'urgent': return <AlertCircle className="w-4 h-4 text-red-600" />;
        case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
        case 'medium': return <Briefcase className="w-4 h-4 text-yellow-500" />;
        case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
        default: return <User className="w-4 h-4 text-blue-500" />;
      }
    }
    return <Bell className="w-4 h-4 text-gray-500" />;
  };
  const getPriorityBadge = priority => ({
    urgent: 'bg-red-600 text-white',
    high: 'bg-red-500 text-white',
    medium: 'bg-yellow-500 text-white',
    low: 'bg-green-500 text-white'
  }[(priority || '').toLowerCase()] || 'bg-blue-500 text-white');
  const getPriorityColor = priority => {
    switch ((priority || '').toLowerCase()) {
      case 'urgent': return 'border-l-red-600 bg-red-50';
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const markNotificationAsRead = id => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
    const read = JSON.parse(localStorage.getItem('bdm_readNotifications') || '[]');
    if (!read.includes(id)) {
      read.push(id);
      localStorage.setItem('bdm_readNotifications', JSON.stringify(read));
    }
  };
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    const ids = notifications.map(n => n.id);
    localStorage.setItem('bdm_readNotifications', JSON.stringify(ids));
  };

  // Stats fetching
  useEffect(() => { fetchStats(); fetchTaskNotifications(); }, []);
  const fetchStats = async () => {
    try {
      const [recRes, clientRes, candRes] = await Promise.all([
        axios.get('https://skilviu.com/backend/api/v1/recruitments'),
        axios.get('https://skilviu.com/backend/api/v1/clientforms'),
        axios.get('https://skilviu.com/backend/api/v1/candidates')
      ]);
      const recs = recRes.data.data || [], clients = clientRes.data.data?.data || [];
      let cands = [];
      if (Array.isArray(candRes.data)) cands = candRes.data;
      else if (Array.isArray(candRes.data?.data)) cands = candRes.data.data;
      else if (Array.isArray(candRes.data?.data?.data)) cands = candRes.data.data.data;

      setRecruitments(recs);
      const totalPositions = recs.reduce((sum, r) => sum + (r.no_of_positions || 0), 0);
      const withoutCands = Object.values(recs.reduce((m, r) => {
        m[r.job_title] = m[r.job_title] || [];
        if (r.candidate) m[r.job_title].push(r.candidate);
        return m;
      }, {})).filter(a => a.length === 0).length;
      const closed = recs.filter(r => r.status === 'closed').length;

      let immediate=0, shortTerm=0, longTerm=0;
      recs.forEach(r => {
        const p = (r.notice_period||'').toLowerCase();
        if (p.includes('immediate')) immediate++;
        else if (p.includes('10')||p.includes('15')) shortTerm++;
        else longTerm++;
      });

      setStats({
        applications: recs.length,
        interviews: recs.filter(r => r.interviewScheduled).length,
        candidates: cands.length,
        clientForms: clients.length,
        totalPositions,
        positionsWithoutCandidates: withoutCands,
        positionsClosed: closed,
        projectStatus: { immediate, shortTerm, longTerm }
      });
      setStartCount(true);
    } catch (err) { console.error(err); }
  };

  const getPercentage = count => {
    const total = stats.projectStatus.immediate + stats.projectStatus.shortTerm + stats.projectStatus.longTerm;
    return total ? `${Math.round((count / total) * 100)}%` : '0%';
  };

  // Cards / popup openers
  const openModalForCategory = cat => {
    setModalTitle(cat);
    setModalTheme(cat==='Warning'?'red':cat==='Caution'?'yellow':'green');
    setModalData(
      recruitments.filter(r => {
        const p = (r.notice_period||'').toLowerCase();
        if (cat==='Warning') return p.includes('immediate');
        if (cat==='Caution') return p.includes('10')||p.includes('15');
        return true;
      })
    );
    setShowModal(true);
  };
  const openClientsModal = async () => {
    const res = await axios.get('https://skilviu.com/backend/api/v1/clientforms');
    setModalTitle('Client Details');
    setModalTheme('default');
    setModalData(res.data.data?.data || []);
    setShowModal(true);
  };
  const openCandidatesModal = async () => {
    const res = await axios.get('https://skilviu.com/backend/api/v1/candidates');
    let cands = [];
    if (Array.isArray(res.data)) cands = res.data;
    else if (Array.isArray(res.data?.data)) cands = res.data.data;
    else if (Array.isArray(res.data?.data?.data)) cands = res.data.data.data;
    setModalTitle('Candidate Details');
    setModalTheme('default');
    setModalData(cands);
    setShowModal(true);
  };
  const openPositionsModal = () => {
    setModalTitle('Position Details');
    setModalTheme('default');
    setModalData(recruitments);
    setShowModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 md:p-8">
      {/* Header with Notifications */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to the Business Dashboard</h1>
        {/* Bell */}
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            {unreadCount>0 ? <BellRing className="w-6 h-6 text-orange-600"/> : <Bell className="w-6 h-6 text-gray-600"/>}
            {unreadCount>0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount>9?'9+':unreadCount}
            </span>}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border z-50">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">BDM Team Tasks</h3>
                {unreadCount>0 && <p className="text-sm text-gray-500">{unreadCount} unread notifications</p>}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notificationsLoading ? (
                  <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading notifications...</p>
                  </div>
                ) : notifications.map(notif=>(
                  <div key={notif.id} onClick={()=>markNotificationAsRead(notif.id)}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read?`${getPriorityColor(notif.priority)} border-l-4`:''}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.type, notif.priority)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm font-medium ${!notif.read?'text-gray-900':'text-gray-700'}`}>{notif.title}</p>
                          {notif.priority && notif.type==='task_assignment' &&
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(notif.priority)}`}>
                              {notif.priority.toUpperCase()}
                            </span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                        {notif.taskData && (
                          <div className="mt-2 text-xs text-gray-500 space-y-1">
                            <div>Assigned to: {notif.taskData.assignedTo}</div>
                            <div>Team: {notif.taskData.teamRole}</div>
                            {notif.taskData.jobLocation && (<div>Location: {notif.taskData.jobLocation}</div>)}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                      </div>
                      {!notif.read && <div className="flex-shrink-0"><div className="w-2 h-2 bg-blue-500 rounded-full"></div></div>}
                    </div>
                  </div>
                ))}
              </div>
              {notifications.length>0 && (
                <div className="p-3 border-t text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium" onClick={markAllAsRead}>
                    Mark all as read</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        <OverviewCard icon={<ClipboardList className="w-6 h-6 text-purple-600"/>} label="No. of Clients" value={stats.clientForms} colorClass="text-purple-600 bg-purple-100" startCount={startCount} onClick={openClientsModal}/>
        <OverviewCard icon={<FileSignature className="w-6 h-6 text-pink-600"/>} label="No. of Positions" value={stats.totalPositions} colorClass="text-pink-600 bg-pink-100" startCount={startCount} onClick={openPositionsModal}/>
        <OverviewCard icon={<Users className="w-6 h-6 text-green-600"/>} label="No. of Candidates" value={stats.candidates} colorClass="text-green-600 bg-green-100" startCount={startCount} onClick={openCandidatesModal}/>
        <OverviewCard icon={<CalendarCheck className="w-6 h-6 text-yellow-600"/>} label="Interviews Scheduled" value={stats.interviews} colorClass="text-yellow-600 bg-yellow-100" startCount={startCount}/>
        <OverviewCard icon={<Send className="w-6 h-6 text-blue-600"/>} label="Positions without Candidates" value={stats.positionsWithoutCandidates} colorClass="text-blue-600 bg-blue-100" startCount={startCount}/>
        <OverviewCard icon={<CheckCircle className="w-6 h-6 text-red-600"/>} label="Positions Closed" value={stats.positionsClosed} colorClass="text-red-600 bg-red-100" startCount={startCount}/>
      </div>

      {/* Status Bars */}
      <div className="bg-gray-50 rounded-2xl p-6 shadow mt-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Project Status</h2>
        <div className="space-y-6">
          <StatusBar label="Warning" color="red" width={getPercentage(stats.projectStatus.immediate)} onClick={()=>openModalForCategory('Warning')}/>
          <StatusBar label="Caution" color="yellow" width={getPercentage(stats.projectStatus.shortTerm)} onClick={()=>openModalForCategory('Caution')}/>
          <StatusBar label="Good" color="green" width={getPercentage(stats.projectStatus.longTerm)} onClick={()=>openModalForCategory('Good')}/>
        </div>
      </div>

      {/* Unified tabular Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center pt-16 z-50">
          <div className={`bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-6 relative overflow-auto max-h-[80vh]
            ${modalTheme==='red'?'border-4 border-red-600':''}
            ${modalTheme==='yellow'?'border-4 border-yellow-500':''}
            ${modalTheme==='green'?'border-4 border-green-600':''}`}>
            <button onClick={()=>setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500"><X className="w-6 h-6"/></button>
            <h3 className={`text-2xl font-semibold mb-6 border-b pb-4
              ${modalTheme==='red'?'text-red-600':''}
              ${modalTheme==='yellow'?'text-yellow-600':''}
              ${modalTheme==='green'?'text-green-600':''}`}>
              {modalTitle}
            </h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {modalTitle==='Client Details' && <>
                    <th className="px-6 py-3">Company</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Website</th>
                  </>}
                  {modalTitle==='Candidate Details' && <>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Location</th>
                  </>}
                  {(modalTitle==='Position Details' || ['Warning','Caution','Good'].includes(modalTitle)) && <>
                    <th className="px-6 py-3">Job Title</th>
                    <th className="px-6 py-3">Positions</th>
                    <th className="px-6 py-3">Notice Period</th>
                  </>}
                </tr>
              </thead>
              <tbody>
                {modalData.map((item, idx)=>(
                  <tr key={idx}>
                    {modalTitle==='Client Details' && <>
                      <td className="px-6 py-4">{item.company_name}</td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">{item.phone}</td>
                      <td className="px-6 py-4">{item.website}</td>
                    </>}
                    {modalTitle==='Candidate Details' && <>
                      <td className="px-6 py-4">{item.candidate_name}</td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">{item.phone || item.mobile_number}</td>
                      <td className="px-6 py-4">{item.current_location}</td>
                    </>}
                    {(modalTitle==='Position Details' || ['Warning','Caution','Good'].includes(modalTitle)) && <>
                      <td className="px-6 py-4">{item.job_title}</td>
                      <td className="px-6 py-4">{item.no_of_positions}</td>
                      <td className="px-6 py-4">{item.notice_period}</td>
                    </>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Updated OverviewCard - centered
const OverviewCard = ({ icon, label, value, colorClass, startCount, onClick }) => {
  const [textColor, bgColor] = colorClass.split(' ');
  return (
    <div onClick={onClick} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg flex flex-col justify-center items-center text-center cursor-pointer">
      <div className={`p-3 rounded-full mb-3 ${bgColor}`}>{icon}</div>
      <p className="w-full text-center text-sm text-gray-500">{label}</p>
      <p className={`w-full text-center text-xl font-bold ${textColor}`}>
        {startCount ? <CountUp end={value} duration={2} /> : 0}
      </p>
    </div>
  );
};

// Colored StatusBar - matches theme
const StatusBar = ({ label, color, width, onClick }) => {
  const map = {
    red: { bgDark: 'bg-red-600', text: 'text-red-700' },
    yellow: { bgDark: 'bg-yellow-500', text: 'text-yellow-700' },
    green: { bgDark: 'bg-green-600', text: 'text-green-700' }
  };
  const cls = map[color] || map.green;
  return (
    <div onClick={onClick} className="flex items-center justify-between p-4 rounded-lg shadow cursor-pointer hover:shadow-lg">
      <span className={`font-semibold ${cls.text}`}>{label}</span>
      <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4 overflow-hidden">
        <div className={`${cls.bgDark} h-full`} style={{ width }} />
      </div>
      <span className={`text-sm font-medium ${cls.text}`}>{width}</span>
    </div>
  );
};

export default BusinessDashboard;
