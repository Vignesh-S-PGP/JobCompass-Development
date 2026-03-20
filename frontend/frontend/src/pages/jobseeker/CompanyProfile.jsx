import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import JobCard from "./JobCard";
import JobDetails from "./JobDetails";
import {
  Building2,
  MapPin,
  Globe,
  Briefcase,
  Users,
  ChevronLeft,
  Users2,
  LayoutGrid,
  Sparkles,
  ExternalLink,
  Plus
} from "lucide-react";
import { Card, Button, Badge, Skeleton, EmptyState } from "../../components/ui";
import { motion, AnimatePresence } from "framer-motion";

export default function CompanyProfile() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [savedIds, setSavedIds] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/companies/${companyId}`),
      api.get("/companies/followed/ids"),
      api.get("/applications/saved/ids")
    ]).then(([companyRes, followRes, savedRes]) => {
      setCompany(companyRes.data.company);
      setJobs(companyRes.data.jobs || []);
      setFollowed(followRes.data.ids.includes(companyId));
      setSavedIds(savedRes.data.ids || []);
    }).finally(() => setLoading(false));
  }, [companyId]);

  const toggleFollow = async () => {
    const res = await api.post(`/companies/${companyId}/follow`);
    setFollowed(res.data.followed);
  };

  const toggleSave = async (jobId, e) => {
    e.stopPropagation();
    const res = await api.post(`/applications/saved/${jobId}`);
    setSavedIds(prev =>
      res.data.saved
        ? [...prev, jobId]
        : prev.filter(id => id !== jobId)
    );
  };

  if (selectedJob) {
    return (
      <JobDetails
        job={selectedJob}
        onBack={() => setSelectedJob(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-10 animate-pulse">
        <Skeleton className="h-64 rounded-[40px]" />
        <div className="grid md:grid-cols-2 gap-8">
           {[1, 2].map(i => <Skeleton key={i} className="h-48 rounded-[32px]" />)}
        </div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4">
      {/* HERO SECTION */}
      <Card className="p-0 overflow-hidden border-none rounded-[48px] shadow-sm ring-1 ring-border relative">
         <div className="h-48 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent relative">
            <Button
               variant="ghost"
               onClick={() => navigate(-1)}
               className="absolute top-8 left-8 bg-white/50 backdrop-blur-md hover:bg-white border-none rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px]"
            >
               <ChevronLeft size={18} className="mr-2" /> Back
            </Button>
         </div>
         <div className="px-12 pb-12">
            <div className="flex flex-col md:flex-row gap-10 -mt-20 relative z-10 items-end">
               <div className="w-40 h-40 rounded-[48px] bg-card p-2 shadow-2xl border-4 border-card">
                  <div className="w-full h-full rounded-[40px] bg-muted/20 flex items-center justify-center overflow-hidden">
                    {company.logo ? (
                      <img src={company.logo} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <Building2 size={48} className="text-muted-foreground" />
                    )}
                  </div>
               </div>
               <div className="flex-1 space-y-3 pb-2">
                  <div className="flex items-center gap-3">
                     <h1 className="text-5xl font-black tracking-tighter text-foreground">{company.name}</h1>
                     <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">
                        Verified Partner
                     </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    <span className="flex items-center gap-2 bg-muted/40 px-4 py-1.5 rounded-full"><Briefcase size={14} className="text-primary" /> {company.industry}</span>
                    <span className="flex items-center gap-2 bg-muted/40 px-4 py-1.5 rounded-full"><MapPin size={14} className="text-primary" /> {company.location}</span>
                    <span className="flex items-center gap-2 bg-muted/40 px-4 py-1.5 rounded-full"><Users size={14} className="text-primary" /> 100-500 EMP</span>
                  </div>
               </div>
               <div className="flex gap-4 pb-2">
                  {company.website && (
                     <Button
                        variant="outline"
                        asChild
                        className="h-14 px-8 rounded-2xl border-2 font-black uppercase tracking-widest text-[11px]"
                     >
                        <a href={company.website} target="_blank" rel="noreferrer">
                           Visit Site <ExternalLink size={16} className="ml-2" />
                        </a>
                     </Button>
                  )}
                  <Button
                    onClick={toggleFollow}
                    className={`h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl transition-all ${
                      followed ? "bg-slate-200 text-slate-700 shadow-none hover:bg-slate-300" : "shadow-primary/20"
                    }`}
                  >
                    {followed ? "Following" : "Follow"}
                  </Button>
               </div>
            </div>
         </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* ABOUT & CONTENT */}
         <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                     <Sparkles size={20} />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">About {company.name}</h2>
               </div>
               <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                  {company.about || "This company hasn't added a description yet."}
               </p>
            </section>

            <section className="space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <LayoutGrid size={20} />
                     </div>
                     <h2 className="text-2xl font-black tracking-tight">Open Positions</h2>
                  </div>
                  <Badge variant="secondary" className="px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                     {jobs.length} Opportunities
                  </Badge>
               </div>

               {jobs.length === 0 ? (
                  <EmptyState
                    title="No open roles yet"
                    description="This company isn't currently hiring for any positions. Follow them to stay updated!"
                    icon={<Briefcase size={48} />}
                  />
               ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {jobs.map(job => (
                      <JobCard
                        key={job._id}
                        job={job}
                        isSaved={savedIds.includes(job._id)}
                        onSaveToggle={toggleSave}
                        onOpen={() => setSelectedJob(job)}
                      />
                    ))}
                  </div>
               )}
            </section>
         </div>

         {/* SIDEBAR INFO */}
         <div className="lg:col-span-1 space-y-8">
            <Card className="p-8 rounded-[40px] border-none shadow-sm ring-1 ring-border space-y-8">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-border pb-4">Company Details</h3>

               <div className="space-y-6">
                  {[
                     { label: "Industry", value: company.industry, icon: <Briefcase size={16} /> },
                     { label: "Location", value: company.location, icon: <MapPin size={16} /> },
                     { label: "Size", value: "100-500 employees", icon: <Users2 size={16} /> },
                     { label: "Website", value: company.website, icon: <Globe size={16} />, link: true }
                  ].map((item, i) => (
                     <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary/60 shrink-0">
                           {item.icon}
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{item.label}</p>
                           {item.link ? (
                              <a href={item.value} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline truncate block max-w-[180px]">
                                 {item.value?.replace("https://", "").replace("http://", "")}
                              </a>
                           ) : (
                              <p className="text-sm font-bold text-foreground">{item.value || "—"}</p>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </Card>

            <Card className="p-8 rounded-[40px] bg-primary/5 border-none ring-1 ring-primary/10">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                     <Plus size={20} />
                  </div>
                  <h4 className="text-lg font-black tracking-tight">Stay Updated</h4>
               </div>
               <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">
                  Follow {company.name} to get notified as soon as they post new job opportunities.
               </p>
               <Button className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px]">
                  Turn on Notifications
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
}
