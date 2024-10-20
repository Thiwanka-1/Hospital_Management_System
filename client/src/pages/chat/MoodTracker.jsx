import React from 'react';

const MoodTracker = ({ setMood, setStressLevel, setSleepQuality }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Daily Mood Tracker</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Mood (1-5):</label>
                <input
                    type="number"
                    min="1"
                    max="5"
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Stress Level (1-5):</label>
                <input
                    type="number"
                    min="1"
                    max="5"
                    onChange={(e) => setStressLevel(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Sleep Quality (1-5):</label>
                <input
                    type="number"
                    min="1"
                    max="5"
                    onChange={(e) => setSleepQuality(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
        </div>
    );
};

export default MoodTracker;
