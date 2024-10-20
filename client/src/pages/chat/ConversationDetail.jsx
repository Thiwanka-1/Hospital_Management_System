import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ConversationDetail = () => {
    const { id } = useParams(); // Get message ID from URL
    const [conversation, setConversation] = useState(null);
    const [newReply, setNewReply] = useState("");
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(""); // Error state
    const [autoRefresh, setAutoRefresh] = useState(true); // Control auto-refresh

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const res = await axios.get(`/api/support/${id}`);
                setConversation(res.data);
            } catch (error) {
                console.error("Failed to fetch conversation:", error);
                setError("Failed to load conversation. Please try again.");
            } finally {
                setLoading(false); // Set loading to false once done
            }
        };
        fetchConversation();

        // Set up auto-refresh interval
        const intervalId = setInterval(() => {
            if (autoRefresh) {
                fetchConversation();
            }
        }, 5000); // Fetch conversation every 5 seconds

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [id, autoRefresh]);

    const handleAddReply = async () => {
        if (!newReply.trim()) return; // Prevent empty replies
        const reply = {
            sender: "support", // Change this based on your logic
            message: newReply
        };

        // Optimistic UI update
        setConversation((prev) => ({
            ...prev,
            replies: [...prev.replies, { ...reply, userName: "Support" }] // Add reply locally
        }));

        try {
            await axios.post(`/api/support/${id}/reply`, reply);
            setNewReply(""); // Clear the input field
        } catch (error) {
            console.error("Failed to add reply:", error);
            setError("Failed to add reply. Please try again."); // Show error message
            // Optionally revert the optimistic update if needed
            setConversation((prev) => ({
                ...prev,
                replies: prev.replies.slice(0, -1) // Remove the last added reply on failure
            }));
        }
    };

    // Function to show notification
    const showNotification = (message) => {
        if (Notification.permission === "granted") {
            new Notification("New Reply", {
                body: message,
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification("New Reply", {
                        body: message,
                    });
                }
            });
        }
    };

    useEffect(() => {
        // Check for new replies periodically
        const checkForNewReplies = async () => {
            if (autoRefresh) {
                try {
                    const res = await axios.get(`/api/support/${id}`);
                    const updatedConversation = res.data;

                    // Compare the length of replies to detect new ones
                    if (updatedConversation.replies.length > conversation.replies.length) {
                        showNotification("A new reply has arrived!");
                    }
                    setConversation(updatedConversation);
                } catch (error) {
                    console.error("Failed to check for new replies:", error);
                }
            }
        };

        // Set up interval for checking new replies
        const checkIntervalId = setInterval(checkForNewReplies, 5000); // Check every 5 seconds

        return () => clearInterval(checkIntervalId);
    }, [id, conversation, autoRefresh]);

    if (loading) {
        return <p>Loading conversation...</p>; // Loading message
    }

    if (error) {
        return <p className="text-red-600">{error}</p>; // Error message
    }

    return (
        <div className="p-4">
            {conversation ? (
                <>
                    <h2 className="text-2xl font-bold mb-4">Conversation with {conversation.userName}</h2>
                    <div className="space-y-4">
                        <div className={`p-3 rounded-lg bg-gray-100`}>
                            <p><strong>User:</strong> {conversation.message}</p>
                        </div>
                        {conversation.replies.length > 0 ? (
                            conversation.replies.map((reply, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg ${reply.sender === "user" ? "bg-blue-100" : "bg-green-100"}`}
                                >
                                    <p><strong>{reply.sender === "user" ? reply.userName : "Support"}:</strong> {reply.message}</p>
                                </div>
                            ))
                        ) : (
                            <p>No replies yet.</p> // Message when no replies are present
                        )}
                    </div>
                    <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full p-3 border rounded-lg mt-4"
                    />
                    <button onClick={handleAddReply} className="w-full p-3 mt-2 bg-blue-600 text-white rounded-lg">
                        Send Reply
                    </button>

                    {/* Option to toggle auto-refresh */}
                    <div className="mt-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="mr-2"
                            />
                            Auto-refresh conversation
                        </label>
                    </div>
                </>
            ) : (
                <p>No conversation found.</p>
            )}
        </div>
    );
};

export default ConversationDetail;
