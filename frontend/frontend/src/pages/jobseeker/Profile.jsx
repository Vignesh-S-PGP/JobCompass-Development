import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Camera,
  MapPin,
  Briefcase,
  Plus,
  X,
  CheckCircle2,
  Trash2,
  GraduationCap,
  User,
  Mail,
  Sparkles,
  Save,
  Globe,
  Award
} from "lucide-react";
import { Card, Button, Input, Badge } from "../../components/ui";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
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
    });
  }, []);

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (form.skills.includes(skillInput.trim())) return;
    setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
    setSkillInput("");
  };

  const removeSkill = skill => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
  };

  const addEducation = () => {
    setForm({ ...form, education: [...form.education, { school: "", degree: "", year: "" }] });
  };

  const updateEducation = (index, field, value) => {
    const newEdu = [...form.education];
    newEdu[index][field] = value;
    setForm({ ...form, education: newEdu });
  };

  const removeEducation = index => {
    setForm({ ...form, education: form.education.filter((_, i) => i !== index) });
  };

  const addExperience = () => {
    setForm({
      ...form,
      detailedExperience: [...form.detailedExperience, { company: "", role: "", description: "" }]
    });
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...form.detailedExperience];
    newExp[index][field] = value;
    setForm({ ...form, detailedExperience: newExp });
  };

  const removeExperience = index => {
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
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const SectionHeader = ({ icon, title, action, actionLabel }) => (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-black tracking-tight">{title}</h3>
      </div>
      {action && (
        <Button variant="ghost" size="sm" onClick={action} className="text-primary font-black uppercase tracking-widest text-[10px]">
          <Plus size={14} className="mr-1" /> {actionLabel}
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground font-medium">Control how your profile appears to recruiters.</p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 min-w-[160px]"
        >
          {saving ? "Saving..." : showSuccess ? <><CheckCircle2 size={18} className="mr-2" /> Saved</> : <><Save size={18} className="mr-2" /> Save Changes</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-10">
          {/* PHOTO CARD */}
          <Card className="p-8 flex flex-col items-center text-center space-y-6 rounded-[40px] border-none shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-primary/5" />
            <div className="relative z-10 pt-4">
               <div className="relative">
                  <div className="w-32 h-32 rounded-[48px] bg-card p-1 shadow-2xl border border-border overflow-hidden">
                    <img
                      src={form.profileImage || "/avatar-placeholder.png"}
                      className="w-full h-full object-cover rounded-[44px]"
                      alt=""
                    />
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-3 rounded-2xl shadow-xl cursor-pointer hover:bg-primary transition-colors border-4 border-card">
                    <Camera size={18}/>
                    <input type="file" hidden onChange={handleImageUpload}/>
                  </label>
               </div>
            </div>
            <div className="space-y-1">
               <h2 className="text-2xl font-black tracking-tight">{form.fullName || "Your Name"}</h2>
               <p className="text-primary font-bold text-sm tracking-tight">{form.headline || "Professional Headline"}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
               <MapPin size={14} className="text-primary" /> {form.location || "Location Not Set"}
            </div>
          </Card>

          {/* CONTACT INFO */}
          <Card className="p-8 space-y-6 rounded-[40px]">
             <SectionHeader icon={<User size={18}/>} title="Personal Info" />
             <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  className="bg-muted/30 border-none rounded-xl"
                />
                <Input
                  label="Headline"
                  placeholder="Senior Software Engineer"
                  value={form.headline}
                  onChange={e => setForm({ ...form, headline: e.target.value })}
                  className="bg-muted/30 border-none rounded-xl"
                />
                <div className="grid grid-cols-2 gap-4">
                   <Input
                    label="Location"
                    placeholder="NYC, USA"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="bg-muted/30 border-none rounded-xl"
                  />
                  <Input
                    label="Experience (Yrs)"
                    type="number"
                    placeholder="5"
                    value={form.experience}
                    onChange={e => setForm({ ...form, experience: e.target.value })}
                    className="bg-muted/30 border-none rounded-xl"
                  />
                </div>
             </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-10">
          {/* BIO */}
          <Card className="p-8 rounded-[40px]">
            <SectionHeader icon={<Sparkles size={18}/>} title="Professional Summary" />
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              className="w-full bg-muted/30 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[160px] text-foreground"
              placeholder="Tell your story, your achievements, and what you're looking for..."
            />
          </Card>

          {/* SKILLS */}
          <Card className="p-8 rounded-[40px]">
            <SectionHeader icon={<Award size={18}/>} title="Skills & Expertise" />
            <div className="flex gap-3 mb-8">
              <Input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                placeholder="Add a skill (e.g. React, Python)"
                className="bg-muted/30 border-none rounded-2xl flex-1"
                onKeyPress={e => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} className="rounded-2xl h-10 px-6 font-black uppercase tracking-widest text-[10px]">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {form.skills.map(skill => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge className="pl-4 pr-2 py-2 rounded-xl bg-primary/10 text-primary border-none flex items-center gap-2 group">
                      <span className="text-[10px] font-black uppercase tracking-widest">{skill}</span>
                      <button onClick={() => removeSkill(skill)} className="p-1 hover:bg-primary/20 rounded-md transition-colors">
                        <X size={12} />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
              {form.skills.length === 0 && (
                <p className="text-muted-foreground text-sm italic font-medium">No skills added yet.</p>
              )}
            </div>
          </Card>

          {/* EXPERIENCE */}
          <Card className="p-8 rounded-[40px]">
            <SectionHeader
              icon={<Briefcase size={18}/>}
              title="Work Experience"
              action={addExperience}
              actionLabel="Add Experience"
            />
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {form.detailedExperience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-[32px] bg-muted/20 border border-border/50 relative group"
                  >
                    <button
                      onClick={() => removeExperience(index)}
                      className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16}/>
                    </button>
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <Input
                        label="Company"
                        value={exp.company}
                        onChange={e => updateExperience(index, "company", e.target.value)}
                        className="bg-card border-none rounded-xl shadow-sm"
                      />
                      <Input
                        label="Role"
                        value={exp.role}
                        onChange={e => updateExperience(index, "role", e.target.value)}
                        className="bg-card border-none rounded-xl shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground ml-0.5">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={e => updateExperience(index, "description", e.target.value)}
                        className="w-full bg-card border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[100px]"
                        placeholder="What were your key responsibilities and impact?"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {form.detailedExperience.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-[32px] bg-muted/5">
                   <p className="text-muted-foreground font-medium">No work experience listed.</p>
                </div>
              )}
            </div>
          </Card>

          {/* EDUCATION */}
          <Card className="p-8 rounded-[40px]">
            <SectionHeader
              icon={<GraduationCap size={18}/>}
              title="Education"
              action={addEducation}
              actionLabel="Add Education"
            />
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {form.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-[32px] bg-muted/20 border border-border/50 relative group"
                  >
                    <button
                      onClick={() => removeEducation(index)}
                      className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16}/>
                    </button>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <Input
                          label="Institution"
                          value={edu.school}
                          onChange={e => updateEducation(index, "school", e.target.value)}
                          className="bg-card border-none rounded-xl shadow-sm"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <Input
                          label="Degree"
                          value={edu.degree}
                          onChange={e => updateEducation(index, "degree", e.target.value)}
                          className="bg-card border-none rounded-xl shadow-sm"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <Input
                          label="Year"
                          value={edu.year}
                          onChange={e => updateEducation(index, "year", e.target.value)}
                          className="bg-card border-none rounded-xl shadow-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {form.education.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-[32px] bg-muted/5">
                   <p className="text-muted-foreground font-medium">No education history listed.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
