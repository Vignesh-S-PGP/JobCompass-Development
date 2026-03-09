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
  Sparkles
} from "lucide-react";

export default function JobDetails({ job, onBack }) {
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");

  const company = job.company || {};

  useEffect(() => {
    api.get("/resumes").then(res =>
      setResumes(res.data.resumes || [])
    );
  }, []);

  /* ---------------- CHECK ATS ONLY ---------------- */
  const checkAtsScore = async () => {
    if (!resumeId) {
      setPopupMessage("Please select a resume to evaluate ATS score.");
      return;
    }

    setAtsLoading(true);
    try {
      const res = await api.post("/applications/ats-check", {
        jobId: job._id,
        resumeId
      });
      setAtsResult(res.data);
    } catch {
      setPopupMessage("Unable to calculate ATS score.");
    } finally {
      setAtsLoading(false);
    }
  };

  /* ---------------- APPLY JOB (UNCHANGED LOGIC) ---------------- */
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
    <div className="max-w-7xl mx-auto space-y-6 pb-20">

      {/* NAV */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
      >
        <ChevronLeft size={16} /> Back to Jobs
      </button>

      {/* HEADER */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-xl p-2">
            {company.logo ? (
              <img src={company.logo} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="text-slate-800" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black">{job.title}</h1>
            <div className="flex items-center gap-4 text-slate-400 mt-1">
              <span className="flex items-center gap-1 text-xs font-bold">
                <Building2 size={14} /> {company.name}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold">
                <MapPin size={14} /> {job.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-8 bg-white border rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="text-indigo-600" />
            <h3 className="text-xs font-black uppercase tracking-widest">
              Job Description
            </h3>
          </div>

          <p className="text-slate-600 whitespace-pre-line">
            {job.description}
          </p>

          {job.skillsRequired?.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="text-indigo-600" />
                <h4 className="text-xs font-black uppercase tracking-widest">
                  Required Skills
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-50 border rounded-lg text-xs font-bold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 space-y-6">

          {/* APPLICATION PANEL */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-widest">
                Application Panel
              </h3>
            </div>

            <select
              value={resumeId}
              onChange={e => setResumeId(e.target.value)}
              className="w-full p-3 border rounded-xl mb-4"
            >
              <option value="">Select Resume</option>
              {resumes.map(r => (
                <option key={r._id} value={r._id}>
                  {r.title}
                </option>
              ))}
            </select>

            {/* CHECK ATS */}
            <button
              onClick={checkAtsScore}
              disabled={atsLoading}
              className="w-full mb-3 bg-indigo-50 text-indigo-700 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-100 transition flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              Check ATS Score
            </button>

            {/* APPLY */}
            <button
              onClick={applyJob}
              disabled={atsLoading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition"
            >
              {atsLoading ? "Processing..." : "Initiate Application"}
            </button>
          </div>

          {/* COMPANY INFO */}
          <div className="bg-slate-50 border rounded-2xl p-6">
            <p className="text-xs font-bold">Industry</p>
            <p className="text-sm font-black">{company.industry}</p>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs font-black text-indigo-600 uppercase"
              >
                Visit Website <Globe size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* POPUP */}
      {popupMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm text-center">
            <p className="font-bold mb-4">{popupMessage}</p>
            <button
              onClick={() => setPopupMessage("")}
              className="w-full bg-slate-900 text-white py-2 rounded-xl font-bold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <ATSModal
        loading={atsLoading}
        data={atsResult}
        onClose={() => setAtsResult(null)}
      />
    </div>
  );
}