"use client";

import { ArrowRight, Image, Leaf, Recycle, Sprout, TreePine, Upload, Star, Zap, Award, CheckCircle, Camera, Lightbulb, Target, Globe } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export default function OrganicWasteApp() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [stats, setStats] = useState({ analyses: 1247, co2Saved: 2.3, wasteReduced: 890 });
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsClient(true);

    // Generate particles only on client
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 5,
      animationDuration: 3 + Math.random() * 4
    }));
    setParticles(generatedParticles);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        analyses: prev.analyses + Math.floor(Math.random() * 3),
        co2Saved: parseFloat((prev.co2Saved + Math.random() * 0.1).toFixed(1)),
        wasteReduced: prev.wasteReduced + Math.floor(Math.random() * 5)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [isClient]);

  const handleFileSelect = (file) => {
    if (file && file.type && file.type.startsWith('image/')) {
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
        setDescription(cleanContent);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-green-300 to-teal-200 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-24 left-16 w-40 h-40 bg-green-500 rounded-full filter blur-2xl animate-pulse"></div>
        <div className="absolute top-64 right-28 w-28 h-28 bg-emerald-500 rounded-full filter blur-lg animate-bounce"></div>
        <div className="absolute bottom-36 left-1/3 w-48 h-48 bg-lime-500 rounded-full filter blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-teal-400 rounded-full filter blur-xl animate-ping"></div>
      </div>

      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute animate-float"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`
              }}
            >
              <div className="w-2 h-2 bg-white/30 rounded-full"></div>
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-6 mb-6">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full animate-spin-slow"></div>
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white border-4 border-white shadow-2xl">
                <img
                  src="/logo.png"
                  alt="Recyclica AI Logo"
                  className="w-full h-full object-cover scale-125"
                />
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-6xl font-black bg-gradient-to-r from-green-800 via-emerald-700 to-teal-800 bg-clip-text text-transparent">
                Recyclica AI
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-2xl font-bold text-green-900 mb-4 leading-tight">
              Waste Revolution: Transforming Organic Waste into Sustainable Solutions
            </p>
            <p className="text-lg text-green-800 leading-relaxed">
              Upload any organic waste photo and get instant,
              personalized eco-friendly solutions
            </p>
          </div>

          {/* Environmental Crisis Awareness Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Globe className="w-8 h-8 text-red-600" />
                <span className="text-3xl font-black text-red-800">1,337</span>
              </div>
              <p className="text-red-600 font-semibold">Tons CO₂/Second Globally</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Target className="w-8 h-8 text-orange-600" />
                <span className="text-3xl font-black text-orange-800">+1.5°C</span>
              </div>
              <p className="text-orange-600 font-semibold">Global Temperature Rise</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Recycle className="w-8 h-8 text-purple-600" />
                <span className="text-3xl font-black text-purple-800">2.01B</span>
              </div>
              <p className="text-purple-600 font-semibold">Tons Waste/Year Globally</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-red-800 mb-2 flex items-center justify-center gap-2">
                <span className="animate-pulse">🚨</span>
                The Climate Crisis is NOW
                <span className="animate-pulse">🚨</span>
              </h3>
              <p className="text-red-700 font-medium">
                Every photo you analyze helps reduce waste and fight climate change. Small actions, BIG impact!
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { icon: Zap, text: "AI-Powered", color: "yellow" },
              { icon: Recycle, text: "Eco-Friendly", color: "green" },
              { icon: TreePine, text: "Composting Guide", color: "emerald" },
              { icon: Lightbulb, text: "Smart Solutions", color: "blue" },
            ].map((badge, index) => (
              <div key={index} className="group flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 border-2 border-green-200 shadow-lg hover:border-green-400 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                <badge.icon className="w-4 h-4 text-green-600 group-hover:animate-spin" />
                <span className="text-sm text-green-700 font-bold">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl border-2 border-green-300 p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="space-y-8">
              {/* File Upload Area */}
              <div
                className={`relative border-3 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 select-none transform hover:scale-[1.02] ${isDragOver
                  ? 'border-green-600 bg-green-100 shadow-2xl scale-[1.02] animate-pulse'
                  : 'border-green-400 hover:border-green-500 hover:bg-green-50 hover:shadow-xl'
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
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-spin-slow opacity-75"></div>
                    <div className="relative p-6 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full shadow-inner">
                      <Upload className="w-12 h-12 text-green-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-green-900 mb-2">
                      Upload Your Organic Waste Photo
                    </p>
                    <p className="text-green-700 text-lg font-medium">
                      Food scraps, yard waste, biodegradable materials - We analyze it all!
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Camera className="w-4 h-4" />
                        <span>Drag & Drop</span>
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Instant Analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {preview && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-300 shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-green-200 rounded-xl">
                      <Image className="w-8 h-8 text-green-700" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-900">Your Organic Waste Sample</h3>
                      <p className="text-green-600">Ready for AI-powered analysis</p>
                    </div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Organic waste preview"
                        className="max-w-full max-h-96 rounded-2xl shadow-2xl border-4 border-white"
                      />
                      <div className="absolute -top-4 -right-4 bg-green-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-6 px-12 rounded-3xl flex items-center justify-center gap-4 shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-3xl text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-white"></div>
                      <span>AI Analyzing Your Waste...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-8 h-8 animate-pulse" />
                      <span>Get AI-Powered Eco Solutions</span>
                      <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Description Result */}
            {description && (
              <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 shadow-2xl border-green-300 animate-fadeIn">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-200 to-emerald-200 rounded-xl shadow-lg">
                    <Lightbulb className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-800">Personalized Eco Solutions </h3>
                    <p className="text-green-600 font-medium"> Recommendations for your waste</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-8 border-2 border-green-200 shadow-xl">
                  {description.startsWith('Error:') || description.startsWith('Network error:') ? (
                    <div className="text-center p-8">
                      <div className="text-6xl mb-4">⚠️</div>
                      <p className="text-red-600 font-bold text-lg">{description}</p>
                    </div>
                  ) : (
                    <div className="waste-analysis-content">
                      {description.includes('<h') || description.includes('<p') || description.includes('<ul') ? (
                        <div dangerouslySetInnerHTML={{ __html: description }} />
                      ) : (
                        <div>
                          {description.split('\n').map((line, index) => {
                            const trimmedLine = line.trim();

                            if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                              return <h3 key={index} className="text-2xl font-black text-green-800 mb-4 mt-6 border-b-3 border-green-400 pb-3 flex items-center gap-3">
                                <Star className="w-6 h-6 text-yellow-500" />
                                {trimmedLine.slice(2, -2)}
                              </h3>;
                            } else if (trimmedLine.startsWith('* ')) {
                              return (
                                <div key={index} className="flex items-start mb-4 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-l-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 shadow-lg">
                                    ✓
                                  </div>
                                  <p className="text-green-800 leading-relaxed font-medium">{trimmedLine.slice(2)}</p>
                                </div>
                              );
                            } else if (trimmedLine === '') {
                              return null;
                            } else {
                              return <p key={index} className="mb-4 text-green-700 leading-relaxed text-lg">{trimmedLine}</p>;
                            }
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <style dangerouslySetInnerHTML={{
                  __html: `
                    @keyframes float {
                      0%, 100% { transform: translateY(0px) rotate(0deg); }
                      50% { transform: translateY(-20px) rotate(180deg); }
                    }
                    @keyframes fadeIn {
                      from { opacity: 0; transform: translateY(20px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes spin-slow {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                    .animate-float { animation: float 4s ease-in-out infinite; }
                    .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
                    .animate-spin-slow { animation: spin-slow 8s linear infinite; }
                    
                    .waste-analysis-content h2 {
                      color: #166534;
                      font-size: 1.75rem;
                      font-weight: 800;
                      margin-bottom: 1.5rem;
                      border-bottom: 3px solid #16a34a;
                      padding-bottom: 0.75rem;
                      background: linear-gradient(135deg, #166534, #16a34a);
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                    }
                    
                    .waste-analysis-content p {
                      color: #15803d;
                      line-height: 1.7;
                      margin-bottom: 1.5rem;
                      font-size: 1.1rem;
                    }
                    
                    .waste-analysis-content ul {
                      background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                      border-radius: 1rem;
                      padding: 2rem;
                      border-left: 6px solid #16a34a;
                      margin-bottom: 2rem;
                      list-style-type: none;
                      counter-reset: step-counter;
                      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    }
                    
                    .waste-analysis-content li {
                      color: #166534;
                      margin-bottom: 1rem;
                      padding-left: 3rem;
                      font-size: 1.05rem;
                      line-height: 1.6;
                      position: relative;
                      counter-increment: step-counter;
                      font-weight: 500;
                    }
                    
                    .waste-analysis-content li::before {
                      content: counter(step-counter);
                      position: absolute;
                      left: 0;
                      top: 0;
                      background: linear-gradient(135deg, #16a34a, #059669);
                      color: white;
                      width: 2rem;
                      height: 2rem;
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 0.875rem;
                      font-weight: 700;
                      box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
                    }
                    
                    .waste-analysis-content strong {
                      color: #14532d;
                      font-weight: 700;
                      background: linear-gradient(135deg, #14532d, #166534);
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                    }
                  `
                }} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 bg-white/95 backdrop-blur-lg rounded-3xl border-2 border-green-200 shadow-xl overflow-hidden">
          <div className="relative  ">
            {/* <div className="bg-gradient-to-r from-green-400 to-emerald-400 px-8 py-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Globe className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                                    <Globe className="w-6 h-6 text-white" />

                </div>
                <p className="text-green-100 font-medium max-w-2xl mx-auto">
                  Waste management for a sustainable future | Transforming the world with one  photo
                </p>
              </div>
            </div> */}

            <div className="px-8 py-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 ">

                {/* Rishabh */}
                <div className="text-center">
                  <h4 className="font-bold text-gray-800 text-lg mb-3">Rishabh Parihar</h4>
                  <div className="flex gap-3 justify-center">
                    <a
                      href="https://linkedin.com/in/rishabh-parihar-"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.16 8.94H4.8V24H.16zM7.59 8.94h4.25v2.16h.06c.59-1.12 2.03-2.3 4.18-2.3 4.48 0 5.3 2.95 5.3 6.79V24h-4.68v-7.78c0-1.61-.03-3.69-2.25-3.69-2.26 0-2.61 1.77-2.61 3.59V24H7.59z" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/rispar0529"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.94.58.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.13-3.22.7-3.9-1.39-3.9-1.39-.53-1.36-1.3-1.72-1.3-1.72-1.07-.73.08-.71.08-.71 1.18.08 1.8 1.21 1.8 1.21 1.05 1.8 2.75 1.28 3.42.98.11-.77.41-1.28.74-1.58-2.57-.29-5.28-1.28-5.28-5.7 0-1.26.45-2.28 1.2-3.08-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.16 11.16 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.58.23 2.75.11 3.04.75.8 1.2 1.82 1.2 3.08 0 4.43-2.71 5.41-5.29 5.69.42.36.79 1.07.79 2.16 0 1.56-.01 2.82-.01 3.21 0 .31.21.66.8.55C20.7 21.4 24 17.1 24 12c0-6.35-5.15-11.5-12-11.5z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Jay */}
                <div className="text-center">
                  <h4 className="font-bold text-gray-800 text-lg mb-3">Jay Gheewala</h4>
                  <div className="flex gap-3 justify-center">
                    <a
                      href="https://www.linkedin.com/in/jay-gheewala-1b886728b"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.16 8.94H4.8V24H.16zM7.59 8.94h4.25v2.16h.06c.59-1.12 2.03-2.3 4.18-2.3 4.48 0 5.3 2.95 5.3 6.79V24h-4.68v-7.78c0-1.61-.03-3.69-2.25-3.69-2.26 0-2.61 1.77-2.61 3.59V24H7.59z" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/jay-gheewala"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.94.58.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.13-3.22.7-3.9-1.39-3.9-1.39-.53-1.36-1.3-1.72-1.3-1.72-1.07-.73.08-.71.08-.71 1.18.08 1.8 1.21 1.8 1.21 1.05 1.8 2.75 1.28 3.42.98.11-.77.41-1.28.74-1.58-2.57-.29-5.28-1.28-5.28-5.7 0-1.26.45-2.28 1.2-3.08-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.16 11.16 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.58.23 2.75.11 3.04.75.8 1.2 1.82 1.2 3.08 0 4.43-2.71 5.41-5.29 5.69.42.36.79 1.07.79 2.16 0 1.56-.01 2.82-.01 3.21 0 .31.21.66.8.55C20.7 21.4 24 17.1 24 12c0-6.35-5.15-11.5-12-11.5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  {/* <Globe className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                  <Globe className="w-6 h-6 text-white" /> */}

                </div>
                <p className="font-medium max-w-2xl mx-auto">
                  Waste management for a sustainable future | Transforming the world with one  photo
                </p>
              </div>
            </div>

          </div>
        </footer>
      </div>
    </div>
  );
}
