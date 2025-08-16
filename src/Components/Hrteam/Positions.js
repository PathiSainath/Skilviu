import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Eye, EyeOff, Search, Filter } from 'lucide-react';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [filters, setFilters] = useState({
    showActive: true,
    showClosed: true,
    searchTerm: ''
  });
  const navigate = useNavigate();

  // Enhanced fetch function using admin endpoint
  const fetchPositions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');
      
      console.log('Fetching positions from admin API...');
      
      // ENHANCED: Use admin endpoint to get all jobs (active + closed)
      const res = await axios.get('https://skilviu.com/backend/api/v1/recruitments/admin/all');
      
      console.log('Raw API Response:', res);
      console.log('Response data:', res.data);
      
      // Handle different response structures
      let data;
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        data = res.data.data;
      } else {
        data = [];
      }

      console.log('Processed data:', data);
      console.log('Data length:', data.length);
      
      // Set debug info
      setDebugInfo({
        totalRecords: data.length,
        activeCount: data.filter(item => item.is_active !== false).length,
        closedCount: data.filter(item => item.is_active === false).length,
        sampleRecord: data[0] || null,
        responseStructure: Object.keys(res.data || {})
      });

      if (!data || data.length === 0) {
        setError('No recruitment data found in API response');
        setPositions([]);
        setFilteredPositions([]);
        return;
      }

      // ENHANCED: Better processing with job status
      const grouped = data.reduce((acc, item, index) => {
        console.log(`Processing item ${index}:`, item);
        
        const jobTitle = item.job_title || 
                        item.position || 
                        item.jobTitle || 
                        item.title || 
                        'Unknown Position';
        
        const clientName = item.client_name || 
                          item.clientName || 
                          item.client || 
                          'Unknown Client';
        
        const count = Number(item.no_of_positions) || 1;
        const isActive = item.is_active !== false;
        const status = isActive ? 'Active' : 'Closed';
        
        const key = `${jobTitle}__${clientName}`;

        if (!acc[key]) {
          acc[key] = { 
            jobTitle, 
            clientName, 
            count: 0,
            totalJobs: 0,
            activeJobs: 0,
            closedJobs: 0,
            id: item.job_id || item.id || index,
            status: 'Mixed', // Will be determined after processing all items
            isActive: null, // Will be determined
            autoCloseReason: null,
            autoClosedAt: null,
            createdAt: item.created_at,
            items: [] // Store all items for this position
          };
        }

        acc[key].count += count;
        acc[key].totalJobs += 1;
        acc[key].items.push(item);
        
        if (isActive) {
          acc[key].activeJobs += 1;
        } else {
          acc[key].closedJobs += 1;
          // Store closure info from the most recent closed job
          if (item.auto_close_reason) {
            acc[key].autoCloseReason = item.auto_close_reason;
          }
          if (item.auto_closed_at) {
            acc[key].autoClosedAt = item.auto_closed_at;
          }
        }

        return acc;
      }, {});

      // Determine final status for each position group
      Object.values(grouped).forEach(group => {
        if (group.activeJobs > 0 && group.closedJobs > 0) {
          group.status = 'Mixed';
          group.isActive = true; // Mixed is considered active
        } else if (group.activeJobs > 0) {
          group.status = 'Active';
          group.isActive = true;
        } else {
          group.status = 'Closed';
          group.isActive = false;
        }
      });

      console.log('Grouped data:', grouped);

      const formatted = Object.values(grouped).sort((a, b) => {
        // Sort by status (Active first, then Mixed, then Closed) and then by count
        if (a.isActive !== b.isActive) {
          return b.isActive - a.isActive;
        }
        return b.count - a.count;
      });
      
      console.log('Final formatted positions:', formatted);
      
      setPositions(formatted);
      setFilteredPositions(formatted); // Initialize filtered positions
      
      if (formatted.length === 0) {
        setError('No positions could be processed from the data');
      }

    } catch (error) {
      console.error('Error fetching positions:', error);
      setError(`Failed to fetch positions: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter positions based on current filters
  useEffect(() => {
    let filtered = positions;

    // Filter by status
    if (!filters.showActive || !filters.showClosed) {
      filtered = filtered.filter(pos => {
        if (filters.showActive && (pos.status === 'Active' || pos.status === 'Mixed')) return true;
        if (filters.showClosed && pos.status === 'Closed') return true;
        return false;
      });
    }

    // Filter by search term
    if (filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(pos => 
        pos.jobTitle.toLowerCase().includes(searchTerm) ||
        pos.clientName.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredPositions(filtered);
  }, [positions, filters]);

  // Initial fetch
  useEffect(() => {
    fetchPositions();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    await fetchPositions(true);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleCardClick = (index, jobTitle, clientName) => {
    setSelectedIndex(index);
    const encodedJobTitle = encodeURIComponent(jobTitle);
    const encodedClientName = encodeURIComponent(clientName);
    navigate(`/Hrteamdashboard/candidatestatus/${encodedJobTitle}?client=${encodedClientName}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-gray-600">Loading positions...</div>
      </div>
    );
  }

  // Enhanced error display
  if (error && positions.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">All Positions</h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="text-red-800 font-medium">Error:</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
        
        {showDebug && debugInfo && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="text-gray-800 font-medium mb-2">Debug Information:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Total Records:</strong> {debugInfo.totalRecords}</p>
              <p><strong>Active Jobs:</strong> {debugInfo.activeCount}</p>
              <p><strong>Closed Jobs:</strong> {debugInfo.closedCount}</p>
              <p><strong>Response Structure:</strong> {debugInfo.responseStructure.join(', ')}</p>
              {debugInfo.sampleRecord && (
                <div>
                  <strong>Sample Record:</strong>
                  <pre className="bg-white p-2 rounded mt-1 text-xs overflow-x-auto max-h-40 overflow-y-auto">
                    {JSON.stringify(debugInfo.sampleRecord, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="text-center py-8 text-gray-500">
          No positions found
        </div>
      </div>
    );
  }

  const totalPositions = positions.reduce((sum, pos) => sum + pos.count, 0);
  const activePositions = positions.filter(pos => pos.isActive).reduce((sum, pos) => sum + pos.count, 0);
  const closedPositions = totalPositions - activePositions;

  return (
    <div className="p-6">
      {/* Header with stats and controls */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">All Positions</h1>
          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <span>Total: {totalPositions} positions</span>
            <span className="text-green-600">Active: {activePositions}</span>
            <span className="text-red-600">Closed: {closedPositions}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search positions..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('showActive', !filters.showActive)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.showActive 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              {filters.showActive ? <Eye className="w-4 h-4 inline mr-1" /> : <EyeOff className="w-4 h-4 inline mr-1" />}
              Active
            </button>
            <button
              onClick={() => handleFilterChange('showClosed', !filters.showClosed)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.showClosed 
                  ? 'bg-red-100 text-red-800 border border-red-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              {filters.showClosed ? <Eye className="w-4 h-4 inline mr-1" /> : <EyeOff className="w-4 h-4 inline mr-1" />}
              Closed
            </button>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          {/* Debug toggle */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm"
          >
            {showDebug ? 'Hide' : 'Debug'}
          </button>
        </div>
      </div>

      {/* Debug info */}
      {showDebug && debugInfo && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-gray-800 font-medium mb-2">Debug Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>Total Records:</strong> {debugInfo.totalRecords}</p>
              <p><strong>Active Jobs:</strong> {debugInfo.activeCount}</p>
              <p><strong>Closed Jobs:</strong> {debugInfo.closedCount}</p>
            </div>
            <div>
              <p><strong>Filtered Results:</strong> {filteredPositions.length}</p>
              <p><strong>Show Active:</strong> {filters.showActive ? 'Yes' : 'No'}</p>
              <p><strong>Show Closed:</strong> {filters.showClosed ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p><strong>Search Term:</strong> {filters.searchTerm || 'None'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error display for non-fatal errors */}
      {error && positions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm">⚠️ {error}</p>
        </div>
      )}

      {/* Positions grid */}
      {filteredPositions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg mb-2">No positions match your filters</p>
          <p className="text-sm">Try adjusting your search terms or filter settings</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPositions.map((pos, index) => (
            <div
              key={`${pos.jobTitle}-${pos.clientName}-${index}`}
              onClick={() => handleCardClick(index, pos.jobTitle, pos.clientName)}
              className={`border rounded-xl p-4 text-center shadow-md transition-all cursor-pointer hover:shadow-lg ${
                selectedIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50'
                  : pos.status === 'Closed'
                    ? 'border-red-200 hover:border-red-300 bg-red-50'
                    : pos.status === 'Mixed'
                      ? 'border-yellow-200 hover:border-yellow-300 bg-yellow-50'
                      : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                {pos.jobTitle}
                {pos.status === 'Closed' && <span className="ml-2 text-red-600">🔒</span>}
                {pos.status === 'Mixed' && <span className="ml-2 text-yellow-600">⚡</span>}
              </div>
              
              <div className="text-md text-gray-500 italic mb-3 line-clamp-1">
                {pos.clientName}
              </div>
              
              <div className={`inline-block text-sm rounded-full px-3 py-1 font-medium mb-2 ${
                pos.status === 'Closed' 
                  ? 'bg-red-100 text-red-700'
                  : pos.status === 'Mixed'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-50 text-blue-700'
              }`}>
                {pos.count} position{pos.count > 1 ? 's' : ''}
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-center mb-2">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  pos.status === 'Active' ? 'bg-green-400' : 
                  pos.status === 'Mixed' ? 'bg-yellow-400' : 'bg-red-400'
                }`}></span>
                <span className="text-xs text-gray-600">{pos.status}</span>
                {pos.status === 'Mixed' && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({pos.activeJobs}A/{pos.closedJobs}C)
                  </span>
                )}
              </div>

              {/* Additional info for closed jobs */}
              {pos.status === 'Closed' && pos.autoCloseReason && (
                <div className="text-xs text-red-600 mt-2 p-2 bg-red-100 rounded">
                  {pos.autoCloseReason}
                </div>
              )}

              {/* Creation date */}
              {pos.createdAt && (
                <div className="text-xs text-gray-400 mt-2">
                  Created: {new Date(pos.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Positions;
