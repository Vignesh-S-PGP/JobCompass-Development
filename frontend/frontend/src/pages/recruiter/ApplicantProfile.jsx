import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  MapPin,
  Briefcase,
  MessageCircle,
  ArrowLeft,
  ExternalLink,
  Award,
  BookOpen,
  Mail,
  Zap,
  CheckCircle2,
  FileText
} from "lucide-react";

export default function ApplicantProfile() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/applicants/${applicationId}/profile`)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (loading) return (
    <div className="max-w-6xl mx-auto p-10 space-y-8 animate-pulse">
       <div className="h-48 bg-slate-100 rounded-[40px]" />
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 h-96 bg-slate-100 rounded-[40px]" />
          <div className="lg:col-span-4 h-96 bg-slate-100 rounded-[40px]" />
       </div>
    </div>
  );

  if (!data) return (
    <div className="max-w-6xl mx-auto p-10 text-center">
       <h1 className="text-2xl font-black text-slate-900">Applicant data not found</h1>
       <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 font-bold hover:underline">Return to list</button>
    </div>
  );

  const { profile, email, resume, application, ats: atsFromData } = data;
  // Fallback to data.ats if it's returned directly
  const ats = atsFromData || application?.ats || {};

  const handleStartChat = async () => {
    try {
      const res = await api.post("/chat/start", { applicationId })
      navigate(`/recruiter/chat/${res.data.conversationId}`)
    } catch (err) {
      console.error("Failed to start chat", err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10 pb-20">

      {/* TOP NAVIGATION */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-500 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm"
        >
          <ArrowLeft size={18} /> Back to Applicants
        </button>

        <div className="flex gap-3">
           <button
             onClick={handleStartChat}
             className="flex items-center gap-3 bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all shadow-sm"
           >
             <MessageCircle size={18} /> Message
           </button>
           <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
             <Zap size={18} /> Schedule Interview
           </button>
        </div>
      </div>

      {/* HERO SECTION - HYBRID LOOK */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>
        <div className="px-10 pb-10">
          <div className="relative flex flex-col md:flex-row items-end gap-8 -mt-20">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[32px] bg-white border-[6px] border-white shadow-2xl overflow-hidden">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-5xl font-black text-white">
                    {profile?.fullName?.[0]}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                 <CheckCircle2 size={20} className="text-white" />
              </div>
            </div>

            <div className="flex-1 pb-2 text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile?.fullName}</h1>
              <p className="text-lg font-bold text-slate-500 mt-1">{profile?.headline}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-sm font-bold text-slate-400">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-500" /> {profile?.location}
                </span>
                <span className="flex items-center gap-2">
                  <Briefcase size={16} className="text-indigo-500" /> {profile?.experience} Years Experience
                </span>
                <span className="flex items-center gap-2">
                  <Mail size={16} className="text-indigo-500" /> {email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* MAIN CONTENT */}
        <div className="lg:col-span-8 space-y-10">

          {/* ABOUT */}
          <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Professional Narrative</h3>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium text-lg italic border-l-4 border-slate-50 pl-6">
              {profile?.bio || "Candidate has not provided a detailed bio yet."}
            </p>
          </section>

          {/* SKILLS VISUALIZATION */}
          <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Technical Competencies</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile?.skills?.map((s, i) => (
                <div
                  key={i}
                  className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 hover:border-indigo-600 hover:bg-white transition-all shadow-sm"
                >
                  <Award size={16} className="text-indigo-500" />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">{s}</span>
                </div>
              ))}
            </div>
          </section>

          {/* EXPERIENCE TIMELINE MOCKUP */}
          <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Career Trajectory</h3>
             </div>
             <div className="space-y-10 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {[1, 2].map(i => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                       <Briefcase size={16} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                       <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-black text-slate-900">Senior Developer</div>
                          <time className="font-black text-[10px] uppercase tracking-widest text-indigo-500">2021 – Present</time>
                       </div>
                       <div className="text-slate-500 font-bold text-sm">TechCorp Global Solutions</div>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-10">

          {/* ATS SCORE BREAKDOWN */}
          <section className="bg-indigo-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 text-center">ATS Intelligence</h3>
                <div className="relative w-40 h-40 mx-auto mb-8">
                   <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-800" strokeWidth="3" />
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-400" strokeWidth="3" strokeDasharray={`${ats.score || 0}, 100`} strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black">{ats.score || 0}%</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mt-1">Match Rate</span>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Key Strengths</p>
                      <ul className="space-y-2">
                         {ats.matched_skills?.slice(0, 3).map((s, i) => (
                            <li key={i} className="text-xs font-bold flex items-center gap-2">
                               <div className="w-1 h-1 bg-emerald-400 rounded-full" /> {s}
                            </li>
                         ))}
                      </ul>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-2">Identified Gaps</p>
                      <ul className="space-y-2">
                         {ats.missing_skills?.slice(0, 3).map((s, i) => (
                            <li key={i} className="text-xs font-bold flex items-center gap-2">
                               <div className="w-1 h-1 bg-rose-400 rounded-full" /> {s}
                            </li>
                         ))}
                      </ul>
                   </div>
                </div>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
          </section>

          {/* DOCUMENTS */}
          <section className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-6 text-center">Verified Assets</h3>
             <div className="space-y-4">
                <div className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-900 transition-all cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-slate-800">
                         <FileText size={18} className="text-indigo-600" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-900 group-hover:text-white uppercase tracking-tight truncate w-32">
                           {resume?.title || resume?.filename || "Resume.pdf"}
                         </p>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Version</p>
                      </div>
                   </div>
                   <button
                     onClick={() => window.open(`${api.defaults.baseURL}/resumes/view/${resume?.id}`, "_blank")}
                     className="p-2 text-slate-300 group-hover:text-white"
                   >
                      <ExternalLink size={18} />
                   </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl opacity-50">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                         <BookOpen size={18} className="text-amber-600" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Portfolio.pdf</p>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Not Uploaded</p>
                      </div>
                   </div>
                </div>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}
