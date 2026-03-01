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
  ExternalLink,
  ShieldCheck,
  Info,
  Sparkles
} from "lucide-react"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Badge from "../../components/ui/Badge"
import Input from "../../components/ui/Input"

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/company/my").then(res => {
      if (res.data.company) {
        setForm(res.data.company)
      }
    }).finally(() => setLoading(false))
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
    try {
      await api.post("/company", form)
      alert("Company profile updated successfully in the registry.")
    } catch (err) {
      console.error("Failed to save company profile", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto p-20 flex flex-col items-center justify-center gap-6 animate-pulse">
       <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem]" />
       <div className="h-10 bg-slate-100 w-64 rounded-xl" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">

      {/* HEADER / HERO SECTION */}
      <div className="bg-slate-950 rounded-[3rem] border border-slate-900 shadow-2xl overflow-hidden relative group">
        <div className="h-48 bg-gradient-to-r from-primary-950 via-slate-900 to-primary-950 opacity-50 group-hover:opacity-60 transition-opacity" />
        <div className="px-10 md:px-16 pb-12 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-10 -mt-20">
            <div className="relative group/logo">
              <div className="w-40 h-40 rounded-[2.5rem] bg-white border-[8px] border-slate-950 shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-500 group-hover/logo:border-primary-600">
                {form.logo ? (
                  <img
                    src={form.logo}
                    alt="logo"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Building2 size={48} className="text-slate-200" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-slate-950/60 text-white rounded-[2.5rem] opacity-0 group-hover/logo:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-sm border-[8px] border-transparent">
                <Camera size={28} className="group-hover/logo:scale-110 transition-transform" />
                <input type="file" hidden onChange={handleLogoUpload} />
              </label>
            </div>

            <div className="flex-1 pb-4 text-center md:text-left">
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="UNIDENTIFIED_ENTITY"
                className="text-4xl md:text-6xl font-black text-white w-full outline-none bg-transparent placeholder:text-white/10 tracking-tighter uppercase leading-none mb-6"
              />
              <div className="flex flex-wrap justify-center md:justify-start gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <span className="flex items-center gap-3 group/item hover:text-white transition-colors cursor-default">
                  <Briefcase size={16} className="text-primary-600" /> {form.industry || "Undefined Sector"}
                </span>
                <span className="flex items-center gap-3 group/item hover:text-white transition-colors cursor-default">
                  <MapPin size={16} className="text-primary-600" /> {form.location || "Global Coordinates"}
                </span>
              </div>
            </div>

            {form.website && (
              <a
                href={form.website}
                target="_blank"
                rel="noreferrer"
                className="mb-6 p-4 bg-white/5 border border-white/5 text-primary-500 hover:bg-primary-600 hover:text-white hover:border-primary-600 rounded-2xl transition-all duration-300 shadow-xl"
              >
                <ExternalLink size={24} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: About */}
        <div className="lg:col-span-8 space-y-12">
          <Card className="p-10 md:p-16">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
              <Info size={24} className="text-primary-600" />
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Entity Narrative</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Corporate Mission & Identity</p>
              </div>
            </div>
            <textarea
              value={form.about}
              onChange={e => setForm({ ...form, about: e.target.value })}
              placeholder="Enter professional company biography, mission statements, and operational overview..."
              className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-[2rem] p-8 min-h-[300px] outline-none focus:border-primary-600 focus:bg-white transition-all text-slate-600 text-lg leading-relaxed italic font-medium custom-scrollbar"
            />
          </Card>
        </div>

        {/* Right Side: Quick Details */}
        <div className="lg:col-span-4 space-y-10">
          <Card className="p-10">
            <div className="flex items-center gap-4 mb-10 pb-4 border-b border-slate-100">
              <ShieldCheck className="text-primary-600" size={20} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Entity Metadata</h3>
            </div>

            <div className="space-y-8">
              <Input
                label="Primary Industry"
                icon={Briefcase}
                value={form.industry}
                onChange={e => setForm({ ...form, industry: e.target.value })}
                placeholder="e.g. Artificial Intelligence"
              />

              <Input
                label="Global Location"
                icon={MapPin}
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Silicon Valley, CA"
              />

              <Input
                label="Operational Scale"
                icon={Users}
                value={form.size}
                onChange={e => setForm({ ...form, size: e.target.value })}
                placeholder="e.g. 500-1000 Nodes"
              />

              <Input
                label="Digital Domain"
                icon={Globe}
                value={form.website}
                onChange={e => setForm({ ...form, website: e.target.value })}
                placeholder="https://entity.io"
              />
            </div>
          </Card>

          {/* Action Module */}
          <div className="bg-slate-950 p-10 rounded-[3rem] text-white relative overflow-hidden group">
            <div className="relative z-10 text-center">
              <Sparkles size={32} className="mx-auto mb-6 text-primary-500" />
              <h4 className="text-xl font-black tracking-tighter uppercase mb-4">Registry Control</h4>
              <p className="text-xs font-medium text-slate-400 mb-10 leading-relaxed uppercase tracking-widest">Update your entity profile to optimize talent acquisition and employer branding.</p>

              <Button
                onClick={handleSubmit}
                loading={saving}
                className="w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-600/30"
                icon={Save}
              >
                Synchronize Profile
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl -mr-16 -mt-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
