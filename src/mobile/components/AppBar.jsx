import React from "react";
import { Camera, MoreVertical, Search } from "lucide-react";

export default function AppBar() {
    return (
        <header className="bg-blue-600 text-white px-4 pt-6 pb-4 shadow-md">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">GoCeylon</h1>
                <div className="flex items-center gap-3">
                    <button
                        aria-label="camera"
                        className="p-2 rounded-md bg-emerald-600/30 hover:bg-emerald-600/40"
                    >
                        <Camera size={18} />
                    </button>
                    <button
                        aria-label="more"
                        className="p-2 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30"
                    >
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
