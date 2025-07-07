import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  ClipboardList,
  FileText,
  LogOut,
  UserPlus,
  CalendarCheck,
  NotebookText, // ✅ Imported correctly
} from 'lucide-react';

const navItemClass = ({ isActive }) =>
  `flex items-center px-2 py-1 rounded-md transition-colors duration-200 ${
    isActive ? 'text-purple-600 font-semibold' : 'text-gray-500 hover:text-purple-600'
  }`;

const Hrteamsidebar = () => {
  return (
    <aside className="h-full bg-white shadow p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-8">Skilviu</h2>

        <nav className="space-y-4 text-sm">
          <NavLink to="/Hrteamdashboard" className={navItemClass}>
            <Home className="mr-2 w-4 h-4" />
            Overview
          </NavLink>
          <NavLink to="/Hrteamdashboard/candidateform-page" className={navItemClass}>
            <NotebookText className="mr-2 w-4 h-4" />
            Candidate Form
          </NavLink>
          {/* <NavLink to="/Hrteamdashboard/add-candidate" className={navItemClass}>
            <UserPlus className="mr-2 w-4 h-4" />
            Add Candidate
          </NavLink>
          <NavLink to="/Hrteamdashboard/interviews" className={navItemClass}>
            <CalendarCheck className="mr-2 w-4 h-4" />
            Interviews
          </NavLink> */}
          <NavLink to="/Hrteamdashboard/candidatestatus" className={navItemClass}>
            <FileText className="mr-2 w-4 h-4" />
            Candidate Status
          </NavLink>
        </nav>
      </div>

      <NavLink to="/login" className="flex items-center text-red-600 font-semibold mt-8 hover:underline">
        <LogOut className="mr-2 w-4 h-4" />
        Logout
      </NavLink>
    </aside>
  );
};

export default Hrteamsidebar;
