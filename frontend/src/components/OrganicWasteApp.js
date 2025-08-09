"use client";

import { ArrowRight, Image, Leaf, Recycle, Sprout, TreePine, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

export default function OrganicWasteApp() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setDescription('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/describe-image`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.html) {
        let cleanContent = data.html;

        if (cleanContent.includes('```html')) {
          cleanContent = cleanContent.replace(/```html\s*\n?/g, '');
        }
        if (cleanContent.includes('```')) {
          cleanContent = cleanContent.replace(/```\s*$/g, '');
        }
        if (cleanContent.startsWith('```') && cleanContent.endsWith('```')) {
          cleanContent = cleanContent.slice(3, -3).trim();
        }

        setDescription(cleanContent.trim());
      } else {
        setDescription(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setDescription(`Network error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-300 to-green-100 relative overflow-hidden">
      {/* Subtle organic pattern background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-24 left-16 w-40 h-40 bg-green-400 rounded-full filter blur-xl mix-blend-multiply"></div>
        <div className="absolute top-64 right-28 w-28 h-28 bg-emerald-400 rounded-full filter blur-lg mix-blend-multiply"></div>
        <div className="absolute bottom-36 left-1/3 w-48 h-48 bg-lime-400 rounded-full filter blur-xl mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-green-600 border-2 border-green-400">
              <img
                src="/logo.png"
                alt="EcoWaste AI Logo"
                className="w-full h-full object-cover scale-125"
              />
            </div>


            <h1 className="text-5xl font-bold text-green-800">
              Recyclica AI
            </h1>
          </div>

          <p className="text-xl italic font-bold text-green-900 max-w-3xl mx-auto mb-3">
            Turning your organic waste into smart, sustainable and eco-friendly solutions
          </p>

          <p className="text-xl text-green-700 max-w-2xl mx-auto leading-relaxed">
            Snap a photo of your organic waste and discover eco-friendly disposal methods, composting tips, and sustainable solutions.
          </p>

          {/* Feature badges */}
          <div className="flex justify-center gap-4 flex-wrap mt-8">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-green-200 shadow-sm hover:border-green-400 hover:shadow-md transition duration-200 cursor-pointer">
              <Recycle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Eco-Friendly</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-green-200 shadow-sm hover:border-green-400 hover:shadow-md transition duration-200 cursor-pointer">
              <TreePine className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Composting Guide</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-green-200 shadow-sm hover:border-green-400 hover:shadow-md transition duration-200 cursor-pointer">
              <Sprout className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Sustainable</span>
            </div>
          </div>
        </div>




        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-green-300 p-8 shadow-md">
            <div className="space-y-8">
              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-3xl p-14 text-center cursor-pointer transition-colors duration-300 select-none ${isDragOver
                  ? 'border-green-600 bg-green-100 shadow-lg'
                  : 'border-green-400 hover:border-green-500 hover:bg-green-100'
                  }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  required
                />
                <div className="flex flex-col items-center gap-5">
                  <div className="p-5 bg-green-200 rounded-full shadow-inner">
                    <Upload className="w-10 h-10 text-green-700" />
                  </div>
                  <p className="text-2xl font-semibold text-green-900 mb-1">
                    Upload your organic waste photo
                  </p>
                  <p className="text-green-700 text-base">
                    Food scraps, yard waste, biodegradable materials
                  </p>
                </div>
              </div>

              {/* Image Preview */}
              {preview && (
                <div className="bg-green-100 rounded-2xl p-8 border border-green-300 shadow-md mt-10">
                  <div className="flex items-center gap-4 mb-5">
                    <Image className="w-6 h-6 text-green-700" />
                    <h3 className="text-xl font-semibold text-green-900">Your Organic Waste</h3>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={preview}
                      alt="Organic waste preview"
                      className="max-w-full max-h-[28rem] rounded-2xl shadow-lg border border-green-300"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full mt-10 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 px-10 rounded-3xl flex items-center justify-center gap-4 shadow-lg transition-colors duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Analyzing Waste...</span>
                    </>
                  ) : (
                    <>
                      <Leaf className="w-6 h-6" />
                      <span>Get Eco Solutions</span>
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Description Result */}
            {description && (
              <div className="mt-8 bg-green-100 rounded-xl p-6 border shadow-lg border-green-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Recycle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800">Eco-Friendly Solutions</h3>
                </div>
                <div className="bg-white rounded-lg p-6 border border-green-200">
                  {description.startsWith('Error:') || description.startsWith('Network error:') ? (
                    <p className="text-red-600 font-medium">❌ {description}</p>
                  ) : (
                    <div className="waste-analysis-content">
                      {description.includes('<h') || description.includes('<p') || description.includes('<ul') ? (
                        // If it contains HTML tags, render as HTML
                        <div dangerouslySetInnerHTML={{ __html: description }} />
                      ) : (
                        // If it's plain text with markdown, format it nicely
                        <div>
                          {description.split('\n').map((line, index) => {
                            const trimmedLine = line.trim();

                            if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                              // Handle bold headings
                              return <h3 key={index} className="text-lg font-bold text-green-800 mb-3 mt-4 border-b-2 border-green-400 pb-2">{trimmedLine.slice(2, -2)}</h3>;
                            } else if (trimmedLine.startsWith('* ')) {
                              // Handle bullet points
                              return (
                                <div key={index} className="flex items-start mb-3 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                    •
                                  </div>
                                  <p className="text-green-800 leading-relaxed">{trimmedLine.slice(2)}</p>
                                </div>
                              );
                            } else if (trimmedLine === '') {
                              // Skip empty lines
                              return null;
                            } else {
                              // Handle regular paragraphs
                              return <p key={index} className="mb-4 text-green-700 leading-relaxed">{trimmedLine}</p>;
                            }
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Custom styles for the waste analysis content */}
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .waste-analysis-content h2 {
                      color: #166534;
                      font-size: 1.5rem;
                      font-weight: 700;
                      margin-bottom: 1rem;
                      border-bottom: 2px solid #16a34a;
                      padding-bottom: 0.5rem;
                    }
                    
                    .waste-analysis-content p {
                      color: #15803d;
                      line-height: 1.6;
                      margin-bottom: 1.5rem;
                      font-size: 1rem;
                    }
                    
                    .waste-analysis-content ul {
                      background-color: #f0fdf4;
                      border-radius: 0.75rem;
                      padding: 1.5rem;
                      border-left: 4px solid #16a34a;
                      margin-bottom: 1.5rem;
                      list-style-type: none;
                      counter-reset: step-counter;
                    }
                    
                    .waste-analysis-content li {
                      color: #166534;
                      margin-bottom: 0.75rem;
                      padding-left: 2rem;
                      font-size: 0.95rem;
                      line-height: 1.5;
                      position: relative;
                      counter-increment: step-counter;
                    }
                    
                    .waste-analysis-content li::before {
                      content: counter(step-counter);
                      position: absolute;
                      left: 0;
                      top: 0;
                      background-color: #16a34a;
                      color: white;
                      width: 1.5rem;
                      height: 1.5rem;
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 0.75rem;
                      font-weight: 600;
                    }
                    
                    .waste-analysis-content li:last-child {
                      margin-bottom: 0;
                    }
                    
                    .waste-analysis-content strong {
                      color: #14532d;
                      font-weight: 600;
                    }
                  `
                }} />
              </div>
            )}
          </div>
        </div>


        {/* Footer */}
        <div className="text-center mt-16 text-green-700 font-medium flex flex-col items-center gap-3">
          <p className="flex justify-center items-center gap-2">
            • Helping you reduce waste and protect the environment 
            <a
              href="https://github.com/rispar0529/Recyclica-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
              aria-label="GitHub Repository"
            >
              
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="text-green-700 hover:text-green-900 transition-colors duration-300"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 
                  0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
                  -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64
                  -.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 
                  7.65 0 018 4.58c.68.003 1.37.092 2.01.27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 
                  2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 
                  1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
          </p>

          {/* LinkedIn profiles */}
          <div className="flex justify-center items-center gap-6 mt-4">
            <a
              href="https://linkedin.com/in/rishabh-parihar-"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile 1"
              className="text-green-700 hover:text-green-900 transition-colors duration-300"
            >
              Rishabh
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                
                <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.16 8.94H4.8V24H.16zM7.59 8.94h4.25v2.16h.06c.59-1.12 2.03-2.3 4.18-2.3 4.48 0 5.3 2.95 5.3 6.79V24h-4.68v-7.78c0-1.61-.03-3.69-2.25-3.69-2.26 0-2.61 1.77-2.61 3.59V24H7.59z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/jay-gheewala-1b886728b"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile 2"
              className="text-green-700 hover:text-green-900 transition-colors duration-300"
            >
              Jay
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.16 8.94H4.8V24H.16zM7.59 8.94h4.25v2.16h.06c.59-1.12 2.03-2.3 4.18-2.3 4.48 0 5.3 2.95 5.3 6.79V24h-4.68v-7.78c0-1.61-.03-3.69-2.25-3.69-2.26 0-2.61 1.77-2.61 3.59V24H7.59z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
