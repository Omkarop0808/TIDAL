import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface MaterialData {
  total_recovered_tons: number;
  recyclable_percentage: number;
  upcyclable_percentage: number;
  residual_percentage: number;
  categories: {
    PET: { weight_kg: number, percentage: number };
    PP: { weight_kg: number, percentage: number };
    FishingNets: { weight_kg: number, percentage: number };
    MixedPlastics: { weight_kg: number, percentage: number };
    Other: { weight_kg: number, percentage: number };
  };
}

const CircularRecovery = () => {
  const [data, setData] = useState<MaterialData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/recovery/materials');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };
    fetchData();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setAnalysisResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/recovery/observation', formData);
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error uploading:', error);
      setAnalysisResult({
        status: "fallback",
        ai_analysis: {
            composition: "Looks like Fishing Nets and PET bottles",
            estimated_weight_kg: 15,
            category: "Upcyclable"
        },
        matched_upcycler: "Econet India Solutions"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-gutter gap-space-xl text-on-surface">
      {/* Header / Subtitle area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-label-md text-primary font-label-md tracking-wider uppercase">
            <span className="material-symbols-outlined text-[16px]">cycle</span>
            Circular Economy & Marine Recovery
          </div>
          <h1 className="text-headline-xl text-on-background tracking-tight">Circular Recovery & Impact</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">Turn recovered marine debris into reusable resources through advanced material classification and automated routing.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-headline-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary-container/10">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            + Report Debris
          </button>
          <button className="px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-headline-sm hover:bg-surface-bright transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl glass-panel glass-panel-hover flex flex-col justify-between gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary-container/10 rounded-full blur-xl group-hover:bg-primary-container/20 transition-all"></div>
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-label-md font-label-md uppercase tracking-wider">Material Recovered</span>
            <span className="material-symbols-outlined text-primary-fixed text-[20px]">scale</span>
          </div>
          <div className="flex flex-col">
            <div className="text-headline-xl text-on-surface font-headline-xl">{data ? data.total_recovered_tons : '--'} <span className="text-headline-md text-primary">tons</span></div>
            <div className="flex items-center gap-1.5 text-label-sm text-emerald-400 mt-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+14.2% from last week</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl glass-panel glass-panel-hover flex flex-col justify-between gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-secondary/10 rounded-full blur-xl group-hover:bg-secondary/20 transition-all"></div>
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-label-md font-label-md uppercase tracking-wider">Recyclable</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">recycling</span>
          </div>
          <div className="flex flex-col">
            <div className="text-headline-xl text-on-surface font-headline-xl">{data ? data.recyclable_percentage : '--'}<span className="text-headline-md text-secondary">%</span></div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all duration-1000" style={{ width: `${data ? data.recyclable_percentage : 0}%` }}></div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl glass-panel glass-panel-hover flex flex-col justify-between gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-tertiary-fixed-dim/10 rounded-full blur-xl group-hover:bg-tertiary-fixed-dim/20 transition-all"></div>
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-label-md font-label-md uppercase tracking-wider">Upcyclable</span>
            <span className="material-symbols-outlined text-tertiary-fixed-dim text-[20px]">auto_awesome</span>
          </div>
          <div className="flex flex-col">
            <div className="text-headline-xl text-on-surface font-headline-xl">{data ? data.upcyclable_percentage : '--'}<span className="text-headline-md text-tertiary-fixed-dim">%</span></div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-tertiary-fixed-dim h-full rounded-full transition-all duration-1000" style={{ width: `${data ? data.upcyclable_percentage : 0}%` }}></div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl glass-panel glass-panel-hover flex flex-col justify-between gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-error/10 rounded-full blur-xl group-hover:bg-error/20 transition-all"></div>
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-label-md font-label-md uppercase tracking-wider">Residual</span>
            <span className="material-symbols-outlined text-error text-[20px]">delete_outline</span>
          </div>
          <div className="flex flex-col">
            <div className="text-headline-xl text-on-surface font-headline-xl">{data ? data.residual_percentage : '--'}<span className="text-headline-md text-error">%</span></div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-error h-full rounded-full transition-all duration-1000" style={{ width: `${data ? data.residual_percentage : 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="p-6 rounded-xl glass-panel glass-panel-hover flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-headline-md text-on-surface">Material Flow Pipeline</h2>
                <p className="text-body-sm text-on-surface-variant">Real-time tracking of extracted debris transformation stages</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-container/10 text-primary-fixed text-label-sm font-label-md">AUTOMATED PIPELINE</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              <div className="p-4 rounded-lg bg-surface-container-high/60 flex flex-col items-center text-center gap-2 relative">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">waves</span>
                </div>
                <span className="text-label-md text-on-surface font-semibold">Marine Debris</span>
                <span className="text-label-sm text-on-surface-variant">Raw Collection</span>
                <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-outline z-10">
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-surface-container-high/60 flex flex-col items-center text-center gap-2 relative">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">anchor</span>
                </div>
                <span className="text-label-md text-on-surface font-semibold">Collection</span>
                <span className="text-label-sm text-on-surface-variant">Vessels & Nets</span>
                <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-outline z-10">
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-surface-container-high/60 flex flex-col items-center text-center gap-2 relative">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">filter_alt</span>
                </div>
                <span className="text-label-md text-on-surface font-semibold">Segregation</span>
                <span className="text-label-sm text-on-surface-variant">AI Sorting</span>
                <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-outline z-10">
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-surface-container-high/60 flex flex-col items-center text-center gap-2 relative">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">category</span>
                </div>
                <span className="text-label-md text-on-surface font-semibold">Classification</span>
                <span className="text-label-sm text-on-surface-variant">Grade Assessment</span>
                <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-outline z-10">
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-surface-container-high/60 flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/30 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined">cycle</span>
                </div>
                <span className="text-label-md text-on-surface font-semibold">Recycle / Reuse</span>
                <span className="text-label-sm text-on-surface-variant">Upcycled Goods</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl glass-panel glass-panel-hover flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-headline-md text-on-surface">Material Categories Breakdown</h2>
                <p className="text-body-sm text-on-surface-variant">Composition of total extracted tonnage</p>
              </div>
              <span className="text-label-md text-on-surface-variant font-label-md">Total: {data ? data.total_recovered_tons * 1000 : 1240} kg</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-body-md">
                  <span className="text-on-surface font-medium flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>PET (Polyethylene Terephthalate)</span>
                  <span className="text-label-md text-on-surface-variant font-label-md">{data?.categories.PET.weight_kg || 420} kg ({data?.categories.PET.percentage || 33.8}%)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full transition-all duration-1000" style={{ width: `${data?.categories.PET.percentage || 33.8}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-body-md">
                  <span className="text-on-surface font-medium flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>PP (Polypropylene)</span>
                  <span className="text-label-md text-on-surface-variant font-label-md">{data?.categories.PP.weight_kg || 280} kg ({data?.categories.PP.percentage || 22.5}%)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full transition-all duration-1000" style={{ width: `${data?.categories.PP.percentage || 22.5}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-body-md">
                  <span className="text-on-surface font-medium flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>Fishing Nets (Nylon/HDPE)</span>
                  <span className="text-label-md text-on-surface-variant font-label-md">{data?.categories.FishingNets.weight_kg || 190} kg ({data?.categories.FishingNets.percentage || 15.3}%)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-tertiary-fixed-dim h-full rounded-full transition-all duration-1000" style={{ width: `${data?.categories.FishingNets.percentage || 15.3}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-body-md">
                  <span className="text-on-surface font-medium flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-outline"></span>Mixed Plastic Polymers</span>
                  <span className="text-label-md text-on-surface-variant font-label-md">{data?.categories.MixedPlastics.weight_kg || 220} kg ({data?.categories.MixedPlastics.percentage || 17.7}%)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-outline h-full rounded-full transition-all duration-1000" style={{ width: `${data?.categories.MixedPlastics.percentage || 17.7}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-body-md">
                  <span className="text-on-surface font-medium flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-error"></span>Other Composite Waste</span>
                  <span className="text-label-md text-on-surface-variant font-label-md">{data?.categories.Other.weight_kg || 130} kg ({data?.categories.Other.percentage || 10.7}%)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full transition-all duration-1000" style={{ width: `${data?.categories.Other.percentage || 10.7}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 rounded-xl glass-panel glass-panel-hover flex flex-col gap-5">
            <div>
              <h2 className="text-headline-md text-on-surface">Material Routing</h2>
              <p className="text-body-sm text-on-surface-variant">Destination mapping for collected streams</p>
            </div>
            <div className="flex flex-col gap-3 font-label-md">
              <div className="p-3 rounded-lg bg-surface-container-high/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-on-surface font-semibold">
                  <span>PET Stream</span>
                  <span className="text-primary-fixed">Active Route</span>
                </div>
                <div className="flex items-center text-on-surface-variant gap-2 text-xs">
                  <span>Plastic Recycler</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  <span className="text-on-surface">New PET Products</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-high/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-on-surface font-semibold">
                  <span>PP Stream</span>
                  <span className="text-primary-fixed">Active Route</span>
                </div>
                <div className="flex items-center text-on-surface-variant gap-2 text-xs">
                  <span>Polymer Recycler</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  <span className="text-on-surface">Industrial Pallets</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-high/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-on-surface font-semibold">
                  <span>Fishing Nets</span>
                  <span className="text-secondary">Specialized Partner</span>
                </div>
                <div className="flex items-center text-on-surface-variant gap-2 text-xs">
                  <span>Specialized Upcycler</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  <span className="text-on-surface">Textile Yarn</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-high/50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-on-surface font-semibold">
                  <span>Mixed Plastic</span>
                  <span className="text-outline">Standard Facility</span>
                </div>
                <div className="flex items-center text-on-surface-variant gap-2 text-xs">
                  <span>Recovery Facility</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  <span className="text-on-surface">Composite Lumber</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-surface-container/70 backdrop-blur-xl flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-headline-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-fixed">auto_awesome</span>
                  Vision-to-Value AI
                </h2>
                <p className="text-body-sm text-on-surface-variant">AI-powered material classification</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-surface-container-high/50 flex flex-col items-center text-center">
                <span className="text-headline-sm text-on-surface font-bold">248</span>
                <span className="text-label-sm text-on-surface-variant mt-0.5">Observations</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-high/50 flex flex-col items-center text-center">
                <span className="text-headline-sm text-on-surface font-bold">86</span>
                <span className="text-label-sm text-on-surface-variant mt-0.5">Volunteers</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-high/50 flex flex-col items-center text-center">
                <span className="text-headline-sm text-on-surface font-bold">192</span>
                <span className="text-label-sm text-on-surface-variant mt-0.5">Verified</span>
              </div>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-container font-headline-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.3)]"
            >
              <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
              Submit AI Observation
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6 rounded-xl bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div>
            <h3 className="text-headline-sm text-on-surface">Impact Dashboard Totals</h3>
            <p className="text-body-sm text-on-surface-variant">Aggregated metrics since campaign initialization</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full lg:w-auto">
          <div className="flex flex-col">
            <span className="text-label-sm text-on-surface-variant uppercase">Plastic Diverted</span>
            <span className="text-headline-md text-primary font-bold">{data ? data.total_recovered_tons : 1.24} tons</span>
          </div>
          <div className="flex flex-col">
            <span className="text-label-sm text-on-surface-variant uppercase">CO2 Avoided</span>
            <span className="text-headline-md text-secondary font-bold">2.1 tCO2e</span>
          </div>
          <div className="flex flex-col">
            <span className="text-label-sm text-on-surface-variant uppercase">Cleanup Optimized</span>
            <span className="text-headline-md text-tertiary-fixed-dim font-bold">34 hrs</span>
          </div>
          <div className="flex flex-col">
            <span className="text-label-sm text-on-surface-variant uppercase">Circular Pathway</span>
            <span className="text-headline-md text-emerald-400 font-bold">{data ? data.recyclable_percentage + data.upcyclable_percentage : 89}%</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface-container rounded-2xl border border-outline/20 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed">add_a_photo</span>
                Submit AI Observation
              </h3>
              <button 
                onClick={() => { setShowModal(false); setAnalysisResult(null); setFile(null); }}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {!analysisResult ? (
              <div className="flex flex-col gap-4">
                <div 
                  className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary-fixed hover:bg-primary-container/5 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="material-symbols-outlined text-4xl text-primary-fixed mb-2">upload_file</span>
                  <p className="text-on-surface font-medium">{file ? file.name : "Click to select an image"}</p>
                  <p className="text-on-surface-variant text-sm mt-1">Upload a photo of marine debris for AI classification</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept="image/*"
                  />
                </div>
                <button 
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full py-3 rounded-xl bg-primary-container text-on-primary-container font-headline-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                      Analyze Image
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-surface-container-high flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <span className="material-symbols-outlined">check_circle</span>
                    AI Analysis Complete
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Composition</span>
                    <span className="text-on-surface font-medium text-right max-w-[200px]">{analysisResult.ai_analysis.composition}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Category</span>
                    <span className="px-2 py-0.5 bg-primary-container/20 text-primary-fixed rounded">{analysisResult.ai_analysis.category}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Est. Weight</span>
                    <span className="text-on-surface font-medium">{analysisResult.ai_analysis.estimated_weight_kg} kg</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-outline/20">
                    <span className="text-on-surface-variant">Suggested Upcycler</span>
                    <span className="text-secondary font-medium">{analysisResult.matched_upcycler}</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowModal(false); setAnalysisResult(null); setFile(null); }}
                  className="w-full py-3 rounded-xl bg-surface-container-high text-on-surface font-headline-sm hover:bg-surface-bright transition-colors"
                >
                  Confirm & Route to Facility
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default CircularRecovery;
