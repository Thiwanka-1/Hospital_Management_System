import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const AddMessage = () => {
    const [formData, setFormData] = useState({ userName: "", message: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Initialize navigate

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/support", formData);
            const messageId = response.data.newMessage._id; // Get the ID of the new message
            setFormData({ userName: "", message: "" });
            alert("Message created successfully!");

            // Redirect to the reply page for the created message
            navigate(`/conversation/${messageId}`); // Adjust the path based on your routing setup
        } catch (error) {
            console.error("Error:", error);
            setError("Failed to create message.");
        }
    };

    return (
        <div>
            {error && <p className="text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="p-2 border rounded w-full"
                    required
                />
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message..."
                    className="p-2 border rounded w-full"
                    required
                />
                <button type="submit" className="p-2 bg-blue-600 text-white rounded">Submit</button>
            </form>
        </div>
    );
};

export default AddMessage;
