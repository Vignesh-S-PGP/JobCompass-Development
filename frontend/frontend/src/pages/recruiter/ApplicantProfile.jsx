import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { MapPin, Briefcase, MessageCircle, ArrowLeft } from "lucide-react";

export default function ApplicantProfile() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/applicants/${applicationId}/profile`)
      .then(res => setData(res.data))
      .catch(() => setData(null));
  }, [applicationId]);

  if (!data) return <div className="p-10">Loading...</div>;

  const { profile, email, resume } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-8 flex gap-6">
        <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden">
          {profile?.profileImage ? (
            <img src={profile.profileImage} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-white">
              {profile?.fullName?.[0]}
            </span>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile?.fullName}</h1>
          <p className="text-slate-500">{profile?.headline}</p>

          <div className="flex gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {profile?.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={14} /> {profile?.experience} yrs
            </span>
          </div>
        </div>

        {/* MESSAGE CTA */}
        <button
          onClick={() => navigate(`/recruiter/chat/${applicationId}`)}
          className="h-fit flex items-center gap-2 bg-indigo-600
                     hover:bg-indigo-700 text-white px-5 py-3 rounded-xl"
        >
          <MessageCircle size={18} />
          Message
        </button>
      </div>

      {/* ABOUT */}
      <section className="bg-white rounded-2xl shadow p-8">
        <h3 className="text-sm font-bold uppercase text-slate-400 mb-3">
          About
        </h3>
        <p className="text-slate-700 whitespace-pre-line">
          {profile?.bio || "No bio provided"}
        </p>
      </section>

      {/* SKILLS */}
      <section className="bg-white rounded-2xl shadow p-8">
        <h3 className="text-sm font-bold uppercase text-slate-400 mb-4">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile?.skills?.map((s, i) => (
            <span
              key={i}
              className="px-4 py-1 rounded-full bg-indigo-50
                         text-indigo-700 text-xs font-bold"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* RESUME */}
      {resume && (
        <section className="bg-white rounded-2xl shadow p-8">
          <h3 className="text-sm font-bold uppercase text-slate-400 mb-3">
            Resume
          </h3>
          <p className="font-semibold">{resume.title || resume.filename}</p>
          <button
            onClick={() => window.open(
              `/api/resumes/view/${resume.id}`, "_blank"
            )}
            className="mt-3 text-indigo-600 text-sm font-bold hover:underline"
          >
            View Resume
          </button>
        </section>
      )}

      {/* ACCOUNT */}
      <section className="bg-white rounded-2xl shadow p-8">
        <h3 className="text-sm font-bold uppercase text-slate-400 mb-3">
          Contact
        </h3>
        <p className="text-slate-700">{email}</p>
      </section>
    </div>
  );
}