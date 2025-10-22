import React, { useState } from 'react';

const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning" // warning, danger, info
}) => {
    if (!isOpen) return null;

    const getIconAndColors = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: (
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    ),
                    bgColor: 'bg-red-100',
                    iconBg: 'bg-red-100',
                    confirmBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    borderColor: 'border-red-200'
                };
            case 'warning':
                return {
                    icon: (
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    ),
                    bgColor: 'bg-amber-100',
                    iconBg: 'bg-amber-100',
                    confirmBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
                    borderColor: 'border-amber-200'
                };
            default:
                return {
                    icon: (
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    bgColor: 'bg-blue-100',
                    iconBg: 'bg-blue-100',
                    confirmBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                    borderColor: 'border-blue-200'
                };
        }
    };

    const { icon, bgColor, iconBg, confirmBg, borderColor } = getIconAndColors();

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-[#000000c4]"
                onClick={onClose}
            ></div>

            {/* Dialog */}
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    className={`relative transform overflow-hidden rounded-md bg-white px-6 py-6 text-left shadow-2xl transition-all  sm:my-8 sm:w-full sm:max-w-md sm:p-8 border-2`}
                    style={{
                        animation: 'slideIn 0.2s ease-out forwards'
                    }}
                >
                    <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBg} sm:mx-0`}>
                            {icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 ml-2">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-1">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors sm:w-auto"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            className={`inline-flex w-full justify-center rounded-sm px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors sm:w-auto ${confirmBg}`}
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default ConfirmationDialog;