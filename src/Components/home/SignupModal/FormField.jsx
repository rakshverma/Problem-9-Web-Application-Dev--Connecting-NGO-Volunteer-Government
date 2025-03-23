import React from 'react';

function FormField({ id, label, type, value, onChange, placeholder, required, options, multiple, rows, min, max, helper }) {
  if (type === 'select') {
    return (
      <div className="mb-5">
        <label htmlFor={id} className="block mb-2 font-medium text-gray-800">{label}</label>
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          multiple={multiple}
          className="w-full p-3 border border-gray-300 rounded-lg text-base transition-all focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {helper && <small className="block mt-1 text-gray-500 text-sm">{helper}</small>}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="mb-5">
        <label htmlFor={id} className="block mb-2 font-medium text-gray-800">{label}</label>
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 3}
          required={required}
          className="w-full p-3 border border-gray-300 rounded-lg text-base transition-all focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none"
        ></textarea>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <label htmlFor={id} className="block mb-2 font-medium text-gray-800">{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="w-full p-3 border border-gray-300 rounded-lg text-base transition-all focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 outline-none"
      />
    </div>
  );
}

export default FormField;