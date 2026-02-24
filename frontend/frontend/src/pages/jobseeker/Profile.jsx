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
    profileImage: ""
  });

  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    api.get("/profile").then(res => {
      if (res.data.profile) {
        setForm(res.data.profile);
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

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to deactivate your account? This action can only be undone by an administrator.")) return;
    try {
      await api.delete("/auth/delete-account");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      alert("Failed to delete account");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Profile.</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">
            Asset Management & Identity
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
            saving ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl'
          }`}
        >
          {saving ? "Processing..." : showSuccess ? <CheckCircle2 size={18} /> : "Save Changes"}
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
                  <Briefcase size={12} /> <span className="text-[9px] font-black uppercase">Experience</span>
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

          {/* SKILLS SECTION */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Skillset Registry</h3>
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase">{form.skills.length} Loaded</span>
            </div>

            <div className="flex gap-3 mb-8">
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addSkill()}
                placeholder="Ex: React.js"
                className="flex-1 bg-slate-50 border-none rounded-xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <button
                onClick={addSkill}
                className="bg-indigo-600 text-white px-6 rounded-xl hover:bg-slate-900 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {form.skills.map(skill => (
                <div
                  key={skill}
                  className="group bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 hover:border-slate-900 transition-all"
                >
                  <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {form.skills.length === 0 && (
                <div className="w-full py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Technical Skills Indexed</p>
                </div>
              )}
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-red-50 border border-red-100 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
               <h3 className="text-red-900 font-black uppercase tracking-widest text-sm flex items-center gap-2">
                 <Trash2 size={18} /> Danger Zone
               </h3>
               <p className="text-red-700/60 text-xs font-bold mt-1">
                 Deactivating your account will withdraw all active applications and hide your profile.
               </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="bg-white text-red-600 px-6 py-3 rounded-2xl border-2 border-red-200 font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              Deactivate Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}