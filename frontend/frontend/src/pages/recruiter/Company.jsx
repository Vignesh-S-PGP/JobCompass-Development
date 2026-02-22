import { useEffect, useState } from "react"
import api from "../../services/api"
import { 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  Briefcase, 
  Camera, 
  Save, 
  ExternalLink 
} from "lucide-react"

export default function Company() {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    location: "",
    size: "",
    website: "",
    about: "",
    logo: ""
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get("/company/my").then(res => {
      if (res.data.company) {
        setForm(res.data.company)
      }
    })
  }, [])

  const handleLogoUpload = e => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () =>
      setForm({ ...form, logo: reader.result })
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    setSaving(true)
    await api.post("/company", form)
    setSaving(false)
    alert("Company profile saved")
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header / Hero Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-700" />
          <div className="px-8 pb-8">
            <div className="relative flex items-end gap-6 -mt-12">
              <div className="relative group">
                <img
                  src={form.logo || "/company-placeholder.png"}
                  alt="logo"
                  className="w-32 h-32 rounded-2xl object-cover bg-white border-4 border-white shadow-md"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Camera size={24} />
                  <input type="file" hidden onChange={handleLogoUpload} />
                </label>
              </div>

              <div className="flex-1 pb-2">
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter Company Name"
                  className="text-3xl font-black text-slate-900 w-full outline-none bg-transparent placeholder:text-slate-300"
                />
                <div className="flex items-center gap-4 text-slate-500 text-sm mt-1 font-medium">
                  <span className="flex items-center gap-1"><Briefcase size={14}/> {form.industry || "Industry"}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {form.location || "Location"}</span>
                </div>
              </div>

              {form.website && (
                <a
                  href={form.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mb-4 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <ExternalLink size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side: About */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="text-slate-400" size={20} />
                <h3 className="font-bold text-slate-900">About Company</h3>
              </div>
              <textarea
                value={form.about}
                onChange={e => setForm({ ...form, about: e.target.value })}
                placeholder="Describe your company culture, mission, and vision…"
                className="w-full border-none bg-slate-50 rounded-xl p-4 min-h-[200px] focus:ring-2 focus:ring-slate-900 transition-all text-slate-600 leading-relaxed"
              />
            </div>
          </div>

          {/* Right Side: Quick Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest border-b border-slate-100 pb-4">Company Details</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Industry</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      value={form.industry}
                      onChange={e => setForm({ ...form, industry: e.target.value })}
                      placeholder="e.g. Technology"
                      className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. New York, NY"
                      className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Company Size</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      value={form.size}
                      onChange={e => setForm({ ...form, size: e.target.value })}
                      placeholder="e.g. 11-50 employees"
                      className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      value={form.website}
                      onChange={e => setForm({ ...form, website: e.target.value })}
                      placeholder="https://company.com"
                      className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
            >
              {saving ? (
                <span className="animate-pulse">Saving Profile...</span>
              ) : (
                <>
                  <Save size={18} /> Save Company Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}