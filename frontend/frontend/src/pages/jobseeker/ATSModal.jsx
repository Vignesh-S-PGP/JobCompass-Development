import { X, CheckCircle2, AlertCircle, Zap, ShieldCheck, Trophy } from "lucide-react";
import JobCompassLoader from "../../components/JobCompassLoader";

export default function ATSModal({ loading, data, onClose }) {
  if (!loading && !data) return null;

  const ats = data?.ats ?? {};
  const matched = Array.isArray(ats.matched_skills) ? ats.matched_skills : [];
  const missing = Array.isArray(ats.missing_skills) ? ats.missing_skills : [];
  const score = data?.atsScore ?? ats.score ?? 0;
  const reason = ats.reason ?? "No detailed explanation provided.";

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-200">
        
        {loading ? (
          <div className="p-24 flex flex-col items-center">
            <JobCompassLoader />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mt-6 animate-pulse">
              Generating Audit...
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Table Header Style - Solid Slate */}
            <div className="bg-slate-800 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy size={18} className="text-indigo-400" />
                <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                  ATS Performance Report
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="group bg-slate-700 p-2 rounded-lg hover:bg-rose-500 transition-all"
              >
                <X size={20} className="text-slate-300 group-hover:text-white" />
              </button>
            </div>

            <div className="p-10 space-y-10 max-h-[85vh] overflow-y-auto">
              {/* Score Centerpiece */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 pb-10">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Match Evaluation</h3>
                  <p className="text-slate-500 font-medium">Your profile alignment against current job specifications.</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100 shadow-inner">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">
                    {score}<span className="text-2xl text-indigo-600">%</span>
                  </span>
                </div>
              </div>

              {/* Skills Analysis - High Visibility Mode */}
              <div className="grid gap-10">
                {/* Matched Assets */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2.5 text-emerald-600">
                    <CheckCircle2 size={20} />
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Matched Assets</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {matched.length === 0 ? (
                      <p className="text-sm text-slate-400 italic">No matches detected in this category.</p>
                    ) : (
                      matched.map((s, i) => (
                        <span key={i} className="px-5 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-[14px] font-bold shadow-sm">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Gap Analysis */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2.5 text-rose-500">
                    <AlertCircle size={20} />
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Gap Analysis</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {missing.length === 0 ? (
                      <p className="text-sm text-slate-400 italic">No significant skill gaps identified.</p>
                    ) : (
                      missing.map((s, i) => (
                        <span key={i} className="px-5 py-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[14px] font-bold shadow-sm">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Audit Reasoning Block */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.04] text-slate-900">
                   <ShieldCheck size={80} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                    <Zap size={16} fill="white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Strategic Insight
                  </span>
                </div>
                <p className="text-slate-700 text-[16px] font-semibold leading-relaxed relative z-10">
                  &ldquo;{reason}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-2">
                  
                  
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}