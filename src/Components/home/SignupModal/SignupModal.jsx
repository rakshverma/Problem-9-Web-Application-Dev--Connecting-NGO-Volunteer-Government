// components/SignupModal.jsx
import React, { useState } from "react";
import UserTypeSelection from "./SignupModal/UserTypeSelection";
import BasicInfoForm from "./SignupModal/BasicInfoForm";
import AdditionalInfoForm from "./SignupModal/AdditionalInfoForm";

function SignupModal({ closeSignupModal, switchToLogin }) {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    // Common fields
    userId: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",

    // Volunteer-specific fields
    age: "",
    gender: "",
    skills: [],
    availability: "",
    interests: "",

    // NGO-specific fields
    organizationName: "",
    location: "",
    orgDescription: "",
    orgWebsite: "",
    ngoPhone: "",

    // Government-specific fields
    agencyName: "",
    department: "",
    contactPerson: "",
    officialEmail: "",
    officePhone: "",
    agencyWebsite: "",
    jurisdiction: "",
    serviceArea: "",
  });

  // Handle Input Change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Handle User Type Selection
  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep(2); // Proceed to Basic Info Form after type selection
  };

  // Handle Modal Backdrop Click to Close
  const handleBackdropClick = (e) => {
    if (e.target.className.includes("modal-backdrop")) {
      closeSignupModal();
    }
  };

  // Handle Next Step
  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  // Handle Previous Step
  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare user data based on selected role
    const userData = {
      username: formData.userId.toLowerCase(), // Use userId as username
      email: formData.email,
      password: formData.password, // In production, secure password appropriately
      phone: formData.phone || formData.ngoPhone || formData.officePhone || "",
      role: userType, // Correctly send the selected role
      extra_fields: {},
    };

    // Map role-specific extra_fields
    if (userType === "volunteer") {
      userData.extra_fields = {
        age: formData.age,
        gender: formData.gender,
        skills: formData.skills,
        availability: formData.availability,
        interests: formData.interests,
      };
    } else if (userType === "ngo") {
      userData.extra_fields = {
        organization_name: formData.organizationName,
        location: formData.location,
        description: formData.orgDescription,
        website: formData.orgWebsite,
      };
    } else if (userType === "government") {
      userData.extra_fields = {
        agency_name: formData.agencyName,
        department: formData.department,
        jurisdiction: formData.jurisdiction,
        service_area: formData.serviceArea,
        website: formData.agencyWebsite,
      };
    }

    // API Call to Backend
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("✅ Registration successful!");
        closeSignupModal();
      } else {
        const errorData = await response.json();
        console.error("❌ Registration failed:", errorData);
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto shadow-xl relative">
        {/* Close Button */}
        <span
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-800 cursor-pointer transition-colors"
          onClick={closeSignupModal}
        >
          &times;
        </span>

        {/* Step 1 - Select User Type */}
        {step === 1 && (
          <UserTypeSelection
            handleUserTypeSelect={handleUserTypeSelect}
            switchToLogin={switchToLogin}
          />
        )}

        {/* Step 2 - Basic Info Form */}
        {step === 2 && (
          <BasicInfoForm
            userType={userType}
            formData={formData}
            handleInputChange={handleInputChange}
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
          />
        )}

        {/* Step 3 - Additional Info Form */}
        {step === 3 && (
          <AdditionalInfoForm
            userType={userType}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handlePrevStep={handlePrevStep}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default SignupModal;
