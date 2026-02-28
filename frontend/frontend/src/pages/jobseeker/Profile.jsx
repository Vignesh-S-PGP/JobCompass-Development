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

  Trash2
} from "lucide-react";

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
    await api.put("/profile", { ...form, experience: Number(form.experience) });
    setSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Profile.</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">
            Professional Identity & Resume
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
            saving ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl'
          }`}
        >
          {saving ? "Processing..." : showSuccess ? <CheckCircle2 size={18} /> : "Save Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: IDENTITY CARD */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-slate-900 rounded-[32px] p-8 shadow-[12px_12px_0px_0px_rgba(15,23,42,0.05)]">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <img
                src={form.profileImage || "/avatar-placeholder.png"}
                alt="profile"
                className="w-full h-full rounded-3xl object-cover border-2 border-slate-900 shadow-sm"
              />
              <label className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl cursor-pointer hover:bg-slate-900 transition-colors shadow-lg">
                <Camera size={18} />
                <input type="file" hidden onChange={handleImageUpload} />
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                <input
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  className="w-full text-xl font-black text-slate-900 outline-none border-b border-transparent focus:border-indigo-500 pb-1"
                />
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Professional Headline</label>
                <input
                  value={form.headline}
                  onChange={e => setForm({ ...form, headline: e.target.value })}
                  className="w-full text-sm font-bold text-slate-500 outline-none border-b border-transparent focus:border-indigo-500 pb-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin size={12} /> <span className="text-[9px] font-black uppercase">Location</span>
                </div>
                <input
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full text-xs font-bold text-slate-700 outline-none"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Briefcase size={12} /> <span className="text-[9px] font-black uppercase">Years Exp</span>
                </div>
                <input
                  type="number"
                  value={form.experience}
                  onChange={e => setForm({ ...form, experience: e.target.value })}
                  className="w-full text-xs font-bold text-slate-700 outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: TECHNICAL SPECS */}
        <div className="lg:col-span-8 space-y-8 pb-20">
          
          {/* ABOUT SECTION */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Professional Bio</h3>
            </div>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              className="w-full bg-slate-50 border-none rounded-2xl p-6 min-h-[160px] text-slate-600 font-medium text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              placeholder="Describe your career trajectory..."
            />
          </div>


          {/* SKILLS SECTION moved to left column for better resume feel */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Skillset</h3>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addSkill()}
                placeholder="Add skill..."
                className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <button
                onClick={addSkill}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-slate-900 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {form.skills.map(skill => (
                <div
                  key={skill}
                  className="group bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:border-slate-900 transition-all"
                >
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{skill}</span>
                  <button onClick={() => removeSkill(skill)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TECHNICAL SPECS */}
        <div className="lg:col-span-8 space-y-8">

          {/* ABOUT SECTION */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Professional Summary</h3>
            </div>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              className="w-full bg-slate-50 border-none rounded-2xl p-6 min-h-[120px] text-slate-600 font-medium text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              placeholder="Describe your career trajectory..."
            />
          </div>

          {/* EXPERIENCE SECTION */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Work Experience</h3>
              </div>
              <button onClick={addExperience} className="text-indigo-600 hover:text-slate-900 flex items-center gap-1 text-[10px] font-black uppercase">
                <Plus size={14} /> Add Experience
              </button>
            </div>

            <div className="space-y-6">
              {form.detailedExperience.map((exp, index) => (
                <div key={index} className="p-6 bg-slate-50 rounded-2xl relative group border border-transparent hover:border-slate-200 transition-all">
                  <button onClick={() => removeExperience(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Company</label>
                      <input
                        value={exp.company}
                        onChange={e => updateExperience(index, "company", e.target.value)}
                        className="w-full bg-white border-none rounded-lg px-4 py-2 text-xs font-bold outline-none"
                        placeholder="Ex: Google"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                      <input
                        value={exp.role}
                        onChange={e => updateExperience(index, "role", e.target.value)}
                        className="w-full bg-white border-none rounded-lg px-4 py-2 text-xs font-bold outline-none"
                        placeholder="Ex: Senior Dev"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={e => updateExperience(index, "description", e.target.value)}
                      className="w-full bg-white border-none rounded-lg px-4 py-2 text-xs font-medium outline-none min-h-[80px]"
                      placeholder="What did you achieve?"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDUCATION SECTION */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Education</h3>
              </div>
              <button onClick={addEducation} className="text-indigo-600 hover:text-slate-900 flex items-center gap-1 text-[10px] font-black uppercase">
                <Plus size={14} /> Add Education
              </button>
            </div>

            <div className="space-y-6">
              {form.education.map((edu, index) => (
                <div key={index} className="p-6 bg-slate-50 rounded-2xl relative group border border-transparent hover:border-slate-200 transition-all">
                  <button onClick={() => removeEducation(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Institution</label>
                      <input
                        value={edu.school}
                        onChange={e => updateEducation(index, "school", e.target.value)}
                        className="w-full bg-white border-none rounded-lg px-4 py-2 text-xs font-bold outline-none"
                        placeholder="Ex: Stanford"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Degree</label>
                      <input
                        value={edu.degree}
                        onChange={e => updateEducation(index, "degree", e.target.value)}
                        className="w-full bg-white border-none rounded-lg px-4 py-2 text-xs font-bold outline-none"
                        placeholder="Ex: CS"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Year</label>
                      <input
                        value={edu.year}
                        onChange={e => updateEducation(index, "year", e.target.value)}
                        className="w-full bg-white border-none rounded-lg px-4 py-2 text-xs font-bold outline-none"
                        placeholder="Ex: 2022"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DANGER ZONE */}
      
        </div>

      </div>
    </div>
  );
}
