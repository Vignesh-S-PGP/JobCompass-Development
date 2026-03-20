import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lightbulb,
  Activity
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

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Strong Match";
    if (score >= 40) return "Moderate Match";
    return "Low Match";
  };

  return (

    <div className="bg-white border rounded-2xl overflow-hidden">

      {/* HEADER */}

      <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">

        <div className="flex items-center gap-2">

          <Sparkles size={18} className="text-indigo-600"/>

          <h2 className="text-sm font-semibold text-slate-900">
            ATS Compatibility Report
          </h2>

        </div>

        <div className="flex items-center gap-2 text-slate-400 text-sm">

          <Activity size={16}/>
          AI Analysis

        </div>

      </div>


      <div className="p-6 space-y-8">

        {/* SCORE */}

        <div className="flex flex-col md:flex-row items-center gap-8">

          <ScoreCircle score={score}/>

          <div>

            <p className="text-sm text-slate-400">
              Resume Match Score
            </p>

            <h3 className="text-2xl font-semibold text-slate-900">
              {getScoreLabel()}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              This score represents how well your resume aligns with the job requirements.
            </p>

          </div>

        </div>


        {/* SKILL COMPARISON */}

        <div className="grid md:grid-cols-2 gap-6">

          <SkillGroup
            title="Matched Skills"
            icon={<CheckCircle2 size={16}/>}
            color="emerald"
            items={matched_skills}
          />

          <SkillGroup
            title="Missing Skills"
            icon={<AlertCircle size={16}/>}
            color="rose"
            items={missing_skills}
          />

        </div>


        {/* JOB VS RESUME */}

        <div className="grid md:grid-cols-2 gap-6">

          <SkillGroup
            title="Job Required Skills"
            items={required_skills}
          />

          <SkillGroup
            title="Skills Detected in Resume"
            items={resume_skills}
          />

        </div>


        {/* SUMMARY */}

        {summary && (

          <div className="bg-slate-50 border rounded-xl p-5">

            <div className="flex items-center gap-2 mb-2 text-indigo-600">

              <Sparkles size={16}/>
              <span className="font-medium">
                AI Insight
              </span>

            </div>

            <p className="text-sm text-slate-600">
              {summary}
            </p>

          </div>

        )}


        {/* RECOMMENDATIONS */}

        {recommendations.length > 0 && (

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">

            <div className="flex items-center gap-2 mb-3 text-indigo-600">

              <Lightbulb size={16}/>
              <span className="font-medium">
                Recommendations
              </span>

            </div>

            <ul className="space-y-1 text-sm text-slate-700">

              {recommendations.map((r,i)=>(
                <li key={i}>• {r}</li>
              ))}

            </ul>

          </div>

        )}

      </div>

    </div>

  );

}


/* ---------- SCORE CIRCLE ---------- */

function ScoreCircle({ score }) {

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (

    <div className="relative w-28 h-28">

      <svg className="w-28 h-28 -rotate-90">

        <circle
          cx="56"
          cy="56"
          r={radius}
          strokeWidth="8"
          fill="none"
          className="text-slate-200"
        />

        <circle
          cx="56"
          cy="56"
          r={radius}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-indigo-600"
        />

      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-slate-900">

        {score}%

      </div>

    </div>

  );

}


/* ---------- SKILL GROUP ---------- */

function SkillGroup({ title, items = [], icon, color = "slate" }) {

  return (

    <div className="border rounded-xl p-4">

      <div className="flex items-center gap-2 mb-3 text-slate-600">

        {icon}

        <span className="text-sm font-medium">
          {title}
        </span>

      </div>

      <div className="flex flex-wrap gap-2">

        {items.length === 0
          ? <span className="text-xs text-slate-400">None</span>
          : items.map((s,i)=>(
              <span
                key={i}
                className="bg-slate-100 text-xs px-2 py-1 rounded"
              >
                {s}
              </span>
            ))}

      </div>

    </div>

  );

}