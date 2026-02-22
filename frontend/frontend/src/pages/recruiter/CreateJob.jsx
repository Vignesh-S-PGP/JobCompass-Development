import { useState } from "react"
import api from "../../services/api"
import { 
  PlusCircle, 
  Sparkles, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  ListChecks 
} from "lucide-react"

export default function CreateJob() {
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
      alert("Job created successfully")
    } catch (err) {
      console.error(err)
      alert("Error creating job")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
            <PlusCircle className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Post a New Opening</h1>
            <p className="text-slate-500 text-sm">Fill in the details to find your next great hire.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Core Info */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <Sparkles size={18} />
              <h2 className="text-xs font-black uppercase tracking-widest">Essential Details</h2>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Job Title</label>
              <input 
                name="title" 
                placeholder="e.g. Senior Full Stack Engineer" 
                onChange={handleChange} 
                className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-4 text-slate-900 font-medium transition-all" 
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Role Description</label>
              <textarea 
                name="description" 
                placeholder="What will they do? What is the mission?" 
                onChange={handleChange} 
                className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-4 min-h-[160px] text-slate-600 leading-relaxed transition-all" 
                required
              />
            </div>
          </div>

          {/* Section 2: Requirements & Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 mb-2">
                <ListChecks size={18} className="text-indigo-500" />
                <h3 className="text-[11px] font-black uppercase tracking-widest">Qualifications</h3>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Briefcase className="absolute left-4 top-3.5 text-slate-400" size={16} />
                  <input name="experience" placeholder="Experience (e.g. 3-5 years)" onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Skills (Comma Separated)</label>
                  <input name="skillsRequired" placeholder="React, Node.js, AWS..." onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 mb-2">
                <MapPin size={18} className="text-indigo-500" />
                <h3 className="text-[11px] font-black uppercase tracking-widest">Logistics</h3>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-slate-400" size={16} />
                  <input name="location" placeholder="Location (or Remote)" onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="relative">
                  <Clock className="absolute left-4 top-3.5 text-slate-400" size={16} />
                  <input name="jobType" placeholder="Job Type (Full-time, Contract)" onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="relative">
                  <DollarSign className="absolute left-4 top-3.5 text-slate-400" size={16} />
                  <input name="salaryRange" placeholder="Salary Range (e.g. $100k - $120k)" onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" className="text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors">Discard Draft</button>
            <button 
              disabled={loading}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 active:scale-95"
            >
              {loading ? "Publishing..." : "Publish Job Opening"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}