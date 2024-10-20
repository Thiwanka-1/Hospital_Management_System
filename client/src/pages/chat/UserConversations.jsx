import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserConversations = () => {
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchMessages = async () => {
            if (!userId) return;
            const response = await axios.get(`/api/support/user/${userId}`);
            setMessages(response.data);
        };
        fetchMessages();
    }, [userId]);

    const viewConversation = (id) => {
        navigate(`/conversation/${id}`);
    };

    return (
        <div>
            {messages.map((msg) => (
                <div key={msg._id}>
                    <p>{msg.message}</p>
                    <button onClick={() => viewConversation(msg._id)}>View</button>
                </div>
            ))}
        </div>
    );
};

export default UserConversations;
