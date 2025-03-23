import React, { useState } from "react";
import axios from "axios";

function SignupModal({ closeSignupModal }) {
  const [userType, setUserType] = useState(""); // Role selection
  const [formData, setFormData] = useState({
    // Common fields
    userId: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",

    // Volunteer specific
    age: "",
    gender: "",
    skills: "",
    availability: "",

    // NGO specific
    organizationName: "",
    orgWebsite: "",
    
    // Government specific
    agencyName: "",
    department: "",
    
    // Location for NGO/Government
    location: "",
    lat: "",
    lon: ""
  });

  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔄 Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Clear error for this field if it exists
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null
      });
    }
  };

  // 🌍 Handle location input change
  const handleLocationChange = (e) => {
    const query = e.target.value;
    setLocationQuery(query);

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
    )
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching locations:", err);
        setIsLoading(false);
      });
  };

  // 📌 Select location from suggestions
  const handleSelectLocation = (location) => {
    setFormData({
      ...formData,
      location: location.display_name,
      lat: location.lat,
      lon: location.lon
    });
    setLocationQuery(location.display_name);
    setSuggestions([]);
    
    // Clear location-related errors
    setErrors({
      ...errors,
      location: null
    });
  };

  // Validate form based on user type
  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.userId.trim()) newErrors.userId = "User ID is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    
    // Role-specific validations
    if (userType === "volunteer") {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.age.trim()) newErrors.age = "Age is required";
      if (!formData.gender.trim()) newErrors.gender = "Gender is required";
      if (!formData.skills.trim()) newErrors.skills = "Skills are required";
      if (!formData.availability.trim()) newErrors.availability = "Availability is required";
    } 
    else if (userType === "ngo") {
      if (!formData.organizationName.trim()) newErrors.organizationName = "Organization name is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";
    } 
    else if (userType === "government") {
      if (!formData.agencyName.trim()) newErrors.agencyName = "Agency name is required";
      if (!formData.department.trim()) newErrors.department = "Department is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Prepare data for backend
    const userData = {
      username: formData.userId.toLowerCase(),
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: userType,
      extra_fields: []
    };

    // Add extra fields based on role
    if (userType === "volunteer") {
      userData.extra_fields = [
        { key: "fullName", value: formData.fullName },
        { key: "age", value: formData.age },
        { key: "gender", value: formData.gender },
        { key: "skills", value: formData.skills },
        { key: "availability", value: formData.availability }
      ];
    } else if (userType === "ngo") {
      userData.extra_fields = [
        { key: "organizationName", value: formData.organizationName },
        { key: "location", value: formData.location },
        { key: "latitude", value: formData.lat },
        { key: "longitude", value: formData.lon },
        { key: "website", value: formData.orgWebsite }
      ];
    } else if (userType === "government") {
      userData.extra_fields = [
        { key: "agencyName", value: formData.agencyName },
        { key: "department", value: formData.department },
        { key: "location", value: formData.location },
        { key: "latitude", value: formData.lat },
        { key: "longitude", value: formData.lon }
      ];
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", userData);
      if (response.status === 201) {
        console.log("✅ Registration successful!");
        localStorage.setItem("token", response.data.token);
        closeSignupModal();
        window.location.href = "/dashboard";
      } else {
        console.error("❌ Registration failed:", response.data.message);
        alert(response.data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("⚠️ Error submitting form:", error.response?.data || error.message);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error occurred while signing up. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Your Account</h2>

        {/* 🌟 Select User Type */}
        {!userType && (
          <div className="text-center mb-6">
            <p className="mb-3 text-gray-600">Select your role to continue:</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setUserType("volunteer")}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Volunteer
              </button>
              <button
                onClick={() => setUserType("ngo")}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                NGO
              </button>
              <button
                onClick={() => setUserType("government")}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Government
              </button>
            </div>
          </div>
        )}

        {/* 📝 Signup Form */}
        {userType && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">User ID</label>
              <input
                type="text"
                id="userId"
                value={formData.userId}
                onChange={handleInputChange}
                placeholder="Enter User ID"
                className={`w-full p-3 border ${errors.userId ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
              />
              {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Volunteer Specific Fields */}
            {userType === "volunteer" && (
              <>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full p-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Age</label>
                  <input
                    type="number"
                    id="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter your age"
                    className={`w-full p-3 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  />
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Gender</label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Skills</label>
                  <textarea
                    id="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="List your skills (e.g., first aid, cooking, driving)"
                    className={`w-full p-3 border ${errors.skills ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                    rows="3"
                  ></textarea>
                  {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Availability</label>
                  <select
                    id="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${errors.availability ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  >
                    <option value="">Select availability</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="evenings">Evenings only</option>
                    <option value="fulltime">Full-time</option>
                    <option value="on-call">On-call/Emergency basis</option>
                  </select>
                  {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
                </div>
              </>
            )}

            {/* NGO Specific Fields */}
            {userType === "ngo" && (
              <>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Organization Name</label>
                  <input
                    type="text"
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    placeholder="Enter organization name"
                    className={`w-full p-3 border ${errors.organizationName ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  />
                  {errors.organizationName && <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Website (Optional)</label>
                  <input
                    type="url"
                    id="orgWebsite"
                    value={formData.orgWebsite}
                    onChange={handleInputChange}
                    placeholder="https://yourorganization.org"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Location</label>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={handleLocationChange}
                    placeholder="Start typing to search location..."
                    className={`w-full p-3 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  {isLoading && <p className="text-gray-500">Loading...</p>}
                  {suggestions.length > 0 && (
                    <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto mt-1">
                      {suggestions.map((location) => (
                        <div
                          key={location.place_id}
                          onClick={() => handleSelectLocation(location)}
                          className="p-2 hover:bg-blue-50 cursor-pointer"
                        >
                          {location.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                  {formData.lat && formData.lon && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Location coordinates captured
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Government Specific Fields */}
            {userType === "government" && (
              <>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Agency Name</label>
                  <input
                    type="text"
                    id="agencyName"
                    value={formData.agencyName}
                    onChange={handleInputChange}
                    placeholder="Enter government agency name"
                    className={`w-full p-3 border ${errors.agencyName ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  />
                  {errors.agencyName && <p className="text-red-500 text-sm mt-1">{errors.agencyName}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Department</label>
                  <input
                    type="text"
                    id="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Enter department name"
                    className={`w-full p-3 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  />
                  {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Location</label>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={handleLocationChange}
                    placeholder="Start typing to search location..."
                    className={`w-full p-3 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  {isLoading && <p className="text-gray-500">Loading...</p>}
                  {suggestions.length > 0 && (
                    <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto mt-1">
                      {suggestions.map((location) => (
                        <div
                          key={location.place_id}
                          onClick={() => handleSelectLocation(location)}
                          className="p-2 hover:bg-blue-50 cursor-pointer"
                        >
                          {location.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                  {formData.lat && formData.lon && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Location coordinates captured
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Form Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={closeSignupModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <div className="flex space-x-3">
                {userType && (
                  <button
                    type="button"
                    onClick={() => setUserType("")}
                    className="px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                  >
                    Back
                  </button>
                )}
                
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-green-600"
                >
                  Create Account
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignupModal;
