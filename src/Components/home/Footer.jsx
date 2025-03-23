// components/Footer.js
import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white pt-16 pb-5 mt-20 relative">
            <div className="absolute top-[-50px] left-0 right-0 h-[50px] bg-gray-800 clip-path-polygon"></div>
            <div className="w-full max-w-7xl mx-auto px-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
                    <div>
                        <h3 className="text-lg mb-5 relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-[-8px] after:w-10 after:h-[3px] after:bg-yellow-500">Connect4Change</h3>
                        <ul className="list-none">
                            <li className="mb-2.5">
                                <a href="/about" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">About Us</a>
                            </li>
                            <li className="mb-2.5">
                                <a href="/mission" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Our Mission</a>
                            </li>
                            <li className="mb-2.5">
                                <a href="/stories" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Impact Stories</a>
                            </li>
                            <li className="mb-2.5">
                                <a href="/contact" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Contact Us</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg mb-5 relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-[-8px] after:w-10 after:h-[3px] after:bg-yellow-500">For Volunteers</h3>
                        <ul className="list-none">
                            <li className="mb-2.5">
                                <a href="/projects" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Find Projects</a>
                            </li>
                            <li className="mb-2.5">
                                <a href="/hours" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Track Hours</a>
                            </li>
                            <li className="mb-2.5">
                                <a href="/skills" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Skills Development</a>
                            </li>
                            <li className="mb-2.5">
                                <a href="/resources/volunteers" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Volunteer Resources</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg mb-5 relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-[-8px] after:w-10 after:h-[3px] after:bg-yellow-500">For Organizations</h3>
                        <ul className="list-none">
                            <li className="mb-2.5">
                                <a href="/post-project" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Post Projects</a>
                            </li>
                            <li className="mb-2.5">
                                <a href="/find-volunteers" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Find Volunteers</a>
                            </li>
                            <li className="mb-2.5">
                                <a href="/success-stories" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Success Stories</a>
                            </li>
                            <li className="mb-2.5">
                                <a href="/resources/organizations" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Organization Resources</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg mb-5 relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-[-8px] after:w-10 after:h-[3px] after:bg-yellow-500">Resources</h3>
                        <ul className="list-none">
                            <li className="mb-2.5">
                                <a href="/blog" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Blog</a>
                            </li>
                            <li className="mb-2.5">
                                <a href="/guides" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Guides & Tutorials</a>
                            </li>
                            <li className="mb-2.5">
                                <a href="/faq" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">FAQ</a>
                            </li>
                            <li className="mb-2.5">
                                <a href="/terms" className="text-gray-300 no-underline transition-all duration-300 hover:text-white hover:pl-1">Terms & Privacy</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="text-center pt-5 border-t border-gray-700 text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Connect4Change. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;