import React, { useState } from 'react';
import { createEntry } from '../api';

const MoodOptions = [
    { rating: 5, label: "Excellent", color: "green", emoji: "😊" },
    { rating: 4, label: "Good", color: "blue", emoji: "🙂" },
    { rating: 3, label: "Neutral", color: "yellow", emoji: "😐" },
    { rating: 2, label: "Stressed", color: "orange", emoji: "😟" },
    { rating: 1, label: "Poor", color: "red", emoji: "😥" },
];

function MoodLogForm({ token, onEntryAdded }) {
    const [moodRating, setMoodRating] = useState(5);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const entryData = {
            mood_rating: moodRating,
            notes: notes || null, // FastAPI expects null if empty
        };

        try {
            await createEntry(entryData, token);
            setMessage("Mood successfully logged!");
            setNotes('');
            // Notify parent component (Dashboard) to refresh data
            if (onEntryAdded) {
                onEntryAdded(); 
            }
        } catch (err) {
            setError(err.message || "Failed to submit entry.");
        } finally {
            setLoading(false);
        }
    };

    const selectedMood = MoodOptions.find(m => m.rating === moodRating);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-600">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Daily Check-in</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Mood Rating Selector */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                        How are you feeling right now?
                    </label>
                    <div className="flex justify-between space-x-2">
                        {MoodOptions.map((mood) => (
                            <button
                                key={mood.rating}
                                type="button"
                                onClick={() => setMoodRating(mood.rating)}
                                className={`
                                    flex flex-col items-center p-3 rounded-xl transition duration-150 ease-in-out w-1/5
                                    ${mood.rating === moodRating 
                                        ? `bg-${mood.color}-500 text-white shadow-lg scale-105` 
                                        : `bg-gray-100 text-gray-600 hover:bg-gray-200`
                                    }
                                `}
                            >
                                <span className="text-3xl mb-1">{mood.emoji}</span>
                                <span className="text-sm font-semibold">{mood.label}</span>
                            </button>
                        ))}
                    </div>
                    {/* Display current selection */}
                    <p className={`mt-3 text-center text-${selectedMood?.color}-600 font-bold`}>
                        Selected: {selectedMood?.emoji} {selectedMood?.label} ({moodRating}/5)
                    </p>
                </div>

                {/* Notes Textarea */}
                <div>
                    <label htmlFor="notes" className="block text-lg font-medium text-gray-700 mb-2">
                        What's on your mind? (Optional)
                    </label>
                    <textarea
                        id="notes"
                        rows="3"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        placeholder="e.g., Had a good conversation today, feeling a bit tired."
                    ></textarea>
                </div>
                
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Log Check-in'}
                </button>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
            </form>
        </div>
    );
}

export default MoodLogForm;