import React, { useEffect, useState, useCallback } from 'react';
import { fetchProtected, fetchTrackerData, deleteEntry } from '../api'; 
import MoodLogForm from './MoodLogForm';
import TrackerHistory from './TrackerHistory';

function Dashboard({ token, onLogout }) {
  const [userData, setUserData] = useState(null);
  const [trackerData, setTrackerData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingTracker, setLoadingTracker] = useState(false);
  const [error, setError] = useState('');

  
  const loadTrackerData = useCallback(async () => {
    if (!token) return;
    setLoadingTracker(true);
    try {
        const data = await fetchTrackerData(token);
        setTrackerData(data);
    } catch (err) {
        console.error("Error fetching tracker data:", err);
    } finally {
        setLoadingTracker(false);
    }
}, [token]);

  const loadProtectedData = useCallback(async () => {
    if (!token) return;

    try {
      const user = await fetchProtected('/users/me', 'GET', token);
      setUserData(user);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError('Failed to load user data. Logging out.');
      onLogout();
    } finally {
      setLoadingUser(false);
    }

    await loadTrackerData();
  }, [token, onLogout, loadTrackerData]);

  useEffect(() => {
    loadProtectedData();
  }, [loadProtectedData]);


  const handleDeleteEntry = useCallback(async (entryId) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) {
        return;
    }

    setLoadingTracker(true);
    try {
        await deleteEntry(token, entryId);

        // Success: Immediately reload the tracker data to update the list
        await loadTrackerData();

    } catch (err) {
        console.error("Error deleting entry:", err);
        setError("Failed to delete entry.");
        setLoadingTracker(false);
    }
  }, [token, loadTrackerData]);



  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navigation Bar (Header) */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-semibold text-indigo-600">Mental Health App</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </header>

      {/* Main Content Area */}
      <main className="p-8 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Hello, {userData?.username || 'User'}!
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-1">
                <MoodLogForm
                    token={token}
                    onEntryAdded={loadTrackerData} 
                />
            </div>


            <div className="lg:col-span-2">
                <TrackerHistory
                    trackerData={trackerData}
                    loading={loadingTracker}
                    onDeleteEntry={handleDeleteEntry}
                />
            </div>

        </div>

      </main>
    </div>
  );
}


export default Dashboard;