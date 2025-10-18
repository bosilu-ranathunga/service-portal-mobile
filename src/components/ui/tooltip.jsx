import React, { useState } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const getTooltipClasses = () => {
        const baseClasses = "absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg opacity-0 transition-opacity duration-300";
        const visibleClasses = isVisible ? "opacity-100" : "opacity-0 pointer-events-none";
        
        const positionClasses = {
            top: "-top-12 left-1/2 transform -translate-x-1/2",
            bottom: "-bottom-12 left-1/2 transform -translate-x-1/2",
            left: "top-1/2 -left-2 transform -translate-y-1/2 -translate-x-full",
            right: "top-1/2 -right-2 transform -translate-y-1/2 translate-x-full"
        };

        return `${baseClasses} ${visibleClasses} ${positionClasses[position]}`;
    };

    const getArrowClasses = () => {
        const baseClasses = "absolute w-2 h-2 bg-gray-900 transform rotate-45";
        const positionClasses = {
            top: "top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            bottom: "bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2",
            left: "left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2",
            right: "right-full top-1/2 transform -translate-y-1/2 translate-x-1/2"
        };

        return `${baseClasses} ${positionClasses[position]}`;
    };

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <div className={getTooltipClasses()}>
                {content}
                <div className={getArrowClasses()}></div>
            </div>
        </div>
    );
};

export default Tooltip;