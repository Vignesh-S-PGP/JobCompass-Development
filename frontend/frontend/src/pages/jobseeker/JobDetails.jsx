import { useEffect, useState } from "react";
import api from "../../services/api";
import ATSModal from "./ATSModal";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Briefcase, 
  Layers, 
  Globe, 
  Cpu,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";

export default function JobDetails({ job, onBack }) {
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [applyError, setApplyError] = useState("");
const [popupMessage, setPopupMessage] = useState("");
  const company = job.company || {};

  useEffect(() => {
    api.get("/resumes").then(res =>
      setResumes(res.data.resumes || [])
    );
  }, []);

const applyJob = async () => {
  if (!resumeId) {
    setPopupMessage("Please select a resume before applying.");
    return;
  }

  setAtsLoading(true);

  try {
    const res = await api.post("/applications/apply", {
      jobId: job._id,
      resumeId
    });

    setAtsResult(res.data);

  } catch (err) {
    if (err.response?.status === 409) {
      setPopupMessage("You have already applied for this job.");
    } else {
      setPopupMessage("Something went wrong. Please try again.");
    }
  } finally {
    setAtsLoading(false);
  }
};
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* 01. NAVIGATION & QUICK ACTIONS */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all"
        >
          <ChevronLeft size={16} />
          Return to Registry
        </button>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Position Open</span>
        </div>
      </div>

      {/* 02. COMMAND HEADER */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Building2 size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-xl p-2 flex-shrink-0">
              {company.logo ? (
                <img src={company.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-800 font-black text-2xl">
                  {company.name?.[0]}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-none mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                  <Building2 size={14} /> {company.name}
                </span>
                <span className="text-slate-600">/</span>
                <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                  <MapPin size={14} /> {job.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 03. TECHNICAL SPECIFICATIONS */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
              <Layers size={18} className="text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Project Description</h3>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line font-medium italic">
                {job.description}
              </p>
            </div>

            {job.skillsRequired?.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <Cpu size={18} className="text-indigo-600" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Core Tech Stack</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {applyError && (
  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-[11px] font-bold">
    {applyError}
  </div>
)}
{popupMessage && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
      <h3 className="text-lg font-black text-slate-900 mb-2">
        Action Blocked
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        {popupMessage}
      </p>
      <button
        onClick={() => setPopupMessage("")}
        className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition"
      >
        Got it
      </button>
    </div>
  </div>
)}

        {/* 04. DEPLOYMENT PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck size={20} className="text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Application Terminal</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Available Resumes</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-sm text-slate-700 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                  value={resumeId}
                  onChange={e => setResumeId(e.target.value)}
                >
                  <option value="">Select Asset...</option>
                  {resumes.map(r => (
                    <option key={r._id} value={r._id}>{r.title}</option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3 items-start">
                 <Briefcase size={16} className="text-indigo-600 mt-1" />
                 <p className="text-[11px] font-bold text-indigo-700 leading-tight">
                   Your resume will be processed via AI-ATS logic to determine role alignment before submission.
                 </p>
              </div>

              <button
                onClick={applyJob}
                disabled={atsLoading}
                className="w-full group relative overflow-hidden bg-slate-900 py-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-[0.98]"
              >
                <div className="relative z-10 flex items-center justify-center gap-3 text-white">
                  <span className="text-xs font-black uppercase tracking-[0.2em]">
                    {atsLoading ? "Processing..." : "Initiate Application"}
                  </span>
                </div>
                {/* Visual hover effect */}
                <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Employer Intelligence</h4>
             <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-500">Industry</span>
                 <span className="text-xs font-black text-slate-900">{company.industry}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-500">Size</span>
                 <span className="text-xs font-black text-slate-900">{company.size}</span>
               </div>
               {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                    External Site <Globe size={12} />
                  </a>
               )}
             </div>
          </div>
        </div>
      </div>

      <ATSModal
        loading={atsLoading}
        data={atsResult}
        onClose={() => setAtsResult(null)}
      />
    </div>
  );
}