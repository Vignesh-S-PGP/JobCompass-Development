import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  ChevronLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Building2,
  Users,
  CheckCircle,
  Share2,
  Bookmark,
  Sparkles,
  Zap,
  ChevronRight,
  Target
} from "lucide-react";
import { Card, Button, Badge, Skeleton, Tabs } from "../../components/ui";
import { motion, AnimatePresence } from "framer-motion";
import ATSModal from "./ATSModal";

export default function JobDetails({ job: initialJob, onBack }) {
  const [job, setJob] = useState(initialJob);
  const [loading, setLoading] = useState(!initialJob);
  const [activeTab, setActiveTab] = useState("description");
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showATS, setShowATS] = useState(false);

  useEffect(() => {
    if (!initialJob?._id) return;
    fetchJobDetails();
    checkStatus();
  }, [initialJob?._id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/jobs/${initialJob._id}`);
      setJob(res.data.job);
    } catch (err) {
      console.error("Failed to fetch job details", err);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const [savedRes, appsRes] = await Promise.all([
        api.get("/jobs/saved"),
        api.get("/applications/my")
      ]);
      setIsSaved((savedRes.data.savedJobs || []).some(j => j._id === initialJob._id));
      setIsApplied((appsRes.data.applications || []).some(a => a.jobId === initialJob._id));
    } catch (err) {}
  };

  const toggleSave = async () => {
    try {
      if (isSaved) {
        await api.delete(`/jobs/${job._id}/save`);
        setIsSaved(false);
      } else {
        await api.post(`/jobs/${job._id}/save`);
        setIsSaved(true);
      }
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 rounded-[40px]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-96 rounded-3xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "description", label: "Job Description" },
    { id: "company", label: "About Company" },
    { id: "reviews", label: "Reviews (0)" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* BACK BUTTON */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="group text-muted-foreground hover:text-foreground -ml-4"
      >
        <ChevronLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to search
      </Button>

      {/* HEADER SECTION */}
      <div className="relative overflow-hidden rounded-[40px] bg-slate-900 text-white p-12 lg:p-16">
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-start justify-between">
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center p-3 overflow-hidden shadow-2xl">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt="" className="w-full h-full object-contain" />
                ) : (
                  <Building2 size={32} className="text-slate-900" />
                )}
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">{job.title}</h1>
                <p className="text-primary text-xl font-bold mt-1">{job.company?.name}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 text-sm font-black uppercase tracking-[0.15em] text-slate-400">
              <span className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" /> {job.location}
              </span>
              <span className="flex items-center gap-2">
                <Briefcase size={18} className="text-primary" /> {job.jobType}
              </span>
              <span className="flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-500" /> {job.salaryRange || "Competitive"}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-amber-500" /> Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.skillsRequired?.map(skill => (
                <Badge key={skill} className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl backdrop-blur-md">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Card className="glass border-white/10 p-8 w-full lg:w-96 flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Application Deadline</p>
                  <p className="text-sm font-bold text-white">Aug 24, 2025</p>
               </div>
               <Badge className="bg-emerald-500 text-white border-none py-1">Active</Badge>
            </div>

            {isApplied ? (
              <Button size="lg" className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs" disabled>
                <CheckCircle size={18} className="mr-2" /> Application Sent
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => setShowATS(true)}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
              >
                <Zap size={18} className="mr-2" /> Apply with ATS Match
              </Button>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                className={`flex-1 h-12 rounded-2xl border-white/10 text-white hover:bg-white/10 ${isSaved ? "bg-white/10 border-white/40" : ""}`}
                onClick={toggleSave}
              >
                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} className="mr-2" />
                {isSaved ? "Saved" : "Save Job"}
              </Button>
              <Button variant="outline" className="h-12 w-12 rounded-2xl border-white/10 text-white hover:bg-white/10">
                <Share2 size={18} />
              </Button>
            </div>

            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
              Join 52 other applicants for this role
            </p>
          </Card>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[150px] rounded-full translate-x-1/2" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-10">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "description" ? (
              <Card className="p-10 prose prose-slate dark:prose-invert max-w-none shadow-sm rounded-[32px]">
                <h3 className="text-2xl font-black text-foreground mb-6">About the role</h3>
                <div className="text-muted-foreground font-medium leading-relaxed whitespace-pre-line text-lg">
                  {job.description}
                </div>

                <div className="mt-12 space-y-6">
                  <h4 className="text-xl font-black text-foreground">Key Responsibilities</h4>
                  <ul className="space-y-4 list-none p-0">
                    {[1, 2, 3, 4].map(i => (
                      <li key={i} className="flex gap-4 items-start text-muted-foreground font-medium">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                          <CheckCircle size={14} className="text-primary" />
                        </div>
                        Collaborate with cross-functional teams to design and implement new features for our flagship application.
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ) : activeTab === "company" ? (
              <Card className="p-10 shadow-sm rounded-[32px] space-y-8">
                 <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center p-4">
                       <Building2 size={40} className="text-primary" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black">{job.company?.name || "The Company"}</h3>
                       <p className="text-muted-foreground font-bold">Innovation & Technology • 250-500 Employees</p>
                    </div>
                 </div>
                 <p className="text-muted-foreground font-medium leading-relaxed text-lg">
                    {job.company?.description || "At our core, we're a team of innovators, dreamers, and doers, working together to build a better future for our customers and communities. We believe in transparency, empathy, and constant growth."}
                 </p>
                 <Button variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 py-6">
                    Visit Company Website <ChevronRight size={16} className="ml-2" />
                 </Button>
              </Card>
            ) : null}
          </motion.div>
        </div>

        <aside className="lg:col-span-4 space-y-8 sticky top-24">
          <Card className="p-8 shadow-sm rounded-[32px] bg-primary/5 border-primary/10 overflow-hidden relative">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-primary" /> Match Insights
            </h3>
            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Skill Match</span>
                  <span className="text-sm font-black text-primary">85%</span>
               </div>
               <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-primary" transition={{ duration: 1, delay: 0.5 }} />
               </div>
               <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Exp. Relevance</span>
                  <span className="text-sm font-black text-emerald-500">High</span>
               </div>
               <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "95%" }} className="h-full bg-emerald-500" transition={{ duration: 1, delay: 0.7 }} />
               </div>
            </div>
            <div className="mt-8 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-white/50 dark:border-white/5">
               <p className="text-xs font-bold text-muted-foreground italic">
                 "Your background in React and Node.js makes you a strong candidate for this role."
               </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
          </Card>

          <Card className="p-8 shadow-sm rounded-[32px]">
            <h3 className="text-lg font-black text-foreground mb-6">Company Benefits</h3>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { icon: <Target className="text-indigo-500" />, label: "401k Plan" },
                 { icon: <Clock className="text-emerald-500" />, label: "Flexible Hours" },
                 { icon: <Users className="text-amber-500" />, label: "Inclusive Team" },
                 { icon: <Briefcase className="text-rose-500" />, label: "Paid Leave" },
               ].map((b, i) => (
                 <div key={i} className="p-3 bg-muted/40 rounded-2xl flex flex-col items-center text-center gap-2 border border-border">
                    <div className="p-2 bg-background rounded-xl shadow-sm">{b.icon}</div>
                    <span className="text-[10px] font-black uppercase tracking-wider">{b.label}</span>
                 </div>
               ))}
            </div>
          </Card>
        </aside>
      </div>

      <ATSModal
        isOpen={showATS}
        onClose={() => setShowATS(false)}
        jobId={job._id}
        onSuccess={() => {
          setIsApplied(true);
          setShowATS(false);
        }}
      />
    </div>
  );
}
