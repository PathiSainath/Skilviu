// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function TaskAssign() {
//   const [users, setUsers] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [selectedUser, setSelectedUser] = useState('');
//   const [selectedJob, setSelectedJob] = useState('');
//   const [taskData, setTaskData] = useState({
//     message: '',
//     priority_level: 'medium',
//     deadline: '',
//     job_id: '',
//     client_id: '',
//     assigned_to: '',
//     assignedToId: '',
//     assignedBy: 'Admin',
//     status: 'pending',
//     task_type: 'recruitment'
//   });
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   // Fetch users, jobs and clients on component mount
//   useEffect(() => {
//     fetchUsers();
//     fetchJobs();
//     fetchClients();
//   }, []);

//   // Fetch users from API or fallback mock data
//   const fetchUsers = async () => {
//     try {
//       // Try API first
//       const response = await axios.get('https://skilviu.com/backend/api/v1/users', {
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         }
//       });
//       if (response.data && response.data.data && Array.isArray(response.data.data)) {
//         setUsers(response.data.data);
//       } else if (response.data && Array.isArray(response.data)) {
//         setUsers(response.data);
//       } else {
//         throw new Error('Invalid users data format');
//       }
//     } catch {
//       // Fallback mock data
//       setUsers([
//         { id: 1, user_role: 'Admin', username: 'naveen.indla@skilviu.com', created_at: '2025-07-12 16:26:50' },
//         { id: 2, user_role: 'Bdm', username: 'manaswi.v@skilviu.com', created_at: '2025-07-12 16:30:55' },
//         { id: 3, user_role: 'Hrteam', username: 'naveena.p@skilviu.com', created_at: '2025-07-12 16:42:19' },
//         { id: 4, user_role: 'Admin', username: 'lokesh.ch@skilviu.com', created_at: '2025-07-12 17:12:40' },
//         { id: 5, user_role: 'Hrteam', username: 'sumeera.k@skilviu.com', created_at: '2025-07-12 17:15:53' },
//         { id: 6, user_role: 'Hrteam', username: 'sravani.n@skilviu.com', created_at: '2025-07-14 15:54:08' },
//         { id: 7, user_role: 'Hrteam', username: 'sravan.s@skilviu.com', created_at: '2025-07-15 12:30:37' },
//         { id: 8, user_role: 'Admin', username: 'premnath@skilviu.com', created_at: '2025-07-16 12:04:13' },
//         { id: 9, user_role: 'Admin', username: 'jaya@skilviu.com', created_at: '2025-07-24 18:16:08' }
//       ]);
//       setErrorMessage('ℹ️ Using demo data - Connect to API to load actual users');
//     }
//   };

//   // Fetch jobs from API
//   const fetchJobs = async () => {
//     try {
//       const response = await axios.get('https://skilviu.com/backend/api/v1/recruitments');
//       if (response.data && response.data.data) {
//         setJobs(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//       setJobs([]);
//     }
//   };

//   // Fetch clients from API
//   const fetchClients = async () => {
//     try {
//       const response = await fetch('https://skilviu.com/backend/api/v1/clientforms/dropdown');
//       const json = await response.json();
//       if (json.status && Array.isArray(json.data)) {
//         setClients(json.data);
//       }
//     } catch (error) {
//       console.error('Error fetching clients:', error);
//       setClients([]);
//     }
//   };

//   // Handle form input changes for task-related fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTaskData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // When user selects a team member, save user ID and username
//   const handleUserSelect = (e) => {
//     const userId = e.target.value;
//     const user = users.find(u => u.id === parseInt(userId));
//     setSelectedUser(userId);
//     setTaskData(prev => ({
//       ...prev,
//       assignedTo: user ? user.username : '',
//       assignedToId: userId,
//       teamType: user ? user.user_role.toLowerCase() : ''
//     }));
//   };

//   // When user selects a job, save job_id and related info, show description
//   const handleJobSelect = (e) => {
//     const jobId = e.target.value;
//     const job = jobs.find(j => j.job_id === parseInt(jobId));
//     setSelectedJob(jobId);
//     setTaskData(prev => ({
//       ...prev,
//       job_id: jobId,
//       client_id: job ? job.client_id : '',
//       description: job ? `Handle recruitment for ${job.job_title} position at ${job.client_name || 'Client'}. Required skills: ${job.skills_required || ''}` : prev.description
//     }));
//   };

