import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 🚀 Import useNavigate

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

const VolunteerDashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Environment",
    image: "",
    location: {
      coordinates: [0, 0],
      address: "",
    },
  });

  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const navigate = useNavigate(); // 🚀 Initialize navigation

  // ✅ Fetch All Issues
  const fetchIssues = async () => {
    try {
      const { data } = await api.get("/issues");
      setIssues(data);
    } catch (error) {
      console.error("❌ Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load Issues on Mount
  useEffect(() => {
    fetchIssues();
  }, []);

  // ✅ Fetch Location Suggestions Dynamically
  const fetchLocationSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setFetchingLocation(true);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );

      setSuggestions(response.data);
    } catch (error) {
      console.error("❌ Error fetching location:", error);
    } finally {
      setFetchingLocation(false);
    }
  };

  // ✅ Handle Location Input Change
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationQuery(value);
    fetchLocationSuggestions(value);
  };

  // ✅ Handle Location Selection
  const handleSelectLocation = (location) => {
    setFormData({
      ...formData,
      location: {
        coordinates: [parseFloat(location.lon), parseFloat(location.lat)],
        address: location.display_name,
      },
    });
    setLocationQuery(location.display_name);
    setSuggestions([]);
  };

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Validate Form Before Submission
  const validateForm = () => {
    const wordCount = formData.description.trim().split(/\s+/).length;
    if (wordCount < 10) {
      alert("❌ Description must contain at least 10 words.");
      return false;
    }
    return true;
  };

  // ✅ Handle Create Issue
  const handleCreateIssue = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      image: formData.image,
      location: {
        coordinates: formData.location.coordinates,
        address: formData.location.address,
      },
    };

    try {
      console.log("📡 Sending Payload:", JSON.stringify(payload, null, 2));
      const { data } = await api.post("/issues", payload);
      alert("✅ Issue Created Successfully");

      // Reset Form
      setFormData({
        title: "",
        description: "",
        category: "Environment",
        image: "",
        location: {
          coordinates: [0, 0],
          address: "",
        },
      });
      setLocationQuery(""); // Clear location query
      fetchIssues(); // Refresh Issues after creation
    } catch (error) {
      console.error(
        "❌ Error creating issue:",
        error.response?.data || error.message
      );
      alert("❌ Failed to create issue. Check console for details.");
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert("✅ Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ✅ Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-700">🚀 Volunteer Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </div>

      {/* ✅ Create Issue Form */}
      <div className="create-issue-form p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-700">📢 Report New Issue</h2>
        <form onSubmit={handleCreateIssue} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description (at least 10 words)"
            required
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
          >
            <option>Environment</option>
            <option>Education</option>
            <option>Health</option>
            <option>Infrastructure</option>
            <option>Safety</option>
            <option>Other</option>
          </select>

          {/* ✅ Location Input with Suggestions */}
          <div>
            <label className="block mb-2 font-medium">📍 Location</label>
            <input
              type="text"
              value={locationQuery}
              onChange={handleLocationChange}
              placeholder="Start typing to search location..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            />
            {fetchingLocation && (
              <p className="text-gray-500 text-sm mt-1">Fetching location...</p>
            )}
            {suggestions.length > 0 && (
              <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto mt-1 bg-white shadow-md">
                {suggestions.map((location) => (
                  <div
                    key={location.place_id}
                    onClick={() => handleSelectLocation(location)}
                    className="p-3 hover:bg-blue-100 cursor-pointer transition-all"
                  >
                    {location.display_name}
                  </div>
                ))}
              </div>
            )}
            {formData.location.coordinates[0] !== 0 &&
              formData.location.coordinates[1] !== 0 && (
                <p className="text-sm text-green-600 mt-1">
                  ✅ Location coordinates captured
                </p>
              )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all"
          >
            🚀 Submit Issue
          </button>
        </form>
      </div>

      {/* ✅ Issue List */}
      <div className="issue-list space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">📚 Reported Issues</h2>
        {loading ? (
          <p className="text-gray-500">Loading issues...</p>
        ) : issues.length === 0 ? (
          <p className="text-gray-500">No issues found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {issues.map((issue) => (
              <div
                key={issue._id}
                className="p-5 border border-gray-200 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <h3 className="text-lg font-bold text-blue-700">{issue.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{issue.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>📂 Category:</strong> {issue.category}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>📍 Location:</strong> {issue.location?.address || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>👤 Posted by:</strong> {issue.userId?.username || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
