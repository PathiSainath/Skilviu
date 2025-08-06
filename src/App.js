import './App.css';
import './index.css';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Outlet,
  Link,
} from 'react-router-dom';
import { Menu, Home, FileText, UserCheck, LogOut } from 'lucide-react';

import ScrollToTop from './Components/ScrollToTop';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

// Public Pages
import HomePage from './Components/Home';
import Aboutus from './Components/Aboutus';
import Services from './Components/Services';
import Clients from './Components/Clients';
import Careers from './Components/Careers';
import Contactus from './Components/Contactus';
import Testimonials from './Components/Testimonials';
import Jobdetails from './Components/Jobdetails';
import Referafriend from './Components/Referafriend';

// Profiles
import Profile1 from './Components/Profile1';
import Profile2 from './Components/Profile2';
import Profile3 from './Components/Profile3';
import Profile4 from './Components/Profile4';
import Profile5 from './Components/Profile5';
import Profile6 from './Components/Profile6';
import Profile7 from './Components/Profile7';
import Profile8 from './Components/Profile8';

// Services
import Staffing from './Components/Staffing';
import Payroll from './Components/Payroll';
import ITmanagement from './Components/ITmanagement';
import ITnetwork from './Components/ITnetwork';

// Auth & Shared Forms
import Login from './Components/Login';
import Candidateform from './Components/Candidateform';

// Admin Dashboard
import Admindashboard from './Components/Admin/Admindashboard';
import AdminDashboardHome from './Components/Admin/Dashboardhome';
import Candidateform_page from './Components/Hrteam/Candidateform_page';

// Business Dashboard
import Businessdashboard from './Components/Businessdeveloper/Businessdashboard';
import BusinessDashboardHome from './Components/Businessdeveloper/Dashboardhome';
import BD_Clientform from './Components/Businessdeveloper/Clientform_page';
import BD_RecruitmentPage from './Components/Businessdeveloper/Recruitment_page';
import Formedit from './Components/Businessdeveloper/Formedit';

// HR Dashboard
import HrteamDashboardHome from './Components/Hrteam/Dashboardhome';
import Candidatestatus from './Components/Hrteam/Candidatestatus';
import Getintouch from './Components/Getintouch';
import Disclaimer from './Components/Disclaimer';
import Positions from './Components/Hrteam/Positions';
import Clientformedit from './Components/Businessdeveloper/Clientformedit';
import Scams from './Components/Scams';
import TaskAssign from './Components/Admin/Taskassign';


function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admindashboard');
  const isBusinessRoute = location.pathname.startsWith('/businessdashboard');
  const isHrteamRoute = location.pathname.startsWith('/hrteamdashboard');

  return (
    <>
      {!isAdminRoute && !isBusinessRoute && !isHrteamRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/services" element={<Services />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/jobs/:id" element={<Jobdetails />} />
        <Route path="/refer" element={<Referafriend />} />
        <Route path='/getintouch' element={<Getintouch />} />
        <Route path='/Scams' element={<Scams />} />

        {/* Profiles */}
        <Route path="/profile1" element={<Profile1 />} />
        <Route path="/profile2" element={<Profile2 />} />
        <Route path="/profile3" element={<Profile3 />} />
        <Route path="/profile4" element={<Profile4 />} />
        <Route path="/profile5" element={<Profile5 />} />
        <Route path="/profile6" element={<Profile6 />} />
        <Route path="/profile7" element={<Profile7 />} />
        <Route path="/profile8" element={<Profile8 />} />

        {/* Services */}
        <Route path="/staffing" element={<Staffing />} />
        <Route path="/staffing/:id" element={<Staffing />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/itmanagement" element={<ITmanagement />} />
        <Route path="/network" element={<ITnetwork />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/candidateform" element={<Candidateform />} />

        {/* Admin Dashboard */}
        <Route path="/admindashboard" element={<AdmindashboardLayout />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="candidateform-page" element={<Candidateform_page />} />
          <Route path='task-assign' element={<TaskAssign />} />
        </Route>

        {/* Business Dashboard */}
        <Route path="/businessdashboard" element={<BusinessdashboardLayout />}>
          <Route index element={<BusinessDashboardHome />} />
          <Route path="clientform-page" element={<BD_Clientform />} />
          <Route path="recruitment-page" element={<BD_RecruitmentPage />} />
          <Route path='formedit/:id' element={<Formedit />} />
          <Route path="clientformedit/:id" element={<Clientformedit />} />


        </Route>

        {/* HR Team Dashboard */}
        <Route path="/hrteamdashboard" element={<HrteamdashboardLayout />}>
          <Route index element={<HrteamDashboardHome />} />
          <Route path="candidateform-page" element={<Candidateform_page />} />
          <Route path="candidatestatus" element={<Candidatestatus />} />
          <Route path="positions" element={<Positions />} />
          <Route path="candidatestatus/:jobTitle" element={<Candidatestatus />} />

        </Route>
      </Routes>

      {!isAdminRoute && !isBusinessRoute && !isHrteamRoute && <Footer />}
      {!isAdminRoute && !isBusinessRoute && !isHrteamRoute && <Disclaimer />}
    </>
  );
}

// Admin Layout
function AdmindashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow">
        <h1 className="text-lg font-bold text-blue-900">Skilviu</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:w-60 md:flex`}>
        <div className="h-full overflow-y-auto pt-16 md:pt-0">
          <Admindashboard />
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-6 mt-16 md:mt-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

// Business Layout
function BusinessdashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow">
        <h1 className="text-lg font-bold text-blue-900">Skilviu - Business</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:w-60 md:flex`}>
        <div className="h-full overflow-y-auto pt-16 md:pt-0">
          <Businessdashboard />
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-6 mt-16 md:mt-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

// ✅ HR Team Layout
function HrteamdashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', path: '/hrteamdashboard', icon: <Home className="w-4 h-4" /> },
    { name: 'Candidate Form', path: '/hrteamdashboard/candidateform-page', icon: <FileText className="w-4 h-4" /> },
    { name: 'Candidate Status', path: '/hrteamdashboard/candidatestatus', icon: <UserCheck className="w-4 h-4" /> },
  ];

  const handleLogout = () => {
    // Clear any session tokens if used
    // localStorage.removeItem('token');
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
          <h1 className="text-xl font-bold text-blue-900">Skilviu</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${location.pathname === item.path
                  ? 'bg-purple-50 text-purple-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-800"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <aside className="hidden md:flex w-64 bg-white shadow-md">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 w-64 bg-white shadow-md">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col w-full">
        <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow fixed top-0 w-full z-40">
          <h1 className="text-lg font-bold text-blue-900">Skilviu - HR Team</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <main className="flex-1 p-4 md:p-6 mt-16 md:mt-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { HrteamdashboardLayout };
export default App;
