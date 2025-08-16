import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  ClipboardList,
  FileText,
  LogOut,
  UserPlus,
  CalendarCheck,
  NotebookText,
  Users, // Added for Referred Friends icon
} from 'lucide-react';

const navItemClass = ({ isActive }) =>
  `flex items-center px-3 py-2 rounded-md transition-colors duration-200 text-sm ${
    isActive 
      ? 'text-purple-600 bg-purple-50 font-semibold' 
      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
  }`;

const Hrteamsidebar = () => {
  return (
    <aside className="h-full bg-white shadow p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-8">Skilviu</h2>

        <nav className="space-y-2">
          <NavLink to="/Hrteamdashboard" className={navItemClass}>
            <Home className="mr-3 w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Overview</span>
          </NavLink>
          
          <NavLink to="/Hrteamdashboard/candidateform-page" className={navItemClass}>
            <NotebookText className="mr-3 w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Candidate Form</span>
          </NavLink>
          
          {/* Referred Friends Link */}
          <NavLink to="/Hrteamdashboard/referred-friends" className={navItemClass}>
            <Users className="mr-3 w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Referred Friends</span>
          </NavLink>
        </nav>
      </div>

      <NavLink 
        to="/login" 
        className="flex items-center px-3 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-md transition-colors duration-200"
      >
        <LogOut className="mr-3 w-4 h-4 flex-shrink-0" />
        <span>Logout</span>
      </NavLink>
    </aside>
  );
};

export default Hrteamsidebar;
