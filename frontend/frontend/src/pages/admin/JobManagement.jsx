import { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2, MapPin, Banknote, Clock, Briefcase, Search, Filter, Layers, TrendingUp, ShieldAlert, ChevronRight } from "lucide-react";
import { ListSkeleton } from "../../components/ui/Skeleton";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import EmptyState from "../../components/ui/EmptyState";

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/jobs");
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job mandate? This action is permanent.")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" ? true : j.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <ListSkeleton />;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-slate-100">
         <div>
            <Badge variant="primary" className="mb-4">Operational Oversight</Badge>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Mandate <span className="text-primary-600">Repository</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
              Preside over the global job registry and manage operational mandates.
            </p>
         </div>

         <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:max-w-xl">
            <div className="flex-1 w-full">
               <Input
                 icon={Search}
                 placeholder="Search mandates..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="py-4 shadow-xl shadow-slate-200/50"
               />
            </div>
            <div className="bg-slate-950 text-white px-8 py-4 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col group hover:bg-primary-600 transition-colors duration-500">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary-200 transition-colors">Total Entries</span>
               <span className="text-2xl font-black leading-none mt-1">{jobs.length}</span>
            </div>
         </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">
        {["all", "open", "paused", "closed"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-6 py-3 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all ${
              filter === s
                ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105"
                : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
            }`}
          >
            {s} Mandates
          </button>
        ))}
      </div>

      {filteredJobs.length === 0 ? (
        <EmptyState
           title="No mandates indexed"
           description="We couldn't find any job entries matching your current registry filter."
           actionLabel="View All Mandates"
           onAction={() => { setFilter("all"); setSearch(""); }}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredJobs.map((j) => (
            <Card
              key={j._id}
              hover
              className="p-10 group relative flex flex-col overflow-hidden"
            >
              {/* Status Indicator */}
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <Briefcase size={80} className="text-slate-50" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                       <Badge variant={j.status === "open" ? "success" : j.status === "paused" ? "warning" : "danger"} className="border-none px-3 py-1 text-[8px]">
                          {j.status}
                       </Badge>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{j.companyName || "Verified Entity"}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tighter leading-none mb-2">
                      {j.title}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       Mandate ID: {j._id.slice(-8)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => deleteJob(j._id)}
                    className="p-4 rounded-2xl border-none bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-xl shadow-transparent group-hover:shadow-rose-600/10"
                    title="Purge Record"
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 mt-auto border-t border-slate-50">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400">
                       <MapPin size={14} className="text-primary-600" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Location</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 truncate">{j.location}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Banknote size={14} className="text-primary-600" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Salary</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 truncate">{j.salaryRange || "TBD"}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Clock size={14} className="text-primary-600" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Contract</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 truncate">{j.jobType}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Layers size={14} className="text-primary-600" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Exp. Tier</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 truncate">{j.experience}+ Yrs</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* SYSTEM OPERATIONS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
         <Card className="p-10 bg-slate-950 text-white relative overflow-hidden group">
            <div className="relative z-10">
               <ShieldAlert size={40} className="text-rose-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
               <h3 className="text-xl font-black uppercase tracking-tight mb-4">Mandate Verification</h3>
               <p className="text-xs font-medium text-slate-400 mb-8 leading-relaxed uppercase tracking-widest">Execute platform-wide mandate validation and security audits.</p>
               <Button variant="danger" className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Initiate Audit</Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
         </Card>

         <Card className="p-10 border-2 border-slate-900 group">
            <TrendingUp size={40} className="text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-slate-900">Registry Analytics</h3>
            <p className="text-xs font-medium text-slate-500 mb-8 leading-relaxed uppercase tracking-widest">Analyze global registry volume and corporate acquisition metrics.</p>
            <Button className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Analyze Repository <ChevronRight size={16} className="ml-2" /></Button>
         </Card>
      </div>
    </div>
  );
}
