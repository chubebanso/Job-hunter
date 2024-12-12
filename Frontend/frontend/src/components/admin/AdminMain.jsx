import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminMain = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="flex gap-4">
                <button
                    onClick={() => navigate('/admin/companies')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
                >
                    Company
                </button>
                <button
                    onClick={() => navigate('/admin/:id/applicants')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
                >
                    User
                </button>
            </div>
        </div>
    );
};

export default AdminMain;
