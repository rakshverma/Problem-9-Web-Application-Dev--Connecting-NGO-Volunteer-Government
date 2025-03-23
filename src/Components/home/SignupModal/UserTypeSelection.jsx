import React from 'react';

function UserTypeSelection({ handleUserTypeSelect, switchToLogin }) {
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign Up</h2>
        <p className="text-gray-600">Select your role to get started</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div
          className="bg-white border border-gray-200 rounded-xl p-6 text-center cursor-pointer transition-all hover:border-blue-500 hover:-translate-y-1 hover:shadow-lg"
          onClick={() => handleUserTypeSelect('volunteer')}
        >
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Volunteer</h3>
          <p className="text-sm text-gray-600">I want to contribute my time and skills to community projects</p>
        </div>
        <div
          className="bg-white border border-gray-200 rounded-xl p-6 text-center cursor-pointer transition-all hover:border-blue-500 hover:-translate-y-1 hover:shadow-lg"
          onClick={() => handleUserTypeSelect('ngo')}
        >
          <div className="text-4xl mb-4">🏢</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">NGO/Non-profit</h3>
          <p className="text-sm text-gray-600">I represent an organization looking for volunteers and resources</p>
        </div>
        <div
          className="bg-white border border-gray-200 rounded-xl p-6 text-center cursor-pointer transition-all hover:border-blue-500 hover:-translate-y-1 hover:shadow-lg"
          onClick={() => handleUserTypeSelect('government')}
        >
          <div className="text-4xl mb-4">🏛️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Government Agency</h3>
          <p className="text-sm text-gray-600">I represent a government body collaborating on community initiatives</p>
        </div>
      </div>
      <div className="text-center text-gray-600">
        <p>Already have an account? <button onClick={switchToLogin} className="text-blue-500 font-medium hover:underline">Log In</button></p>
      </div>
    </>
  );
}

export default UserTypeSelection;