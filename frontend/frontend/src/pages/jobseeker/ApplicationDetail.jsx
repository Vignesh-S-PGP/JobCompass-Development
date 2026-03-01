import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Globe,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Layers,
  Info
} from "lucide-react";
import api from "../../services/api";
import ATSBreakdown from "../../components/applications/ATSBreakdown";
import ResumePreview from "../../components/applications/ResumePreview";
import { DetailSkeleton } from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/applications/${id}`)
      .then((res) => setApp(res.data.application))
      .catch(err => console.error("Failed to load application detail", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStartChat = async () => {
    try {
      // Backend expects applicationId in payload for /chat/start
      const res = await api.post("/chat/start", { applicationId: id });
      navigate(`/jobseeker/chat/${res.data.conversationId}`);
    } catch (err) {
      console.error("Chat start failed", err);
    }
  };

  if (loading) return <DetailSkeleton />;

  if (!app) {
    return (
      <div className="max-w-4xl mx-auto p-20 text-center animate-in fade-in">
        <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Record Not Found</h1>
        <p className="text-slate-500 font-medium mb-10">The application transmission you're looking for does not exist in our registry.</p>
        <Button onClick={() => navigate(-1)} icon={ArrowLeft}>Return to Applied Jobs</Button>
      </div>
    );
  }

  const statusStyle = {
    shortlisted: "bg-emerald-500 text-white",
    rejected: "bg-rose-500 text-white",
    applied: "bg-primary-600 text-white",
    pending: "bg-amber-500 text-white",
  };

  const statusVariants = {
    shortlisted: "success",
    rejected: "danger",
    applied: "primary",
    pending: "warning",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">

      {/* TOP NAV & QUICK ACTIONS */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          icon={ArrowLeft}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900"
        >
          Return to Registry
        </Button>
        <div className="flex items-center gap-4">
           <Badge variant={statusVariants[app.status] || "primary"} className="px-5 py-2 rounded-2xl border-none shadow-lg shadow-slate-200/50 font-black uppercase tracking-[0.2em] text-[10px]">
              {app.status} Status
           </Badge>
           <Button
             onClick={handleStartChat}
             icon={MessageSquare}
             className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
           >
             Message Recruiter
           </Button>
        </div>
      </div>

      {/* COMMAND HEADER CARD */}
      <div className="bg-slate-950 border border-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-900/10 rounded-full blur-[100px] -ml-40 -mb-40" />

        <div className="p-10 md:p-16 flex flex-col md:flex-row justify-between gap-10 relative z-10">
          <div className="flex items-center gap-10">
            <div className="w-24 h-24 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center p-4 backdrop-blur-xl group-hover:border-primary-500 transition-colors">
              {app.company?.logo ? (
                <img src={app.company.logo} alt="logo" className="max-h-full max-w-full object-contain p-1" />
              ) : (
                <Building2 className="text-white/20" size={32} />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <Badge className="bg-primary-500/10 text-primary-400 border-primary-500/20">{app.job?.jobType}</Badge>
                 <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Transmission Successful</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                {app.job?.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 mt-2">
                <span className="text-primary-400 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                   <Building2 size={16} /> {app.company?.name}
                </span>
                <span className="text-white/20 hidden md:block">|</span>
                <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <MapPin size={16} /> {app.job?.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 self-end md:self-center">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Transmission Timestamp</p>
                <p className="text-sm font-bold text-white uppercase tracking-tight">
                   {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                   }) : "—"}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-12 gap-10">

        {/* LEFT – JOB + ATS */}
        <div className="lg:col-span-8 space-y-10">

          {/* JOB DESCRIPTION */}
          <Card className="overflow-hidden">
            <div className="px-10 py-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              <Layers size={20} className="text-primary-600" />
              <div className="flex flex-col">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
                  Role Specification
                </h2>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Context & Core Mission</p>
              </div>
            </div>
            <div className="p-10 md:p-12">
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line italic font-medium border-l-4 border-primary-100 pl-8">
                {app.job?.description}
              </p>
            </div>
          </Card>

          {/* ATS – UNCHANGED LOGIC, WRAPPED IN UI */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-900 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
            <div className="relative">
               <ATSBreakdown ats={app.ats} score={app.atsScore} />
            </div>
          </div>
        </div>

        {/* RIGHT – COMPANY + META + RESUME */}
        <div className="lg:col-span-4 space-y-10">

          {/* COMPANY OVERVIEW */}
          <Card className="p-10">
            <div className="flex items-center gap-3 mb-8">
               <Info size={18} className="text-primary-600" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                 Domain Intelligence
               </h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-10 font-medium">
              {app.company?.about || "No company description available in the registry."}
            </p>

            {app.company?.website && (
              <a
                href={app.company.website}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button variant="outline" className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest" icon={Globe}>
                  Visit External Site
                </Button>
              </a>
            )}
          </Card>

          {/* RESUME – UNCHANGED LOGIC, WRAPPED IN UI */}
          <div className="space-y-4">
             <div className="flex items-center gap-3 px-4">
                <ShieldCheck size={18} className="text-primary-600" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Submitted Asset</h3>
             </div>
             <ResumePreview resume={app.resume} />
          </div>

          {/* METADATA NODE */}
          <Card className="overflow-hidden">
            <div className="px-8 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              <Sparkles size={16} className="text-primary-600" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">
                Transmission Metadata
              </h2>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center group/item">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/item:text-primary-500 transition-colors">Contract Type</span>
                <span className="flex items-center gap-2 font-black text-xs text-slate-900 uppercase tracking-tight">
                  <Briefcase size={14} className="text-slate-200" /> {app.job?.jobType}
                </span>
              </div>

              <div className="flex justify-between items-center group/item">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/item:text-primary-500 transition-colors">Experience Tier</span>
                <span className="flex items-center gap-2 font-black text-xs text-slate-900 uppercase tracking-tight">
                  <Layers size={14} className="text-slate-200" /> {app.job?.experience}+ Yrs
                </span>
              </div>

              <div className="flex justify-between items-center group/item pt-4 border-t border-slate-50">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/item:text-primary-500 transition-colors">Indexed On</span>
                <span className="flex items-center gap-2 font-black text-xs text-slate-900 uppercase tracking-tight">
                  <Calendar size={14} className="text-slate-200" />
                  {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-GB") : "—"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
