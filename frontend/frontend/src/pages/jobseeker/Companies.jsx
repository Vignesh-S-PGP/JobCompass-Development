import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Building2, Users2, Briefcase, Globe, ArrowRight, Sparkles } from "lucide-react";
import { Card, Button, Input, Badge, Skeleton, EmptyState } from "../../components/ui";
import { motion, AnimatePresence } from "framer-motion";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [followedIds, setFollowedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/companies"),
      api.get("/companies/followed/ids")
    ]).then(([res1, res2]) => {
      setCompanies(res1.data.companies || []);
      setFilteredCompanies(res1.data.companies || []);
      setFollowedIds(res2.data.ids || []);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...companies];
    if (search) {
      result = result.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.industry?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (location) {
      result = result.filter(c => c.location === location);
    }
    setFilteredCompanies(result);
  }, [search, location, companies]);

  const toggleFollow = async (companyId, e) => {
    e.stopPropagation();
    const res = await api.post(`/companies/${companyId}/follow`);
    setFollowedIds(prev =>
      res.data.followed
        ? [...prev, companyId]
        : prev.filter(id => id !== companyId)
    );
  };

  const locations = [...new Set(companies.map(c => c.location).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Companies</h1>
          <p className="text-muted-foreground font-medium">Explore top workplaces and follow your favorites.</p>
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4 flex items-center gap-4">
           <Building2 size={24} className="text-primary" />
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Partners</p>
              <p className="text-2xl font-black text-primary leading-none">{companies.length}</p>
           </div>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-muted/10 p-4 rounded-[32px] border border-border">
        <div className="flex-1 relative w-full">
           <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
           <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies by name or industry..."
              className="w-full h-14 bg-card border-none rounded-2xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
           />
        </div>
        <div className="flex items-center gap-3 bg-card border border-border rounded-2xl h-14 px-4 min-w-[200px]">
           <MapPin size={20} className="text-muted-foreground" />
           <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium outline-none"
           >
              <option value="">All Locations</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
           </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-[40px]" />)}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <EmptyState
           title="No companies found"
           description="We couldn't find any companies matching your current filters. Try adjusting your search!"
           actionLabel="Reset Filters"
           onAction={() => { setSearch(""); setLocation(""); }}
           icon={<Building2 size={48} />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCompanies.map((c, i) => (
              <motion.div
                key={c._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  onClick={() => navigate(`/jobseeker/companies/${c._id}`)}
                  className="p-8 h-full flex flex-col group hover:border-primary/50 transition-all shadow-sm hover:shadow-2xl hover:shadow-primary/5 overflow-hidden relative rounded-[40px]"
                >
                   <div className="flex-1 space-y-6">
                      <div className="flex justify-between items-start">
                         <div className="w-16 h-16 rounded-[24px] bg-muted/40 flex items-center justify-center p-3 border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-all transform group-hover:scale-110 duration-500">
                            {c.logo ? (
                               <img src={c.logo} alt="" className="w-full h-full object-contain" />
                            ) : (
                               <Building2 size={28} className="text-muted-foreground" />
                            )}
                         </div>
                         <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-none text-[8px] font-black uppercase tracking-widest px-2 py-1">
                            {c.industry || "General"}
                         </Badge>
                      </div>

                      <div className="space-y-2">
                         <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-none tracking-tight">
                            {c.name}
                         </h3>
                         <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                            <MapPin size={14} className="text-primary/60" /> {c.location || "Remote"}
                         </div>
                      </div>

                      <div className="flex items-center gap-4 py-2 border-y border-border/50">
                         <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                               <div key={i} className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[8px] font-black">
                                  {String.fromCharCode(64 + i)}
                               </div>
                            ))}
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Hiring</span>
                      </div>
                   </div>

                   <div className="mt-8 flex items-center gap-3">
                      <Button
                        onClick={(e) => toggleFollow(c._id, e)}
                        variant={followedIds.includes(c._id) ? "secondary" : "default"}
                        className={`flex-1 rounded-2xl h-11 font-black uppercase tracking-widest text-[10px] ${
                           followedIds.includes(c._id) ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : ""
                        }`}
                      >
                         {followedIds.includes(c._id) ? "Following" : "Follow"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl h-11 w-11 text-muted-foreground group-hover:text-primary transition-colors"
                      >
                         <ArrowRight size={18} />
                      </Button>
                   </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
