import Card from "./ui/Card";
import Badge from "./ui/Badge";
import { MapPin, Briefcase, ChevronRight } from "lucide-react";

export default function JobCard({ job, onClick }) {
  return (
    <Card
      hover
      onClick={onClick}
      className="p-6 md:p-8 cursor-pointer group relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary-200 transition-all duration-500 shadow-inner">
          <img
            src={
              job.company?.logo ||
              `https://logo.clearbit.com/${job.company?.name}.com`
            }
            alt={job.company?.name}
            className="w-full h-full object-contain p-2"
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
               {job.company?.name}
             </span>
             <Badge variant="primary" className="text-[8px] px-2 py-0.5 border-none">Verified</Badge>
          </div>
          <h2 className="text-xl font-black text-slate-950 group-hover:text-primary-600 transition-colors uppercase tracking-tight leading-none">
            {job.title}
          </h2>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
               <MapPin size={14} className="text-primary-600" /> {job.location}
            </div>
            <div className="flex items-center gap-1.5">
               <Briefcase size={14} className="text-primary-600" /> {job.jobType}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-end md:pl-6 border-t md:border-t-0 md:border-l border-slate-50 pt-6 md:pt-0 md:h-16">
           <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary-600 group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-sm">
              <ChevronRight size={20} />
           </div>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary-600/10 transition-all duration-700" />
    </Card>
  )
}
