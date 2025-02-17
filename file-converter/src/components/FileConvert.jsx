import React, { useState } from "react";
import convertFile from "../utils/convertFile";

export default function FileConvert({ file, setConvertedFile }) {
  const [format, setFormat] = useState("");

  const handleConvert = async () => {
    const converted = await convertFile(file, format);
    setConvertedFile(converted);
  };

  return (
    <div className="mt-5 bg-gray-800 p-5 rounded-lg shadow-lg w-80">
      <select
        onChange={(e) => setFormat(e.target.value)}
        className="w-full p-2 bg-gray-700 text-white rounded-md"
      >
        <option value="">Select Format</option>
        <option value="png">PNG (Image)</option>
        <option value="jpg">JPG (Image)</option>
        <option value="mp3">MP3 (Audio)</option>
        <option value="wav">WAV (Audio)</option>
        <option value="mp4">MP4 (Video)</option>
      </select>
      <button
        onClick={handleConvert}
        className="mt-3 bg-green-600 w-full py-2 rounded-md hover:bg-green-700"
      >
        Convert File
      </button>
    </div>
  );
}
