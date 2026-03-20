import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  Star,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";
import JobDetails from "./JobDetails";

export default function JobSeekerDashboard() {

  const [stats,setStats] = useState({
    applied:0,
    shortlisted:0,
    rejected:0
  });

  const [recommendedJobs,setRecommendedJobs] = useState([]);
  const [loading,setLoading] = useState(true);
  const [selectedJob,setSelectedJob] = useState(null);

  useEffect(()=>{

    const fetchData = async()=>{

      try{

        const [appsRes,jobsRes] = await Promise.all([
          api.get("/applications/my"),
          api.get("/job-feed")
        ]);

        const apps = appsRes.data.applications || [];

        setStats({
          applied:apps.length,
          shortlisted:apps.filter(a=>a.status==="shortlisted").length,
          rejected:apps.filter(a=>a.status==="rejected").length
        });

        setRecommendedJobs(
          jobsRes.data.recommended?.slice(0,3) || []
        );

      }catch(err){
        console.error("Dashboard data fetch failed",err);
      }
      finally{
        setLoading(false);
      }

    };

    fetchData();

  },[]);

  if(selectedJob){
    return(
      <JobDetails
        job={selectedJob}
        onBack={()=>setSelectedJob(null)}
      />
    );
  }

  if(loading){
    return(
      <div className="animate-pulse space-y-6">

        <div className="h-8 w-40 bg-slate-200 rounded"/>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i=>(
            <div key={i} className="h-24 bg-slate-200 rounded-xl"/>
          ))}
        </div>

        <div className="h-64 bg-slate-200 rounded-xl"/>

      </div>
    );
  }

  const statCards = [

    {
      label:"Applications",
      value:stats.applied,
      icon:<Clock size={20}/>,
      color:"text-indigo-600",
      bg:"bg-indigo-50"
    },

    {
      label:"Shortlisted",
      value:stats.shortlisted,
      icon:<CheckCircle size={20}/>,
      color:"text-emerald-600",
      bg:"bg-emerald-50"
    },

    {
      label:"Rejected",
      value:stats.rejected,
      icon:<XCircle size={20}/>,
      color:"text-rose-600",
      bg:"bg-rose-50"
    }

  ];

  return(

    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-semibold text-slate-900">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Track your job applications and discover new opportunities
          </p>

        </div>

        <Link
          to="/jobseeker/jobs"
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition"
        >

          Explore Jobs
          <ArrowRight size={16}/>

        </Link>

      </div>


      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {statCards.map(card=>(

          <div
            key={card.label}
            className="bg-white border rounded-xl p-5 flex items-center gap-4 hover:shadow-sm transition"
          >

            <div className={`${card.bg} ${card.color} p-3 rounded-lg`}>
              {card.icon}
            </div>

            <div>

              <p className="text-xs text-slate-400">
                {card.label}
              </p>

              <p className="text-xl font-semibold text-slate-900">
                {card.value}
              </p>

            </div>

          </div>

        ))}

      </div>


      {/* RECOMMENDED JOBS */}

      <div className="space-y-6">

        <div className="flex items-center justify-between">

          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">

            <Star size={18} className="text-amber-500"/>
            Recommended Jobs

          </h2>

          <Link
            to="/jobseeker/jobs"
            className="text-sm text-indigo-600 hover:underline"
          >

            View All

          </Link>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {recommendedJobs.length>0 ? recommendedJobs.map(job=>(

            <div
              key={job._id}
              onClick={()=>setSelectedJob(job)}
              className="cursor-pointer bg-white border rounded-xl p-5 hover:shadow-md hover:border-indigo-500 transition"
            >

              <div className="flex gap-4">

                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">

                  {job.company?.logo
                    ? <img src={job.company.logo} className="w-full h-full object-cover"/>
                    : <Briefcase className="text-slate-400"/>}

                </div>

                <div>

                  <h3 className="font-medium text-slate-900">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    {job.company?.name} • {job.location}
                  </p>

                  <div className="flex gap-2 mt-2 flex-wrap">

                    {job.skillsRequired?.slice(0,3).map(skill=>(
                      <span
                        key={skill}
                        className="bg-slate-100 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}

                  </div>

                </div>

              </div>

            </div>

          )) : (

            <div className="col-span-full border border-dashed rounded-xl p-10 text-center text-slate-400 text-sm">

              No recommended jobs yet. Complete your profile to improve matches.

            </div>

          )}

        </div>

      </div>

    </div>

  );

}