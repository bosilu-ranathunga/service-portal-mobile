import React from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, EllipsisVertical } from 'lucide-react';
import { vibrate } from '../../utils/pwaUtils';

export default function TopNameBar({ title, rightIcon }) {
    const navigate = useNavigate();

    const goBack = () => {
        vibrate(12);
        navigate(-1);
    }

    return (
        <header className="bg-blue-500 text-primary-foreground px-4 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-primary/20">
            <div className="flex items-center space-x-3">
                <ArrowLeft size={24} onClick={goBack} className="cursor-pointer" />
                <span className="text-2xl font-bold">{title}</span>
            </div>

            <div className="flex items-center space-x-3">
                {/* Menu Toggle */}
                {rightIcon}
                <EllipsisVertical size={24} />
            </div>
        </header>
    );
}
