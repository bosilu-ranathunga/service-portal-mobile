import React from 'react'
import AppBar from "../components/AppBar";
import BottomNavigation from "../components/BottomNavigation";

export default function dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* App Bar */}
            <AppBar />


            {/* Main Content */}
            <main className="p-4 pb-28 flex-1">
                <div className="space-y-6">

                </div>
            </main>


            {/* Bottom Navigation */}
            <BottomNavigation />
        </div>
    )
}
