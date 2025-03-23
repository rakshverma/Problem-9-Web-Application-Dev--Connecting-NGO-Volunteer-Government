import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ API Base URL
const API_URL = "http://localhost:5000/api";

// ✅ Get Auth Token from Local Storage
const getAuthToken = () => localStorage.getItem("token");

// ✅ Axios instance with token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const NGODashboard = () => {
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Fetch Issues that are not converted to projects
  const fetchIssues = async () => {
    try {
      const { data } = await api.get("/issues");
      const unconvertedIssues = data.filter(
        (issue) => issue.status !== "in-progress"
      );
      setIssues(unconvertedIssues);
    } catch (error) {
      console.error("❌ Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch All Projects
  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
    }
  };

  // ✅ Convert Issue to Project
  const createProjectFromIssue = async (issueId) => {
    try {
      const { data } = await api.post(`/projects/create/${issueId}`);
      alert("✅ Project created successfully!");
      fetchIssues();
      fetchProjects();
    } catch (error) {
      console.error("❌ Error creating project:", error);
      alert("❌ Failed to create project. Check console for details.");
    }
  };

  // ✅ Load Data on Mount
  useEffect(() => {
    fetchIssues();
    fetchProjects();
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert("✅ Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 shadow-md text-white flex justify-between items-center">
        <h1 className="text-3xl font-extrabold">🌱 NGO Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-semibold rounded-full shadow-md transition-transform transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      <div className="container mx-auto p-6 space-y-8">
        {/* ✅ Issues List */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            🔥 Pending Issues for Project Creation
          </h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-500"></div>
            </div>
          ) : issues.length === 0 ? (
            <p className="text-gray-500">No issues found.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {issues.map((issue) => (
                <div
                  key={issue._id}
                  className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg hover:scale-105 transition-transform"
                >
                  <h3 className="text-lg font-bold">{issue.title}</h3>
                  <p className="text-sm text-gray-600">{issue.description}</p>
                  <p className="text-sm text-gray-700">
                    <strong>Category:</strong> {issue.category}
                  </p>
                  <button
                    onClick={() => createProjectFromIssue(issue._id)}
                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
                  >
                    ➕ Create Project
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Projects List */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            🚀 All Created Projects
          </h2>
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects created yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg hover:scale-105 transition-transform"
                >
                  <h3 className="text-lg font-bold">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <p className="text-sm">
                    <strong>Category:</strong> {project.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Location:</strong> {project.location?.address || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Created At:</strong>{" "}
                    {new Date(project.createdAt).toLocaleString()}
                  </p>

                  {/* ✅ Comments Section */}
                  <div className="mt-4 space-y-2">
                    <h4 className="font-bold text-green-700">💬 Comments:</h4>
                    {project.comments.length === 0 ? (
                      <p className="text-sm text-gray-500">No comments yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {project.comments.map((comment) => (
                          <div
                            key={comment._id}
                            className="text-sm bg-gray-100 p-2 rounded-md shadow-sm border-l-4 border-green-400"
                          >
                            <strong>
                              {comment.userId?.username || "Anonymous"}
                            </strong>
                            : {comment.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Footer */}
      <footer className="bg-gray-200 text-center py-4 mt-8">
        <p className="text-gray-600">
          © {new Date().getFullYear()} NGO Connect | All Rights Reserved 🌱
        </p>
      </footer>
    </div>
  );
};

export default NGODashboard;
