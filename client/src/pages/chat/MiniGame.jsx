import React, { useState, useEffect } from 'react';

const MiniGame = () => {
    const [score, setScore] = useState(0);
    const [position, setPosition] = useState({ top: '50%', left: '50%' });

    // Function to move the object to a new random position
    const moveObject = () => {
        const randomTop = `${Math.floor(Math.random() * 80)}%`;
        const randomLeft = `${Math.floor(Math.random() * 80)}%`;
        setPosition({ top: randomTop, left: randomLeft });
    };

    const handleClick = () => {
        setScore(score + 1);
        moveObject();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 relative h-64">
            <h2 className="text-xl font-bold mb-4">Mini Game</h2>
            <p className="text-gray-700 mb-4">Score: {score}</p>
            <div
                onClick={handleClick}
                className="w-10 h-10 bg-blue-500 rounded-full absolute cursor-pointer"
                style={{ top: position.top, left: position.left }}
            >
            </div>
        </div>
    );
};

export default MiniGame;
