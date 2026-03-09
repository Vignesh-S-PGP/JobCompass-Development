import {
  ArrowRight,
  MapPin,
  Briefcase,
  Clock,
  Bookmark
} from "lucide-react";

export default function JobCard({
  job = {},
  priority = false,
  matchedSkills = [],
  isSaved = false,
  onSaveToggle,
  onOpen
}) {
  const company = job.company ?? {};

  return (
    <div
      onClick={onOpen}
      className="group relative bg-white border border-slate-200 rounded-[32px] mb-4 p-8 cursor-pointer
      hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500"
    >
      {/* SAVE BUTTON */}
      <button
        onClick={(e) => onSaveToggle(job._id, e)}
        className="absolute top-6 right-6 p-2 rounded-xl bg-white border border-slate-200
        hover:bg-indigo-50 transition"
      >
        <Bookmark
          size={18}
          className={
            isSaved
              ? "fill-indigo-600 text-indigo-600"
              : "text-slate-400"
          }
        />
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* LEFT */}
        <div className="flex flex-1 items-center gap-6">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 p-2 flex items-center justify-center">
            {company.logo ? (
              <img
                src={company.logo}
                alt="logo"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="font-black text-slate-300 text-2xl">
                {company.name?.[0] || "?"}
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {company.name || "Company"}
            </span>

            <h3 className="text-xl font-black text-slate-900">
              {job.title || "Untitled Role"}
            </h3>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex gap-10">
          <div>
            <MapPin size={12} />
            <p className="text-xs font-black">{job.location || "—"}</p>
          </div>

          <div>
            <Clock size={12} />
            <p className="text-xs font-black">{job.jobType || "—"}</p>
          </div>

          <div>
            <Briefcase size={12} />
            <p className="text-xs font-black">
              {job.experience || 0}+ Yrs
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <ArrowRight size={20} />
      </div>
    </div>
  );
}