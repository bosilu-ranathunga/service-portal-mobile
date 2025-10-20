import React from 'react'
import TopNameBar from '@/components/mobile/TopNameBar'

export default function JobInfo() {
    return (
        <div className="min-h-screen bg-background flex flex-col">

            {/* Mobile Header */}
            <TopNameBar title="Job Information" />

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[#f3f4f6]">

            </main>
        </div>
    )
}
