import React, { useEffect, useState } from "react";
import axios from "axios";

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

const GovernmentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch User Profile
  const fetchUserData = async () => {
    try {
      const { data } = await api.get("/user/profile");
      setUserData(data);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  // ✅ Fetch All Issues
  const fetchIssues = async () => {
    try {
      const { data } = await api.get("/issues");
      setIssues(data);
    } catch (error) {
      console.error("❌ Error fetching issues:", error);
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

  // ✅ Load Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      await fetchIssues();
      await fetchProjects();
      setLoading(false);
    };
    fetchData();
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // ✅ Get Agency Details from extra_fields
  const agencyName =
    userData?.extra_fields?.find((field) => field.key === "agencyName")
      ?.value || "Government Agency";
  const department =
    userData?.extra_fields?.find((field) => field.key === "department")
      ?.value || "Department";

  // ✅ Get Projects Working on an Issue
  const getProjectsForIssue = (issueId) =>
    projects.filter((project) => project.relatedIssue === issueId);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Government Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* ✅ Agency Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Welcome, {agencyName} - {department}
        </h2>
        <p className="text-gray-600">
          This is your government agency dashboard where you can monitor
          community issues, track projects by NGOs, and allocate resources.
        </p>
      </div>

      {/* ✅ Issues and Projects Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* ✅ Active Issues Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-600">
            Reported Issues
          </h3>
          {issues.length === 0 ? (
            <p className="text-gray-500">No issues reported.</p>
          ) : (
            issues.map((issue) => (
              <div
                key={issue._id}
                className="p-4 border-b last:border-0 hover:bg-gray-100 rounded-md"
              >
                <h4 className="text-md font-bold">{issue.title}</h4>
                <p className="text-sm text-gray-600">{issue.description}</p>
                <p className="text-sm">
                  <strong>Category:</strong> {issue.category}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong> {issue.status}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Location:</strong> {issue.location?.address || "N/A"}
                </p>

                {/* ✅ List Projects Related to This Issue */}
                <div className="mt-4 space-y-2">
                  <h5 className="text-sm font-semibold">
                    Projects Working on This Issue:
                  </h5>
                  {getProjectsForIssue(issue._id).length === 0 ? (
                    <p className="text-xs text-gray-500">
                      No projects created yet.
                    </p>
                  ) : (
                    getProjectsForIssue(issue._id).map((project) => (
                      <div
                        key={project._id}
                        className="text-xs bg-gray-100 p-2 rounded"
                      >
                        <strong>{project.title}</strong>: {project.status}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ Ongoing Projects Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            Ongoing Projects
          </h3>
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects created yet.</p>
          ) : (
            projects.map((project) => (
              <div
                key={project._id}
                className="p-4 border-b last:border-0 hover:bg-gray-100 rounded-md"
              >
                <h4 className="text-md font-bold">{project.title}</h4>
                <p className="text-sm text-gray-600">{project.description}</p>
                <p className="text-sm">
                  <strong>Category:</strong> {project.category}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong> {project.status}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Location:</strong>{" "}
                  {project.location?.address || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Created At:</strong>{" "}
                  {new Date(project.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
