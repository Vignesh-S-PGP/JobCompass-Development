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
  GraduationCap,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers
} from "lucide-react"
import { DetailSkeleton } from "../../components/ui/Skeleton"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"

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

  const handleStartChat = async () => {
    try {
      const res = await api.post("/chat/start", { applicationId })
      navigate(`/recruiter/chat/${res.data.conversationId}`)
    } catch (err) {
      console.error("Chat start failed", err)
    }
  }

  if (loading) return <DetailSkeleton />;

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-20 text-center animate-in fade-in">
        <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Profile Not Found</h1>
        <p className="text-slate-500 font-medium mb-10">The professional profile for this transmission is no longer available in the registry.</p>
        <Button onClick={() => navigate(-1)} icon={ArrowLeft}>Return to Applicants</Button>
      </div>
    );
  }

  const { profile, email } = data

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">

      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          icon={ArrowLeft}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900"
        >
          Return to Pipeline
        </Button>

        <div className="flex items-center gap-4">
           <Badge variant="primary" className="px-6 py-2 rounded-2xl border-none shadow-lg shadow-slate-200/50 font-black uppercase tracking-[0.2em] text-[10px]">
              Verified Identity
           </Badge>
           <Button
             onClick={handleStartChat}
             icon={MessageCircle}
             className="px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/30"
           >
             Direct Message
           </Button>
        </div>
      </div>

      {/* HEADER CARD */}
      <div className="bg-slate-950 rounded-[3rem] border border-slate-900 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] -mr-64 -mt-64 transition-all duration-700 group-hover:bg-primary-500/15" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-900/10 rounded-full blur-[100px] -ml-40 -mb-40" />

        <div className="px-10 md:px-20 pb-16 relative z-10 pt-16">
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
            <div className="w-48 h-48 rounded-[3rem] bg-slate-900 border-[8px] border-slate-950 shadow-2xl overflow-hidden shrink-0 group-hover:border-primary-600 transition-colors duration-500">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-primary-600 flex items-center justify-center text-6xl font-black text-white uppercase">
                  {profile?.fullName?.[0]}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-6 pt-4">
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4">{profile?.fullName}</h1>
                <p className="text-xl md:text-2xl font-bold text-primary-500 tracking-tight leading-relaxed max-w-2xl">
                  {profile?.headline || "Senior Professional Specialist"}
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-8 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                <span className="flex items-center gap-3 group/item hover:text-white transition-colors">
                  <MapPin size={18} className="text-primary-600" /> {profile?.location || "Global"}
                </span>
                <span className="flex items-center gap-3 group/item hover:text-white transition-colors">
                  <TrendingUp size={18} className="text-primary-600" /> {profile?.experience || "5"} Years Industry Tenure
                </span>
                <span className="flex items-center gap-3 group/item hover:text-white transition-colors">
                  <Mail size={18} className="text-primary-600" /> {email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* NARRATIVE */}
          <Card className="p-10 md:p-16">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
              <Layers size={24} className="text-primary-600" />
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Professional Narrative</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Career Philosophy & Objectives</p>
              </div>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed italic border-l-4 border-primary-100 pl-8 py-2 font-medium">
              {profile?.bio || "No professional narrative provided in the transmission."}
            </p>
          </Card>

          {/* EXPERIENCE */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 px-4">
              <ShieldCheck size={24} className="text-primary-600" />
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Career Trajectory</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Historical Mandate Execution</p>
              </div>
            </div>

            <div className="space-y-10 relative before:absolute before:left-10 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
              {profile?.detailedExperience?.map((exp, i) => (
                <div key={i} className="relative flex gap-10 pl-2">
                  <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-[2rem] flex items-center justify-center shrink-0 z-10 group hover:border-primary-500 transition-colors">
                    <Briefcase size={20} className="text-slate-300 group-hover:text-primary-600 transition-colors" />
                  </div>

                  <Card className="p-8 md:p-10 w-full hover:border-primary-100 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{exp.role}</h4>
                        <p className="text-sm font-black text-primary-600 uppercase tracking-widest leading-none">
                          {exp.company}
                        </p>
                      </div>
                      <Badge variant="primary" className="px-4 py-1.5 rounded-xl self-start md:self-center bg-primary-50 text-primary-700">
                        {exp.duration || "Mandate Term Unknown"}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-base leading-relaxed font-medium">
                      {exp.description}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-12">
          {/* SKILLS */}
          <Card className="p-10">
            <div className="flex items-center gap-4 mb-10 pb-4 border-b border-slate-100">
              <Cpu size={20} className="text-primary-600" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Technical Arsenal</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile?.skills?.map((skill, i) => (
                <div
                  key={i}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 group hover:border-primary-300 hover:bg-white transition-all"
                >
                  <Award size={14} className="text-primary-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{skill}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* EDUCATION */}
          <Card className="p-10">
            <div className="flex items-center gap-4 mb-10 pb-4 border-b border-slate-100">
              <GraduationCap size={20} className="text-primary-600" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Academic Foundation</h3>
            </div>

            <div className="space-y-10">
              {profile?.education?.map((edu, i) => (
                <div
                  key={i}
                  className="flex gap-6 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary-950 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-slate-200">
                    <GraduationCap size={20} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                      {edu.degree}
                    </h4>
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-widest">
                      {edu.school}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Term: {edu.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* PIPELINE ACTIONS */}
          <div className="bg-slate-950 p-10 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="relative z-10 text-center">
                <MessageCircle size={32} className="mx-auto mb-6 text-primary-500" />
                <h4 className="text-xl font-black tracking-tighter uppercase mb-3">Initiate Dialogue</h4>
                <p className="text-xs font-medium text-slate-400 mb-10 leading-relaxed uppercase tracking-widest">Accelerate the acquisition process with a direct communication channel.</p>
                <Button onClick={handleStartChat} className="w-full py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-600/30">
                  Execute Chat <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl -mr-16 -mt-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