//   // Submit Form Handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setSuccessMessage('');
//     setErrorMessage('');

//     try {
//       const selectedJobData = jobs.find(j => j.job_id === parseInt(selectedJob));
//       const autoTitle = selectedJobData ? `Recruitment: ${selectedJobData.job_title}` : 'Recruitment Task';

//       const newTask = {
//         ...taskData,
//         title: autoTitle,
//         id: Date.now(),
//         createdAt: new Date().toISOString(),
//         assignedToUser: users.find(u => u.id === parseInt(selectedUser)),
//         jobDetails: selectedJobData,
//         teamType: users.find(u => u.id === parseInt(selectedUser))?.user_role.toLowerCase() || '',
//         assigned_to: users.find(u => u.id === parseInt(selectedUser))?.username || '',
//         priority: taskData.priority_level // for display
//       };

//       const taskResponse = await createTaskAssignment(newTask);

//       if (taskResponse.success) {
//         setTasks(prev => [...prev, newTask]);
//         await sendNotificationToTeam(newTask);
//         resetForm();
//         setSuccessMessage('✅ Recruitment task assigned successfully!');
//         setTimeout(() => setSuccessMessage(''), 5000);
//       } else {
//         throw new Error('Failed to create task assignment');
//       }
//     } catch (error) {
//       console.error('Error assigning task:', error);
//       setErrorMessage('❌ Error assigning task. Please try again.');
//       setTimeout(() => setErrorMessage(''), 5000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create Task Assignment API call
//   const createTaskAssignment = async (taskData) => {
//     try {
//       const assignedUser = users.find(u => u.id === parseInt(selectedUser));
//       const assignedToUsername = assignedUser ? assignedUser.username : '';

//       const response = await axios.post('https://skilviu.com/backend/api/v1/task-assigning', {
//         user_id: parseInt(selectedUser),
//         job_id: selectedJob ? parseInt(selectedJob) : null,
//         assigned_to: assignedToUsername,
//         message: taskData.message,
//         priority_level: taskData.priority_level,
//         deadline: taskData.deadline,
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       });

//       console.log('Task assignment response:', response.data);
//       return { success: true, data: response.data };
//     } catch (error) {
//       console.error('API Error creating task:', error);
//       if (error.response) {
//         console.error('Response data:', error.response.data);
//         console.error('Response status:', error.response.status);
//       }
//       return { success: false, error };
//     }
//   };

//   // Notification logic (localStorage-based)
//   const sendNotificationToTeam = async (task) => {
//     const notification = {
//       id: Date.now(),
//       type: 'task_assigned',
//       message: `New recruitment task "${task.title}" assigned to ${task.assigned_to}`,
//       teamType: task.teamType,
//       taskId: task.id,
//       jobId: task.job_id,
//       timestamp: new Date().toISOString(),
//       read: false,
//       priority_level: task.priority_level
//     };

//     const existingNotifications = JSON.parse(localStorage.getItem('teamNotifications') || '[]');
//     existingNotifications.push(notification);
//     localStorage.setItem('teamNotifications', JSON.stringify(existingNotifications));
//   };

//   // Reset form fields and selected values
//   const resetForm = () => {
//     setTaskData({
//       message: '',
//       priority_level: 'medium',
//       deadline: '',
//       job_id: '',
//       client_id: '',
//       assigned_to: '',
//       assignedToId: '',
//       assignedBy: 'Admin',
//       status: 'pending',
//       task_type: 'recruitment'
//     });
//     setSelectedUser('');
//     setSelectedJob('');
//   };

//   // Display role names formatted nicely
//   const getRoleDisplayName = (role) => {
//     switch (role?.toLowerCase()) {
//       case 'admin': return 'Admin';
//       case 'hrteam': return 'HR Team';
//       case 'bdm': return 'Business Development';
//       default: return role || 'Unknown Role';
//     }
//   };

