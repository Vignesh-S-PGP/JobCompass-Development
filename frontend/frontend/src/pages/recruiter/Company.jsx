import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Camera,
  Save,
  ExternalLink,
  Plus,
  ArrowRight,
  Info,
  CheckCircle2
} from "lucide-react";
import { Card, Button, Input, Badge } from "../../components/ui";
import { motion, AnimatePresence } from "framer-motion";

export default function Company() {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    location: "",
    size: "",
    website: "",
    about: "",
    logo: ""
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get("/companies/my")
      .then(res => {
        if (res.data.company) {
          setForm(res.data.company);
        }
      });
  }, []);

  const handleLogoUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, logo: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.post("/companies", form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const SectionHeader = ({ icon, title, description }) => (
    <div className="flex items-start gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-black tracking-tight">{title}</h3>
        {description && <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mt-1">{description}</p>}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground font-medium">Control how your organization appears to potential candidates.</p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 min-w-[160px]"
        >
          {saving ? "Saving..." : success ? <><CheckCircle2 size={18} className="mr-2" /> Saved</> : <><Save size={18} className="mr-2" /> Save Profile</>}
        </Button>
      </div>

      {/* HERO SECTION REDESIGN */}
      <Card className="p-0 border-none rounded-[48px] shadow-sm ring-1 ring-border overflow-hidden relative">
        <div className="h-40 bg-slate-900 overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/10 to-transparent" />
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>
        <div className="px-12 pb-10">
           <div className="flex flex-col md:flex-row gap-8 -mt-16 relative z-10 items-end">
              <div className="relative group">
                 <div className="w-36 h-36 rounded-[44px] bg-card p-2 shadow-2xl border-4 border-card">
                    <img
                       src={form.logo || "/company-placeholder.png"}
                       className="w-full h-full rounded-[36px] bg-muted/20 object-cover"
                       alt=""
                    />
                 </div>
                 <label className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-3 rounded-2xl shadow-xl cursor-pointer hover:bg-primary transition-all border-4 border-card">
                    <Camera size={20} className="text-white"/>
                    <input type="file" hidden onChange={handleLogoUpload}/>
                 </label>
              </div>

              <div className="flex-1 space-y-3 pb-2">
                 <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter Company Name"
                    className="text-4xl font-black text-foreground outline-none w-full bg-transparent placeholder:text-muted-foreground/30 tracking-tight"
                 />
                 <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                    <span className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full"><Briefcase size={14} className="text-primary" /> {form.industry || "Set Industry"}</span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full"><MapPin size={14} className="text-primary" /> {form.location || "Set Location"}</span>
                 </div>
              </div>

              {form.website && (
                <Button variant="ghost" className="rounded-2xl h-14 w-14 group border border-border bg-card shadow-sm mb-2" asChild>
                   <a href={form.website} target="_blank" rel="noreferrer">
                      <ExternalLink size={20} className="text-primary group-hover:scale-110 transition-transform" />
                   </a>
                </Button>
              )}
           </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           {/* ABOUT */}
           <Card className="p-10 rounded-[40px] border-none shadow-sm ring-1 ring-border">
              <SectionHeader
                 icon={<Info size={22} />}
                 title="About Organization"
                 description="Company mission, culture, and values"
              />
              <textarea
                 value={form.about}
                 onChange={e => setForm({ ...form, about: e.target.value })}
                 placeholder="Describe your company's story. Candidates love to see what makes you unique!"
                 className="w-full bg-muted/30 border-none rounded-[32px] p-8 min-h-[300px] focus:ring-4 focus:ring-primary/10 outline-none text-foreground font-medium leading-relaxed transition-all"
              />
           </Card>
        </div>

        <div className="lg:col-span-1 space-y-10">
           {/* DETAILS CARD */}
           <Card className="p-10 rounded-[40px] border-none shadow-sm ring-1 ring-border space-y-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-border pb-6">Organization Details</h3>

              <div className="space-y-8">
                 <Input
                    label="Industry"
                    value={form.industry}
                    onChange={v => setForm({ ...form, industry: v.target.value })}
                    placeholder="e.g. Technology, Healthcare"
                    className="bg-muted/30 border-none rounded-xl h-12"
                 />
                 <Input
                    label="Location"
                    value={form.location}
                    onChange={v => setForm({ ...form, location: v.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="bg-muted/30 border-none rounded-xl h-12"
                 />
                 <Input
                    label="Company Size"
                    value={form.size}
                    onChange={v => setForm({ ...form, size: v.target.value })}
                    placeholder="e.g. 50-200 Employees"
                    className="bg-muted/30 border-none rounded-xl h-12"
                 />
                 <Input
                    label="Website"
                    value={form.website}
                    onChange={v => setForm({ ...form, website: v.target.value })}
                    placeholder="https://acme.inc"
                    className="bg-muted/30 border-none rounded-xl h-12"
                 />
              </div>
           </Card>

           {/* HIRING BADGE */}
           <Card className="p-8 rounded-[40px] bg-primary/5 border-none ring-1 ring-primary/10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Plus size={20} />
                 </div>
                 <h4 className="text-lg font-black tracking-tight">Active Hiring</h4>
              </div>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">
                 Maintaining an updated profile increases candidate trust and application rates by up to 40%.
              </p>
              <Button className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px]" onClick={() => navigate("/recruiter/jobs/create")}>
                 Create New Job <ArrowRight size={14} className="ml-2" />
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}
