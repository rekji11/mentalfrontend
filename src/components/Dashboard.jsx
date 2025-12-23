import React, { useEffect, useState } from 'react';
import { fetchProtected } from '../api'; 

function Dashboard({ token, onLogout }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Fetch User Data Hook ---
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const data = await fetchProtected('/users/me', 'GET', token);
        setUserData(data);
        setError('');
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError('Failed to load user data. You may have been logged out.');
        onLogout(); 
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadUserData();
    }
  }, [token, onLogout]);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-600">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-100 border border-red-400 text-red-700 rounded max-w-lg mx-auto mt-10">
        <p className="font-bold">Authorization Error</p>
        <p>{error}</p>
        <button 
          onClick={onLogout} 
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Navigation Bar */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-semibold text-indigo-600">Mental Health Check-in</h1>
        <button 
          onClick={onLogout} 
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </header>
      
      {/* Main Content Area */}
      <main className="p-8">
        
        {/* Personalized Welcome Message */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome Back, {userData.username}!</h2>
        
        {/* Authorization Status Card (CLEANED) */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Account Summary</h3>
          
          <div className="space-y-3 text-left">
            <p>
              <span className="font-medium text-gray-800">Authenticated User: </span> 
              <span className="font-bold text-indigo-700">{userData.username}</span> 
            </p>
            <p>
              <span className="font-medium text-gray-800">Session Status: </span> 
              <span className="text-green-600 font-bold">ACTIVE</span>
            </p>
            {/* RAW TOKEN DISPLAY IS REMOVED */}
          </div>
        </div>
        
        {/* Placeholder for other features */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard title="Mental Health Tracker" description="Log your daily moods and thoughts." color="blue" />
            <FeatureCard title="Goal Setting" description="Track your recovery goals and progress." color="green" />
            <FeatureCard title="Resource Library" description="Access articles and guided exercises." color="purple" />
        </div>
        
      </main>
    </div>
  );
}

const FeatureCard = ({ title, description, color }) => {
    let bgColor = `bg-${color}-100`;
    let borderColor = `border-${color}-500`;
    let textColor = `text-${color}-800`;

    return (
        <div className={`p-6 ${bgColor} rounded-xl shadow-md border-t-4 ${borderColor}`}>
            <h4 className={`text-lg font-bold mb-2 ${textColor}`}>{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
            <button className={`mt-4 text-sm font-medium ${textColor} hover:underline`}>
                Go to {title} &rarr;
            </button>
        </div>
    );
};

export default Dashboard;