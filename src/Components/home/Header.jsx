import React from 'react';

function Header({ openLoginModal, openSignupModal }) {
    return (
        <header className="bg-white shadow-md sticky top-0 z-100">
            <div className="w-full max-w-7xl mx-auto px-5">
                <div className="flex justify-between items-center py-4">
                    <a href="/" className="text-2xl font-bold text-blue-500 no-underline flex items-center">
                        <span className="mr-2 text-3xl text-blue-500">⟳</span> Connect4Change
                    </a>
                    <nav>
                        <ul className="flex list-none">
                            <li className="mr-5">
                                <a href="/" className="no-underline text-gray-800 font-medium transition-colors duration-300 hover:text-blue-500">Home</a>
                            </li>
                            <li className="mr-5">
                                <a href="/projects" className="no-underline text-gray-800 font-medium transition-colors duration-300 hover:text-blue-500">Projects</a>
                            </li>
                            <li className="mr-5">
                                <a href="/organizations" className="no-underline text-gray-800 font-medium transition-colors duration-300 hover:text-blue-500">Organizations</a>
                            </li>
                            <li className="mr-5">
                                <a href="/how-it-works" className="no-underline text-gray-800 font-medium transition-colors duration-300 hover:text-blue-500">How It Works</a>
                            </li>
                            <li className="mr-5">
                                <a href="/about" className="no-underline text-gray-800 font-medium transition-colors duration-300 hover:text-blue-500">About Us</a>
                            </li>
                        </ul>
                    </nav>
                    <div className="flex gap-3">
                        <button 
                            className="bg-transparent text-blue-500 border-none px-5 py-2.5 rounded-full font-semibold cursor-pointer transition-all duration-300 hover:bg-blue-50"
                            onClick={openLoginModal}
                        >
                            Log In
                        </button>
                        <button 
                            className="bg-blue-500 text-white border-none px-5 py-2.5 rounded-full font-semibold cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                            onClick={openSignupModal}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;