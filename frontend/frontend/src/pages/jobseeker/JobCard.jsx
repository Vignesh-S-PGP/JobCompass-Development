import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  Building2,
  DollarSign,
  Sparkles
} from "lucide-react";
import { Card, Button, Badge } from "../../components/ui";

export default function JobCard({
  job = {},
  matchedSkills = [],
  isSaved = false,
  onSaveToggle,
  onOpen
}) {
  const company = job.company ?? {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        onClick={onOpen}
        className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer hover:border-primary/50 transition-all shadow-sm hover:shadow-2xl hover:shadow-primary/5 rounded-[32px] overflow-hidden relative"
      >
        {/* MATCH INDICATOR IF SKILLS MATCH */}
        {matchedSkills.length > 0 && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-b-xl border-x border-b border-primary/20 flex items-center gap-1.5">
            <Sparkles size={10} /> Top Match
          </div>
        )}

        <div className="flex items-start md:items-center gap-6 flex-1">
          {/* LOGO */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] bg-muted/40 flex items-center justify-center p-3 border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-all transform group-hover:scale-110 duration-500 shrink-0">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center rounded-[18px] text-primary text-xl font-black">
                {company.name?.[0] || <Building2 size={24} />}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight">
                {job.title || "Untitled Role"}
              </h3>
              <p className="text-sm font-bold text-primary flex items-center gap-2">
                {company.name || "Company"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
              <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full"><MapPin size={12} className="text-primary/60" /> {job.location || "Remote"}</span>
              <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full"><Clock size={12} className="text-primary/60" /> {job.jobType || "Full-time"}</span>
              <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full"><DollarSign size={12} className="text-emerald-500" /> {job.salaryRange || "Competitive"}</span>
            </div>

            {/* SKILLS CHIPS */}
            {matchedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {matchedSkills.slice(0, 3).map(skill => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-primary/5 text-primary border-primary/10 text-[9px] font-black uppercase tracking-wider px-2 py-0.5"
                  >
                    {skill}
                  </Badge>
                ))}
                {matchedSkills.length > 3 && (
                  <span className="text-[9px] font-black text-muted-foreground self-center">+{matchedSkills.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-border">
          <div className="md:hidden flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <Briefcase size={12} /> {job.experience || 0}+ Yrs
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onSaveToggle(job._id, e);
              }}
              className={`rounded-2xl h-12 w-12 transition-all ${
                isSaved ? "bg-primary/10 text-primary shadow-inner" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <Bookmark
                size={22}
                className={isSaved ? "fill-primary" : ""}
              />
            </Button>

            <Button
              className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/10"
            >
              Details <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
