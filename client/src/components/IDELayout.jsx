import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";

const IDELayout = () => {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [outputLogs, setOutputLogs] = useState("");
  const [status, setStatus] = useState("Run");
  const [showPopup, setShowPopup] = useState(false); // For project name popup
  const [projectName, setProjectName] = useState(""); // For project name

  const navigate = useNavigate();

  const runCode = async () => {
    setStatus("Loading...");
    console.log("Sending request to run code:", { language, code, input });
    try {
      const response = await fetch("http://localhost:3000/ide/runCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language, code, input }),
        credentials: "include", // Ensure cookies are sent with the request
      });
      const data = await response.json();
      setOutputLogs(data.output || "No output or error occurred.");
      setStatus("Run");
    } catch (error) {
      console.error("Execution error:", error);
      setOutputLogs("Execution error occurred.");
      setStatus("Run");
    }
  };
  

  const saveProject = async () => {
    if (!projectName) {
      alert("Please enter a project name.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/project/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName, code, language }),
        credentials: "include", // Ensure the user session or JWT token is sent
      });
  
      const data = await response.json();
  
      if (data.success) {
        navigate("/projects");
      } else {
        console.error("Error saving project:", data.message);
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };
  
  const handleSave = () => {
    setShowPopup(true);
  };

  const handlePopupSubmit = () => {
    if (projectName) {
      saveProject();
      setShowPopup(false); // Close popup after saving
    }
  };

  const handlePopupCancel = () => {
    setShowPopup(false); // Close popup without saving
  };

  const languages = [
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "cpp17", label: "C/C++" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      {/* Popup for Project Name */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Enter Project Name</h2>
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border border-gray-600 px-4 py-2 rounded w-full mb-4"
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={handlePopupSubmit}
              >
                Save Project
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handlePopupCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-gray-800 text-white py-4 mb-6 rounded-lg shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">EduCode IDE</h1>
          <div className="mt-4 flex justify-center items-center space-x-4">
            <select
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-600 bg-gray-700 text-white px-4 py-2 rounded w-48"
              value={language}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <button
              onClick={runCode}
              disabled={status !== "Run"}
              className={`${
                status === "Run"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-500 cursor-not-allowed"
              } text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105`}
            >
              {status}
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              Save Project
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className="w-2/3 pr-4">
          <div
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4"
            style={{ height: "720px" }}
          >
            <h3 className="text-lg text-gray-400 mb-2">Editor</h3>
            <MonacoEditor
              height="90%"
              defaultLanguage={language}
              value={code}
              theme="vs-dark"
              onChange={(newValue) => setCode(newValue)}
            />
          </div>
        </div>

        <div className="w-1/3 flex flex-col space-y-4" style={{ height: "600px" }}>
          <div
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4"
            style={{ height: "350px" }}
          >
            <h3 className="text-lg text-gray-400 mb-2">Input Parameters</h3>
            <MonacoEditor
              height="90%"
              defaultLanguage="text"
              value={input}
              theme="vs-dark"
              onChange={(newValue) => setInput(newValue)}
            />
          </div>

          <div
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4"
            style={{ height: "350px" }}
          >
            <h3 className="text-lg text-gray-400 mb-2">Output Logs</h3>
            <MonacoEditor
              height="90%"
              defaultLanguage="text"
              value={outputLogs}
              theme="vs-dark"
              options={{ readOnly: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDELayout;
