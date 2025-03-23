// components/Projects.js
import React from 'react';

function Projects() {
    const projects = [
        {
            id: 1,
            category: 'Environment',
            title: 'Community Garden Restoration',
            description: 'Revitalizing abandoned spaces into thriving community gardens to improve food security.',
            volunteers: 12,
            organizations: 2
        },
        {
            id: 2,
            category: 'Education',
            title: 'Digital Literacy for Seniors',
            description: 'Teaching essential digital skills to elderly community members to bridge the digital divide.',
            volunteers: 15,
            organizations: 1
        },
        {
            id: 3,
            category: 'Health',
            title: 'Mental Health Awareness Campaign',
            description: 'Raising awareness and reducing stigma around mental health issues in local communities.',
            volunteers: 20,
            organizations: 3
        }
    ];

    return (
        <section className="py-20">
            <div className="w-full max-w-7xl mx-auto px-5">
                <div className="text-center mb-12">
                    <h2 className="text-4xl text-gray-800 mb-4 relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:rounded">Featured Projects</h2>
                    <p className="text-xl text-gray-600 max-w-xl mx-auto">Join these initiatives making a difference in communities</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => (
                        <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-2.5 hover:shadow-lg" key={project.id}>
                            <div className="h-48 bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center text-gray-400">
                                Project Image Placeholder
                            </div>
                            <div className="p-6">
                                <span className="inline-block bg-blue-50 text-blue-500 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                                    {project.category}
                                </span>
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">{project.title}</h3>
                                <p className="mb-5 text-gray-600">{project.description}</p>
                                <div className="flex justify-between text-gray-500 text-sm mt-5">
                                    <span>{project.volunteers} Volunteers</span>
                                    <span>{project.organizations} Organization{project.organizations !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Projects;