import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, Building2, Calendar, Hash } from "lucide-react";
import api from "../../services/api";
import ATSBreakdown from "../../components/applications/ATSBreakdown";
import ResumePreview from "../../components/applications/ResumePreview";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);

  useEffect(() => {
    api.get(`/applications/${id}`).then((res) => setApp(res.data.application));
  }, [id]);

  if (!app) return <div className="p-10 font-mono text-xs text-slate-400">LOADING_SYSTEM_DATA...</div>;

  const statusStyle = {
    shortlisted: "bg-emerald-500 text-white",
    rejected: "bg-rose-500 text-white",
    pending: "bg-amber-500 text-white",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Top Nav */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-[11px] uppercase tracking-[0.2em] transition-colors">
          <ArrowLeft size={14} /> Back to Terminal
        </button>
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
          <Hash size={10} /> {id.toUpperCase()}
        </div>
      </div>

      {/* Standardized Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center p-3">
              {app.company?.logo ? <img src={app.company.logo} alt="logo" className="max-h-full object-contain" /> : <Building2 className="text-slate-300" />}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{app.job?.title}</h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-indigo-600 font-bold text-sm tracking-wide">{app.company?.name}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 text-xs font-bold uppercase flex items-center gap-1">
                  <MapPin size={12} /> {app.job?.location}
                </span>
              </div>
            </div>
          </div>
          <div className={`${statusStyle[app.status] || statusStyle.pending} px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]`}>
            {app.status}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <div className="w-1 h-3 bg-indigo-600 rounded-full" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Job Specification</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {app.job?.description}
              </p>
            </div>
          </div>

          <ATSBreakdown ats={app.ats} score={app.atsScore} />
        </div>

        {/* Right Column - Secondary Actions */}
        <div className="space-y-6">
          <ResumePreview resume={app.resume} />

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <div className="w-1 h-3 bg-indigo-600 rounded-full" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Metadata</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Type</span>
                <span className="text-slate-900 font-black flex items-center gap-1.5"><Briefcase size={12}/> {app.job?.jobType}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Applied</span>
                <span className="text-slate-900 font-black flex items-center gap-1.5"><Calendar size={12}/> {new Date(app.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}