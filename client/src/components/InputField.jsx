// client/src/components/InputField.jsx
// A reusable input component for forms with consistent styling and error display.

import React from "react";

export default function InputField({ label, type = "text", placeholder, error, ...props }) {
  return (
    <div className="w-full">
      <label className="block  font-semibold text-sm mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder || label}
        className="w-full h-9 py-2 px-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