//   // Display role colors for UI tags
//   const getRoleColorClasses = (role) => {
//     switch (role?.toLowerCase()) {
//       case 'admin': return 'bg-red-500';
//       case 'hrteam': return 'bg-green-500';
//       case 'bdm': return 'bg-blue-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   // Priority badge colors
//   const getPriorityColorClasses = (priority) => {
//     switch (priority?.toLowerCase()) {
//       case 'low': return 'bg-green-100 text-green-800';
//       case 'medium': return 'bg-yellow-100 text-yellow-800';
//       case 'high': return 'bg-red-100 text-red-800';
//       case 'urgent': return 'bg-red-500 text-white';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-5 font-sans">
//       {/* Header */}
//       <div className="text-center mb-8 p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl">
//         <h2 className="text-3xl font-bold mb-3">
//           Assign Recruitment Task to Team Member
//         </h2>
//         <p className="text-lg opacity-90">
//           Assign job postings and recruitment tasks to team members based on their roles
//         </p>
//       </div>

//       {/* Success Message */}
//       {successMessage && (
//         <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-5 font-medium">
//           {successMessage}
//         </div>
//       )}

//       {/* Error Message */}
//       {errorMessage && (
//         <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-5 font-medium">
//           {errorMessage}
//         </div>
//       )}

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5">
//         {/* Form Section */}
//         <div className="bg-white p-6 rounded-xl shadow-lg">
//           <form onSubmit={handleSubmit}>
//             {/* Job Selection - FIXED: Added unique key prop */}
//             <div className="flex flex-col mb-5">
//               <label htmlFor="job-select" className="mb-2 font-semibold text-gray-700 text-sm">
//                 Select Job Posting *
//               </label>
//               <select
//                 id="job-select"
//                 value={selectedJob}
//                 onChange={handleJobSelect}
//                 required
//                 className="p-3 border-2 border-gray-200 rounded-lg text-sm transition-colors focus:border-indigo-500 focus:outline-none"
//               >
//                 <option value="">Choose a job posting...</option>
//                 {jobs.map(job => (
//                   <option key={`job-${job.job_id}`} value={job.job_id}>
//                     {job.job_title}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* User Selection - FIXED: Added unique key prop */}
//             <div className="flex flex-col mb-5">
//               <label htmlFor="user-select" className="mb-2 font-semibold text-gray-700 text-sm">
//                 Select Team Member *
//               </label>
//               <select
//                 id="user-select"
//                 value={selectedUser}
//                 onChange={handleUserSelect}
//                 required
//                 className="p-3 border-2 border-gray-200 rounded-lg text-sm transition-colors focus:border-indigo-500 focus:outline-none"
//               >
//                 <option value="">Choose a team member...</option>
//                 {users.map(user => (
//                   <option key={`user-${user.id}`} value={user.id}>
//                     {user.username} - {getRoleDisplayName(user.user_role)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Selected User Info */}
//             {selectedUser && (
//               <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
//                 {(() => {
//                   const user = users.find(u => u.id === parseInt(selectedUser));
//                   return user ? (
//                     <div>
//                       <h4 className="text-gray-600 font-semibold mb-3">
//                         Selected Team Member:
//                       </h4>
//                       <p className="text-sm text-gray-600 mb-1">
//                         <strong>Name:</strong> {user.username}
//                       </p>
//                       <p className="text-sm text-gray-600 mb-1">
//                         <strong>Role:</strong>
//                         <span
//                           className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ml-2 ${getRoleColorClasses(user.user_role)}`}
//                         >
//                           {getRoleDisplayName(user.user_role)}
//                         </span>
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         <strong>Member Since:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
//                       </p>
//                     </div>
//                   ) : null;
//                 })()}
//               </div>
//             )}

//             {/* Task Description */}
//             <div className="flex flex-col mb-5">
//               <label htmlFor="message" className="mb-2 font-semibold text-gray-700 text-sm">
//                 Task Description *
//               </label>
//               <textarea
//                 id="message"
//                 name="message"
//                 value={taskData.message}
//                 onChange={handleInputChange}
//                 required
//                 className="p-3 border-2 border-gray-200 rounded-lg text-sm min-h-[100px] resize-y transition-colors focus:border-indigo-500 focus:outline-none"
//                 rows="4"
//                 placeholder="Task description will auto-populate when job is selected"
//               />
//             </div>

