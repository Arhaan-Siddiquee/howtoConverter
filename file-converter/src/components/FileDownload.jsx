import React from "react";

export default function FileDownload({ convertedFile }) {
  return (
    <div className="mt-5 bg-gray-800 p-5 rounded-lg shadow-lg w-80">
      <a
        href={convertedFile}
        download="converted_file"
        className="bg-blue-600 w-full py-2 rounded-md hover:bg-blue-700 text-center block"
      >
        Download Converted File
      </a>
    </div>
  );
}
