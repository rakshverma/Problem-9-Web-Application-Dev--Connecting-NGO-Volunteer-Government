// components/Features.js
import React from 'react';

function Features() {
    return (
        <section className="py-20 bg-white rounded-lg shadow mx-5 mb-16">
            <div className="w-full max-w-7xl mx-auto px-5">
                <div className="text-center mb-12">
                    <h2 className="text-4xl text-gray-800 mb-4 relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:rounded">How It Works</h2>
                    <p className="text-xl text-gray-600 max-w-xl mx-auto">Our platform makes it easy to connect, collaborate and create impact</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="bg-white p-10 rounded-lg text-center transition-all duration-300 border border-gray-100 hover:-translate-y-2.5 hover:shadow-lg hover:border-gray-300">
                        <div className="text-5xl mb-5 inline-block bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">👥</div>
                        <h3 className="text-2xl mb-4 text-gray-800">Connect</h3>
                        <p className="text-gray-600">Find like-minded individuals, NGOs, and government bodies working on issues you care about.</p>
                    </div>
                    <div className="bg-white p-10 rounded-lg text-center transition-all duration-300 border border-gray-100 hover:-translate-y-2.5 hover:shadow-lg hover:border-gray-300">
                        <div className="text-5xl mb-5 inline-block bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">🤝</div>
                        <h3 className="text-2xl mb-4 text-gray-800">Collaborate</h3>
                        <p className="text-gray-600">Work together on projects, share resources, and combine expertise to maximize impact.</p>
                    </div>
                    <div className="bg-white p-10 rounded-lg text-center transition-all duration-300 border border-gray-100 hover:-translate-y-2.5 hover:shadow-lg hover:border-gray-300">
                        <div className="text-5xl mb-5 inline-block bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">🌟</div>
                        <h3 className="text-2xl mb-4 text-gray-800">Create Impact</h3>
                        <p className="text-gray-600">Track progress, measure outcomes, and celebrate the positive changes you bring to communities.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Features;