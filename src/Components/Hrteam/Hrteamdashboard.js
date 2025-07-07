import React from 'react'
import Hrteamsidebar from './Hrteamsidebar'

function Hrteamdashboard() {
    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar stays fixed */}
            <div className="w-60 bg-white shadow">
                <Hrteamsidebar />
            </div>
        </div>
    )
}

export default Hrteamdashboard