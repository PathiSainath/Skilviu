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