//             {/* Priority and Deadline Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
//               <div className="flex flex-col">
//                 <label htmlFor="priority_level" className="mb-2 font-semibold text-gray-700 text-sm">
//                   Priority Level
//                 </label>
//                 <select
//                   id="priority_level"
//                   name="priority_level"
//                   value={taskData.priority_level}
//                   onChange={handleInputChange}
//                   className="p-3 border-2 border-gray-200 rounded-lg text-sm transition-colors focus:border-indigo-500 focus:outline-none"
//                 >
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                   <option value="urgent">Urgent</option>
//                 </select>
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="deadline" className="mb-2 font-semibold text-gray-700 text-sm">
//                   Deadline
//                 </label>
//                 <input
//                   type="date"
//                   id="deadline"
//                   name="deadline"
//                   value={taskData.deadline ? taskData.deadline.split('T')[0] : ''}  // show only YYYY-MM-DD
//                   onChange={(e) => {
//                     // Update deadline to YYYY-MM-DD format, no time
//                     setTaskData(prev => ({
//                       ...prev,
//                       deadline: e.target.value,
//                     }));
//                   }}
//                   className="p-3 border-2 border-gray-200 rounded-lg text-sm transition-colors focus:border-indigo-500 focus:outline-none"
//                 />
//               </div>

//             </div>

//             {/* Form Buttons */}
//             <div className="flex gap-4 mt-5">
//               <button
//                 type="submit"
//                 disabled={loading || !selectedUser}
//                 className={`flex-1 px-6 py-3 border-none rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 transition-opacity ${(loading || !selectedUser)
//                   ? 'opacity-60 cursor-not-allowed'
//                   : 'hover:opacity-90 cursor-pointer'
//                   }`}
//               >
//                 {loading ? 'Assigning Task...' : 'Assign Recruitment Task'}
//               </button>
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="px-6 py-3 border-2 border-gray-200 rounded-lg text-sm font-semibold bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
//               >
//                 Clear Form
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Recently Assigned Tasks - FIXED: Added unique key prop */}
//         <div className="bg-white p-6 rounded-xl shadow-lg">
//           <h3 className="text-xl font-semibold text-gray-800 mb-5">
//             Recently Assigned Tasks
//           </h3>
//           <div>
//             {tasks.length === 0 ? (
//               <p className="text-center text-gray-500 italic py-10">
//                 No recruitment tasks assigned yet
//               </p>
//             ) : (
//               tasks.slice(-5).reverse().map(task => (
//                 <div key={`task-${task.id}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
//                   <div className="flex justify-between items-center mb-3">
//                     <h4 className="text-gray-800 font-semibold text-lg">
//                       {task.title}
//                     </h4>
//                     <span
//                       className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColorClasses(task.priority)}`}
//                     >
//                       {task.priority.toUpperCase()}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <strong>Assigned to:</strong> {task.assigned_to}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <strong>Team:</strong>
//                     <span
//                       className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ml-2 ${getRoleColorClasses(task.teamType)}`}
//                     >
//                       {getRoleDisplayName(task.teamType)}
//                     </span>
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <strong>Description:</strong> {task.description}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1">
//                     <strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleString() : 'No deadline'}
//                   </p>
//                   {task.jobDetails && (
//                     <div className="bg-gray-200 p-2 rounded mt-2">
//                       <p className="text-xs mb-1">
//                         <strong>Client:</strong> {task.jobDetails.client_name}
//                       </p>
//                       <p className="text-xs">
//                         <strong>Location:</strong> {task.jobDetails.job_location}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TaskAssign;






