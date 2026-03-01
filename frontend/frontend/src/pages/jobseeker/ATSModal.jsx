import {
  X,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Trophy,
  Info,
  Sparkles,
  ChevronRight
} from "lucide-react";
import JobCompassLoader from "../../components/JobCompassLoader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function ATSModal({ loading, data, onClose }) {
  if (!loading && !data) return null;

  // ---------------- SAFE DATA EXTRACTION ----------------
  const atsData =
    typeof data?.ats === "object" && data?.ats !== null ? data.ats : {};

  const matched = Array.isArray(atsData.matched_skills)
    ? atsData.matched_skills
    : [];

  const missing = Array.isArray(atsData.missing_skills)
    ? atsData.missing_skills
    : [];

  const score = data?.atsScore ?? atsData.score ?? 0;

  const summary =
    typeof atsData.summary === "string" && atsData.summary.trim()
      ? atsData.summary
      : typeof atsData.reason === "string" && atsData.reason.trim()
      ? atsData.reason
      : "No detailed explanation available in the registry.";

  const recommendations = Array.isArray(atsData.recommendations)
    ? atsData.recommendations
    : [];

  // ------------------------------------------------------

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
      <Card className="w-full max-w-3xl shadow-2xl border-none overflow-hidden rounded-[3rem]">
        {loading ? (
          <div className="p-24 flex flex-col items-center justify-center gap-8">
            <div className="relative">
               <div className="w-24 h-24 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck size={32} className="text-primary-600" />
               </div>
            </div>
            <div className="text-center">
               <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">Analyzing Alignment</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
                 Executing ATS Logic...
               </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col max-h-[90vh]">
            {/* HEADER */}
            <header className="bg-slate-950 px-10 py-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Trophy size={18} />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                    Performance Audit
                  </h2>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">JobCompass AI-ATS v2.4</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </header>

            <div className="p-10 space-y-12 overflow-y-auto custom-scrollbar">
              {/* SCORE MODULE */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group">
                <div className="relative z-10 space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                    Alignment Score
                  </h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs">
                    Your profile alignment index against the verified mandate specifications.
                  </p>
                </div>
                <div className="relative shrink-0 flex items-center justify-center">
                   <svg className="w-40 h-40 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-white" strokeWidth="3" />
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary-600" strokeWidth="3" strokeDasharray={`${score}, 100`} strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-slate-950 leading-none">
                        {score}<span className="text-xl text-primary-500 font-black uppercase">%</span>
                      </span>
                   </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-2xl -mr-16 -mt-16" />
              </div>

              {/* SKILLS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* MATCHED */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Verified Matches
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {matched.length === 0 ? (
                      <div className="w-full p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                         <p className="text-[10px] font-black uppercase text-slate-300">No direct matches</p>
                      </div>
                    ) : (
                      matched.map((s, i) => (
                        <Badge key={i} variant="success" className="px-4 py-2 text-[10px] rounded-xl">{s}</Badge>
                      ))
                    )}
                  </div>
                </div>

                {/* MISSING */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <AlertCircle size={18} className="text-primary-600" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Capability Gaps
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {missing.length === 0 ? (
                      <div className="w-full p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                         <p className="text-[10px] font-black uppercase text-emerald-600">Optimal Alignment</p>
                      </div>
                    ) : (
                      missing.map((s, i) => (
                        <Badge key={i} variant="primary" className="px-4 py-2 text-[10px] rounded-xl bg-primary-50 text-primary-700">{s}</Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* STRATEGIC INSIGHT */}
              <div className="bg-slate-950 rounded-[2.5rem] p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-white">
                  <Sparkles size={100} />
                </div>

                <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/10">
                      <Zap size={20} className="text-primary-500" fill="currentColor" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Engine Intelligence</h4>
                   </div>

                   <p className="text-slate-300 text-lg leading-relaxed italic font-medium mb-10 border-l-4 border-primary-600 pl-8">
                     "{summary}"
                   </p>

                   {recommendations.length > 0 && (
                     <div className="space-y-6">
                       <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Recommendations</h5>
                       <div className="grid grid-cols-1 gap-4">
                         {recommendations.map((rec, i) => (
                           <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/5 p-5 rounded-2xl hover:border-primary-500 transition-all duration-300">
                              <div className="w-2 h-2 rounded-full bg-primary-600 mt-1.5 shrink-0" />
                              <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tight">{rec}</p>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                </div>
              </div>
            </div>

            <footer className="p-10 border-t border-slate-50 bg-white flex justify-end">
               <Button onClick={onClose} className="px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                 Acknowledge Report <ChevronRight size={16} className="ml-2" />
               </Button>
            </footer>
          </div>
        )}
      </Card>
    </div>
  );
}
