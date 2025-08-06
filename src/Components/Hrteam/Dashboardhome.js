// import React, { useEffect, useState } from 'react';
// import { Users, ClipboardList, FileSignature } from 'lucide-react';
// import Positions from './Positions';

// const Dashboardhome = () => {
//   const [stats, setStats] = useState({
//     applications: 0,
//     interviews: 0,
//     candidates: 0,
//     clientForms: 0,
//     totalPositions: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showPositions, setShowPositions] = useState(false);

//   useEffect(() => {
//     const fetchAllStats = async () => {
//       try {
//         setLoading(true);
//         setError('');

//         const countEndpoints = [
//           { url: 'https://skilviu.com/backend/api/v1/recruitments/count', key: 'applications' },
//           { url: 'https://skilviu.com/backend/api/v1/recruitments/interviews/count', key: 'interviews' },
//           { url: 'https://skilviu.com/backend/api/v1/candidates/count', key: 'candidates' },
//           { url: 'https://skilviu.com/backend/api/v1/clientforms/count', key: 'clientForms' }
//         ];

//         const countResults = await Promise.all(
//           countEndpoints.map(async ({ url, key }) => {
//             try {
//               const response = await fetch(url);
//               if (!response.ok) throw new Error(`HTTP ${response.status}`);
//               const data = await response.json();
//               return { key, count: data.count || 0 };
//             } catch (error) {
//               console.warn(`Count endpoint ${url} failed:`, error);
//               return { key, count: null };
//             }
//           })
//         );

//         const hasFailedCounts = countResults.some(result => result.count === null);

//         if (hasFailedCounts) {
//           await fetchFullDataAsFallback();
//         } else {
//           const newStats = {};
//           countResults.forEach(({ key, count }) => {
//             newStats[key] = count;
//           });

//           // ✅ Fixed: Calculate total positions properly
//           const recruitmentRes = await fetch('https://skilviu.com/backend/api/v1/recruitments');
//           const recruitmentJson = await recruitmentRes.json();
//           const recruitments = Array.isArray(recruitmentJson) ? recruitmentJson :
//             recruitmentJson?.data && Array.isArray(recruitmentJson.data) ? recruitmentJson.data : [];

//           // Sum up all no_of_positions values
//           const totalPositionsCount = recruitments.reduce((sum, recruitment) => {
//             const positionCount = Number(recruitment.no_of_positions) || 1;
//             return sum + positionCount;
//           }, 0);

