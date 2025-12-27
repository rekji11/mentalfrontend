import React from 'react';
import PasswordUpdateForm from './PasswordUpdateForm';

function SettingsScreen({ token, userData, onLogout }) {
    return (
        <div className="p-4 sm:p-8 space-y-8 bg-white rounded-t-3xl shadow-2xl min-h-[calc(100vh-60px)]">
            
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4 border-b pb-2">
                Profile & Settings
            </h2>
            
            <div className="bg-indigo-50 p-4 rounded-xl shadow-inner border border-indigo-200">
                 <p className="text-lg font-semibold text-indigo-800">Account Details</p>
                 <p className="text-sm text-indigo-700">Username: <span className="font-medium">{userData?.username || 'Loading...'}</span></p>
            </div>
            
            <PasswordUpdateForm token={token} />

            <button
                onClick={onLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition duration-200 shadow-md"
            >
                Sign Out
            </button>
        </div>
    );
}

export default SettingsScreen;