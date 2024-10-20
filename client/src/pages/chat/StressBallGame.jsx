// MindfulBreathingGame.jsx
import React, { useState, useEffect } from 'react';

const MindfulBreathingGame = () => {
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathCount, setBreathCount] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let timer;
        if (isBreathing) {
            setMessage('Inhale...'); // Show inhale message
            timer = setTimeout(() => {
                setMessage('Hold...'); // Show hold message
                setTimeout(() => {
                    setMessage('Exhale...'); // Show exhale message
                    setTimeout(() => {
                        setBreathCount((prev) => prev + 1); // Increment breath count
                        setMessage(''); // Clear message after breathing cycle
                    }, 4000); // Duration of exhale
                }, 4000); // Duration of hold
            }, 4000); // Duration of inhale
        }

        return () => clearTimeout(timer); // Cleanup on component unmount
    }, [isBreathing]);

    const handleStartBreathing = () => {
        setBreathCount(0); // Reset count
        setIsBreathing(true); // Start breathing exercise
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Mindful Breathing Exercise</h2>
            <button
                onClick={handleStartBreathing}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Start Breathing Exercise
            </button>
            {isBreathing && (
                <div className="mt-4">
                    <p className="font-bold">{message}</p>
                </div>
            )}
            {breathCount > 0 && (
                <p className="mt-4 text-gray-700">
                    You've completed {breathCount} breathing cycles!
                </p>
            )}
        </div>
    );
};

export default MindfulBreathingGame;
