import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SupportMessages = () => {
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await axios.get("/api/support");
            setMessages(response.data);
        };
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        await axios.delete(`/api/support/${id}`);
        setMessages(messages.filter((msg) => msg._id !== id));
    };

    const handleReply = (id) => {
        navigate(`/conversation/${id}`);
    };

    return (
        <div>
            {messages.map((msg) => (
                <div key={msg._id} className="p-4 bg-gray-100 mb-4 rounded">
                    <p><strong>{msg.userName}</strong></p>
                    <p>{msg.message}</p>
                    <div className="flex space-x-2">
                        <button onClick={() => handleReply(msg._id)} className="p-1 bg-green-600 text-white rounded">Reply</button>
                        <button onClick={() => handleDelete(msg._id)} className="p-1 bg-red-600 text-white rounded">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SupportMessages;
