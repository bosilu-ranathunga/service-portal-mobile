import React from "react";
import { Home, Star, Bookmark, User } from "lucide-react";

export default function BottomNavigation() {
    return (
        <nav className="fixed left-0 right-0 bottom-0 bg-white border-t shadow-lg">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center px-6 py-3">
                    <NavItem icon={<Home size={20} />} label="Home" active />
                    <NavItem icon={<Bookmark size={20} />} label="Bookings" />
                    <NavItem icon={<User size={20} />} label="Profile" />
                </div>
            </div>
        </nav>
    );
}

function NavItem({ icon, label, active = false }) {
    return (
        <button className="flex flex-col items-center gap-1 focus:outline-none">
            <div
                className={`p-2 rounded-md ${active ? "text-blue-600" : "text-gray-500"
                    }`}
            >
                {icon}
            </div>
            <span className={`text-xs ${active ? "text-blue-600" : "text-gray-500"}`}>
                {label}
            </span>
        </button>
    );
}
