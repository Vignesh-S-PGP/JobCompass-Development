import {
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Activity,
  ListChecks,
  FileSearch,
  Lightbulb
} from "lucide-react";

export default function ATSBreakdown({ ats = {}, score = 0 }) {
  const {
    required_skills = [],
    resume_skills = [],
    matched_skills = [],
    missing_skills = [],
    summary,
    recommendations = []
  } = ats;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">

      {/* HEADER */}
      <div className="px-6 py-4 border-b bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-3.5 bg-indigo-600 rounded-sm" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            ATS Evaluation
          </h2>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Activity size={14} />
          <span className="text-[9px] font-bold uppercase tracking-widest">
            Live Analysis
          </span>
        </div>
      </div>

      <div className="p-8 space-y-10">

        {/* SCOREBOARD */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border">
            <div className="relative">
              <svg className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="36" strokeWidth="6" className="text-slate-200" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={226}
                  strokeDashoffset={226 - (226 * score) / 100}
                  strokeLinecap="round"
                  className="text-indigo-600 transition-all"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-black">{score}%</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Match Quality
              </p>
              <p className="text-sm font-black uppercase italic">
                {score >= 80 ? "Optimized" : score >= 50 ? "Moderate" : "Low"}
              </p>
            </div>
          </div>

          <Stat label="Required Skills" value={required_skills.length} />
          <Stat label="Resume Skills" value={resume_skills.length} />
        </div>

        {/* SKILL COMPARISON */}
        <div className="grid md:grid-cols-2 gap-6">
          <SkillBox
            title="Matched Skills"
            icon={<CheckCircle2 size={16} />}
            color="emerald"
            items={matched_skills}
          />
          <SkillBox
            title="Missing Skills"
            icon={<AlertCircle size={16} />}
            color="rose"
            items={missing_skills}
          />
        </div>

        {/* REQUIRED vs RESUME */}
        <div className="grid md:grid-cols-2 gap-6">
          <SkillBox
            title="Job Required Skills"
            icon={<ListChecks size={16} />}
            items={required_skills}
          />
          <SkillBox
            title="Extracted Resume Skills"
            icon={<FileSearch size={16} />}
            items={resume_skills}
          />
        </div>

        {/* SUMMARY */}
        {summary && (
          <div className="bg-slate-50 border rounded-xl p-6 relative">
            <div className="absolute top-4 right-4 opacity-10">
              <ShieldCheck size={60} />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Zap size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                ATS Summary
              </span>
            </div>

            <p className="text-slate-700 font-semibold leading-relaxed">
              “{summary}”
            </p>
          </div>
        )}

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <Lightbulb size={16} />
              <h4 className="text-[11px] font-black uppercase tracking-widest">
                Improvement Suggestions
              </h4>
            </div>

            <ul className="space-y-2 text-sm font-semibold text-slate-700">
              {recommendations.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-indigo-500">•</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Stat({ label, value }) {
  return (
    <div className="bg-slate-50 border rounded-xl p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function SkillBox({ title, items = [], icon, color = "slate" }) {
  return (
    <div className={`border rounded-xl p-6 hover:border-${color}-200`}>
      <div className="flex items-center gap-2 mb-4 text-slate-400">
        {icon}
        <h4 className="text-[11px] font-black uppercase tracking-widest">
          {title}
        </h4>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <span className="text-xs italic text-slate-400">None</span>
        ) : (
          items.map((s, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-white border rounded-lg text-xs font-bold"
            >
              {s}
            </span>
          ))
        )}
      </div>
    </div>
  );
}