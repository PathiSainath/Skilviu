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
  X
} from 'lucide-react';

const Dashboardhome = () => {
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    candidates: 0,
    clientForms: 0,
    totalPositions: 0,
    positionsWithoutCandidates: 0,
    positionsClosed: 0,
    closedJobsData: [], // Ensure this is always an array
    projectStatus: { immediate: 0, shortTerm: 0, longTerm: 0 }
  });

  const [recruitments, setRecruitments] = useState([]);
  const [startCount, setStartCount] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]); // Initialize as empty array
  const [modalTheme, setModalTheme] = useState('default');

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [recRes, clientRes, candRes, closedJobsRes] = await Promise.all([
          axios.get('https://skilviu.com/backend/api/v1/recruitments'),
          axios.get('https://skilviu.com/backend/api/v1/clientforms'),
          axios.get('https://skilviu.com/backend/api/v1/candidates'),
          axios.get('https://skilviu.com/backend/api/v1/close')
        ]);

        const recs = recRes.data.data || [];
        const clients = clientRes.data.data?.data || [];
        let cands = [];
        if (Array.isArray(candRes.data)) cands = candRes.data;
        else if (Array.isArray(candRes.data.data)) cands = candRes.data.data;
        else if (Array.isArray(candRes.data.data.data)) cands = candRes.data.data.data;

        // **FIXED**: Ensure closedJobs is always an array
        let closedJobs = [];
        if (closedJobsRes.data.success && closedJobsRes.data.data) {
          closedJobs = Array.isArray(closedJobsRes.data.data) ? closedJobsRes.data.data : [];
        }

        console.log('Closed jobs data:', closedJobs); // Debug log

        setRecruitments(recs);

        const applications = recs.length;
        const interviews = recs.filter(r => r.interviewScheduled).length;
        const totalPositions = recs.reduce((sum, r) => sum + (r.no_of_positions || 0), 0);

        const mapToCands = recs.reduce((m, r) => {
          m[r.job_title] = m[r.job_title] || [];
          if (r.candidate) m[r.job_title].push(r.candidate);
          return m;
        }, {});
        const withoutCands = Object.values(mapToCands).filter(arr => arr.length === 0).length;
        const closed = closedJobs.length;

        let immediate=0, shortTerm=0, longTerm=0;
        recs.forEach(r => {
          const p = (r.notice_period||'').toLowerCase();
          if (p.includes('immediate')) immediate++;
          else if (p.includes('10')||p.includes('15')) shortTerm++;
          else if (p.includes('15 to 30')||p.includes('1 month')||p.includes('30')||p.includes('more')) longTerm++;
        });

        setStats({
          applications,
          interviews,
          candidates: cands.length,
          clientForms: clients.length,
          totalPositions,
          positionsWithoutCandidates: withoutCands,
          positionsClosed: closed,
          closedJobsData: closedJobs, // This is now guaranteed to be an array
          projectStatus: { immediate, shortTerm, longTerm }
        });

        setStartCount(true);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchAllStats();
  }, []);

  const getPercentage = count => {
    const tot = stats.projectStatus.immediate + stats.projectStatus.shortTerm + stats.projectStatus.longTerm;
    return tot ? `${Math.round(count/tot*100)}%` : '0%';
  };

  const openClientsModal = async () => {
    setModalTitle('Client Details');
    setModalTheme('default');
    setShowModal(true);
    try {
      const res = await axios.get('https://skilviu.com/backend/api/v1/clientforms');
      const clientData = res.data.data?.data || [];
      setModalData(Array.isArray(clientData) ? clientData : []); // **FIXED**: Ensure array
    } catch {
      setModalData([]);
    }
  };

  const openCandidatesModal = async () => {
    setModalTitle('Candidate Details');
    setModalTheme('default');
    setShowModal(true);
    try {
      const res = await axios.get('https://skilviu.com/backend/api/v1/candidates');
      let cands = [];
      if (Array.isArray(res.data)) cands = res.data;
      else if (Array.isArray(res.data.data)) cands = res.data.data;
      else if (Array.isArray(res.data.data.data)) cands = res.data.data.data;
      setModalData(cands);
    } catch {
      setModalData([]);
    }
  };

  const openPositionsModal = () => {
    setModalTitle('Position Details');
    setModalTheme('default');
    setModalData(Array.isArray(recruitments) ? recruitments : []); // **FIXED**: Ensure array
    setShowModal(true);
  };

  // **FIXED**: Added safety checks for closed jobs modal
  const openClosedPositionsModal = () => {
    setModalTitle('Closed Job Details');
    setModalTheme('red');
    const closedData = Array.isArray(stats.closedJobsData) ? stats.closedJobsData : [];
    console.log('Opening closed jobs modal with data:', closedData); // Debug log
    setModalData(closedData);
    setShowModal(true);
  };

  const openModalForCategory = cat => {
    setModalTitle(cat);
    setModalTheme(cat==='Warning'?'red':cat==='Caution'?'yellow':'green');
    setShowModal(true);
    const filteredData = recruitments.filter(r => {
      const p = (r.notice_period||'').toLowerCase();
      if (cat==='Warning') return p.includes('immediate');
      if (cat==='Caution') return p.includes('10')||p.includes('15');
      return p.includes('15 to 30')||p.includes('1 month')||p.includes('30')||p.includes('more');
    });
    setModalData(Array.isArray(filteredData) ? filteredData : []); // **FIXED**: Ensure array
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">Welcome to the Admin Dashboard</h1>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        <OverviewCard icon={<ClipboardList className="w-6 h-6 text-purple-600"/>}
          label="No. of Clients" value={stats.clientForms} colorClass="text-purple-600 bg-purple-100"
          startCount={startCount} onClick={openClientsModal}/>
        <OverviewCard icon={<FileSignature className="w-6 h-6 text-pink-600"/>}
          label="No. of Positions" value={stats.totalPositions} colorClass="text-pink-600 bg-pink-100"
          startCount={startCount} onClick={openPositionsModal}/>
        <OverviewCard icon={<Users className="w-6 h-6 text-green-600"/>}
          label="No. of Candidates" value={stats.candidates} colorClass="text-green-600 bg-green-100"
          startCount={startCount} onClick={openCandidatesModal}/>
        <OverviewCard icon={<CalendarCheck className="w-6 h-6 text-yellow-600"/>}
          label="Interviews Scheduled" value={stats.interviews} colorClass="text-yellow-600 bg-yellow-100"
          startCount={startCount}/>
        <OverviewCard icon={<Send className="w-6 h-6 text-blue-600"/>}
          label="Positions without Candidates" value={stats.positionsWithoutCandidates} colorClass="text-blue-600 bg-blue-100"
          startCount={startCount}/>
        <OverviewCard icon={<CheckCircle className="w-6 h-6 text-red-600"/>}
          label="Positions Closed" value={stats.positionsClosed} colorClass="text-red-600 bg-red-100"
          startCount={startCount} onClick={openClosedPositionsModal}/>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center pt-16 z-50">
          <div className={`
            bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-6 relative
            overflow-auto max-h-[80vh]
            ${modalTheme==='red'    ? 'border-4 border-red-600'    : ''}
            ${modalTheme==='yellow' ? 'border-4 border-yellow-500' : ''}
            ${modalTheme==='green'  ? 'border-4 border-green-600'  : ''}
          `}>
            <button onClick={()=>setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
              <X className="w-6 h-6"/>
            </button>
            <h3 className={`
              text-2xl font-semibold mb-6 border-b pb-4
              ${modalTheme==='red'    ? 'text-red-600'    : ''}
              ${modalTheme==='yellow' ? 'text-yellow-600' : ''}
              ${modalTheme==='green'  ? 'text-green-600'  : ''}
            `}>
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
                  {(modalTitle==='Position Details'||['Warning','Caution','Good'].includes(modalTitle)) && <>
                    <th className="px-6 py-3">Job Title</th>
                    <th className="px-6 py-3">Positions</th>
                    <th className="px-6 py-3">Notice Period</th>
                  </>}
                  {modalTitle==='Closed Job Details' && <>
                    <th className="px-6 py-3">Job Title</th>
                    <th className="px-6 py-3">Total Positions</th>
                    <th className="px-6 py-3">Filled Positions</th>
                    <th className="px-6 py-3">Closed At</th>
                    <th className="px-6 py-3">Closure Reason</th>
                  </>}
                </tr>
              </thead>
              <tbody>
                {/* **FIXED**: Added array check before mapping */}
                {Array.isArray(modalData) && modalData.length > 0 ? (
                  modalData.map((item, idx)=>(
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
                      {(modalTitle==='Position Details'||['Warning','Caution','Good'].includes(modalTitle)) && <>
                        <td className="px-6 py-4">{item.job_title}</td>
                        <td className="px-6 py-4">{item.no_of_positions}</td>
                        <td className="px-6 py-4">{item.notice_period}</td>
                      </>}
                      {modalTitle==='Closed Job Details' && <>
                        <td className="px-6 py-4">{item.recruitment?.job_title || 'N/A'}</td>
                        <td className="px-6 py-4">{item.total_positions}</td>
                        <td className="px-6 py-4">{item.filled_positions}</td>
                        <td className="px-6 py-4">{new Date(item.closed_at).toLocaleString()}</td>
                        <td className="px-6 py-4">{item.closure_reason}</td>
                      </>}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Component definitions remain unchanged
const OverviewCard = ({ icon, label, value, colorClass, startCount, onClick }) => {
  const [textColor, bgColor] = colorClass.split(' ');
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg flex flex-col justify-center items-center text-center cursor-pointer"
    >
      <div className={`p-3 rounded-full mb-3 ${bgColor}`}>{icon}</div>
      <p className="w-full text-center text-sm text-gray-500">{label}</p>
      <p className={`w-full text-center text-xl font-bold ${textColor}`}>
        {startCount ? <CountUp end={value} duration={2} /> : 0}
      </p>
    </div>
  );
};

const StatusBar = ({ label, color, width, onClick }) => {
  const map = {
    red:    { bgDark: 'bg-red-600',    text: 'text-red-700' },
    yellow: { bgDark: 'bg-yellow-500', text: 'text-yellow-700' },
    green:  { bgDark: 'bg-green-600',  text: 'text-green-700' }
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

export default Dashboardhome;

