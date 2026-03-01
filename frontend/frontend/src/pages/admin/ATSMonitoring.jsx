import { useState, useEffect } from "react"
import api from "../../services/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ShieldCheck, TrendingUp, Cpu, Sparkles, Layers, Info, Filter } from "lucide-react"
import Card from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import { Skeleton } from "../../components/ui/Skeleton"

export default function ATSMonitoring() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchATSStats()
  }, [])

  const fetchATSStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/ats-monitoring")

      const formattedData = res.data.distribution.map(item => ({
        range: `${item._id}-${item._id + 9}`,
        count: item.count
      }))
      setData(formattedData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ["#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81", "#1e1b4b", "#0f172a", "#020617", "#000000", "#1d1e52"]

  if (loading) return (
    <div className="space-y-12 animate-pulse">
       <div className="h-20 w-64 bg-slate-100 rounded-xl" />
       <div className="h-96 w-full bg-slate-100 rounded-[3rem]" />
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-64 bg-slate-100 rounded-[3rem]" />
          <div className="h-64 bg-slate-100 rounded-[3rem]" />
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-slate-100">
         <div>
            <Badge variant="primary" className="mb-4">Intelligence Monitoring</Badge>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              ATS <span className="text-primary-600">Intelligence</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
              Real-time visualization of professional alignment and scoring distribution across the platform.
            </p>
         </div>

         <div className="flex items-center gap-4 bg-slate-950 text-white px-8 py-4 rounded-3xl shadow-xl shadow-slate-200/50 self-start md:self-auto group">
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Global Score Avg</span>
               <span className="text-3xl font-black leading-none mt-1 group-hover:text-primary-500 transition-colors">72.4%</span>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
               <Cpu size={20} className="text-primary-500" />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* CHART MODULE */}
          <Card className="p-10 md:p-16 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-100">
                 <div className="flex items-center gap-4">
                    <TrendingUp size={24} className="text-primary-600" />
                    <div className="flex flex-col">
                       <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Score Distribution</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Statistical Spread of Transmission Alignment</p>
                    </div>
                 </div>
                 <Button variant="ghost" size="sm" icon={Info} />
              </div>

              <div className="h-[400px] w-full mt-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="range"
                      axisLine={false}
                      tickLine={false}
                      tick={{fill: "#94a3b8", fontSize: 10, fontWeight: 800}}
                      dy={20}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{fill: "#94a3b8", fontSize: 10, fontWeight: 800}}
                      dx={-20}
                    />
                    <Tooltip
                      cursor={{fill: "#f8fafc"}}
                      contentStyle={{
                        borderRadius: "24px",
                        border: "none",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
                        padding: "20px",
                        backgroundColor: "#0f172a",
                        color: "#fff"
                      }}
                      itemStyle={{color: "#6366f1", fontWeight: "900", fontSize: "14px", textTransform: "uppercase"}}
                      labelStyle={{color: "#94a3b8", fontWeight: "800", fontSize: "10px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "2px"}}
                    />
                    <Bar dataKey="count" radius={[12, 12, 0, 0]} barSize={40}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Visual BG element */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-[100px] -mr-32 -mb-32" />
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-12">
           {/* ACCURACY MODULE */}
           <Card className="p-10 text-center relative overflow-hidden group">
              <div className="relative z-10">
                <ShieldCheck size={40} className="mx-auto mb-8 text-primary-600 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Engine Precision</h3>
                <div className="text-6xl font-black text-slate-900 tracking-tighter mb-4 group-hover:text-primary-600 transition-colors">84<span className="text-2xl text-primary-500 font-black uppercase">%</span></div>
                <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">System confidence based on recruiter shortlisting actions & manual validation nodes.</p>
                <div className="mt-10 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-primary-600 rounded-full w-[84%]" />
                </div>
              </div>
           </Card>

           {/* KEYWORDS MODULE */}
           <Card className="p-10">
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                 <Sparkles size={20} className="text-primary-600" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Global Skill Trends</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                 {["React", "Node.js", "Python", "AWS", "Docker", "SQL", "Tailwind", "Typescript", "Go", "Redis"].map(k => (
                   <span key={k} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-primary-300 hover:bg-white transition-all cursor-default">
                     {k}
                   </span>
                 ))}
              </div>
           </Card>

           <div className="bg-slate-950 p-10 rounded-[3rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <Layers size={32} className="mb-6 text-primary-500" />
                <h4 className="text-xl font-black tracking-tight uppercase mb-4 leading-none">Engine Calibration</h4>
                <p className="text-xs font-medium text-slate-400 mb-10 leading-relaxed uppercase tracking-widest">Adjustment of system weighting parameters and technical stack indexing logic.</p>
                <Button className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-600/30">
                  Calibrate System
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl -mr-16 -mt-16" />
           </div>
        </div>
      </div>
    </div>
  )
}
