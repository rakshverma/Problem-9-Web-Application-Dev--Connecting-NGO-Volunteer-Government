import React, { useState, useEffect } from "react";

function LocationSearch({ value, onChange }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(value || "");
  
  // Handle input change
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    
    // Update the parent form with the current input
    if (!inputValue) {
      onChange("");
    }
  };
  
  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Direct fetch using the Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        } else {
          console.error("Error fetching locations:", response.status);
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce the API call
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions();
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  // Handle selection of a suggestion
  const handleSelectLocation = (location) => {
    const locationName = location.display_name;
    setSelectedLocation(locationName);
    setQuery(locationName);
    setSuggestions([]);
    
    // Call the onChange prop with the selected location
    onChange(locationName);
  };
  
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Start typing to search locations..."
        className="w-full p-3 border border-gray-300 rounded-lg text-base transition-all focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((location) => (
            <div
              key={location.place_id}
              onClick={() => handleSelectLocation(location)}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
            >
              {location.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Example usage in your form component
function AdditionalInfoForm({
  userType,
  formData,
  setFormData,
  handleInputChange,
  handlePrevStep,
  handleSubmit,
}) {
  // Handle location change
  const handleLocationChange = (locationName) => {
    setFormData({
      ...formData,
      location: locationName
    });
  };
  
  // Modified submit handler to prevent JSON parsing errors
  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit(formData);
  };
  
  return (
    <form onSubmit={handleFormSubmit}>
      {/* Other form fields here */}
      
      <div className="mb-5">
        <label htmlFor="location" className="block mb-2 font-medium text-gray-800">
          Location
        </label>
        <LocationSearch 
          value={formData.location || ""} 
          onChange={handleLocationChange} 
        />
      </div>
      
      {/* More form fields here */}
      
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
          Create Account
        </button>
      </div>
    </form>
  );
}

export default AdditionalInfoForm;