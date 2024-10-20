import React, { useState } from 'react';
import MoodTracker from './MoodTracker';
import MiniGame from './MiniGame';
import StressBallGame from './StressBallGame'; 

const Dashboard = () => {
    const [mood, setMood] = useState('');
    const [stressLevel, setStressLevel] = useState('');
    const [sleepQuality, setSleepQuality] = useState('');
    const [mentalWellness, setMentalWellness] = useState(null);

    const calculateWellness = () => {
        // Simplistic calculation for demonstration
        const score = (Number(mood) + Number(stressLevel) + Number(sleepQuality)) / 3;
        setMentalWellness(score);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold">Mental Health Dashboard</h1>
                <p className="text-gray-600">Track your mood, assess your mental wellness, and play a mini-game to relax.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mood Tracker */}
                <MoodTracker setMood={setMood} setStressLevel={setStressLevel} setSleepQuality={setSleepQuality} />

                {/* Wellness Calculator */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Mental Wellness Calculator</h2>
                    <button
                        onClick={calculateWellness}
                        className="px-4 py-2 bg-blue-600 text-white rounded w-full"
                    >
                        Calculate Wellness Score
                    </button>
                    {/* Add the image below the button */}
                    
                    {mentalWellness && (
                        <div className="mt-4">
                            <p className="text-gray-700">Your Mental Wellness Score: <span className="font-bold">{mentalWellness.toFixed(2)}</span></p>
                            <p className="text-gray-600">
                                {mentalWellness > 3 ? "Your mental wellness is good!" : "Consider some relaxing activities."}
                            </p>
                        </div>
                    )}
                    {/* Add the image below the button */}
                    <div className="mt-3">
    <img
        src="https://i.pinimg.com/564x/7e/9d/ec/7e9dec3e26d3d0ade352d77abab2415b.jpg"
        alt="Wellness"
        className="w-1/2 max-w-sm h-auto mx-auto rounded-lg shadow-md mt-4"
    />
</div>
                </div>

                {/* Mini-Game */}
                <MiniGame />

                 {/* New Stress Ball Mini-Game */}
                 <StressBallGame /> {/* Integrate the new mini-game */}

                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="text-red-500 text-3xl mr-4">
                        <i className="fas fa-heartbeat"></i>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-600"> Import of mental health</p>
                        <p className="text-gray-600">Mental health is essential for overall well-being and quality of life. It affects how we think, feel, and behave, influencing our ability to handle stress, build relationships, and make decisions. Good mental health allows individuals to cope with daily challenges, work productively, and enjoy life. On the other hand, poor mental health can lead to difficulties in everyday activities, physical health problems, and strained relationships. Taking care of mental health is as important as taking care of physical health, and it involves seeking support when needed, maintaining a balanced lifestyle, and practicing self-care.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
