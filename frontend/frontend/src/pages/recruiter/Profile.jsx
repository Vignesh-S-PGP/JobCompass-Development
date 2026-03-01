import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Camera,
  Save,
  User,
  CheckCircle2,
  Briefcase,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Mail,
  Zap,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";

export default function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    designation: "",
    profileImage: ""
  });
  const [userEmail, setUserEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, meRes] = await Promise.all([
          api.get("/recruiter/profile"),
          api.get("/profile/me").catch(() => ({ data: { email: "recruiter@jobcompass.io" } }))
        ]);

        if (profileRes.data.profile) {
          setForm(profileRes.data.profile);
        }
        setUserEmail(meRes.data.email || "recruiter@jobcompass.io");
      } catch (err) {
        console.error("Failed to fetch recruiter profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
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
    try {
      await api.post("/recruiter/profile", form);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
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

  if (loading) return (
    <div className="max-w-5xl mx-auto p-20 flex flex-col items-center justify-center gap-6 animate-pulse">
       <div className="w-32 h-32 bg-slate-100 rounded-full" />
       <div className="h-10 bg-slate-100 w-64 rounded-xl" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-slate-100">
         <div>
            <Badge variant="primary" className="mb-4">Operational Identity</Badge>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Recruiter <span className="text-primary-600">Profile</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
              Configure your personal recruiter identity for the platform registry.
            </p>
         </div>

         <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              loading={saving}
              className="px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-600/20"
              icon={showSuccess ? CheckCircle2 : Save}
            >
              {saving ? "Synchronizing..." : showSuccess ? "Changes Verified" : "Save Changes"}
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* AVATAR MODULE */}
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

              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2 leading-none">
                {form.fullName || "IDENT_NULL"}
              </h2>
              <p className="text-xs font-black text-primary-600 uppercase tracking-widest mb-10">
                {form.designation || "UNASSIGNED_ROLE"}
              </p>

              <div className="h-px bg-slate-50 mb-10" />

              <div className="flex flex-col items-center gap-2">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Linked Terminal</span>
                 <span className="text-xs font-bold text-slate-900">{userEmail}</span>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-2xl -mr-16 -mt-16" />
          </Card>

          <div className="bg-slate-950 p-10 rounded-[3rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <ShieldCheck size={32} className="mb-6 text-primary-500" />
                <h3 className="font-black text-white text-lg mb-3 uppercase tracking-tight">Access Control</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-10">
                  Your identity is verified and encrypted within the JobCompass security protocol.
                </p>
                <div className="h-1 w-16 bg-primary-600 rounded-full" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
          </div>
        </div>

        {/* IDENTITY CONFIGURATION */}
        <div className="lg:col-span-8 space-y-10">
          <Card className="p-10 md:p-16">
            <div className="flex items-center gap-4 mb-12 pb-6 border-b border-slate-100">
              <User className="text-primary-600" size={24} />
              <div className="flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Personal Identity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Recruiter Registry Data</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Input
                label="Full Legal Name"
                icon={User}
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                placeholder="Enter verified full name"
                className="py-4"
              />

              <Input
                label="Designation / Rank"
                icon={Briefcase}
                value={form.designation}
                onChange={e => setForm({ ...form, designation: e.target.value })}
                placeholder="e.g. Talent Acquisition Lead"
                className="py-4"
              />
            </div>

            <div className="mt-12 p-8 bg-primary-50 rounded-[2rem] border border-primary-100 flex gap-6 items-center group">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/10 group-hover:scale-110 transition-transform">
                  <Star size={24} className="text-primary-600" fill="currentColor" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">Visibility Optimized</h4>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">
                    A complete profile with a professional avatar increases candidate response rates by <span className="text-primary-600 font-black">2.4x</span>.
                  </p>
               </div>
            </div>
          </Card>

          {/* DANGER ZONE */}
          <Card className="p-10 md:p-16 border-rose-100 bg-rose-50/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                   <AlertCircle className="text-rose-500" size={20} />
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-rose-900">Security: Danger Zone</h3>
                </div>
                <p className="text-sm text-rose-700/70 font-medium max-w-md">
                  Deactivating your account will immediately hide your professional identity and all active job mandates from the platform registry.
                </p>
              </div>
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                className="px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20"
                icon={Trash2}
              >
                Purge Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
