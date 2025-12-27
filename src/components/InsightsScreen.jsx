import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react'; 

const MOOD_MAP = {
    5: { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' },
    4: { label: 'Happy', color: 'text-lime-600', bg: 'bg-lime-100' },
    3: { label: 'Calm', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    2: { label: 'Anxious', color: 'text-orange-600', bg: 'bg-orange-100' },
    1: { label: 'Overwhelmed', color: 'text-red-600', bg: 'bg-red-100' },
};

function InsightsScreen({ trackerData, loading, onDeleteEntry }) {
    const entries = trackerData?.entries || [];
    const entryCount = entries.length;
    const totalMood = entries.reduce((sum, entry) => sum + entry.mood_rating, 0);
    const averageMood = entryCount > 0 ? (totalMood / entryCount).toFixed(2) : 'N/A';
    const getAverageMoodDescription = (avg) => {
        if (avg >= 4.5) return "You've been feeling great recently!";
        if (avg >= 3.5) return "Your mood has been generally happy and stable.";
        if (avg >= 2.5) return "You're holding steady, but there's room for improvement.";
        if (avg > 0) return "Recent mood suggests you may need extra self-care.";
        return "Log your first check-in to see your trends!";
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading your mood history...
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Your Insights & History</h2>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Mood Summary</h3>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-4xl font-bold text-indigo-600">{averageMood}</p>
                        <p className="text-sm text-gray-500">Average Mood Score ({entryCount} entries)</p>
                    </div>
                </div>
                <p className={`text-base font-medium ${averageMood > 3 ? 'text-green-700' : 'text-orange-700'}`}>
                    {getAverageMoodDescription(averageMood)}
                </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mb-4">Detailed History</h3>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                {entryCount === 0 ? (
                    <p className="p-6 text-center text-gray-500">No entries logged yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {entries.map((entry) => {
                            const mood = MOOD_MAP[entry.mood_rating] || MOOD_MAP[3]; // Default to calm if rating is odd
                            
                            return (
                                <li key={entry.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center space-x-3 mb-1">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${mood.color} ${mood.bg}`}>
                                                {mood.label} ({entry.mood_rating})
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {entry.reflection || 'No reflection provided.'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onDeleteEntry(entry.id)}
                                        className="text-red-400 hover:text-red-600 p-2 ml-4 rounded-full hover:bg-red-50 transition-colors"
                                        aria-label="Delete entry"
                                        title="Delete Entry"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default InsightsScreen;