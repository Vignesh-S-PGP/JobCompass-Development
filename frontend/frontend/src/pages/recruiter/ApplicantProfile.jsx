import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"
import {
  MapPin,
  Briefcase,
  MessageCircle,
  ArrowLeft,
  Award,
  Mail,
  GraduationCap
} from "lucide-react"

export default function ApplicantProfile() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/applicants/${applicationId}/profile`)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [applicationId])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-10 space-y-8 animate-pulse">
        <div className="h-48 bg-slate-100 rounded-[40px]" />
        <div className="h-96 bg-slate-100 rounded-[40px]" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        <h1 className="text-2xl font-black">Applicant not found</h1>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-indigo-600 font-bold"
        >
          Go Back
        </button>
      </div>
    )
  }

  const { profile, email } = data

  const handleStartChat = async () => {
    try {
      const res = await api.post("/chat/start", { applicationId })
      navigate(`/recruiter/chat/${res.data.conversationId}`)
    } catch (err) {
      console.error("Chat start failed", err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10 pb-20">

      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-5 py-3 bg-white border rounded-2xl font-bold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={18} /> Back to Applicants
        </button>

        <button
          onClick={handleStartChat}
          className="flex items-center gap-3 bg-white border px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px]"
        >
          <MessageCircle size={18} /> Message
        </button>
      </div>

      {/* HEADER */}
      <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900" />
        <div className="px-10 pb-10">
          <div className="flex flex-col md:flex-row gap-8 -mt-20">
            <div className="w-40 h-40 rounded-[32px] bg-white border-[6px] shadow-2xl overflow-hidden">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-5xl font-black text-white">
                  {profile?.fullName?.[0]}
                </div>
              )}
            </div>

            <div className="flex-1 pt-20 md:pt-0">
              <h1 className="text-4xl font-black">{profile?.fullName}</h1>
              <p className="text-lg font-bold text-slate-500 mt-1">
                {profile?.headline}
              </p>

              <div className="flex flex-wrap gap-6 mt-4 text-sm font-bold text-slate-400">
                <span className="flex items-center gap-2">
                  <MapPin size={16} /> {profile?.location}
                </span>
                <span className="flex items-center gap-2">
                  <Briefcase size={16} /> {profile?.experience} Years
                </span>
                <span className="flex items-center gap-2">
                  <Mail size={16} /> {email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section className="bg-white rounded-[40px] border p-10 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6">
          Professional Narrative
        </h3>
        <p className="text-slate-600 text-lg leading-relaxed italic border-l-4 pl-6">
          {profile?.bio || "No bio provided"}
        </p>
      </section>

      {/* SKILLS */}
      <section className="bg-white rounded-[40px] border p-10 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6">
          Technical Skills
        </h3>
        <div className="flex flex-wrap gap-3">
          {profile?.skills?.map((skill, i) => (
            <div
              key={i}
              className="px-5 py-3 rounded-2xl bg-slate-50 border flex items-center gap-3"
            >
              <Award size={16} className="text-indigo-500" />
              <span className="text-xs font-black uppercase">{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="bg-white rounded-[40px] border p-10 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8">
          Career Trajectory
        </h3>

        <div className="space-y-10 relative before:absolute before:left-5 before:top-0 before:h-full before:w-0.5 before:bg-slate-200">
          {profile?.detailedExperience?.map((exp, i) => (
            <div key={i} className="relative flex gap-6 pl-10">
              <div className="absolute left-0 top-2 w-10 h-10 bg-slate-100 border rounded-full flex items-center justify-center">
                <Briefcase size={16} />
              </div>

              <div className="bg-white border rounded-[32px] p-6 shadow-sm w-full">
                <div className="flex justify-between mb-1">
                  <h4 className="font-black">{exp.role}</h4>
                  <span className="text-xs font-bold text-indigo-500">
                    {exp.duration || "—"}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-500">
                  {exp.company}
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section className="bg-white rounded-[40px] border p-10 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8">
          Education
        </h3>

        <div className="space-y-6">
          {profile?.education?.map((edu, i) => (
            <div
              key={i}
              className="flex gap-6 p-6 rounded-[32px] bg-slate-50 border"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap size={20} />
              </div>

              <div>
                <h4 className="font-black text-slate-900">
                  {edu.degree}
                </h4>
                <p className="text-sm font-bold text-slate-500">
                  {edu.school}
                </p>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  {edu.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}