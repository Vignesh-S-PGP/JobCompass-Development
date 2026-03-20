import {
  ArrowRight,
  MapPin,
  Briefcase,
  Clock,
  Bookmark
} from "lucide-react";

export default function JobCard({
  job = {},
  matchedSkills = [],
  isSaved = false,
  onSaveToggle,
  onOpen
}) {

  const company = job.company ?? {};

  return (

    <div
      onClick={onOpen}
      className="bg-white border rounded-xl p-6 flex items-center justify-between
      hover:shadow-lg hover:border-indigo-500 transition cursor-pointer"
    >

      {/* LEFT */}

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center">

          {company.logo ? (

            <img
              src={company.logo}
              className="max-h-full object-contain"
            />

          ) : (

            <span className="font-semibold text-slate-500">
              {company.name?.[0] || "?"}
            </span>

          )}

        </div>

        <div>

          <p className="text-sm font-medium text-slate-900">
            {job.title || "Untitled Role"}
          </p>

          <p className="text-xs text-slate-500">
            {company.name || "Company"}
          </p>

          {/* MATCHED SKILLS */}

          {matchedSkills.length > 0 && (

            <div className="flex gap-2 mt-2 flex-wrap">

              {matchedSkills.slice(0,3).map(skill => (

                <span
                  key={skill}
                  className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded"
                >
                  {skill}
                </span>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* CENTER */}

      <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">

        <div className="flex items-center gap-1">
          <MapPin size={14}/>
          {job.location || "—"}
        </div>

        <div className="flex items-center gap-1">
          <Clock size={14}/>
          {job.jobType || "—"}
        </div>

        <div className="flex items-center gap-1">
          <Briefcase size={14}/>
          {job.experience || 0}+ yrs
        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4">

        <button
          onClick={(e) => onSaveToggle(job._id, e)}
          className="text-slate-400 hover:text-indigo-600"
        >
          <Bookmark
            size={18}
            className={isSaved ? "fill-indigo-600 text-indigo-600" : ""}
          />
        </button>

        <ArrowRight size={18} className="text-slate-400"/>

      </div>

    </div>

  );
}