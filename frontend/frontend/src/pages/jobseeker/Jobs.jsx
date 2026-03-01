import { useEffect, useState } from "react";
import api from "../../services/api";
import JobDetails from "./JobDetails";
import { 
  ArrowRight, 
  MapPin, 
  Briefcase,
  Star,
  Clock,
  Search,
  Filter,
  Zap,
  TrendingUp,
  Cpu
} from "lucide-react";
import { ListSkeleton } from "../../components/ui/Skeleton";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import EmptyState from "../../components/ui/EmptyState";

export default function Jobs() {
  const [recommended, setRecommended] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experience: ""
  });

  useEffect(() => {
    Promise.all([
      api.get("/job-feed"),
      api.get("/profile")
    ]).then(([feedRes, profileRes]) => {
      setRecommended(feedRes.data.recommended || []);
      setAllJobs(feedRes.data.all || []);
      setFilteredJobs(feedRes.data.all || []);
      setProfile(profileRes.data.profile);
    }).catch(err => console.error("Failed to fetch jobs", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = allJobs;

    if (search) {
      result = result.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.location) {
      result = result.filter(j => j.location === filters.location);
    }

    if (filters.jobType) {
      result = result.filter(j => j.jobType === filters.jobType);
    }

    if (filters.experience) {
      result = result.filter(j => parseInt(j.experience) <= parseInt(filters.experience));
    }

    setFilteredJobs(result);
  }, [search, filters, allJobs]);

  const getMatchedSkills = (jobSkills) => {
    if (!profile?.skills) return [];
    return jobSkills.filter(s => profile.skills.some(ps => ps.toLowerCase() === s.toLowerCase()));
  };

  const JobRow = ({ job, priority }) => {
    const matched = getMatchedSkills(job.skillsRequired || []);

    return (
      <Card
        hover
        onClick={() => setSelectedJob(job)}
        className="mb-4 p-6 md:p-8 cursor-pointer group"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left: Branding & Identity */}
          <div className="flex flex-1 items-center gap-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 p-2 flex-shrink-0 flex items-center justify-center group-hover:border-primary-200 transition-colors">
              {job.company?.logo ? (
                <img src={job.company.logo} alt="logo" className="max-h-full max-w-full object-contain p-1" />
              ) : (
                <Briefcase className="text-slate-200" size={24} />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {job.company?.name}
                </span>
                {priority && (
                  <Badge variant="primary" className="flex items-center gap-1">
                    <Star size={8} fill="currentColor" /> Best Match
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors">
                {job.title}
              </h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {matched.slice(0, 3).map(s => (
                  <span key={s} className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border border-emerald-100">
                    {s}
                  </span>
                ))}
                {job.skillsRequired?.length > matched.length && (
                   <span className="text-[9px] font-black text-slate-400 uppercase px-2.5 py-1">+{job.skillsRequired.length - matched.length} Skills</span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Essential Data */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-12 shrink-0">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-slate-400">
                <MapPin size={12} />
                <p className="text-[9px] font-black uppercase tracking-widest">Location</p>
              </div>
              <p className="text-sm font-bold text-slate-900">{job.location}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-slate-400">
                <Clock size={12} />
                <p className="text-[9px] font-black uppercase tracking-widest">Contract</p>
              </div>
              <p className="text-sm font-bold text-slate-900">{job.jobType}</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-1.5 mb-1.5 text-slate-400">
                <TrendingUp size={12} />
                <p className="text-[9px] font-black uppercase tracking-widest">Experience</p>
              </div>
              <p className="text-sm font-bold text-slate-900">{job.experience}+ Yrs</p>
            </div>
          </div>

          {/* Right: Action */}
          <div className="flex items-center justify-end lg:pl-6">
               <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group-hover:border-primary-500">
                 <ArrowRight size={20} />
               </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) return <ListSkeleton />;
  if (selectedJob) return <JobDetails job={selectedJob} onBack={() => setSelectedJob(null)} />;

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <Badge variant="primary" className="mb-4">Live Registry</Badge>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Market <span className="text-primary-600">Feed</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
              Discover opportunities indexed from top-tier organizations within the JobCompass ecosystem.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            <Input
              icon={Search}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by role, company, or keywords..."
              className="py-4 shadow-xl shadow-slate-200/50"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">

        {/* Sidebar Filters */}
        <aside className="lg:w-80 shrink-0">
           <Card className="p-8 sticky top-8">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                <Filter size={18} className="text-primary-600" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Refine Search</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Target Location</label>
                  <select
                    value={filters.location}
                    onChange={e => setFilters({...filters, location: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none cursor-pointer hover:border-primary-200 transition-colors"
                  >
                    <option value="">Global (Anywhere)</option>
                    <option value="Remote">Remote</option>
                    <option value="New York">New York</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="London">London</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Employment Model</label>
                  <div className="grid grid-cols-1 gap-2">
                    {["Full-time", "Part-time", "Contract"].map(type => (
                      <button
                        key={type}
                        onClick={() => setFilters({...filters, jobType: filters.jobType === type ? "" : type})}
                        className={`text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          filters.jobType === type
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</label>
                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{filters.experience || 15}+ Yrs</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="15"
                    value={filters.experience || 15}
                    onChange={e => setFilters({...filters, experience: e.target.value})}
                    className="w-full accent-primary-600 mb-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase">
                    <span>Entry</span>
                    <span>Executive</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setFilters({location: "", jobType: "", experience: ""})}
                  className="w-full text-rose-500 hover:bg-rose-50 hover:text-rose-600 py-3 text-[10px] font-black uppercase tracking-widest"
                >
                  Clear Parameters
                </Button>
              </div>
           </Card>

           <div className="mt-8 bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <Cpu size={32} className="mb-6 text-primary-500" />
                <h4 className="text-xl font-black tracking-tight leading-tight mb-3 uppercase">AI Talent Matching</h4>
                <p className="text-xs font-medium text-slate-400 mb-8 leading-relaxed">Enable system intelligence to receive real-time alerts for roles that align with your verified skillset.</p>
                <Button className="w-full bg-white text-slate-900 hover:bg-primary-500 hover:text-white border-none py-3 text-[10px] font-black uppercase tracking-widest">Activate Alerts</Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl -mr-16 -mt-16" />
           </div>
        </aside>

        {/* Job Listings */}
        <div className="flex-1 space-y-12">
          {recommended.length > 0 && !search && !filters.location && !filters.jobType && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-600 shadow-[0_0_12px_rgba(99,121,247,0.5)] animate-pulse" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Priority Matches</h2>
              </div>
              <div>
                {recommended.slice(0, 3).map(job => (
                  <JobRow key={job._id} job={job} priority={true} />
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Registry Feed</h2>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Showing {filteredJobs.length} results</p>
            </div>

            {filteredJobs.length === 0 ? (
              <EmptyState
                title="No Roles Indexed"
                description="Your current search parameters don't match any indexed roles. Try broadening your criteria."
                actionLabel="View All Jobs"
                onAction={() => setFilters({location: "", jobType: "", experience: ""})}
              />
            ) : (
              <div className="space-y-4">
                {filteredJobs.map(job => (
                  <JobRow key={job._id} job={job} priority={false} />
                ))}
              </div>
            )}
          </section>
        </div>

      </div>
    </div>
  );
}
