// import React from 'react';
// import { NavLink } from 'react-router-dom';

// // Lucide Icons
// import {
//   Home,
//   ClipboardList,
//   FileSignature,
//   FileText,
//   LogOut,
// } from 'lucide-react';

// const navItemClass = ({ isActive }) =>
//   `flex items-center px-2 py-1 rounded-md transition-colors duration-200 ${isActive ? 'text-purple-600 font-semibold' : 'text-gray-500 hover:text-purple-600'
//   }`;

// const BusinessSidebar = () => {
//   return (
//     <aside className="h-full bg-white shadow p-6 flex flex-col justify-between">
//       <div>
//         <h2 className="text-xl font-bold text-blue-900 mb-8">Skilviu</h2>

//         <nav className="space-y-4 text-sm">
//           <NavLink to="/businessdashboard" className={navItemClass}>
//             <Home className="mr-2 w-4 h-4" />
//             Overview
//           </NavLink>
//           <NavLink to="/businessdashboard/clientform-page" className={navItemClass}>
//             <ClipboardList className="mr-2 w-4 h-4" />
//             CO FORM
//           </NavLink>
//           <NavLink to="/businessdashboard/recruitment-page" className={navItemClass}>
//             <FileSignature className="mr-2 w-4 h-4" />
//             CR FORM
//           </NavLink>
//           <NavLink to="/businessdashboard/clientformedit/:id" className={navItemClass}>
//             <FileText className="mr-2 w-4 h-4" />
//             CO FORM Edit
//           </NavLink>
//           <NavLink to="/businessdashboard/formedit/:id" className={navItemClass}>
//             <FileText className="mr-2 w-4 h-4" />
//             CR FORM Edit
//           </NavLink>
//         </nav>
//       </div>

//       <NavLink
//         to="/login"
//         className="flex items-center text-red-600 font-semibold mt-8 hover:underline"
//       >
//         <LogOut className="mr-2 w-4 h-4" />
//         Logout
//       </NavLink>
//     </aside>
//   );
// };

// export default BusinessSidebar;






import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

// Lucide Icons
import {
  Home,
  ClipboardList,
  FileSignature,
  FileText,
  LogOut,
  User,
} from 'lucide-react';

const navItemClass = ({ isActive }) =>
  `flex items-center px-2 py-1 rounded-md transition-colors duration-200 ${
    isActive ? 'text-purple-600 font-semibold' : 'text-gray-500 hover:text-purple-600'
  }`;

const BusinessSidebar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user data from localStorage
      const storedUserId = localStorage.getItem('user_id');
      
      if (storedUserId) {
        // Fetch specific user by ID
        const response = await axios.get(`https://skilviu.com/backend/api/v1/users/${storedUserId}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.status === true) {
          setCurrentUser(response.data.data);
        } else {
          throw new Error('User not found in API response');
        }
      } else {
        // Fetch all users and find BDM
        const response = await axios.get('https://skilviu.com/backend/api/v1/users', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.status === true) {
          const bdmUser = response.data.data.find(user => user.user_role === 'Bdm');
          
          if (bdmUser) {
            setCurrentUser(bdmUser);
            // Store the user data for future use
            localStorage.setItem('user_id', bdmUser.id);
            localStorage.setItem('username', bdmUser.username);
          } else {
            throw new Error('No BDM user found');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
      
      // Fallback to stored username if available
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setCurrentUser({
          username: storedUsername,
          user_role: localStorage.getItem('user_role') || 'Bdm'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Extract and format username for display
  const getDisplayName = () => {
    if (!currentUser || !currentUser.username) return 'User';
    
    const username = currentUser.username;
    
    // If it's an email, extract and format the name part
    if (username.includes('@')) {
      const namePart = username.split('@')[0];
      return namePart
        .replace(/\./g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    // If it's not an email, just capitalize properly
    return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
  };

  // Get role display name - UPDATED: Shows "Business Developer" instead of "Business Development Manager"
  const getRoleDisplayName = () => {
    if (!currentUser || !currentUser.user_role) return '';
    
    switch (currentUser.user_role.toLowerCase()) {
      case 'bdm':
        return 'Business Developer'; // Changed from 'Business Development Manager'
      case 'admin':
        return 'Administrator';
      case 'hrteam':
        return 'HR Team';
      default:
        return currentUser.user_role;
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
  };

  return (
    <aside className="h-full bg-white shadow-lg p-6 flex flex-col justify-between">
      <div>
        {/* Clean Welcome Header */}
        <div className="mb-8 pb-4 border-b border-gray-100">
          {loading ? (
            <div>
              <div className="animate-pulse bg-gray-200 h-6 w-32 rounded mb-2"></div>
              <div className="animate-pulse bg-gray-100 h-4 w-24 rounded"></div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-1">
                Welcome {getDisplayName()}
              </h2>
              {currentUser && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  {getRoleDisplayName()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-3 text-sm">
          <NavLink to="/businessdashboard" className={navItemClass}>
            <Home className="mr-3 w-4 h-4" />
            Dashboard Overview
          </NavLink>
          <NavLink to="/businessdashboard/clientform-page" className={navItemClass}>
            <ClipboardList className="mr-3 w-4 h-4" />
            CO FORM
          </NavLink>
          <NavLink to="/businessdashboard/recruitment-page" className={navItemClass}>
            <FileSignature className="mr-3 w-4 h-4" />
            CR FORM
          </NavLink>
          <NavLink to="/businessdashboard/clientformedit/:id" className={navItemClass}>
            <FileText className="mr-3 w-4 h-4" />
            CO FORM Edit
          </NavLink>
          <NavLink to="/businessdashboard/formedit/:id" className={navItemClass}>
            <FileText className="mr-3 w-4 h-4" />
            CR FORM Edit
          </NavLink>
        </nav>
      </div>

      {/* Logout Section */}
      <div>
        <NavLink
          to="/login"
          className="flex items-center justify-center w-full px-4 py-2 text-red-600 font-semibold bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 w-4 h-4" />
          Logout
        </NavLink>
      </div>
    </aside>
  );
};

export default BusinessSidebar;
