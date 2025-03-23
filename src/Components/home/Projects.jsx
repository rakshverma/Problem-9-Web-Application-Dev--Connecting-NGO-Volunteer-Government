// components/Projects.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch recent projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/projects/recent");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="py-20">
      <div className="w-full max-w-7xl mx-auto px-5">
        {/* ✅ Header displaying project count */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Featured Projects</h2>
          <span className="text-gray-500">{projects.length} Projects Available</span>
        </div>

        {loading ? (
          <p className="text-center text-lg text-gray-500">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-2.5 hover:shadow-lg"
                key={project._id}
              >
                <div className="h-48 bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center text-gray-400">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "Project Image Placeholder"
                  )}
                </div>
                <div className="p-6">
                  <span className="inline-block bg-blue-50 text-blue-500 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{project.title}</h3>
                  <p className="mb-5 text-gray-600">{project.description}</p>
                  <div className="flex justify-between text-gray-500 text-sm mt-5">
                    <span>{project.volunteers?.length || 0} Volunteers</span>
                    <span>
                      {project.organization?.username || "Unknown Organization"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
