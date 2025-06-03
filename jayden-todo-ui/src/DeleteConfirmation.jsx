import React from 'react';

const DeleteConfirmation = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop - this blocks interaction */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
                onClick={onCancel}
            />

            {/* Modal */}
            <div
                className="z-50 bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h2>
                <p className="text-sm text-gray-600 mb-4">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                        No
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation;
