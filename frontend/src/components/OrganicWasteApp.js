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
        // Remove HTML code block markers if present
        let cleanContent = data.html;
        
        // Remove ```html at the beginning and ``` at the end
        if (cleanContent.includes('```html')) {
          cleanContent = cleanContent.replace(/```html\s*\n?/g, '');
        }
        if (cleanContent.includes('```')) {
          cleanContent = cleanContent.replace(/```\s*$/g, '');
        }
        
        // Also handle just ``` without html
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Subtle organic pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-200 rounded-full"></div>
        <div className="absolute top-60 right-32 w-24 h-24 bg-emerald-200 rounded-full"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-lime-200 rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 bg-green-600 rounded-xl">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-green-800">
              EcoWaste AI
            </h1>
          </div>
          <p className="text-xl text-green-700 max-w-2xl mx-auto leading-relaxed mb-8">
            Snap a photo of your organic waste and discover eco-friendly disposal methods, composting tips, and sustainable solutions.
          </p>
          
          {/* Feature badges */}
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-green-200 shadow-sm">
              <Recycle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Eco-Friendly</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-green-200 shadow-sm">
              <TreePine className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Composting Guide</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-green-200 shadow-sm">
              <Sprout className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Sustainable</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-green-200 p-8 shadow-lg">
            <div className="space-y-8">
              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer ${
                  isDragOver
                    ? 'border-green-500 bg-green-50'
                    : 'border-green-300 hover:border-green-400 hover:bg-green-50'
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
                
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-green-100 rounded-full">
                    <Upload className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-green-800 mb-2">
                      Upload your organic waste photo
                    </p>
                    <p className="text-green-600">
                      Food scraps, yard waste, biodegradable materials
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {preview && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Image className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800">Your Organic Waste</h3>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={preview}
                      alt="Organic waste preview"
                      className="max-w-full max-h-96 rounded-lg shadow-sm border border-green-200"
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
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing Waste...</span>
                    </>
                  ) : (
                    <>
                      <Leaf className="w-5 h-5" />
                      <span>Get Eco Solutions</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Description Result */}
            {description && (
              <div className="mt-8 bg-green-50 rounded-xl p-6 border border-green-200">
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
       <div className="text-center mt-12 text-green-600">
  <p className="flex justify-center items-center gap-2">
    Powered by AI • Helping you reduce waste and protect the environment 🌍
    <a
      href="https://github.com/H-raheel/ecowaste-ai"
      target="_blank"
      rel="noopener noreferrer"
      className="ml-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        className="text-green-600 hover:text-green-800 transition"
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
</div>

      </div>
    </div>
  );
}
// "use client";

// import { motion } from "framer-motion";
// import { ArrowRight, Image, Leaf, Recycle, Sprout, TreePine, Upload } from "lucide-react";
// import { useRef, useState } from "react";

// export default function OrganicWasteAppEnhanced() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [description, setDescription] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDragOver, setIsDragOver] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleFileSelect = (file) => {
//     if (file && file.type.startsWith("image/")) {
//       setSelectedFile(file);
//       setPreview(URL.createObjectURL(file));
//       setDescription("");
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     handleFileSelect(e.dataTransfer.files[0]);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragOver(false);
//   };

//   const handleFileInputChange = (e) => {
//     handleFileSelect(e.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) return;
//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
//       const res = await fetch(`${apiUrl}/describe-image`, { method: "POST", body: formData });
//       const data = await res.json();

//       if (data.html) {
//         let cleanContent = data.html
//           .replace(/```html\s*\n?/g, "")
//           .replace(/```\s*$/g, "")
//           .trim();
//         setDescription(cleanContent);
//       } else {
//         setDescription(`Error: ${data.error || "Unknown error"}`);
//       }
//     } catch (err) {
//       setDescription(`Network error: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4">
//       <motion.div
//         className="max-w-4xl w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-green-200"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         {/* Header */}
//         <motion.div
//           className="text-center mb-10"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <div className="flex justify-center items-center gap-3 mb-4">
//             <div className="p-3 bg-green-600 rounded-xl">
//               <Leaf className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-4xl font-bold text-green-800">EcoWaste AI</h1>
//           </div>
//           <p className="text-lg text-green-700 max-w-2xl mx-auto">
//             Snap a photo of your organic waste and discover eco-friendly disposal tips.
//           </p>
//         </motion.div>

//         {/* Upload Area */}
//         <motion.div
//           className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
//             isDragOver ? "border-green-500 bg-green-50" : "border-green-300 hover:border-green-400 hover:bg-green-50"
//           }`}
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onClick={() => fileInputRef.current?.click()}
//           whileHover={{ scale: 1.02 }}
//         >
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleFileInputChange}
//             className="hidden"
//           />
//           <motion.div animate={{ scale: isDragOver ? 1.05 : 1 }}>
//             <div className="p-4 bg-green-100 rounded-full mx-auto w-fit mb-3">
//               <Upload className="w-8 h-8 text-green-600" />
//             </div>
//             <p className="text-xl font-semibold text-green-800">Upload your organic waste photo</p>
//             <p className="text-green-600">Drag & drop or click to select</p>
//           </motion.div>
//         </motion.div>

//         {/* Preview */}
//         {preview && (
//           <motion.div
//             className="mt-6 bg-green-50 rounded-xl p-4 border border-green-200"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             <div className="flex items-center gap-2 mb-2">
//               <Image className="w-5 h-5 text-green-600" />
//               <h3 className="text-lg font-semibold text-green-800">Your Organic Waste</h3>
//             </div>
//             <img
//               src={preview}
//               alt="Organic waste preview"
//               className="max-h-96 mx-auto rounded-lg shadow-sm"
//             />
//           </motion.div>
//         )}

//         {/* Submit */}
//         {selectedFile && (
//           <motion.button
//             type="button"
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-3"
//             whileHover={{ scale: 1.02 }}
//           >
//             {isLoading ? (
//               <>
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 <span>Analyzing Waste...</span>
//               </>
//             ) : (
//               <>
//                 <Leaf className="w-5 h-5" />
//                 <span>Get Eco Solutions</span>
//                 <ArrowRight className="w-5 h-5" />
//               </>
//             )}
//           </motion.button>
//         )}

//         {/* Description */}
//         {description && (
//           <motion.div
//             className="mt-8 bg-green-50 rounded-xl p-6 border border-green-200"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <Recycle className="w-5 h-5 text-green-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-green-800">Eco-Friendly Solutions</h3>
//             </div>
//             <div
//               className="bg-white rounded-lg p-4 border border-green-200 prose prose-green"
//               dangerouslySetInnerHTML={{ __html: description }}
//             />
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// }
