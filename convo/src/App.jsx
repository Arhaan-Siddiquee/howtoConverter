// pages/index.js
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const pulse = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};

// Format options for different file types
const formatOptions = {
  image: ['jpg', 'png', 'webp', 'gif', 'svg'],
  video: ['mp4', 'webm', 'avi', 'mov'],
  audio: ['mp3', 'wav', 'ogg', 'aac'],
  document: ['pdf', 'docx', 'txt', 'md', 'csv']
};

// Utility functions
const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

const detectFileType = (extension) => {
  extension = extension.toLowerCase();
  if (formatOptions.image.includes(extension)) return 'image';
  if (formatOptions.video.includes(extension)) return 'video';
  if (formatOptions.audio.includes(extension)) return 'audio';
  if (formatOptions.document.includes(extension)) return 'document';
  return null;
};

export default function Home() {
  const [file, setFile] = useState(null);
  const [convertTo, setConvertTo] = useState('');
  const [fileType, setFileType] = useState(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    setError('');
    setConverted(false);
    setShowSuccess(false);
    
    const extension = getFileExtension(selectedFile.name);
    const type = detectFileType(extension);
    
    if (type) {
      setFile(selectedFile);
      setFileType(type);
      setConvertTo('');
    } else {
      setError('Unsupported file type. Please upload an image, video, audio, or document file.');
      setFile(null);
      setFileType(null);
    }
  };

  // Handle format selection
  const handleFormatChange = (e) => {
    setConvertTo(e.target.value);
  };

  // Handle drag and drop events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle conversion process with animated progress
  const handleConvert = () => {
    if (!file || !convertTo) {
      setError('Please select a file and conversion format.');
      return;
    }
    
    setConverting(true);
    setProgress(0);
    
    // Simulate conversion process with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setConverting(false);
          setConverted(true);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 200);
  };

  // Handle file download after conversion
  const handleDownload = () => {
    if (!file || !convertTo) return;
    
    const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
    const newFileName = `${originalName}.${convertTo}`;
    
    // Create a blob URL for demonstration
    // In a real app, this would be the converted file from your backend
    const blob = new Blob([file], { type: file.type });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = newFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Particle animation background effect
  const particleRef = useRef(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && particleRef.current) {
      const canvas = particleRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas to full window size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Particle settings
      const particlesArray = [];
      const numberOfParticles = 100;
      
      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 3 + 1;
          this.speedX = Math.random() * 1 - 0.5;
          this.speedY = Math.random() * 1 - 0.5;
          this.color = `rgba(90, 120, 220, ${Math.random() * 0.3})`;
        }
        
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          
          if (this.x > canvas.width) this.x = 0;
          if (this.x < 0) this.x = canvas.width;
          if (this.y > canvas.height) this.y = 0;
          if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      function init() {
        for (let i = 0; i < numberOfParticles; i++) {
          particlesArray.push(new Particle());
        }
      }
      
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update();
          particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
      }
      
      init();
      animate();
      
      // Handle resize
      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 overflow-hidden relative">
      <Head>
        <title>howToConvert</title>
        <meta name="description" content="Modern file converter with animations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Background canvas for particle animation */}
      <canvas 
        ref={particleRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      
      {/* Animated background blur circles */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-4xl opacity-20 animate-blob"></div>
      <div className="absolute top-2/3 -right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-4xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-4xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-4 py-10 relative z-10">
        <motion.header 
          className="text-center mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-3"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            File Converter
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-400"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            Convert images, videos, audio, and documents with style
          </motion.p>
        </motion.header>

        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={slideUp}
        >
          <div className="bg-gray-800 backdrop-filter backdrop-blur-lg bg-opacity-60 rounded-3xl shadow-2xl border border-gray-700 p-6 md:p-8 overflow-hidden">
            {/* File Upload Area */}
            <motion.div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive ? 'border-blue-400 bg-gray-700 bg-opacity-40' : 'border-gray-600'
              } ${file ? 'bg-gray-700 bg-opacity-30' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              variants={pulse}
              initial="initial"
              animate={dragActive ? "animate" : "initial"}
            >
              {!file ? (
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="flex justify-center"
                    animate={{ 
                      y: [0, -10, 0],
                      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <svg className="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-medium text-gray-200">Drop your file here</h3>
                  <p className="text-gray-400">or</p>
                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Browse Files
                  </motion.button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-gray-400 mt-2 text-sm">Images · Videos · Audio · Documents</p>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <div className="bg-gray-700 rounded-full p-5">
                      {fileType === 'image' && (
                        <svg className="w-10 h-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      {fileType === 'video' && (
                        <svg className="w-10 h-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                      {fileType === 'audio' && (
                        <svg className="w-10 h-10 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      )}
                      {fileType === 'document' && (
                        <svg className="w-10 h-10 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-xl font-medium text-gray-200">{file.name}</p>
                    <p className="text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                  </motion.div>
                  <motion.button
                    onClick={() => {
                      setFile(null);
                      setFileType(null);
                      setConverted(false);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Remove file
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Conversion Settings */}
            <AnimatePresence>
              {file && (
                <motion.div 
                  className="mt-8 space-y-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-gray-300 mb-2 font-medium">Convert to:</label>
                    <div className="relative">
                      <select
                        value={convertTo}
                        onChange={handleFormatChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Select format</option>
                        {formatOptions[fileType].map((format) => (
                          <option key={format} value={format}>
                            {format.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  {/* Conversion Progress */}
                  {converting && (
                    <motion.div 
                      className="w-full bg-gray-700 rounded-full h-4 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div 
                    className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.button
                      onClick={handleConvert}
                      disabled={!convertTo || converting}
                      className={`flex-1 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                        !convertTo || converting
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg transform hover:scale-105'
                      }`}
                      whileHover={!convertTo || converting ? {} : { scale: 1.05 }}
                      whileTap={!convertTo || converting ? {} : { scale: 0.95 }}
                    >
                      {converting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Converting... {progress}%
                        </span>
                      ) : (
                        'Convert File'
                      )}
                    </motion.button>
                    
                    <motion.button
                      onClick={handleDownload}
                      disabled={!converted}
                      className={`flex-1 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                        !converted
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg transform hover:scale-105'
                      }`}
                      whileHover={!converted ? {} : { scale: 1.05 }}
                      whileTap={!converted ? {} : { scale: 0.95 }}
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        Download
                      </span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="mt-4 p-4 bg-red-900 bg-opacity-50 border border-red-800 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-red-300 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div 
                  className="mt-4 p-4 bg-green-900 bg-opacity-50 border border-green-800 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-green-300 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    File successfully converted! Click download to save your file.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Features section */}
        <motion.section 
          className="mt-20 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Advanced Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-gray-800 bg-opacity-60 backdrop-filter backdrop-blur-lg p-6 rounded-xl border border-gray-700"
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-blue-400 mb-4 flex justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-200 mb-2">High Quality</h3>
              <p className="text-gray-400">Preserve the quality of your files during conversion with our advanced algorithms.</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-800 bg-opacity-60 backdrop-filter backdrop-blur-lg p-6 rounded-xl border border-gray-700"
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-purple-400 mb-4 flex justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-200 mb-2">Secure</h3>
              <p className="text-gray-400">Files are processed securely and privately. We don't store your content on our servers.</p>
              </motion.div>
            
            <motion.div 
              className="bg-gray-800 bg-opacity-60 backdrop-filter backdrop-blur-lg p-6 rounded-xl border border-gray-700"
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-green-400 mb-4 flex justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-200 mb-2">Fast Processing</h3>
              <p className="text-gray-400">Convert your files in seconds with our optimized conversion engine.</p>
            </motion.div>
          </div>
        </motion.section>

        {/* File format section */}
        <motion.section 
          className="mt-16 mb-10 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Supported Formats</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg border border-gray-700">
              <h3 className="font-medium text-blue-400 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Images
              </h3>
              <ul className="text-gray-400 text-sm space-y-1">
                {formatOptions.image.map(format => (
                  <li key={format} className="uppercase">{format}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg border border-gray-700">
              <h3 className="font-medium text-purple-400 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Videos
              </h3>
              <ul className="text-gray-400 text-sm space-y-1">
                {formatOptions.video.map(format => (
                  <li key={format} className="uppercase">{format}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg border border-gray-700">
              <h3 className="font-medium text-green-400 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                </svg>
                Audio
              </h3>
              <ul className="text-gray-400 text-sm space-y-1">
                {formatOptions.audio.map(format => (
                  <li key={format} className="uppercase">{format}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-800 bg-opacity-40 p-4 rounded-lg border border-gray-700">
              <h3 className="font-medium text-yellow-400 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Documents
              </h3>
              <ul className="text-gray-400 text-sm space-y-1">
                {formatOptions.document.map(format => (
                  <li key={format} className="uppercase">{format}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>
        
        {/* Floating badges */}
        <div className="fixed top-4 right-4 flex space-x-2">
          <motion.div 
            className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg px-3 py-1 rounded-full border border-gray-700 text-xs text-gray-300 flex items-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Secure Connection
          </motion.div>
          
          <motion.div 
            className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg px-3 py-1 rounded-full border border-gray-700 text-xs text-gray-300"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <span className="text-blue-400 font-medium">Client Side</span> Secured
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          className="mt-16 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto px-6 py-6 border-t border-gray-800">
            <p>© 2025 howToConvert. Made with 💗.</p>
            
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://media.makeameme.org/created/trust-me-its-2u3d57.jpg" className="text-gray-400 hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="https://github.com/Arhaan-Siddiquee/" className="text-gray-400 hover:text-gray-300 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </motion.footer>
      </div>
      
      {/* Custom cursor effect - add to end of component */}
      <div id="cursor-fx" className="fixed w-8 h-8 rounded-full border-2 border-blue-400 pointer-events-none mix-blend-difference hidden md:block" style={{ transform: 'translate(-50%, -50%)', zIndex: 9999 }}></div>
      
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 30px) scale(1.05);
          }
        }
        
        .animate-blob {
          animation: blob 10s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Custom cursor effect */
        body {
          cursor: default;
        }
        
        a, button, select, input {
          cursor: pointer;
        }
      `}</style>
      
      {/* Custom cursor effect script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', () => {
            const cursorFx = document.getElementById('cursor-fx');
            
            document.addEventListener('mousemove', (e) => {
              cursorFx.style.left = e.clientX + 'px';
              cursorFx.style.top = e.clientY + 'px';
            });
            
            document.addEventListener('mousedown', () => {
              cursorFx.style.transform = 'translate(-50%, -50%) scale(0.8)';
            });
            
            document.addEventListener('mouseup', () => {
              cursorFx.style.transform = 'translate(-50%, -50%) scale(1)';
            });
            
            const handleMouseEnter = () => {
              cursorFx.style.transform = 'translate(-50%, -50%) scale(1.5)';
              cursorFx.style.borderWidth = '1px';
            };
            
            const handleMouseLeave = () => {
              cursorFx.style.transform = 'translate(-50%, -50%) scale(1)';
              cursorFx.style.borderWidth = '2px';
            };
            
            document.querySelectorAll('a, button, select, input').forEach((el) => {
              el.addEventListener('mouseenter', handleMouseEnter);
              el.addEventListener('mouseleave', handleMouseLeave);
            });
          });
        `
      }} />
    </div>
  );
}

// Add custom styles for the app
export function getStaticProps() {
  return {
    props: {}
  };
}