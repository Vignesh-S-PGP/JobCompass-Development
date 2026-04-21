import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  ChevronLeft,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Send,
  Bookmark,
  Globe,
  CheckCircle,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Tabs from "../../components/ui/Tabs";
import Modal from "../../components/ui/Modal";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = id || new URLSearchParams(location.search).get("id");

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${jobId}`);
        setJob(res.data.job || null);

        const appsRes = await api.get("/applications/my");
        const alreadyApplied = appsRes.data.applications?.some(a => a.jobId === jobId);
        setApplied(alreadyApplied);

        const resumesRes = await api.get("/resumes");
        setResumes(resumesRes.data.resumes || []);
      } catch (err) {
        console.error("Failed to fetch job details", err);
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchJob();
  }, [jobId]);

  const handleCheckAts = async () => {
    if (!resumeId) {
      setError("Please select a resume first.");
      return;
    }
    setAtsLoading(true);
    setError("");
    try {
      const res = await api.post("/applications/ats-check", { jobId, resumeId });
      setAtsResult(res.data);
      setShowAtsModal(true);
    } catch (err) {
      setError("Unable to calculate ATS score.");
    } finally {
      setAtsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!resumeId) {
      setError("Please select a resume before applying.");
      return;
    }
    setIsApplying(true);
    setError("");
    try {
      const res = await api.post("/applications/apply", { jobId, resumeId });
      setApplied(true);
      setAtsResult(res.data);
      setShowAtsModal(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("You have already applied for this job.");
      } else {
        setError("Something went wrong during application.");
      }
    } finally {
      setIsApplying(false);
    }
  };

  const tabs = [
    { id: "description", label: "Description" },
    { id: "requirements", label: "Requirements" },
    { id: "company", label: "About Company" },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[500px] rounded-2xl" />
          <Skeleton className="h-[500px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!job) return <div className="text-center py-20 font-bold">Job not found.</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={18} className="mr-2" />
        Back to listings
      </Button>

      <header className="relative p-8 rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-primary/20 blur-[100px] transform rotate-12" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[100%] bg-indigo-600/20 blur-[80px]" />

        <div className="relative flex flex-col md:flex-row items-start gap-8">
          <div className="h-24 w-24 rounded-3xl bg-white flex items-center justify-center p-4 shadow-xl shrink-0">
             {job.company?.logo ? (
               <img src={job.company.logo} alt={job.company.name} className="h-full w-full object-contain" />
             ) : (
               <Building2 size={48} className="text-slate-900" />
             )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-white/20 text-white/80 bg-white/5 uppercase tracking-widest text-[10px]">
                {job.type}
              </Badge>
              {job.skillsRequired && job.skillsRequired.length > 0 && (
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/10 flex items-center gap-1">
                  <Sparkles size={10} />
                  Top Match
                </Badge>
              )}
            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight">{job.title}</h1>
              <p className="text-xl text-white/70 font-medium mt-1">{job.company?.name}</p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
              <div className="flex items-center text-white/60">
                <MapPin size={18} className="mr-2 text-primary" />
                <span className="text-sm font-medium">{job.location}</span>
              </div>
              <div className="flex items-center text-white/60">
                <Calendar size={18} className="mr-2 text-primary" />
                <span className="text-sm font-medium">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-white/60">
                <DollarSign size={18} className="mr-2 text-primary" />
                <span className="text-sm font-medium">{job.salaryRange || "Competitive Pay"}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10">
               <Bookmark size={20} />
            </Button>
            {applied && (
              <Badge className="h-12 px-8 rounded-2xl bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold text-sm">
                <ShieldCheck size={18} className="mr-2" />
                Applied
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm dark:bg-slate-900/50">
            <CardContent className="p-0">
              <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === "description" && (
                    <motion.div
                      key="desc"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="prose prose-slate dark:prose-invert max-w-none"
                    >
                      <h3 className="text-lg font-bold mb-4">Job Overview</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
                    </motion.div>
                  )}
                  {activeTab === "requirements" && (
                    <motion.div
                      key="req"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                         <h3 className="text-lg font-bold mb-4">Required Skills</h3>
                         <div className="flex flex-wrap gap-2">
                           {job.skillsRequired?.map((skill, i) => (
                             <Badge key={i} variant="secondary" className="px-4 py-1.5 rounded-xl border-border/50 text-sm">{skill}</Badge>
                           ))}
                         </div>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === "company" && (
                    <motion.div
                      key="comp"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center p-3 border border-border">
                           {job.company?.logo ? <img src={job.company.logo} alt="logo" /> : <Building2 size={32} className="text-muted-foreground" />}
                        </div>
                        <div>
                           <h3 className="text-xl font-bold">{job.company?.name}</h3>
                           <p className="text-sm text-muted-foreground">{job.company?.industry || "Tech Industry"}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{job.company?.description || "No company description provided."}</p>
                      {job.company?.website && (
                        <Button variant="outline" className="mt-2" onClick={() => window.open(job.company.website, '_blank')}>
                           <Globe size={16} className="mr-2" />
                           Visit Website
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl dark:bg-slate-900/50 overflow-hidden sticky top-24">
             <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg">Apply for this position</CardTitle>
                <CardDescription>Select a resume to continue</CardDescription>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                   <label className="text-sm font-semibold flex items-center gap-2">
                      <FileText size={16} className="text-primary" />
                      Your Resumes
                   </label>
                   <select
                    value={resumeId}
                    onChange={(e) => setResumeId(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                   >
                    <option value="">Select a resume</option>
                    {resumes.map(r => (
                      <option key={r._id} value={r._id}>{r.title}</option>
                    ))}
                   </select>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="w-full h-11 border-primary/20 text-primary hover:bg-primary/5"
                    onClick={handleCheckAts}
                    isLoading={atsLoading}
                  >
                    <Sparkles size={16} className="mr-2" />
                    Check ATS Score
                  </Button>

                  {!applied && (
                    <Button
                      className="w-full h-12 shadow-lg shadow-primary/20"
                      onClick={handleApply}
                      isLoading={isApplying}
                    >
                      Apply Now
                      <Send size={16} className="ml-2" />
                    </Button>
                  )}
                </div>

                <div className="pt-6 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Layers size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Industry</p>
                      <p className="text-sm font-bold">{job.company?.industry || "Technology"}</p>
                    </div>
                  </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showAtsModal}
        onClose={() => setShowAtsModal(false)}
        title={applied ? "Application Submitted!" : "ATS Score Analysis"}
      >
        <div className="space-y-6 text-center py-4">
           <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="364.42"
                  initial={{ strokeDashoffset: 364.42 }}
                  animate={{ strokeDashoffset: 364.42 - (364.42 * (atsResult?.score || 0)) / 100 }}
                  className="text-primary"
                />
              </svg>
              <span className="absolute text-3xl font-black">{atsResult?.score || 0}%</span>
           </div>

           <div>
              <h4 className="font-bold text-lg mb-2">Resume Match Score</h4>
              <p className="text-sm text-muted-foreground px-4">
                {atsResult?.analysis || "Your resume has been analyzed against the job requirements."}
              </p>
           </div>

           <div className="bg-muted/30 p-4 rounded-2xl text-left">
              <h5 className="text-xs font-bold uppercase tracking-wider mb-3 text-muted-foreground">Detailed Breakdown</h5>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                   <span>Skills Match</span>
                   <span className="font-bold text-emerald-500">High</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span>Experience Relevance</span>
                   <span className="font-bold text-primary">Medium</span>
                </div>
              </div>
           </div>

           <Button onClick={() => setShowAtsModal(false)} className="w-full">
              Close
           </Button>
        </div>
      </Modal>
    </div>
  );
}
