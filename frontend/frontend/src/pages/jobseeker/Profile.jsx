import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { 
  Camera, 
  MapPin, 
  Briefcase, 
  Plus, 
  X, 
  Save, 
  User, 
  Zap,
  CheckCircle2,
  GraduationCap,
  Building2,
  Calendar,
  Trash2,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import { DetailSkeleton } from "../../components/ui/Skeleton";

export default function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    headline: "",
    location: "",
    experience: "",
    skills: [],
    bio: "",
    profileImage: "",
    education: [],
    detailedExperience: []
  });

  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/profile").then(res => {
      if (res.data.profile) {
        setForm({
            ...form,
            ...res.data.profile,
            education: res.data.profile.education || [],
            detailedExperience: res.data.profile.detailedExperience || []
        });
      }
    }).catch(err => console.error("Profile load failed", err))
      .finally(() => setLoading(false));
  }, []);

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (form.skills.includes(skillInput.trim())) return;
    setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
    setSkillInput("");
  };

  const removeSkill = skill =>
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });

  const addEducation = () => {
    setForm({
      ...form,
      education: [...form.education, { school: "", degree: "", year: "" }]
    });
  };

  const updateEducation = (index, field, value) => {
    const newEdu = [...form.education];
    newEdu[index][field] = value;
    setForm({ ...form, education: newEdu });
  };

  const removeEducation = (index) => {
    setForm({ ...form, education: form.education.filter((_, i) => i !== index) });
  };

  const addExperience = () => {
    setForm({
      ...form,
      detailedExperience: [...form.detailedExperience, { company: "", role: "", duration: "", description: "" }]
    });
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...form.detailedExperience];
    newExp[index][field] = value;
    setForm({ ...form, detailedExperience: newExp });
  };

  const removeExperience = (index) => {
    setForm({ ...form, detailedExperience: form.detailedExperience.filter((_, i) => i !== index) });
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, profileImage: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.put("/profile", { ...form, experience: Number(form.experience) });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DetailSkeleton />;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-slate-100">
        <div>
           <Badge variant="primary" className="mb-4">Professional Identity</Badge>
           <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
             Verified <span className="text-primary-600">Profile</span>.
           </h1>
           <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
             Configure your professional persona and technical stack for the ecosystem registry.
           </p>
        </div>
        <div className="flex gap-4">
           <Button
             onClick={handleSubmit}
             loading={saving}
             className="px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-600/20"
             icon={showSuccess ? CheckCircle2 : Save}
           >
             {saving ? "Synchronizing..." : showSuccess ? "Verification Successful" : "Save Changes"}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: IDENTITY CARD */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="p-10 text-center relative overflow-hidden group">
            <div className="relative z-10">
              <div className="relative w-40 h-40 mx-auto mb-8">
                <div className="w-full h-full rounded-[2.5rem] bg-slate-100 border-[6px] border-white shadow-2xl overflow-hidden flex items-center justify-center group-hover:border-primary-600 transition-all duration-500">
                  {form.profileImage ? (
                    <img
                      src={form.profileImage}
                      alt="profile"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <User size={64} className="text-slate-200" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-slate-950 text-white p-4 rounded-2xl cursor-pointer hover:bg-primary-600 shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-white">
                  <Camera size={20} />
                  <input type="file" hidden onChange={handleImageUpload} />
                </label>
              </div>

              <div className="space-y-4">
                 <input
                   value={form.fullName}
                   onChange={e => setForm({ ...form, fullName: e.target.value })}
                   placeholder="IDENT_NULL"
                   className="w-full text-center text-2xl font-black text-slate-900 outline-none bg-transparent placeholder:text-slate-200 uppercase tracking-tight"
                 />
                 <input
                   value={form.headline}
                   onChange={e => setForm({ ...form, headline: e.target.value })}
                   placeholder="PROFESSIONAL_HEADLINE_NULL"
                   className="w-full text-center text-xs font-black text-primary-600 outline-none bg-transparent placeholder:text-primary-100 uppercase tracking-widest"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10 pt-10 border-t border-slate-50">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-slate-400">
                    <MapPin size={12} /> <span className="text-[8px] font-black uppercase tracking-widest">Location</span>
                  </div>
                  <input
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full text-center text-xs font-bold text-slate-900 outline-none bg-transparent"
                    placeholder="Global"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-slate-400">
                    <Briefcase size={12} /> <span className="text-[8px] font-black uppercase tracking-widest">Tenure</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <input
                      type="number"
                      value={form.experience}
                      onChange={e => setForm({ ...form, experience: e.target.value })}
                      className="w-8 text-center text-xs font-bold text-slate-900 outline-none bg-transparent"
                      placeholder="0"
                    />
                    <span className="text-[10px] font-bold text-slate-400">Yrs</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-2xl -mr-16 -mt-16" />
          </Card>

          {/* SKILLS SECTION */}
          <Card className="p-10">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
              <Cpu size={20} className="text-primary-600" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Technical Arsenal</h3>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <input
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addSkill()}
                  placeholder="Deploy skill..."
                  className="w-full bg-slate-50 border-2 border-transparent rounded-xl pl-4 pr-12 py-3 text-xs font-bold outline-none focus:border-primary-600 focus:bg-white transition-all"
                />
                <button
                  onClick={addSkill}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-950 text-white p-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {form.skills.map(skill => (
                  <div
                    key={skill}
                    className="group bg-white border border-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:border-primary-600 hover:bg-primary-50 transition-all cursor-default"
                  >
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-primary-700">{skill}</span>
                    <button onClick={() => removeSkill(skill)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="bg-slate-950 p-10 rounded-[3rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <ShieldCheck size={32} className="mb-6 text-primary-500" />
                <h3 className="font-black text-white text-lg mb-3 uppercase tracking-tight">Security Node</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-10">
                  Your professional data is encrypted and verified across the ecosystem blockchain.
                </p>
                <div className="h-1 w-16 bg-primary-600 rounded-full" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
          </div>
        </div>

        {/* RIGHT COLUMN: PROFESSIONAL SPECS */}
        <div className="lg:col-span-8 space-y-12">

          {/* ABOUT SECTION */}
          <Card className="p-10 md:p-16">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
              <Layers size={24} className="text-primary-600" />
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Executive Summary</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Professional Narrative & Vision</p>
              </div>
            </div>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-[2rem] p-8 min-h-[200px] outline-none focus:border-primary-600 focus:bg-white transition-all text-slate-600 text-lg leading-relaxed italic font-medium custom-scrollbar"
              placeholder="Describe your career trajectory and professional mission..."
            />
          </Card>

          {/* EXPERIENCE SECTION */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <ShieldCheck size={24} className="text-primary-600" />
                <div className="flex flex-col">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Career Trajectory</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Historical Mandate Execution</p>
                </div>
              </div>
              <Button variant="ghost" onClick={addExperience} className="text-[9px] font-black uppercase tracking-widest" icon={Plus}>
                Add Mandate
              </Button>
            </div>

            <div className="space-y-8 relative before:absolute before:left-10 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
              {form.detailedExperience.map((exp, index) => (
                <div key={index} className="relative flex gap-10 pl-2">
                  <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-[2rem] flex items-center justify-center shrink-0 z-10 group hover:border-primary-500 transition-colors">
                    <Briefcase size={20} className="text-slate-300 group-hover:text-primary-600 transition-colors" />
                  </div>

                  <Card className="p-10 w-full hover:border-primary-100 transition-colors relative group/card">
                    <button
                      onClick={() => removeExperience(index)}
                      className="absolute top-6 right-6 p-2 bg-rose-50 text-rose-400 rounded-xl opacity-0 group-hover/card:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                       <Input
                         label="Entity Name"
                         value={exp.company}
                         onChange={e => updateExperience(index, "company", e.target.value)}
                         placeholder="e.g. Google DeepMind"
                       />
                       <Input
                         label="Mandate Role"
                         value={exp.role}
                         onChange={e => updateExperience(index, "role", e.target.value)}
                         placeholder="e.g. Lead Systems Architect"
                       />
                    </div>

                    <div className="mb-8">
                       <Input
                         label="Mandate Duration"
                         value={exp.duration}
                         onChange={e => updateExperience(index, "duration", e.target.value)}
                         placeholder="e.g. Jan 2020 — Present"
                       />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">Key Achievements</label>
                      <textarea
                        value={exp.description}
                        onChange={e => updateExperience(index, "description", e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl p-6 min-h-[120px] text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-primary-100 transition-all"
                        placeholder="Detail your impact and verified outcomes..."
                      />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </section>

          {/* EDUCATION SECTION */}
          <section className="space-y-8 pb-20">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <GraduationCap size={24} className="text-primary-600" />
                <div className="flex flex-col">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Academic Foundation</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Verified Learning History</p>
                </div>
              </div>
              <Button variant="ghost" onClick={addEducation} className="text-[9px] font-black uppercase tracking-widest" icon={Plus}>
                Add Record
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {form.education.map((edu, index) => (
                <Card key={index} className="p-10 relative group/card">
                   <button
                      onClick={() => removeEducation(index)}
                      className="absolute top-6 right-6 p-2 bg-rose-50 text-rose-400 rounded-xl opacity-0 group-hover/card:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                    >
                      <Trash2 size={16} />
                   </button>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      <Input
                        label="Institution"
                        value={edu.school}
                        onChange={e => updateEducation(index, "school", e.target.value)}
                        placeholder="e.g. MIT"
                      />
                      <Input
                        label="Degree/Certification"
                        value={edu.degree}
                        onChange={e => updateEducation(index, "degree", e.target.value)}
                        placeholder="e.g. B.S. Computer Science"
                      />
                      <Input
                        label="Graduation Year"
                        value={edu.year}
                        onChange={e => updateEducation(index, "year", e.target.value)}
                        placeholder="e.g. 2022"
                      />
                   </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