import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskAssign() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [taskData, setTaskData] = useState({
    message: '',
    priority_level: 'medium',
    deadline: '',
    job_id: '',
    client_id: '',
    assigned_to: '',
    assignedToId: '',
    assignedBy: 'Admin',
    status: 'pending',
    task_type: 'recruitment'
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch users, jobs, clients and tasks on component mount
  useEffect(() => {
    fetchUsers();
    fetchJobs();
    fetchClients();
    fetchTasks(); // Add this to fetch existing tasks
  }, []);

  // NEW: Fetch existing tasks from API
  const fetchTasks = async () => {
    setTasksLoading(true);
    try {
      const response = await axios.get('https://skilviu.com/backend/api/v1/task-assignments', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.status === true && Array.isArray(response.data.data)) {
        // Transform API data to match frontend task structure
        const transformedTasks = response.data.data.map(task => ({
          id: task.task_assign_id, // Use task_assign_id as the primary key
          title: task.job && task.job.job_title ? `Recruitment: ${task.job.job_title}` : 'Recruitment Task',
          message: task.message,
          priority: task.priority_level,
          priority_level: task.priority_level,
          deadline: task.deadline,
          assigned_to: task.assigned_to,
          teamType: '', // Will be filled from user data if available
          createdAt: task.created_at,
          description: task.message,
          jobDetails: task.job || null,
          user_id: task.user_id,
          job_id: task.job_id
        }));

        setTasks(transformedTasks);
      } else {
        console.log('No tasks found or invalid response format');
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

  // Fetch users from API or fallback mock data
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://skilviu.com/backend/api/v1/users', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        throw new Error('Invalid users data format');
      }
    } catch {
      // Fallback mock data
      setUsers([
        { id: 1, user_role: 'Admin', username: 'naveen.indla@skilviu.com', },
        { id: 2, user_role: 'Bdm', username: 'manaswi.v@skilviu.com', },
        { id: 3, user_role: 'Hrteam', username: 'naveena.p@skilviu.com', },
        { id: 4, user_role: 'Admin', username: 'lokesh.ch@skilviu.com', },
        { id: 5, user_role: 'Hrteam', username: 'sumeera.k@skilviu.com', },
        { id: 6, user_role: 'Hrteam', username: 'sravani.n@skilviu.com', },
        { id: 7, user_role: 'Hrteam', username: 'sravan.s@skilviu.com', },
        { id: 8, user_role: 'Admin', username: 'premnath@skilviu.com', },
        { id: 9, user_role: 'Admin', username: 'jaya@skilviu.com', }
      ]);
      // setErrorMessage('ℹ️ Using demo data - Connect to API to load actual users');
    }
  };

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      const response = await axios.get('https://skilviu.com/backend/api/v1/recruitments');
      if (response.data && response.data.data) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    }
  };

  // Fetch clients from API
  const fetchClients = async () => {
    try {
      const response = await fetch('https://skilviu.com/backend/api/v1/clientforms/dropdown');
      const json = await response.json();
      if (json.status && Array.isArray(json.data)) {
        setClients(json.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    }
  };

  // Handle form input changes for task-related fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // When user selects a team member, save user ID and username
  const handleUserSelect = (e) => {
    const userId = e.target.value;
    const user = users.find(u => u.id === parseInt(userId));
    setSelectedUser(userId);
    setTaskData(prev => ({
      ...prev,
      assignedTo: user ? user.username : '',
      assignedToId: userId,
      teamType: user ? user.user_role.toLowerCase() : ''
    }));
  };

  // When user selects a job, save job_id and related info, show description
  const handleJobSelect = (e) => {
    const jobId = e.target.value;
    const job = jobs.find(j => j.job_id === parseInt(jobId));
    setSelectedJob(jobId);
    setTaskData(prev => ({
      ...prev,
      job_id: jobId,
      client_id: job ? job.client_id : '',
      description: job ? `Handle recruitment for ${job.job_title} position at ${job.client_name || 'Client'}. Required skills: ${job.skills_required || ''}` : prev.description
    }));
  };

  // Submit Form Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const selectedJobData = jobs.find(j => j.job_id === parseInt(selectedJob));
      const autoTitle = selectedJobData ? `Recruitment: ${selectedJobData.job_title}` : 'Recruitment Task';

      const newTask = {
        ...taskData,
        title: autoTitle,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        assignedToUser: users.find(u => u.id === parseInt(selectedUser)),
        jobDetails: selectedJobData,
        teamType: users.find(u => u.id === parseInt(selectedUser))?.user_role.toLowerCase() || '',
        assigned_to: users.find(u => u.id === parseInt(selectedUser))?.username || '',
        priority: taskData.priority_level
      };

      const taskResponse = await createTaskAssignment(newTask);

      if (taskResponse.success) {
        // Refresh tasks from API after successful creation
        await fetchTasks();
        await sendNotificationToTeam(newTask);
        resetForm();
        setSuccessMessage('✅ Recruitment task assigned successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error('Failed to create task assignment');
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      setErrorMessage('❌ Error assigning task. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Create Task Assignment API call
  const createTaskAssignment = async (taskData) => {
    try {
      const assignedUser = users.find(u => u.id === parseInt(selectedUser));
      const assignedToUsername = assignedUser ? assignedUser.username : '';

      const response = await axios.post('https://skilviu.com/backend/api/v1/task-assigning', {
        user_id: parseInt(selectedUser),
        job_id: selectedJob ? parseInt(selectedJob) : null,
        assigned_to: assignedToUsername,
        message: taskData.message,
        priority_level: taskData.priority_level,
        deadline: taskData.deadline,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Task assignment response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('API Error creating task:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      return { success: false, error };
    }
  };

  // Notification logic (localStorage-based)
  const sendNotificationToTeam = async (task) => {
    const notification = {
      id: Date.now(),
      type: 'task_assigned',
      message: `New recruitment task "${task.title}" assigned to ${task.assigned_to}`,
      teamType: task.teamType,
      taskId: task.id,
      jobId: task.job_id,
      timestamp: new Date().toISOString(),
      read: false,
      priority_level: task.priority_level
    };

    const existingNotifications = JSON.parse(localStorage.getItem('teamNotifications') || '[]');
    existingNotifications.push(notification);
    localStorage.setItem('teamNotifications', JSON.stringify(existingNotifications));
  };

  // Reset form fields and selected values
  const resetForm = () => {
    setTaskData({
      message: '',
      priority_level: 'medium',
      deadline: '',
      job_id: '',
      client_id: '',
      assigned_to: '',
      assignedToId: '',
      assignedBy: 'Admin',
      status: 'pending',
      task_type: 'recruitment'
    });
    setSelectedUser('');
    setSelectedJob('');
  };

  // Helper function to get user role by user_id from tasks
  const getUserRoleByUserId = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.user_role : '';
  };

  // Display role names formatted nicely
  const getRoleDisplayName = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'Admin';
      case 'hrteam': return 'HR Team';
      case 'bdm': return 'Business Development';
      default: return role || 'Unknown Role';
    }
  };

  // Display role colors for UI tags
  const getRoleColorClasses = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-red-500';
      case 'hrteam': return 'bg-green-500';
      case 'bdm': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Priority badge colors
  const getPriorityColorClasses = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-red-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-5 font-sans">
      {/* Header */}
      <div className="text-center mb-8 p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl">
        <h2 className="text-3xl font-bold mb-3">
          Assign Recruitment Task to Team Member
        </h2>
        <p className="text-lg opacity-90">
          Assign job postings and recruitment tasks to team members based on their roles
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-5 font-medium">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-5 font-medium">
          {errorMessage}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit}>
            {/* Job Selection */}
            <div className="flex flex-col mb-5">
              <label htmlFor="job-select" className="mb-2 font-semibold text-gray-700 text-sm">
                Select Job Posting *
              </label>
              <select
                id="job-select"
                value={selectedJob}
                onChange={handleJobSelect}
                required
                className="p-3 border-2 border-gray-200 rounded-lg text-sm transition-colors focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Choose a job posting...</option>
                {jobs.map(job => (
                  <option key={`job-${job.job_id}`} value={job.job_id}>
                    {job.job_title}
                  </option>
                ))}
              </select>
            </div>

            {/* User Selection */}
            <div className="flex flex-col mb-5">
              <label htmlFor="user-select" className="mb-2 font-semibold text-gray-700 text-sm">
                Select Team Member *
              </label>
              <select
                id="user-select"
                value={selectedUser}
                onChange={handleUserSelect}
                required
                className="p-3 border-2 border-gray-200 rounded-lg text-sm transition-colors focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Choose a team member...</option>
                {users.map(user => (
                  <option key={`user-${user.id}`} value={user.id}>
                    {user.username} - {getRoleDisplayName(user.user_role)}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected User Info */}
            {selectedUser && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
                {(() => {
                  const user = users.find(u => u.id === parseInt(selectedUser));
                  return user ? (
                    <div>
                      <h4 className="text-gray-600 font-semibold mb-3">
                        Selected Team Member:
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Name:</strong> {user.username}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Role:</strong>
                        <span
                          className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ml-2 ${getRoleColorClasses(user.user_role)}`}
                        >
                          {getRoleDisplayName(user.user_role)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Member Since:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Task Description */}
            <div className="flex flex-col mb-5">
              <label htmlFor="message" className="mb-2 font-semibold text-gray-700 text-sm">
                Task Description *
              </label>
              <textarea
                id="message"
                name="message"
                value={taskData.message}
                onChange={handleInputChange}
                required
                className="p-3 border-2 border-gray-200 rounded-lg text-sm min-h-[100px] resize-y transition-colors focus:border-indigo-500 focus:outline-none"
                rows="4"
                placeholder="Task description will auto-populate when job is selected"
              />
            </div>

            {/* Priority and Deadline Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="flex flex-col">
                <label htmlFor="priority_level" className="mb-2 font-semibold text-gray-700 text-sm">
                  Priority Level
                </label>
                <select
                  id="priority_level"
                  name="priority_level"
                  value={taskData.priority_level}
                  onChange={handleInputChange}
                  className="p-3 border-2 border-gray-200 rounded-lg text-sm transition-colors focus:border-indigo-500 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="deadline" className="mb-2 font-semibold text-gray-700 text-sm">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={taskData.deadline ? taskData.deadline.split('T')[0] : ''}
                  onChange={(e) => {
                    setTaskData(prev => ({
                      ...prev,
                      deadline: e.target.value,
                    }));
                  }}
                  className="p-3 border-2 border-gray-200 rounded-lg text-sm transition-colors focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex gap-4 mt-5">
              <button
                type="submit"
                disabled={loading || !selectedUser}
                className={`flex-1 px-6 py-3 border-none rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 transition-opacity ${(loading || !selectedUser)
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:opacity-90 cursor-pointer'
                  }`}
              >
                {loading ? 'Assigning Task...' : 'Assign Recruitment Task'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border-2 border-gray-200 rounded-lg text-sm font-semibold bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Recently Assigned Tasks - UPDATED: Removed client name */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-semibold text-gray-800">
              Recently Assigned Tasks
            </h3>
            <button
              onClick={fetchTasks}
              disabled={tasksLoading}
              className="px-3 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              {tasksLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* UPDATED: Latest tasks at top with NEW badge */}
          <div className="max-h-[600px] overflow-y-auto pr-2">
            {tasksLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <p className="text-center text-gray-500 italic py-10">
                No recruitment tasks assigned yet
              </p>
            ) : (
              // ✅ FIXED: Sort by creation date descending (newest first), then take 10
              tasks
                .sort((a, b) => {
                  const dateA = new Date(a.createdAt || a.created_at || 0);
                  const dateB = new Date(b.createdAt || b.created_at || 0);
                  return dateB - dateA; // Newest first
                })
                .slice(0, 10)
                .map(task => {
                  const userRole = getUserRoleByUserId(task.user_id);
                  const isRecent = (() => {
                    if (!task.createdAt && !task.created_at) return false;
                    const taskDate = new Date(task.createdAt || task.created_at);
                    const now = new Date();
                    const diffInMinutes = (now - taskDate) / (1000 * 60);
                    return diffInMinutes <= 30; // Recent if within 30 minutes
                  })();

                  return (
                    <div key={`task-${task.id}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-gray-800 font-semibold text-lg">
                            {task.title}
                          </h4>
                          {/* ✅ NEW badge for recent tasks */}
                          {isRecent && (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              🆕 NEW
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColorClasses(task.priority)}`}
                        >
                          {task.priority ? task.priority.toUpperCase() : 'MEDIUM'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Assigned to:</strong> {task.assigned_to}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Team:</strong>
                        <span
                          className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ml-2 ${getRoleColorClasses(userRole)}`}
                        >
                          {getRoleDisplayName(userRole)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Description:</strong> {task.description || task.message}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                      </p>
                      {task.jobDetails && (
                        <div className="bg-gray-200 p-2 rounded mt-2">
                          <p className="text-xs mb-1">
                            <strong>Job:</strong> {task.jobDetails.job_title}
                          </p>
                          <p className="text-xs">
                            <strong>Location:</strong> {task.jobDetails.job_location || 'N/A'}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Created: {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .max-h-\\[600px\\]::-webkit-scrollbar {
          width: 6px;
        }
        .max-h-\\[600px\\]::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .max-h-\\[600px\\]::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .max-h-\\[600px\\]::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}

export default TaskAssign;
