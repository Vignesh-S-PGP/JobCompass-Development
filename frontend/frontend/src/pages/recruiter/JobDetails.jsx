import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"
import {
  ArrowLeft,
  Edit,
  PauseCircle,
  PlayCircle,
  XCircle,
  MapPin,
  Briefcase,
  Banknote,
  Clock,
  Layers,
  Cpu,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Sparkles
} from "lucide-react"
import { DetailSkeleton } from "../../components/ui/Skeleton"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"

export default function RecruiterJobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/jobs/${jobId}`)
      .then(res => setJob(res.data.job))
      .catch(err => console.error("Failed to fetch job", err))
      .finally(() => setLoading(false))
  }, [jobId])

  const updateStatus = async (status) => {
    try {
      await api.patch(`/jobs/${jobId}/status`, { status })
      setJob(j => ({ ...j, status }))
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  if (loading) return <DetailSkeleton />;
  if (!job) return (
    <div className="max-w-4xl mx-auto p-20 text-center animate-in fade-in">
      <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Mandate Not Found</h1>
      <p className="text-slate-500 font-medium mb-10">The job mandate you're looking for does not exist in the platform registry.</p>
      <Button onClick={() => navigate(-1)} icon={ArrowLeft}>Return to Repository</Button>
    </div>
  );

  const statusVariants = {
    open: "success",
    active: "success",
    paused: "warning",
    closed: "danger"
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">

      {/* NAVIGATION & QUICK ACTIONS */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/recruiter/jobs")}
          icon={ArrowLeft}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900"
        >
          Return to Registry
        </Button>
        <div className="flex items-center gap-4">
           <Badge variant={statusVariants[job.status] || "primary"} className="px-6 py-2 rounded-2xl border-none shadow-lg shadow-slate-200/50 font-black uppercase tracking-[0.2em] text-[10px]">
              {job.status} Mandate
           </Badge>
           <Button
             onClick={() => navigate(`/recruiter/jobs/${jobId}/applicants`)}
             icon={TrendingUp}
             className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/30"
           >
             Analyze Pipeline
           </Button>
        </div>
      </div>

      {/* COMMAND HEADER CARD */}
      <div className="bg-slate-950 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-primary-500/15 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-900/10 rounded-full blur-[100px] -ml-40 -mb-40" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
               <Badge className="bg-primary-500/10 text-primary-400 border-primary-500/20">{job.jobType}</Badge>
               <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{job.experience}+ Yrs Req</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase mb-6">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-8 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              <span className="flex items-center gap-3 group/item hover:text-white transition-colors cursor-default">
                <MapPin size={18} className="text-primary-600" /> {job.location}
              </span>
              <span className="flex items-center gap-3 group/item hover:text-white transition-colors cursor-default">
                <Banknote size={18} className="text-primary-600" /> ₹{job.salaryRange || "TBD"} Compensation
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
             <Button size="lg" onClick={() => navigate(`/recruiter/jobs/${jobId}/edit`)} className="px-10 py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black" icon={Edit}>
               Edit Mandate
             </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* MANDATE SPECIFICATIONS */}
        <div className="lg:col-span-8 space-y-12">
          <Card className="p-10 md:p-16">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
              <Layers size={24} className="text-primary-600" />
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Mandate Specification</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Role Context & Professional Mission</p>
              </div>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-medium italic border-l-4 border-primary-100 pl-8 py-2">
                {job.description}
              </p>
            </div>

            {job.skillsRequired?.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-4 mb-10">
                  <Cpu size={24} className="text-primary-600" />
                  <div className="flex flex-col">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Verified Technical Stack</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Core Capability Requirements</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {job.skillsRequired.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl group hover:border-primary-300 hover:bg-white transition-all">
                      <div className="w-2 h-2 rounded-full bg-primary-500 group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* OPERATIONS PANEL */}
        <div className="lg:col-span-4 space-y-10">
          <Card className="p-10 border-2 border-slate-900 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-slate-100">
                <ShieldCheck size={24} className="text-primary-600" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Mandate Controls</h3>
              </div>

              <div className="space-y-4">
                {job.status === "open" && (
                  <Button
                    variant="outline"
                    onClick={() => updateStatus("paused")}
                    className="w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] border-amber-100 text-amber-600 hover:bg-amber-50"
                    icon={PauseCircle}
                  >
                    Pause Mandate
                  </Button>
                )}

                {job.status === "paused" && (
                  <Button
                    variant="primary"
                    onClick={() => updateStatus("open")}
                    className="w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-600 hover:bg-emerald-700 border-none"
                    icon={PlayCircle}
                  >
                    Activate Mandate
                  </Button>
                )}

                {job.status !== "closed" && (
                  <Button
                    variant="outline"
                    onClick={() => updateStatus("closed")}
                    className="w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] border-rose-100 text-rose-600 hover:bg-rose-50"
                    icon={XCircle}
                  >
                    Close Mandate
                  </Button>
                )}

                <div className="p-8 mt-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center group">
                   <Users size={32} className="mx-auto mb-4 text-slate-200 group-hover:text-primary-600 transition-colors group-hover:scale-110 duration-500" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Talent Indexed</p>
                   <p className="text-4xl font-black text-slate-950">{(job.applicants || []).length}</p>
                   <Button
                      variant="ghost"
                      onClick={() => navigate(`/recruiter/jobs/${jobId}/applicants`)}
                      className="mt-6 text-[10px] font-black uppercase tracking-widest text-primary-600 hover:bg-primary-50"
                      icon={ChevronRight}
                   >
                      View Pipeline
                   </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-primary-950 p-10 rounded-[3rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <Sparkles size={32} className="mb-6 text-primary-500" />
                <h3 className="font-black text-white text-lg mb-3 uppercase tracking-tight">System Intelligence</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-10">
                  Optimizing your mandate specification increases the ATS matching accuracy by <span className="text-white font-bold">18.5%</span> on average.
                </p>
                <div className="h-1 w-16 bg-primary-600 rounded-full" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
