import React, { useState } from 'react'
import TopNameBar from '@/components/mobile/TopNameBar'
import { Phone, FileText, Calendar, Wrench, Users, Paperclip, ClipboardList } from 'lucide-react'

export default function JobInfo() {
    const [activeTab, setActiveTab] = useState('overview')

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'instrument', label: 'Instrument', icon: Wrench },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'history', label: 'History', icon: ClipboardList },
        { id: 'attachments', label: 'Attachments', icon: Paperclip },
        { id: 'actions', label: 'Actions', icon: Calendar },
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Mobile Header */}
            <TopNameBar title="Job Information" />

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[#f3f4f6] pb-20">
                {/* Job Summary Header */}
                <div className="bg-white p-4 shadow-sm border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Emergency Repair</h2>
                    <p className="text-sm text-gray-700 mt-1">Metro Hospital — IT Department</p>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <p>📅 <b>Period:</b> 17 Oct – 20 Oct 2025</p>
                        <p>🟢 <b>Status:</b> In Progress</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto bg-white border-b">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center justify-center flex-1 py-3 text-sm font-medium 
                  ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600'}
                `}
                            >
                                <Icon size={18} className="mb-1" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-4 space-y-4">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <h3 className="font-semibold text-gray-800 mb-2">Customer Details</h3>
                                <p><b>Name:</b> Metro Hospital</p>
                                <p><b>Department:</b> IT / Server Maintenance</p>
                                <p><b>Address:</b> 789 Healthcare Blvd, TC 12347</p>
                                <p><b>Contact Persons:</b></p>
                                <div className="mt-1 space-y-1">
                                    {['John Silva', 'Priya Nadarajah'].map((person) => (
                                        <button
                                            key={person}
                                            onClick={() => window.location.href = `tel:${person}`}
                                            className="flex items-center text-blue-600 hover:underline"
                                        >
                                            <Phone size={16} className="mr-1" /> {person}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <h3 className="font-semibold text-gray-800 mb-2">Job Information</h3>
                                <p><b>Description:</b> Critical cooling system failure in server room.</p>
                                <p><b>Job Type:</b> Emergency Repair</p>
                                <p><b>Date Range:</b> 17 Oct – 20 Oct 2025</p>
                            </div>
                        </div>
                    )}

                    {/* Instrument Tab */}
                    {activeTab === 'instrument' && (
                        <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
                            <h3 className="font-semibold text-gray-800 mb-2">Instrument Details</h3>
                            <p><b>Name:</b> Cooling System Controller</p>
                            <p><b>Model:</b> CSX-4000</p>
                            <p><b>Serial No:</b> SN-102394</p>
                            <p><b>Type:</b> HVAC Control Unit</p>
                            <p><b>Warranty:</b> Valid until 2026-03-15 ✅</p>
                        </div>
                    )}

                    {/* Team Tab */}
                    {activeTab === 'team' && (
                        <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
                            <h3 className="font-semibold text-gray-800 mb-2">Assigned Engineers</h3>
                            <p><b>Lead Engineer:</b> John Fernando (You)</p>
                            <ul className="list-disc ml-6 text-gray-700">
                                <li>D. Perera</li>
                                <li>S. Wijesinghe</li>
                            </ul>
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
                            <h3 className="font-semibold text-gray-800 mb-2">Service History</h3>
                            <div className="space-y-3">
                                {[
                                    { date: '10 Jul 2025', type: 'Maintenance', summary: 'Cooling fan replaced' },
                                    { date: '12 Mar 2025', type: 'Calibration', summary: 'Temperature sensor recalibrated' },
                                ].map((item, idx) => (
                                    <div key={idx} className="border rounded-lg p-3">
                                        <p className="font-medium text-gray-800">{item.date} — {item.type}</p>
                                        <p className="text-sm text-gray-600">{item.summary}</p>
                                        <button className="text-blue-600 text-sm mt-1 hover:underline">📄 View FSR</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Attachments Tab */}
                    {activeTab === 'attachments' && (
                        <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
                            <h3 className="font-semibold text-gray-800 mb-2">Attached Documents</h3>
                            <ul className="space-y-2">
                                {['Cooling_System_Specs.pdf', 'Server_Room_Condition.jpg', 'Job_Authorization_Form.pdf'].map((file, idx) => (
                                    <li key={idx} className="flex items-center text-blue-600 hover:underline">
                                        <Paperclip size={16} className="mr-2" /> {file}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Actions Tab */}
                    {activeTab === 'actions' && (
                        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
                            <h3 className="font-semibold text-gray-800 mb-2">Job Actions</h3>
                            <div className="space-y-3">
                                {[
                                    '✅ Mark Job as Completed',
                                    '📝 Add Field Service Report',
                                    '📤 Upload Attachments',
                                    '💬 Add Note / Remark',
                                    '🔁 Request Help from Supervisor'
                                ].map((action, idx) => (
                                    <button
                                        key={idx}
                                        className="w-full py-3 text-gray-800 font-medium bg-gray-100 hover:bg-blue-50 rounded-xl transition"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
