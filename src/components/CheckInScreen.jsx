import React, { useEffect, useState, useCallback } from 'react';
import { fetchProtected } from '../api'; 
import MoodLogForm from './MoodLogForm';
import { SmilePlus, Laugh, Meh, Frown, Annoyed } from 'lucide-react'; 

const MOODS = [
    { rating: 5, icon: SmilePlus, label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' },
    { rating: 4, icon: Laugh, label: 'Happy', color: 'text-lime-600', bg: 'bg-lime-100' },
    { rating: 3, icon: Meh, label: 'Calm', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { rating: 2, icon: Frown, label: 'Anxious', color: 'text-orange-600', bg: 'bg-orange-100' },
    { rating: 1, icon: Annoyed, label: 'Overwhelmed', color: 'text-red-600', bg: 'bg-red-100' },
];

function Dashboard({ token, onLogout}) {
    
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState('');
    const [selectedMood, setSelectedMood] = useState(MOODS[2]); 
    
    const loadTrackerData = useCallback(async () => {
    }, []); 

    const loadProtectedData = useCallback(async () => {
        if (!token) return;

        try {
            await fetchProtected('/users/me', 'GET', token); 
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError('Failed to validate session. Logging out.');
            onLogout();
        } finally {
            setLoadingUser(false);
        }
    }, [token, onLogout]);

    useEffect(() => {
        loadProtectedData();
    }, [loadProtectedData]);


    if (loadingUser) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-xl font-medium text-gray-600">Loading Check-in Screen...</div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className="min-h-screen"> 
            
            <main className="p-4 sm:p-6 max-w-lg mx-auto">
                
                <h2 className="text-3xl font-extrabold text-gray-800 mt-4 mb-6">
                    How are you feeling today?
                </h2>

                <div className="bg-white p-6 rounded-3xl shadow-xl space-y-6">
                    <h3 className="text-xl font-semibold text-gray-700">Select Your Current Mood</h3>
                    
                    <div className="flex justify-around space-x-2 p-2 rounded-full border border-gray-100">
                        {MOODS.map((mood) => {
                            const IconComponent = mood.icon; 
                            return (
                                <button
                                    key={mood.rating}
                                    onClick={() => setSelectedMood(mood)}
                                    className={`p-3 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform 
                                        ${selectedMood.rating === mood.rating 
                                            ? `scale-110 shadow-lg ring-4 ring-offset-2 ring-indigo-400 ${mood.bg}` 
                                            : 'scale-90 hover:scale-100 hover:shadow-md'
                                        }`}
                                    style={{ minWidth: '60px' }}
                                >
                                    <IconComponent size={32} strokeWidth={1.5} className={mood.color} /> 
                                    <span className={`text-xs font-medium mt-1 ${mood.color}`}>
                                        {mood.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                    <MoodLogForm 
                        token={token} 
                        onEntryAdded={loadTrackerData} 
                        moodRating={selectedMood.rating}
                        customClass="bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-inner"
                    />
                </div>
            </main>
        </div>
    );
}

export default Dashboard;