// src/components/TrackerHistory.jsx

import React from 'react';
import { format } from 'date-fns'; 

// 1. Accept the onDeleteEntry prop
function TrackerHistory({ trackerData, loading, onDeleteEntry }) { 
    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading history...</div>;
    }
    
    // Check if trackerData or the crucial nested properties are missing
    // Assuming the data structure is { entries: [...], summary: {...} }
    if (!trackerData || !trackerData.entries || !trackerData.summary) {
        return <div className="p-6 text-center text-gray-500">No tracker data available.</div>;
    }

    const { entries, summary } = trackerData;

    const getMoodColor = (rating) => {
        if (rating >= 4) return 'bg-green-100 text-green-800 border-green-400';
        if (rating === 3) return 'bg-yellow-100 text-yellow-800 border-yellow-400';
        return 'bg-red-100 text-red-800 border-red-400';
    };

    return (
        <div className="space-y-8">
            {/* Summary Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Progress Summary</h3>
                <div className="flex justify-around text-center">
                    <div>
                        <p className="text-4xl font-extrabold text-indigo-600">
                            {summary.average_mood.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">Average Mood (1-5)</p>
                    </div>
                    <div>
                        <p className="text-4xl font-extrabold text-indigo-600">
                            {summary.total_entries}
                        </p>
                        <p className="text-sm text-gray-500">Total Check-ins</p>
                    </div>
                </div>
            </div>

            {/* History List */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Recent History</h3>
                {entries.length === 0 ? (
                    <p className="text-gray-500">Start logging your first entry!</p>
                ) : (
                    <div className="space-y-4">
                        {entries.map((entry) => (
                            <div 
                                key={entry.id} 
                                // Use flex and items-start to position the delete button
                                className={`p-4 rounded-lg border flex justify-between items-start ${getMoodColor(entry.mood_rating)}`}
                            >
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-1 pr-4">
                                        <span className="font-bold text-lg">
                                            Mood Rating: {entry.mood_rating}/5
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {format(new Date(entry.timestamp), 'MMM dd, yyyy h:mm a')}
                                        </span>
                                    </div>
                                    {entry.notes && (
                                        <p className="text-sm italic mt-1">
                                            Notes: {entry.notes}
                                        </p>
                                    )}
                                </div>
                                
                                {/* 2. The Delete Button */}
                                <button
                                    onClick={() => onDeleteEntry(entry.id)} 
                                    className="ml-4 flex-shrink-0 bg-white text-red-600 hover:bg-red-50 border border-red-300 text-xs font-semibold py-1 px-2 rounded transition duration-150"
                                    title="Delete Entry"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrackerHistory;