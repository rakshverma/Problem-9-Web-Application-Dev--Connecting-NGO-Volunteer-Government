import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const getAuthToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [projectFormData, setProjectFormData] = useState({
    title: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    volunteersNeeded: 1,
    skills: [],
    events: []
  });
  const [newComment, setNewComment] = useState("");
  const [commentProjectId, setCommentProjectId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    duration: 1
  });
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedProjectComments, setSelectedProjectComments] = useState(null);

  const navigate = useNavigate();

  const fetchIssues = async () => {
    try {
      const { data } = await api.get("/issues");
      const unconvertedIssues = data.filter(
        (issue) => issue.status !== "in-progress"
      );
      setIssues(unconvertedIssues);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/user/profile");
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const showCreateProjectForm = (issue) => {
    setSelectedIssue(issue);
    setProjectFormData({
      title: issue.title,
      description: issue.description,
      category: issue.category,
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      volunteersNeeded: 1,
      skills: [],
      events: []
    });
    setShowProjectForm(true);
  };

  const handleProjectFormChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData({
      ...projectFormData,
      [name]: value
    });
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setProjectFormData({
      ...projectFormData,
      skills
    });
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      alert("Event title and date are required!");
      return;
    }
    
    setProjectFormData({
      ...projectFormData,
      events: [...projectFormData.events, newEvent]
    });
    
    setNewEvent({
      title: "",
      description: "",
      date: "",
      location: "",
      duration: 1
    });
  };

  const removeEvent = (index) => {
    const updatedEvents = [...projectFormData.events];
    updatedEvents.splice(index, 1);
    setProjectFormData({
      ...projectFormData,
      events: updatedEvents
    });
  };

  const createProject = async (e) => {
    e.preventDefault();
    
    if (!projectFormData.title || !projectFormData.description || !projectFormData.startDate) {
      alert("Please fill in all required fields!");
      return;
    }
    
    try {
      const { data } = await api.post(`/projects/create/${selectedIssue._id}`, projectFormData);
      alert("Project created successfully!");
      setShowProjectForm(false);
      fetchIssues();
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Check console for details.");
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }
    
    try {
      await api.delete(`/projects/${projectId}`);
      alert("Project deleted successfully!");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    }
  };

  const closeProject = async (projectId) => {
    try {
      await api.put(`/projects/close/${projectId}`);
      alert("Project closed successfully!");
      fetchProjects();
    } catch (error) {
      console.error("Error closing project:", error);
      alert("Failed to close project.");
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const addComment = async (projectId) => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }
    
    try {
      await api.post(`/projects/${projectId}/comment`, { text: newComment });
      setNewComment("");
      setCommentProjectId(null);
      fetchProjects();
      
      if (selectedProjectComments && selectedProjectComments._id === projectId) {
        const updatedProject = projects.find(p => p._id === projectId);
        if (updatedProject) {
          setSelectedProjectComments({
            ...updatedProject,
            comments: [...updatedProject.comments, { 
              text: newComment, 
              userId: { username: profile.username },
              createdAt: new Date().toISOString()
            }]
          });
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment.");
    }
  };
  
  const openCommentsModal = (project) => {
    setSelectedProjectComments(project);
    setShowCommentsModal(true);
  };

  useEffect(() => {
    fetchIssues();
    fetchProjects();
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">👤 NGO Profile</h2>
          <div className="text-gray-700 space-y-2">
            <p>
              <strong>Name:</strong> {profile.username || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {profile.email || "N/A"}
            </p>
            {profile.extra_fields && profile.extra_fields.map((field, index) => (
              <p key={index}>
                <strong>{field.key}:</strong> {field.value || "N/A"}
              </p>
            ))}
          </div>
        </div>

        {showProjectForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              📝 Create Project from Issue
            </h2>
            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={projectFormData.title}
                  onChange={handleProjectFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={projectFormData.description}
                  onChange={handleProjectFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={projectFormData.category}
                  onChange={handleProjectFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Safety">Safety</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={projectFormData.startDate}
                    onChange={handleProjectFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
                  <input
                    type="date"
                    name="endDate"
                    value={projectFormData.endDate}
                    onChange={handleProjectFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Volunteers Needed</label>
                <input
                  type="number"
                  name="volunteersNeeded"
                  value={projectFormData.volunteersNeeded}
                  onChange={handleProjectFormChange}
                  min="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills Required (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={projectFormData.skills.join(', ')}
                  onChange={handleSkillsChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g. teaching, gardening, construction"
                />
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-medium text-green-700 mb-2">📅 Project Events</h3>
                
                {projectFormData.events.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <h4 className="font-medium">Added Events:</h4>
                    {projectFormData.events.map((event, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString()} - {event.location}
                          </p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeEvent(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium mb-2">Add New Event</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        name="title"
                        value={newEvent.title}
                        onChange={handleEventChange}
                        placeholder="Event Title"
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        name="date"
                        value={newEvent.date}
                        onChange={handleEventChange}
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="location"
                        value={newEvent.location}
                        onChange={handleEventChange}
                        placeholder="Event Location"
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        name="duration"
                        value={newEvent.duration}
                        onChange={handleEventChange}
                        placeholder="Duration (hours)"
                        min="0.5"
                        step="0.5"
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <textarea
                        name="description"
                        value={newEvent.description}
                        onChange={handleEventChange}
                        placeholder="Event Description"
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        rows="2"
                      ></textarea>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addEvent}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Event
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProjectForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        )}

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
                  <p className="text-sm text-gray-700">
                    <strong>Location:</strong> {issue.location?.address || "N/A"}
                  </p>
                  <button
                    onClick={() => showCreateProjectForm(issue)}
                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
                  >
                    ➕ Create Project
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
                  className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-transform"
                >
                  <h3 className="text-lg font-bold">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <strong>Category:</strong> {project.category}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Location:</strong> {project.location?.address || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Start Date:</strong>{" "}
                      {new Date(project.startDate).toLocaleDateString()}
                    </p>
                    {project.endDate && (
                      <p className="text-sm text-gray-500">
                        <strong>End Date:</strong>{" "}
                        {new Date(project.endDate).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      <strong>Volunteers Needed:</strong> {project.volunteersNeeded || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Status:</strong>{" "}
                      <span className={`font-medium ${
                        project.status === "active" ? "text-green-600" : 
                        project.status === "completed" ? "text-blue-600" : 
                        project.status === "cancelled" ? "text-red-600" : "text-yellow-600"
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </p>
                  </div>

                  {project.events && project.events.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-bold text-green-700">📅 Events:</h4>
                      <div className="space-y-2 mt-1">
                        {project.events.map((event, idx) => (
                          <div key={idx} className="text-sm bg-gray-50 p-2 rounded-md">
                            <p className="font-medium">{event.title}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(event.date).toLocaleDateString()} • {event.duration} hrs
                              {event.location && ` • ${event.location}`}
                            </p>
                            {event.description && <p className="text-xs mt-1">{event.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center">
                    <h4 className="font-bold text-green-700 mr-2">💬 Comments:</h4>
                    <button 
                      onClick={() => openCommentsModal(project)}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {project.comments ? project.comments.length : 0}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => closeProject(project._id)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded shadow-md text-sm"
                    >
                      ✓ Complete
                    </button>
                    <button
                      onClick={() => deleteProject(project._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded shadow-md text-sm"
                    >
                      ❌ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comments Modal */}
      {showCommentsModal && selectedProjectComments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-green-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-green-800">
                Comments for: {selectedProjectComments.title}
              </h3>
              <button 
                onClick={() => setShowCommentsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-grow">
              {selectedProjectComments.comments && selectedProjectComments.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                <div className="space-y-4">
                  {selectedProjectComments.comments && selectedProjectComments.comments.map((comment, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg shadow-sm border-l-4 border-green-400">
                      <div className="flex items-start">
                        <div className="bg-green-100 rounded-full p-2 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {comment.userId?.username || "Anonymous"}
                          </p>
                          <p className="text-gray-600 mt-1">{comment.text}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="flex-grow">
                  <textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Write your comment here..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500 outline-none transition"
                    rows="3"
                  ></textarea>
                </div>
                <button
                  onClick={() => addComment(selectedProjectComments._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition"
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-200 text-center py-4 mt-8">
        <p className="text-gray-600">
          © {new Date().getFullYear()} NGO Connect | All Rights Reserved 🌱
        </p>
      </footer>
    </div>
  );
};

export default NGODashboard;
