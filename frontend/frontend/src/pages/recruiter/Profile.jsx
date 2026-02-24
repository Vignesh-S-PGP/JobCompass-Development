import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Camera,
  Save,
  User,
  CheckCircle2,
  Briefcase,
  Mail,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    designation: "",
    profileImage: ""
  });
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    api.get("/recruiter/profile").then(res => {
      if (res.data.profile) {
        setForm(res.data.profile);
      }
    });

    // Also get user email
    api.get("/auth/me").then(res => {
        // Need to fetch actual user data, auth/me currently only returns userId
        // Let's assume there is a way to get email.
        // For now let's skip email display or use placeholder.
    });
  }, []);

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, profileImage: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setSaving(true);
    // recruiter_profile_routes.py uses POST for saving
    await api.post("/recruiter/profile", form);
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
    <div className="max-w-4xl mx-auto p-4 md:p-10">
      <div className="mb-10 flex items-end justify-between border-b pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Recruiter Profile</h1>
          <p className="text-slate-500 font-medium">Manage your personal recruiter identity</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            saving ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg'
          }`}
        >
          {saving ? "Saving..." : showSuccess ? <CheckCircle2 size={18} /> : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white p-8 rounded-3xl border shadow-sm h-fit">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <img
              src={form.profileImage || "/avatar-placeholder.png"}
              alt="profile"
              className="w-full h-full rounded-2xl object-cover border-2 border-slate-100"
            />
            <label className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-lg cursor-pointer hover:bg-slate-900 shadow-md transition-all">
              <Camera size={16} />
              <input type="file" hidden onChange={handleImageUpload} />
            </label>
          </div>
          <div className="text-center">
            <h2 className="font-bold text-slate-900 text-lg">{form.fullName || "Your Name"}</h2>
            <p className="text-slate-500 text-sm">{form.designation || "Designation"}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-300" size={18} />
                <input
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-medium outline-none"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Job Title / Designation</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 text-slate-300" size={18} />
                <input
                  value={form.designation}
                  onChange={e => setForm({ ...form, designation: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 font-medium outline-none"
                  placeholder="e.g. Senior Technical Recruiter"
                />
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-8 rounded-3xl border border-red-100 flex items-center justify-between">
            <div>
              <h3 className="text-red-900 font-bold">Danger Zone</h3>
              <p className="text-red-700/70 text-sm">Deactivating your account will hide your profile and jobs.</p>
            </div>
            <button
                onClick={handleDeleteAccount}
                className="bg-white text-red-600 px-4 py-2 rounded-xl border border-red-200 font-bold hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
            >
                <Trash2 size={18} /> Deactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
