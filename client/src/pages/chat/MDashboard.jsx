import React, { useState } from 'react';

const Dashboard = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [exerciseType, setExerciseType] = useState('');
    const [heartRate, setHeartRate] = useState(); // Example heart rate value
    const [steps, setSteps] = useState(); // Example steps value
    const targetSteps = 10000; // Target steps for the day

    // Function to calculate BMI and suggest exercises
    const calculateBmiAndExercise = () => {
        if (weight && height) {
            const heightInMeters = height / 100; // Convert height to meters
            const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
            setBmi(calculatedBmi);

            // Suggest exercise based on BMI
            if (calculatedBmi < 18.5) {
                setExerciseType('Strength Training');
            } else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) {
                setExerciseType('Balanced Exercise (Cardio & Strength)');
            } else if (calculatedBmi >= 25 && calculatedBmi <= 29.9) {
                setExerciseType('Cardio Exercises');
            } else {
                setExerciseType('Low-Impact Exercise (Walking, Swimming)');
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Physiotherapy <span className="text-blue-500">Dashboard</span>
                        </h1>
                        <p className="text-gray-600">It looks like you have not completed your exercise today.</p>
                        
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Heart Rate */}
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="text-red-500 text-3xl mr-4">
                        <i className="fas fa-heartbeat"></i>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-600">{heartRate} Protect Your Heart</p>
                        <p className="text-gray-600">A normal heart rate is the number of times your heart beats per minute. For adults, a typical resting heart rate ranges from 60 to 100 beats per minute. Factors like age, activity level, emotions, and overall health can affect heart rate. Regular exercise usually leads to a lower resting heart rate, indicating good cardiovascular fitness.</p>
                    </div>
                </div>

                {/* Steps */}
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
                    <div className="text-yellow-500 text-3xl mr-4">
                        <i className="fas fa-shoe-prints"></i>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-yellow-600">{steps} steps</p>
                        <p className="text-gray-600">
                        Exercise is important for maintaining overall health and well-being. It helps strengthen the heart, improve circulation, and reduce the risk of chronic diseases like diabetes, hypertension, and heart disease. Regular physical activity boosts energy levels, improves mood, and can help manage weight. Exercise also strengthens muscles and bones, enhances flexibility and balance, and supports mental health by reducing stress, anxiety, and depression.
                        </p>
                    </div>
                </div>

                {/* Input Form for BMI Calculation */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Enter Your Details</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700">Weight (kg):</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter your weight"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Height (cm):</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter your height"
                        />
                    </div>
                    <button
                        onClick={calculateBmiAndExercise}
                        className="px-4 py-2 bg-blue-600 text-white rounded w-full"
                    >
                        Calculate
                    </button>
                </div>

                {/* Display Results for BMI and Suggested Exercise */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {bmi && (
                        <div>
                            <h2 className="text-xl font-bold mb-2">BMI Results</h2>
                            <p className="text-gray-700">Your BMI: <span className="font-bold">{bmi}</span></p>
                            <p className="text-gray-700">Suggested Exercise: <span className="font-bold">{exerciseType}</span></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
