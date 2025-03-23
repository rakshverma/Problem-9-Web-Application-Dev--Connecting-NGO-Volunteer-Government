import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// ✅ Get Auth Token from Local Storage
const getAuthToken = () => localStorage.getItem("token");

// ✅ Axios Instance with Token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach Token to Requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const Search = () => {
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [projects, setProjects] = useState([]);
  const [nearbyProjects, setNearbyProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("all"); // ✅ Toggle between all/nearby projects
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Get User's Current Location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("❌ Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchNearbyProjects(latitude, longitude);
      },
      (error) => {
        setError("❌ Error fetching location. Please allow location access.");
        setLoading(false);
      }
    );
  };

  // ✅ Fetch All Projects
  const fetchAllProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      setError("❌ Failed to fetch all projects.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Nearby Projects Based on User's Location
  const fetchNearbyProjects = async (lat, lng) => {
    try {
      const { data } = await api.get(`/issues/nearby`, {
        params: { lat, lng, radius: 10 }, // Radius in KM
      });

      // ✅ Sort Projects by Distance
      const sortedProjects = data.sort((a, b) => a.distance - b.distance);
      setNearbyProjects(sortedProjects);
      setFilteredProjects(sortedProjects); // Set filtered list to all nearby projects initially
    } catch (error) {
      console.error("❌ Error fetching nearby projects:", error);
      setError("❌ Failed to fetch nearby projects.");
    }
  };

  // ✅ Filter Nearby Projects Based on Search Query
  const handleSearch = (query) => {
    setSearchQuery(query);

    const filtered = nearbyProjects.filter((project) =>
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProjects(filtered);
  };

  useEffect(() => {
    fetchAllProjects(); // ✅ Fetch all projects initially
    getUserLocation(); // ✅ Get user's location and nearby projects
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ✅ Header Section with Tabs */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Explore Projects</h1>
      </div>

      {/* ✅ Toggle Buttons for Views */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            view === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setView("all")}
        >
          All Projects
        </button>
        <button
          className={`px-4 py-2 rounded ${
            view === "nearby"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setView("nearby")}
        >
          Nearby Projects
        </button>
      </div>

      {/* ✅ Loading / Error Handling */}
      {loading && <p className="text-gray-500">📡 Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Display All or Nearby Projects Based on View */}
      {view === "all" && (
        <>
          {projects.length === 0 ? (
            <p className="text-gray-500">⚠️ No projects found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </>
      )}

      {view === "nearby" && (
        <>
          {/* ✅ Search Bar for Nearby Projects */}
          <div className="mb-4 flex items-center space-x-4">
            <input
              type="text"
              placeholder="🔍 Search nearby projects..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() =>
                fetchNearbyProjects(location.lat, location.lng)
              }
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
            >
              📍 Refresh Location
            </button>
          </div>

          {/* ✅ Show Nearby Projects Based on Search */}
          {filteredProjects.length === 0 ? (
            <p className="text-gray-500">⚠️ No matching nearby projects found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ✅ Project Card Component
const ProjectCard = ({ project }) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white hover:shadow-xl transition">
      <h3 className="text-lg font-bold">{project.title}</h3>
      <p className="text-sm text-gray-600">{project.description}</p>
      <p className="text-sm">
        <strong>Category:</strong> {project.category}
      </p>
      <p className="text-sm text-gray-500">
        <strong>Location:</strong> {project.location?.address || "N/A"}
      </p>
      {project.distance && (
        <p className="text-sm text-blue-500">
          <strong>Distance:</strong> {project.distance?.toFixed(2)} km
        </p>
      )}
      <button
        onClick={() => window.alert("🔎 Viewing Project: " + project.title)}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        View Details
      </button>
    </div>
  );
};

export default Search;
