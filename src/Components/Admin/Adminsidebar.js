import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  User,
  UserCheck,
  LogOut,
} from 'lucide-react';

const navItemClass = ({ isActive }) =>
  `flex items-center px-2 py-1 rounded-md transition-colors duration-200 ${isActive ? 'text-purple-600 font-semibold' : 'text-gray-500 hover:text-purple-600'
  }`;

const Adminsidebar = () => {
  return (
    <aside className="h-full bg-white shadow p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-8">Skilviu</h2>

        <nav className="space-y-4 text-sm">
          <NavLink to="/admindashboard" className={navItemClass}>
            <User className="mr-2 w-4 h-4" />
            Overview
          </NavLink>

          <NavLink to="/admindashboard/task-assign" className={navItemClass}>
            <UserCheck className="mr-2 w-4 h-4" />
            Task Assign
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

export default Adminsidebar;


