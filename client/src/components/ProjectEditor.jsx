import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";

const ProjectEditor = () => {
  const { id } = useParams();  // Get project ID from URL
  const navigate = useNavigate();

  // Initialize with an empty string to avoid uncontrolled to controlled warnings
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [outputLogs, setOutputLogs] = useState("");
  const [status, setStatus] = useState("Run");

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/project/projects/${id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include credentials such as cookies or token
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch project: " + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          const { name, code, language } = data;
          setProjectName(name || "");
          setCode(code || "");
          setLanguage(language || "java");
        })
        .catch(error => console.error("Error fetching project:", error));
    }
  }, [id]);
  

  const runCode = async () => {
    setStatus("Loading...");
    try {
      const response = await fetch("http://localhost:3000/ide/runCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language, code, input }),
      });
      const data = await response.json();
      setOutputLogs(data.output || "No output or error occurred.");
      setStatus("Run");
    } catch (error) {
      setOutputLogs("Execution error occurred.");
      setStatus("Run");
    }
  };

  const saveProject = async () => {
    if (!projectName) {
      alert("Project name is required.");
      return;
    }
  
    const projectData = {
      name: projectName,
      code,
      language,
    };
  
    try {
      const response = await fetch(`http://localhost:3000/project/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials (cookies or token)
        body: JSON.stringify(projectData),
      });
  
      if (response.ok) {
        navigate("/projects");
      } else {
        const errorData = await response.json();
        console.error("Error updating project:", errorData.message);
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };
  

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <header className="bg-gray-800 text-white py-4 mb-6 rounded-lg shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <div className="mt-4 flex justify-center items-center space-x-4">
            <input
              type="text"
              placeholder="Project Name"
              className="border border-gray-600 bg-gray-700 text-white px-4 py-2 rounded w-48"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <select
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-600 bg-gray-700 text-white px-4 py-2 rounded w-48"
              value={language}
            >
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="cpp17">C/C++</option>
            </select>
            <button
              onClick={runCode}
              disabled={status !== "Run"}
              className={`text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
                status === "Run"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              {status}
            </button>
            <button
              onClick={saveProject}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className="w-2/3 pr-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4" style={{ height: '720px' }}>
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

        <div className="w-1/3 flex flex-col space-y-4" style={{ height: '600px' }}>
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4" style={{ height: '350px' }}>
            <h3 className="text-lg text-gray-400 mb-2">Input Parameters</h3>
            <MonacoEditor
              height="90%"
              defaultLanguage="text"
              value={input}
              theme="vs-dark"
              onChange={(newValue) => setInput(newValue)}
            />
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4" style={{ height: '350px' }}>
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

export default ProjectEditor;