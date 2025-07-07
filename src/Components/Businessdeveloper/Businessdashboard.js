import React from 'react'
import BusinessSidebar from './Businesssidebar'

function Businessdashboard() {
    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar stays fixed */}
            <div className="w-60 bg-white shadow">
                <BusinessSidebar />
            </div>
        </div>
    )
}

export default Businessdashboard