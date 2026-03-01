import { useEffect, useState } from "react";
import api from "../../services/api";
import ATSModal from "./ATSModal";
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Layers, 
  Globe, 
  Cpu,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Info
} from "lucide-react";
import { DetailSkeleton } from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

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
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          icon={ChevronLeft}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900"
        >
          Return to Registry
        </Button>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Acquisition</span>
        </div>
      </div>

      {/* COMMAND HEADER */}
      <div className="bg-slate-950 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-900/10 rounded-full blur-[100px] -ml-40 -mb-40" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-white rounded-3xl p-3 flex-shrink-0 shadow-2xl overflow-hidden flex items-center justify-center">
              {company.logo ? (
                <img src={company.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Building2 className="text-slate-200" size={32} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <Badge className="bg-primary-500/10 text-primary-400 border-primary-500/20">{job.jobType}</Badge>
                 <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{job.experience}+ Yrs Exp</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4 uppercase">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-400">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-400">
                  <Building2 size={16} /> {company.name}
                </span>
                <span className="text-slate-800 hidden md:block">/</span>
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <MapPin size={16} /> {job.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             <Button size="lg" onClick={() => document.getElementById('apply-section').scrollIntoView({behavior: 'smooth'})} className="px-10 py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black">
               Start Application <ArrowRight size={18} className="ml-3" />
             </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* TECHNICAL SPECIFICATIONS */}
        <div className="lg:col-span-8 space-y-10">
          <Card className="p-10 md:p-16">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
              <Layers size={24} className="text-primary-600" />
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Professional Mandate</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Role Description & Context</p>
              </div>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-medium italic border-l-4 border-primary-100 pl-8 py-2">
                {job.description}
              </p>
            </div>

            {job.skillsRequired?.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-4 mb-10">
                  <Cpu size={24} className="text-primary-600" />
                  <div className="flex flex-col">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Technical Requirements</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Skills Required</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {job.skillsRequired.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl group hover:border-primary-300 hover:bg-white transition-all">
                      <div className="w-2 h-2 rounded-full bg-primary-500 group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* DEPLOYMENT PANEL */}
        <div className="lg:col-span-4 space-y-8">
          <Card id="apply-section" className="p-10 border-2 border-slate-900 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <ShieldCheck size={28} className="text-primary-600" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Application Node</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">Submission Assets</label>
                  <div className="relative">
                    <select
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-sm text-slate-900 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                      value={resumeId}
                      onChange={e => setResumeId(e.target.value)}
                    >
                      <option value="">Select Resume Profile...</option>
                      {resumes.map(r => (
                        <option key={r._id} value={r._id}>{r.title}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                       <ChevronLeft className="-rotate-90" size={16} />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100 flex gap-4 items-start">
                   <Sparkles size={20} className="text-primary-600 shrink-0 mt-0.5" />
                   <p className="text-xs font-bold text-primary-800 leading-relaxed uppercase tracking-tight">
                     Our AI-ATS engine will analyze your asset for optimal alignment before submission.
                   </p>
                </div>

                <Button
                  onClick={applyJob}
                  loading={atsLoading}
                  className="w-full py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/30"
                >
                  Initiate Transmission
                </Button>
              </div>
            </div>

            {/* Visual background element */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-2xl -mb-16 -mr-16" />
          </Card>

          <Card className="p-10">
             <div className="flex items-center gap-3 mb-8">
                <Info size={18} className="text-primary-600" />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Employer Brief</h4>
             </div>
             <div className="space-y-6">
               <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entity</span>
                 <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{company.name}</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scale</span>
                 <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{company.size} Nodes</span>
               </div>
               <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sector</span>
                 <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{company.industry}</span>
               </div>
               {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="w-full mt-4 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-black" icon={Globe}>
                      External Domain
                    </Button>
                  </a>
               )}
             </div>
          </Card>
        </div>
      </div>

      <ATSModal
        loading={atsLoading}
        data={atsResult}
        onClose={() => setAtsResult(null)}
      />

      {/* POPUP MESSAGE MODAL */}
      {popupMessage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in">
          <Card className="max-w-md w-full p-10 text-center border-none shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
               <ShieldCheck size={32} className="text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">
              Access Restricted
            </h3>
            <p className="text-slate-500 font-medium mb-10 text-lg leading-relaxed">
              {popupMessage}
            </p>
            <Button
              onClick={() => setPopupMessage("")}
              className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest"
            >
              Acknowledged
            </Button>
          </Card>
        </div>
      )}

      {applyError && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-black uppercase tracking-widest text-xs animate-in slide-up z-[100]">
          {applyError}
        </div>
      )}
    </div>
  );
}
