import React, { useState, useRef } from 'react';
import { Camera, Upload, ShieldCheck, PlayCircle } from 'lucide-react';
import { api } from '../lib/api';

export default function CircularRecovery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      
      const formData = new FormData();
      formData.append('file', file);

      setIsAnalyzing(true);
      try {
        const result = await api.reportObservation(formData);
        setAnalysisResult(result);
      } catch (error) {
        console.error("Error analyzing image:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <main className="w-full bg-background min-h-screen text-on-surface px-6 md:px-12 pt-32 pb-24">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-headline-xl tracking-tighter">Circular Economy & Recovery</h1>
          <p className="text-on-surface-variant font-body-lg max-w-2xl">
            Upload images from the field. YOLO11 detects the debris via CLAHE preprocessing, and Gemini determines the material composition for upcycler matching.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Vision Upload / Camera Feed */}
          <div className="flex flex-col gap-6">
            <div className="relative w-full h-[500px] bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-3xl overflow-hidden flex items-center justify-center group">
              
              {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Uploaded Debris" className="w-full h-full object-cover" />
                  {/* Bounding Boxes overlay */}
                  {analysisResult?.ai_analysis?.bounding_boxes?.map((box: any, i: number) => {
                    const [y1, x1, y2, x2] = box.box_2d;
                    // Mock rendering scale assuming 640x480 normalized (just an example, in real life we scale correctly)
                    // We'll just show the concept here
                    return (
                      <div 
                        key={i}
                        className="absolute border-2 border-error bg-error/10"
                        style={{
                          top: `${(y1 / 480) * 100}%`,
                          left: `${(x1 / 640) * 100}%`,
                          height: `${((y2 - y1) / 480) * 100}%`,
                          width: `${((x2 - x1) / 640) * 100}%`,
                        }}
                      >
                        <span className="absolute -top-6 left-0 bg-error text-white text-xs px-2 py-1 rounded">
                          {box.label} {(box.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    )
                  })}
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 text-on-surface-variant">
                  <Camera className="w-16 h-16 opacity-50 group-hover:scale-110 transition-transform" />
                  <p className="font-headline-sm uppercase tracking-widest">Select an Image or Live Camera</p>
                </div>
              )}

              {/* Upload Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-bright flex items-center gap-2 shadow-xl"
                >
                  <Upload className="w-5 h-5" /> Upload File
                </button>
                <button className="px-6 py-3 rounded-full bg-primary-container text-on-primary-container hover:scale-105 transition-transform flex items-center gap-2 shadow-xl">
                  <PlayCircle className="w-5 h-5" /> Live Camera
                </button>
              </div>

              {isAnalyzing && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-50">
                  <span className="w-12 h-12 rounded-full border-4 border-primary-container border-t-transparent animate-spin"></span>
                  <p className="font-headline-sm tracking-widest uppercase">YOLO & Gemini Analyzing...</p>
                </div>
              )}
            </div>
            
            <p className="text-sm text-on-surface-variant text-center">
              Field reports act as truth labels for the XGBoost training pipeline.
            </p>
          </div>

          {/* AI Analysis Results */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-headline-lg tracking-tighter">AI Inspection Report</h2>
            
            {analysisResult ? (
              <div className="flex flex-col gap-8">
                <div className="p-8 bg-surface-container rounded-3xl border border-outline-variant/10 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-on-surface-variant text-sm tracking-widest uppercase">Detected Items</span>
                    <span className="text-4xl font-headline-lg">{analysisResult.ai_analysis.item_count} objects</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-on-surface-variant text-sm tracking-widest uppercase">Material Composition (Gemini)</span>
                    <span className="text-xl text-on-surface font-body-lg">{analysisResult.ai_analysis.composition}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-on-surface-variant text-sm tracking-widest uppercase">Est. Weight</span>
                      <span className="text-2xl text-on-surface font-headline-sm">{analysisResult.ai_analysis.estimated_weight_kg} kg</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-on-surface-variant text-sm tracking-widest uppercase">Category</span>
                      <span className={`text-2xl font-headline-sm ${analysisResult.ai_analysis.category === 'Highly Recyclable' ? 'text-emerald-400' : 'text-primary-container'}`}>
                        {analysisResult.ai_analysis.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-emerald-900/20 border border-emerald-500/30 rounded-3xl flex flex-col gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-20"><ShieldCheck className="w-32 h-32" /></div>
                  <h3 className="text-xl font-headline-sm text-emerald-400 uppercase tracking-widest z-10">Upcycler Match</h3>
                  <p className="text-3xl font-headline-lg z-10">{analysisResult.matched_upcycler}</p>
                  <button className="self-start px-6 py-3 rounded-full bg-emerald-500/20 text-emerald-300 font-headline-sm border border-emerald-500/50 hover:bg-emerald-500/40 z-10">
                    Dispatch to Facility
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-outline-variant/10 rounded-3xl bg-surface-container-lowest">
                <p className="text-on-surface-variant font-body-lg">Awaiting image upload for inference.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
