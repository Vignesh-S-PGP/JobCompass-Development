import { useState } from "react"
import api from "../../services/api"
import { 
  PlusCircle, 
  Sparkles, 
  MapPin, 
  Briefcase, 
  Clock, 
  Banknote,
  ListChecks,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Badge from "../../components/ui/Badge"
import Input from "../../components/ui/Input"

export default function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    experience: "",
    location: "",
    jobType: "",
    salaryRange: ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/jobs", {
        ...form,
        skillsRequired: form.skillsRequired
          .split(",")
          .map(s => s.trim())
          .filter(s => s !== "")
      })
      alert("Mandate published successfully to the global registry.")
      navigate("/recruiter/jobs")
    } catch (err) {
      console.error(err)
      alert("Critical error: Mandate transmission failed.")
    } finally {
      setLoading(false)
    }
  }

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
               Cancel Mandate
            </Button>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Issue <span className="text-primary-600">Mandate</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
              Initialize a new talent acquisition protocol within the JobCompass ecosystem.
            </p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

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
                name="title" 
                placeholder="e.g. Principal Systems Architect"
                onChange={handleChange} 
                required
                icon={Briefcase}
                className="py-4"
              />

              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mandate Description & mission</label>
                 <textarea
                   name="description"
                   placeholder="Detail the professional mission, responsibilities, and corporate context..."
                   onChange={handleChange}
                   className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-[2rem] p-8 min-h-[250px] outline-none focus:border-primary-600 focus:bg-white transition-all text-slate-600 font-medium custom-scrollbar"
                   required
                 />
              </div>
            </div>
          </Card>

          <Card className="p-10 md:p-16">
            <div className="flex items-center gap-4 mb-12 pb-6 border-b border-slate-100">
              <ListChecks size={24} className="text-primary-600" />
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Technical Qualifications</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Capability Requirements for ATS Alignment</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <Input
                  label="Industry Tenure (Yrs)"
                  name="experience"
                  placeholder="e.g. 5-8"
                  onChange={handleChange}
                  icon={TrendingUp}
                  className="py-4"
               />
               <Input
                  label="Verified Skills (CSV)"
                  name="skillsRequired"
                  placeholder="React, AWS, Python..."
                  onChange={handleChange}
                  icon={Zap}
                  className="py-4"
               />
            </div>
            <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
               Note: Skills provided here will be prioritized by the AI-ATS engine for automated candidate scoring.
            </p>
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
                name="location"
                placeholder="e.g. Remote / London"
                onChange={handleChange}
                icon={MapPin}
              />

              <Input
                label="Contract Model"
                name="jobType"
                placeholder="e.g. Full-time / Contract"
                onChange={handleChange}
                icon={Clock}
              />

              <Input
                label="Compensation Tier"
                name="salaryRange"
                placeholder="e.g. ₹20L - ₹35L"
                onChange={handleChange}
                icon={Banknote}
              />
            </div>
          </Card>

          <Card className="p-10 bg-slate-950 text-white relative overflow-hidden group">
            <div className="relative z-10 text-center">
               <ShieldCheck size={40} className="mx-auto mb-6 text-primary-500 group-hover:scale-110 transition-transform duration-500" />
               <h3 className="text-xl font-black uppercase tracking-tight mb-4">Registry Deployment</h3>
               <p className="text-xs font-medium text-slate-400 mb-10 leading-relaxed uppercase tracking-widest">
                 Publishing this mandate will make it visible to all verified professionals in the global registry.
               </p>
               <Button
                 type="submit"
                 loading={loading}
                 className="w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/30"
                 icon={ArrowRight}
               >
                 Execute Publication
               </Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl -mr-16 -mt-16" />
          </Card>

          <div className="bg-primary-50 p-10 rounded-[3rem] border border-primary-100 flex gap-4 items-start">
             <Info size={20} className="text-primary-600 shrink-0 mt-0.5" />
             <p className="text-[10px] font-bold text-primary-800 leading-relaxed uppercase tracking-tight">
               Mandates with detailed descriptions and specific compensation tiers receive <span className="font-black">40% more</span> qualified transmissions.
             </p>
          </div>
        </div>
      </form>
    </div>
  )
}
