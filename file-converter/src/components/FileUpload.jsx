import React from "react";

export default function FileUpload({ setFile }) {
  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg w-80 text-center">
      <input
        type="file"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-indigo-600 file:text-white file:rounded-md hover:file:bg-indigo-700"
      />
    </div>
  );
}
