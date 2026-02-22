import { CheckCircle2, AlertCircle, Zap, ShieldCheck, ChevronRight, Activity } from "lucide-react";

export default function ATSBreakdown({ ats, score }) {
  // Calculate counts for the scoreboard
  const matchedCount = ats.matched_skills?.length || 0;
  const missingCount = ats.missing_skills?.length || 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header - Industrial Standard */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-3.5 bg-indigo-600 rounded-sm" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            ATS Evaluation Terminal
          </h2>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Activity size={14} />
          <span className="text-[9px] font-bold uppercase tracking-widest">System Live</span>
        </div>
      </div>

      <div className="p-8">
        {/* New Technical Scoreboard Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Large Score Meter */}
          <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="relative flex-shrink-0">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white" />
                <circle 
                  cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" 
                  strokeDasharray={226} 
                  strokeDashoffset={226 - (226 * score) / 100} 
                  className="text-indigo-600 transition-all duration-1000 ease-out" 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900">{score}%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Grade</p>
              <p className="text-sm font-black text-slate-900 uppercase italic">
                {score >= 80 ? "Optimized" : score >= 50 ? "Compatible" : "Critical Gap"}
              </p>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col justify-center">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Found Skills</p>
            <p className="text-2xl font-black text-emerald-700 leading-none">{matchedCount}</p>
          </div>

          <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex flex-col justify-center">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Missing Skills</p>
            <p className="text-2xl font-black text-rose-700 leading-none">{missingCount}</p>
          </div>
        </div>

        {/* Audit Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Matched Assets */}
          <div className="border border-slate-100 rounded-xl p-6 transition-all hover:border-emerald-200 group">
            <div className="flex items-center gap-2 mb-6 text-slate-400 group-hover:text-emerald-600 transition-colors">
              <CheckCircle2 size={16} />
              <h4 className="text-[11px] font-black uppercase tracking-widest">Matched Assets</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {ats.matched_skills?.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold shadow-sm group-hover:border-emerald-100">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Gap Analysis */}
          <div className="border border-slate-100 rounded-xl p-6 transition-all hover:border-rose-200 group">
            <div className="flex items-center gap-2 mb-6 text-slate-400 group-hover:text-rose-500 transition-colors">
              <AlertCircle size={16} />
              <h4 className="text-[11px] font-black uppercase tracking-widest">Gap Analysis</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {ats.missing_skills?.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg text-xs font-bold shadow-sm italic group-hover:border-rose-100">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Evaluation Logic Block - Light Industrial */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.05] text-indigo-600 group-hover:rotate-12 transition-transform">
             <ShieldCheck size={70} />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="p-1.5 bg-slate-900 rounded text-white shadow-lg">
              <Zap size={14} fill="currentColor" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Audit Reasoning
            </span>
          </div>

          <p className="text-slate-700 text-[16px] font-semibold leading-relaxed relative z-10 max-w-4xl">
            &ldquo;{ats.reason}&rdquo;
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-slate-200/60">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logic Verified</span>
             </div>
             <div className="flex items-center gap-2">
                <ChevronRight size={12} className="text-slate-300" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compliance Stable</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}