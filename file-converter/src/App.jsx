import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import FileConvert from "./components/FileConvert";
import FileDownload from "./components/FileDownload";

export default function App() {
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
      <h1 className="text-3xl font-bold mb-6">File Converter</h1>
      <FileUpload setFile={setFile} />
      {file && <FileConvert file={file} setConvertedFile={setConvertedFile} />}
      {convertedFile && <FileDownload convertedFile={convertedFile} />}
    </div>
  );
}
