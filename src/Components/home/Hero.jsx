// components/Hero.js
import React from 'react';

function Hero({ openSignupModal }) {
    return (
        <section className="py-20 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-bl-[100px] mb-16 relative overflow-hidden">
            {/* Background pattern div - add this line */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/images/dots-pattern.svg')" }}></div>
            
            <div className="w-full max-w-7xl mx-auto px-5">
                <div className="max-w-xl relative z-10">
                    <h1 className="text-5xl font-extrabold mb-5 leading-tight">Collaborate for Community Change</h1>
                    <p className="text-xl mb-8 opacity-90">Connect volunteers, NGOs, and government bodies to solve local issues together. Join our platform to make a real difference in your community.</p>
                    <div className="flex gap-4 flex-col sm:flex-row">
                        <button 
                            className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-none py-3 px-6 rounded-full font-semibold cursor-pointer transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg"
                            onClick={openSignupModal}
                        >
                            Get Started
                        </button>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;