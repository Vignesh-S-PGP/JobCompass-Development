import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"
import {
  ChevronLeft,
  Edit,
  Save,
  Briefcase,
  Layers,
  MapPin,
  Clock,
  Banknote,
  Sparkles,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Badge from "../../components/ui/Badge"
import Input from "../../components/ui/Input"
import { DetailSkeleton } from "../../components/ui/Skeleton"

export default function RecruiterEditJob() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get(`/jobs/${jobId}`)
      .then(res => setForm(res.data.job))
      .catch(err => console.error("Failed to fetch job", err))
      .finally(() => setLoading(false))
  }, [jobId])

  const update = async () => {
    setSaving(true)
    try {
      await api.put(`/jobs/${jobId}`, {
        title: form.title,
        description: form.description,
        location: form.location,
        jobType: form.jobType,
        salaryRange: form.salaryRange,
        experience: form.experience,
        skillsRequired: typeof form.skillsRequired === 'string'
          ? form.skillsRequired.split(',').map(s => s.trim()).filter(s => s !== '')
          : form.skillsRequired
      })
      navigate(`/recruiter/jobs/${jobId}`)
    } catch (err) {
      console.error("Failed to update mandate", err)
      alert("Critical error: Mandate update failed.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DetailSkeleton />;
  if (!form) return (
    <div className="max-w-4xl mx-auto p-20 text-center animate-in fade-in">
      <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Mandate Not Found</h1>
      <p className="text-slate-500 font-medium mb-10">The job mandate you're trying to edit does not exist in the platform registry.</p>
      <Button onClick={() => navigate(-1)} icon={ChevronLeft}>Return to Registry</Button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-slate-100">
         <div>
            <Button
               variant="ghost"
               icon={ChevronLeft}
               onClick={() => navigate(-1)}
               className="mb-6 -ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900"
            >
               Discard Changes
            </Button>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Modify <span className="text-primary-600">Mandate</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
              Update parameters for mandate ID: <span className="font-black text-slate-900">{jobId.slice(-8)}</span> within the global registry.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT COLUMN: CORE SPECIFICATIONS */}
        <div className="lg:col-span-8 space-y-12">
          <Card className="p-10 md:p-16">
            <div className="flex items-center gap-4 mb-12 pb-6 border-b border-slate-100">
              <Sparkles size={24} className="text-primary-600" />
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Essential Data</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Primary Mandate Identifiers</p>
              </div>
            </div>

            <div className="space-y-10">
              <Input
                label="Professional Job Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                icon={Briefcase}
                className="py-4"
              />

              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mandate Description & mission</label>
                 <textarea
                   value={form.description}
                   onChange={e => setForm({ ...form, description: e.target.value })}
                   className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-[2rem] p-8 min-h-[300px] outline-none focus:border-primary-600 focus:bg-white transition-all text-slate-600 font-medium custom-scrollbar"
                   required
                 />
              </div>
            </div>
          </Card>

          <Card className="p-10 md:p-16">
            <div className="flex items-center gap-4 mb-12 pb-6 border-b border-slate-100">
              <Zap size={24} className="text-primary-600" />
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Technical Qualifications</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Capability Requirements for ATS Alignment</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <Input
                  label="Industry Tenure (Yrs)"
                  value={form.experience}
                  onChange={e => setForm({ ...form, experience: e.target.value })}
                  icon={Zap}
                  className="py-4"
               />
               <Input
                  label="Verified Skills (CSV)"
                  value={Array.isArray(form.skillsRequired) ? form.skillsRequired.join(', ') : form.skillsRequired}
                  onChange={e => setForm({ ...form, skillsRequired: e.target.value })}
                  icon={Layers}
                  className="py-4"
               />
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: LOGISTICS & ACTION */}
        <div className="lg:col-span-4 space-y-10">
          <Card className="p-10">
            <div className="flex items-center gap-4 mb-10 pb-4 border-b border-slate-100">
              <MapPin size={20} className="text-primary-600" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Logistics Node</h3>
            </div>

            <div className="space-y-8">
              <Input
                label="Operational Location"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                icon={MapPin}
              />

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contract Model</label>
                 <select
                   value={form.jobType}
                   onChange={e => setForm({ ...form, jobType: e.target.value })}
                   className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none cursor-pointer hover:border-primary-600 transition-colors"
                 >
                   <option value="Full-time">Full-time</option>
                   <option value="Part-time">Part-time</option>
                   <option value="Contract">Contract</option>
                   <option value="remote">Remote</option>
                   <option value="onsite">Onsite</option>
                   <option value="hybrid">Hybrid</option>
                 </select>
              </div>

              <Input
                label="Compensation Tier"
                value={form.salaryRange}
                onChange={e => setForm({ ...form, salaryRange: e.target.value })}
                icon={Banknote}
              />
            </div>
          </Card>

          <Card className="p-10 bg-slate-950 text-white relative overflow-hidden group">
            <div className="relative z-10 text-center">
               <ShieldCheck size={40} className="mx-auto mb-6 text-primary-500 group-hover:scale-110 transition-transform duration-500" />
               <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-white">Registry Control</h3>
               <p className="text-xs font-medium text-slate-400 mb-10 leading-relaxed uppercase tracking-widest">
                 Updating this mandate will immediately synchronize the data across the platform for all verified professionals.
               </p>
               <Button
                 onClick={update}
                 loading={saving}
                 className="w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/30"
                 icon={Save}
               >
                 Verify & Synchronize
               </Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl -mr-16 -mt-16" />
          </Card>

          <div className="bg-primary-50 p-10 rounded-[3rem] border border-primary-100 flex gap-4 items-start">
             <Info size={20} className="text-primary-600 shrink-0 mt-0.5" />
             <p className="text-[10px] font-bold text-primary-800 leading-relaxed uppercase tracking-tight">
               System Node ID: <span className="font-black">{jobId}</span>. All modifications are logged within the governance audit trail.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
