import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  NotebookText,
  Users,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../AuthContext'; // make sure path matches your project

const navItemClass = ({ isActive }) =>
  `flex items-center px-3 py-2 rounded-md transition-colors duration-200 text-sm ${
    isActive 
      ? 'text-purple-600 bg-purple-50 font-semibold' 
      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
  }`;

const Hrteamsidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();              // 🧹 clear auth state + localStorage
    navigate('/login');    // 🚀 redirect properly
  };

  return (
    <aside className="h-full bg-white shadow p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-8">Skilviu</h2>

        <nav className="space-y-2">
          <NavLink to="/hrteamdashboard" className={navItemClass}>
            <Home className="mr-3 w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Overview</span>
          </NavLink>
          
          <NavLink to="/hrteamdashboard/candidateform-page" className={navItemClass}>
            <NotebookText className="mr-3 w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Candidate Form</span>
          </NavLink>
          
          <NavLink to="/hrteamdashboard/referred-friends" className={navItemClass}>
            <Users className="mr-3 w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Referred Friends</span>
          </NavLink>
        </nav>
      </div>

      <button 
        onClick={handleLogout}
        className="flex items-center px-3 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-md transition-colors duration-200"
      >
        <LogOut className="mr-3 w-4 h-4 flex-shrink-0" />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Hrteamsidebar;