//           newStats.totalPositions = totalPositionsCount;
//           setStats(newStats);
//         }
//       } catch (error) {
//         console.error('Failed to fetch dashboard stats:', error);
//         setError('Failed to load dashboard statistics');
//         await fetchFullDataAsFallback();
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchFullDataAsFallback = async () => {
//       try {
//         const endpoints = [
//           'https://skilviu.com/backend/api/v1/recruitments',
//           'https://skilviu.com/backend/api/v1/clientforms',
//           'https://skilviu.com/backend/api/v1/candidates'
//         ];

//         const [recruitmentsData, clientFormsData, candidatesData] = await Promise.all(
//           endpoints.map(async (url) => {
//             try {
//               const response = await fetch(url);
//               if (!response.ok) throw new Error(`HTTP ${response.status}`);
//               return await response.json();
//             } catch (error) {
//               console.warn(`Endpoint ${url} failed:`, error);
//               return null;
//             }
//           })
//         );

//         const recruitments = Array.isArray(recruitmentsData) ? recruitmentsData :
//           recruitmentsData?.data && Array.isArray(recruitmentsData.data) ? recruitmentsData.data : [];

//         const clientForms = Array.isArray(clientFormsData) ? clientFormsData :
//           clientFormsData?.data?.data?.data && Array.isArray(clientFormsData.data.data.data) ? clientFormsData.data.data.data :
//           clientFormsData?.data && Array.isArray(clientFormsData.data) ? clientFormsData.data : [];

//         const candidates = Array.isArray(candidatesData) ? candidatesData :
//           candidatesData?.data && Array.isArray(candidatesData.data) ? candidatesData.data : [];

//         const interviewsCount = recruitments.filter(r => r?.interviewScheduled).length;
        
//         // ✅ Fixed: Sum up all positions properly in fallback
//         const totalPositionsCount = recruitments.reduce((sum, recruitment) => {
//           const positionCount = Number(recruitment.no_of_positions) || 1;
//           return sum + positionCount;
//         }, 0);

//         setStats({
//           applications: recruitments.length,
//           interviews: interviewsCount,
//           candidates: candidates.length,
//           clientForms: clientForms.length,
//           totalPositions: totalPositionsCount,
//         });
//       } catch (fallbackError) {
//         console.error('Fallback data fetch failed:', fallbackError);
//         setError('Unable to load dashboard statistics. Please try refreshing the page.');
//       }
//     };

//     fetchAllStats();
//   }, []);

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow p-8">
//         <div className="text-center py-10 text-gray-600">Loading dashboard statistics...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow p-4 sm:p-6 md:p-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">
//         Welcome to the HR Team Dashboard
//       </h1>

//       {error && (
//         <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-10">
//         <OverviewCard
//           icon={<ClipboardList className="w-6 h-6" />}
//           label="No. of Clients"
//           value={stats.clientForms}
//           colorClass="text-purple-600 bg-purple-100"
//           onClick={() => console.log('Clients card clicked')}
//         />
//         <OverviewCard
//           icon={<Users className="w-6 h-6" />}
//           label="No. of Candidates"
//           value={stats.candidates}
//           colorClass="text-green-600 bg-green-100"
//           onClick={() => console.log('Candidates card clicked')}
//         />
//         <OverviewCard
//           icon={<FileSignature className="w-6 h-6" />}
//           label="No. of Positions"
//           value={stats.totalPositions}
//           colorClass="text-pink-600 bg-pink-100"
//           onClick={() => setShowPositions(prev => !prev)}
//         />
//       </div>

//       {/* ✅ Enhanced: Better toggle UI feedback */}
//       {showPositions && (
//         <div className="mt-8 border-t pt-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-gray-800">Position Details</h2>
//             <button 
//               onClick={() => setShowPositions(false)}
//               className="text-gray-500 hover:text-gray-700 text-sm"
//             >
//               Hide Details
//             </button>
//           </div>
//           <Positions />
//         </div>
//       )}
//     </div>
//   );
// };

// const OverviewCard = ({ icon, label, value, colorClass, onClick }) => {
//   const [textColor, bgColor] = colorClass.split(' ');
//   return (
//     <div
//       onClick={onClick}
//       className="bg-white w-full h-40 rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center text-center cursor-pointer"
//     >
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
import axios from 'axios';
import { 
  Users, 
  ClipboardList, 
  FileSignature, 
  Bell, 
  BellRing, 
  CalendarCheck, 
  CheckCircle, 
  X,
  AlertCircle,
  Briefcase,
  User
} from 'lucide-react';
import Positions from './Positions';

const Dashboardhome = () => {
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    candidates: 0,
    clientForms: 0,
    totalPositions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPositions, setShowPositions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Current user - HR Team role
  const currentUser = {
    id: 1,
    username: 'hrteam@skilviu.com',
    role: 'hrteam'
  };

  // Fetch task assignments and filter for HR team only
  const fetchTaskNotifications = async (showLoader = false) => {
    if (showLoader) setNotificationsLoading(true);
    
    try {
      // Fetch both tasks and users to get user roles
      const [tasksResponse, usersResponse] = await Promise.all([
        axios.get('https://skilviu.com/backend/api/v1/task-assignments', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }),
        axios.get('https://skilviu.com/backend/api/v1/users', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (tasksResponse.data && tasksResponse.data.status === true && Array.isArray(tasksResponse.data.data)) {
        // Get users data
        const users = usersResponse.data?.data || [];
        
        // Filter tasks for HR team only
        const hrTasks = tasksResponse.data.data.filter(task => {
          // Find the user assigned to this task
          const assignedUser = users.find(user => user.id === task.user_id);
          // Only show tasks assigned to HR team members
          return assignedUser && assignedUser.user_role.toLowerCase() === 'hrteam';
        });

        // Convert to notification format
        const taskNotifications = hrTasks.map(task => {
          const assignedUser = users.find(user => user.id === task.user_id);
          return {
            id: `task-${task.task_assign_id}`,
            type: 'task_assignment',
            priority: task.priority_level,
            title: `New Task: ${task.job?.job_title || 'Recruitment Task'}`,
            message: `${task.message} - Deadline: ${formatDate(task.deadline)}`,
            time: formatRelativeTime(task.created_at),
            read: false,
            taskData: {
              taskId: task.task_assign_id,
              assignedTo: task.assigned_to,
              jobTitle: task.job?.job_title,
              jobLocation: task.job?.job_location,
              deadline: task.deadline,
              priority: task.priority_level,
              userId: task.user_id,
              jobId: task.job_id,
              teamRole: assignedUser?.user_role || 'Unknown'
            }
          };
        });

        // Load read status from localStorage
        const readNotifications = JSON.parse(localStorage.getItem('hr_readNotifications') || '[]');
        const updatedNotifications = taskNotifications.map(notification => ({
          ...notification,
          read: readNotifications.includes(notification.id)
        }));

        // Sort by creation date (newest first)
        updatedNotifications.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        setNotifications(updatedNotifications);
        setUnreadCount(updatedNotifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching HR team task notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      if (showLoader) setNotificationsLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format relative time helper
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Unknown time';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        setLoading(true);
        setError('');

        const countEndpoints = [
          { url: 'https://skilviu.com/backend/api/v1/recruitments/count', key: 'applications' },
          { url: 'https://skilviu.com/backend/api/v1/recruitments/interviews/count', key: 'interviews' },
          { url: 'https://skilviu.com/backend/api/v1/candidates/count', key: 'candidates' },
          { url: 'https://skilviu.com/backend/api/v1/clientforms/count', key: 'clientForms' }
        ];

        const countResults = await Promise.all(
          countEndpoints.map(async ({ url, key }) => {
            try {
              const response = await fetch(url);
              if (!response.ok) throw new Error(`HTTP ${response.status}`);
              const data = await response.json();
              return { key, count: data.count || 0 };
            } catch (error) {
              console.warn(`Count endpoint ${url} failed:`, error);
              return { key, count: null };
            }
          })
        );

        const hasFailedCounts = countResults.some(result => result.count === null);

        if (hasFailedCounts) {
          await fetchFullDataAsFallback();
        } else {
          const newStats = {};
          countResults.forEach(({ key, count }) => {
            newStats[key] = count;
          });

          const recruitmentRes = await fetch('https://skilviu.com/backend/api/v1/recruitments');
          const recruitmentJson = await recruitmentRes.json();
          const recruitments = Array.isArray(recruitmentJson) ? recruitmentJson :
            recruitmentJson?.data && Array.isArray(recruitmentJson.data) ? recruitmentJson.data : [];

          const totalPositionsCount = recruitments.reduce((sum, recruitment) => {
            const positionCount = Number(recruitment.no_of_positions) || 1;
            return sum + positionCount;
          }, 0);

          newStats.totalPositions = totalPositionsCount;
          setStats(newStats);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setError('Failed to load dashboard statistics');
        await fetchFullDataAsFallback();
      } finally {
        setLoading(false);
      }
    };

    const fetchFullDataAsFallback = async () => {
      try {
        const endpoints = [
          'https://skilviu.com/backend/api/v1/recruitments',
          'https://skilviu.com/backend/api/v1/clientforms',
          'https://skilviu.com/backend/api/v1/candidates'
        ];

        const [recruitmentsData, clientFormsData, candidatesData] = await Promise.all(
          endpoints.map(async (url) => {
            try {
              const response = await fetch(url);
              if (!response.ok) throw new Error(`HTTP ${response.status}`);
              return await response.json();
            } catch (error) {
              console.warn(`Endpoint ${url} failed:`, error);
              return null;
            }
          })
        );

        const recruitments = Array.isArray(recruitmentsData) ? recruitmentsData :
          recruitmentsData?.data && Array.isArray(recruitmentsData.data) ? recruitmentsData.data : [];

        const clientForms = Array.isArray(clientFormsData) ? clientFormsData :
          clientFormsData?.data?.data?.data && Array.isArray(clientFormsData.data.data.data) ? clientFormsData.data.data.data :
          clientFormsData?.data && Array.isArray(clientFormsData.data) ? clientFormsData.data : [];

        const candidates = Array.isArray(candidatesData) ? candidatesData :
          candidatesData?.data && Array.isArray(candidatesData.data) ? candidatesData.data : [];

        const interviewsCount = recruitments.filter(r => r?.interviewScheduled).length;
        
        const totalPositionsCount = recruitments.reduce((sum, recruitment) => {
          const positionCount = Number(recruitment.no_of_positions) || 1;
          return sum + positionCount;
        }, 0);

        setStats({
          applications: recruitments.length,
          interviews: interviewsCount,
          candidates: candidates.length,
          clientForms: clientForms.length,
          totalPositions: totalPositionsCount,
        });
      } catch (fallbackError) {
        console.error('Fallback data fetch failed:', fallbackError);
        setError('Unable to load dashboard statistics. Please try refreshing the page.');
      }
    };

    fetchAllStats();
  }, []);

  // ✅ NEW: Fetch notifications on component mount to show count by default
  useEffect(() => {
    fetchTaskNotifications(false); // Don't show loader on initial fetch
  }, []);

  // Fetch fresh notifications when dropdown opens (with loader)
  useEffect(() => {
    if (showNotifications) {
      fetchTaskNotifications(true); // Show loader when dropdown opens
    }
  }, [showNotifications]);

  // Auto-refresh notifications every 3 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTaskNotifications(false); // Background refresh without loader
    }, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(interval);
  }, []);

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Save to localStorage with HR prefix
    const readNotifications = JSON.parse(localStorage.getItem('hr_readNotifications') || '[]');
    if (!readNotifications.includes(id)) {
      readNotifications.push(id);
      localStorage.setItem('hr_readNotifications', JSON.stringify(readNotifications));
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    
    // Save all as read in localStorage with HR prefix
    const readNotifications = JSON.parse(localStorage.getItem('hr_readNotifications') || '[]');
    const updatedRead = [...new Set([...readNotifications, ...allIds])];
    localStorage.setItem('hr_readNotifications', JSON.stringify(updatedRead));
  };

  // Enhanced notification icon function
  const getNotificationIcon = (type, priority) => {
    if (type === 'task_assignment') {
      switch (priority?.toLowerCase()) {
        case 'urgent':
          return <AlertCircle className="w-4 h-4 text-red-600" />;
        case 'high':
          return <AlertCircle className="w-4 h-4 text-red-500" />;
        case 'medium':
          return <Briefcase className="w-4 h-4 text-yellow-500" />;
        case 'low':
          return <CheckCircle className="w-4 h-4 text-green-500" />;
        default:
          return <User className="w-4 h-4 text-blue-500" />;
      }
    }
    
    // Original notification icons for other types
    switch (type) {
      case 'new_candidate':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'interview_scheduled':
        return <CalendarCheck className="w-4 h-4 text-green-600" />;
      case 'position_update':
        return <FileSignature className="w-4 h-4 text-orange-600" />;
      case 'position_closed':
        return <CheckCircle className="w-4 h-4 text-red-600" />;
      case 'new_client':
        return <ClipboardList className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  // Priority badge colors
  const getPriorityBadge = (priority) => {
    const colors = {
      urgent: 'bg-red-600 text-white',
      high: 'bg-red-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-green-500 text-white'
    };
    return colors[priority?.toLowerCase()] || 'bg-blue-500 text-white';
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'border-l-red-600 bg-red-50';
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8">
        <div className="text-center py-10 text-gray-600">Loading dashboard statistics...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 md:p-8">
      {/* Header with Notifications */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to the HR Team Dashboard
        </h1>
        
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {unreadCount > 0 ? (
              <BellRing className="w-6 h-6 text-orange-600" />
            ) : (
              <Bell className="w-6 h-6 text-gray-600" />
            )}
            {/* ✅ This badge now shows by default when there are unread notifications */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Enhanced Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border z-50">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">HR Team Tasks</h3>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500">{unreadCount} unread notifications</p>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notificationsLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading notifications...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markNotificationAsRead(notification.id)}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? `${getPriorityColor(notification.priority)} border-l-4` : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            {notification.priority && notification.type === 'task_assignment' && (
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(notification.priority)}`}>
                                {notification.priority.toUpperCase()}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          
                          {notification.taskData && (
                            <div className="mt-2 text-xs text-gray-500 space-y-1">
                              <div>**Assigned to:** {notification.taskData.assignedTo}</div>
                              <div>**Team:** {notification.taskData.teamRole}</div>
                              {notification.taskData.jobLocation && (
                                <div>**Location:** {notification.taskData.jobLocation}</div>
                              )}
                            </div>
                          )}
                          
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No HR team task notifications yet</p>
                  </div>
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="p-3 border-t text-center">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Close notifications dropdown when clicking outside */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

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

      {showPositions && (
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Position Details</h2>
            <button 
              onClick={() => setShowPositions(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Hide Details
            </button>
          </div>
          <Positions />
        </div>
      )}
    </div>
  );
};

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
