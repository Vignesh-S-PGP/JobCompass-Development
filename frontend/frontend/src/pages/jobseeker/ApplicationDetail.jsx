import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Globe
} from "lucide-react";
import api from "../../services/api";
import ATSBreakdown from "../../components/applications/ATSBreakdown";
import ResumePreview from "../../components/applications/ResumePreview";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  console.log("data:",app);

  useEffect(() => {
    api.get(`/applications/${id}`).then((res) => setApp(res.data.application));
  }, [id]);

  if (!app) {
    return (
      <div className="p-10 font-mono text-xs text-slate-400">
        LOADING_SYSTEM_DATA...
      </div>
    );
  }

  const statusStyle = {
    shortlisted: "bg-emerald-500 text-white",
    rejected: "bg-rose-500 text-white",
    applied: "bg-indigo-500 text-white",
    pending: "bg-amber-500 text-white",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">

      {/* TOP NAV */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-[11px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* HEADER CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-xl border bg-slate-50 flex items-center justify-center p-3">
              {app.company?.logo ? (
                <img src={app.company.logo} alt="logo" className="max-h-full" />
              ) : (
                <Building2 className="text-slate-300" />
              )}
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase">
                {app.job?.title}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-indigo-600 font-bold text-sm">
                  {app.company?.name}
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase">
                  <MapPin size={12} /> {app.job.location}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`${statusStyle[app.status] || statusStyle.pending}
              px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] self-start`}
          >
            {app.status}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT – JOB + ATS */}
        <div className="lg:col-span-2 space-y-6">

          {/* JOB DESCRIPTION */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-3 border-b bg-slate-50 flex items-center gap-2">
              <div className="w-1 h-3 bg-indigo-600 rounded-full" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Job Specification
              </h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {app.job?.description}
              </p>
            </div>
          </div>

          {/* ATS – UNCHANGED */}
          <ATSBreakdown ats={app.ats} score={app.atsScore} />
        </div>

        {/* RIGHT – COMPANY + META + RESUME */}
        <div className="space-y-6">

          {/* COMPANY OVERVIEW */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
              Company Overview
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {app.company?.about || "No company description available."}
            </p>

            {app.company?.website && (
              <a
                href={app.company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:underline"
              >
                <Globe size={14} /> Visit Website
              </a>
            )}
          </div>

          {/* RESUME – UNCHANGED */}
          <ResumePreview resume={app.resume} />

          {/* METADATA */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-3 border-b bg-slate-50 flex items-center gap-2">
              <div className="w-1 h-3 bg-indigo-600 rounded-full" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Metadata
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Type</span>
                <span className="flex items-center gap-1.5 font-black text-slate-900">
                  <Briefcase size={12} /> {app.job?.jobType}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Applied</span>
                <span className="flex items-center gap-1.5 font-black text-slate-900">
                  <Calendar size={12} />
                  {app.appliedAt
                    ? new Date(app.appliedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}