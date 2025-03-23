import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function LoginModal({ closeLoginModal, switchToSignup }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/login', formData);
            
            if (response.data.token) {
                // Store token in localStorage
                localStorage.setItem('token', response.data.token);
                
                // Decode token to get user ID and role
                const decoded = jwtDecode(response.data.token);
                const userId = decoded.id;
                const userRole = decoded.role;
                
                // Close modal
                closeLoginModal();
                
                // Redirect based on user role with user ID in the URL
                switch(userRole) {
                    case 'volunteer':
                        navigate(`/volunteer/${userId}/dashboard`);
                        break;
                    case 'ngo':
                        navigate(`/ngo/${userId}/dashboard`);
                        break;
                    case 'government':
                        navigate(`/government/${userId}/dashboard`);
                        break;
                    default:
                        navigate('/dashboard');
                }
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target.className.includes('modal-backdrop')) {
            closeLoginModal();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm modal-backdrop" onClick={handleBackdropClick}>
            <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
                <span className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-800 cursor-pointer transition-colors" onClick={closeLoginModal}>&times;</span>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Log In</h2>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 font-medium text-gray-800">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg text-base transition-all focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none"
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 font-medium text-gray-800">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg text-base transition-all focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none"
                        />
                    </div>

                    <div className="mt-7 flex justify-end">
                        <button 
                            type="submit" 
                            className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:-translate-y-1 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                    </div>
                </form>
                
                <div className="mt-6 text-center text-gray-600">
                    <p className="mb-2">Don't have an account? <button onClick={switchToSignup} className="text-blue-500 font-medium hover:underline">Sign Up</button></p>
                    <p><a href="/forgot-password" className="text-blue-500 font-medium hover:underline">Forgot password?</a></p>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
