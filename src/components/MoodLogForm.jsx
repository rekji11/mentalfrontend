import React, { useState } from 'react';
import { createEntry } from '../api';


function MoodLogForm({ token, onEntryAdded, moodRating, customClass }) {
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const ratingToSend = moodRating; 

        if (!ratingToSend) {
            setLoading(false);
            return setError("Mood rating is missing. Please select a mood in the main screen.");
        }
        
        const entryData = {
            mood_rating: ratingToSend,
            notes: notes || null, 
        };

        try {
            await createEntry(entryData, token);
            setMessage("Reflection logged successfully!");
            setNotes('');
            if (onEntryAdded) {
                onEntryAdded(); 
            }
        } catch (err) {
            console.error("Error creating entry:", err);
            setError(err.message || "Failed to submit entry.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={customClass || "bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-600"}> 
            <h3 className="text-xl font-bold mb-4 text-gray-800">Your Reflection</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Want to share more? (Optional)
                    </label>
                    <textarea
                        id="notes"
                        rows="3"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        placeholder="Want to share more?" 
                    ></textarea>
                </div>
                
                {message && (
                    <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition duration-200 text-lg shadow-lg disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Log Check-in'}
                </button>
            </form>
        </div>
    );
}

export default MoodLogForm;