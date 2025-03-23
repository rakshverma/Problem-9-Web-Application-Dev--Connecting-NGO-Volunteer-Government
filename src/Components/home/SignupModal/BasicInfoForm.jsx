// components/SignupModal/BasicInfoForm.jsx
import React from 'react';
import FormField from './FormField';

function BasicInfoForm({ userType, formData, handleInputChange, handleNextStep, handlePrevStep }) {
  // Common fields that appear in all types
  const commonFields = (
    <>
      <FormField
        id="userId"
        label={userType === 'volunteer' ? 'User ID' : userType === 'ngo' ? 'Organization ID' : 'Government Agency ID'}
        type="text"
        value={formData.userId}
        onChange={handleInputChange}
        placeholder={`Enter ${userType === 'volunteer' ? 'your' : 'your organization\'s'} ID`}
        required
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Create a password"
        required
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder={`Enter ${userType === 'volunteer' ? 'your' : 'organization'} email`}
        required
      />
    </>
  );

  // User type specific fields
  const typeSpecificFields = () => {
    switch (userType) {
      case 'volunteer':
        return (
          <FormField
            id="fullName"
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        );
      case 'ngo':
        return (
          <FormField
            id="organizationName"
            label="Organization Name"
            type="text"
            value={formData.organizationName}
            onChange={handleInputChange}
            placeholder="Enter organization name"
            required
          />
        );
      case 'government':
        return (
          <>
            <FormField
              id="agencyName"
              label="Government Agency Name"
              type="text"
              value={formData.agencyName}
              onChange={handleInputChange}
              placeholder="Enter government agency name"
              required
            />
            <FormField
              id="department"
              label="Department"
              type="text"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Enter department name"
              required
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {userType === 'volunteer'
            ? 'Volunteer Basic Information'
            : userType === 'ngo'
              ? 'Organization Basic Information'
              : 'Government Agency Basic Information'}
        </h2>
        <p className="text-gray-600">
          {userType === 'volunteer'
            ? 'Tell us about yourself'
            : 'Tell us about your organization'}
        </p>
      </div>
      <form onSubmit={handleNextStep}>
        {commonFields}
        {typeSpecificFields()}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-6 py-3 border border-blue-500 text-blue-500 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            Next
          </button>
        </div>
      </form>
    </>
  );
}

export default BasicInfoForm;