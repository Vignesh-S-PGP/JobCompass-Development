import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Camera,
  Save,
  User,
  CheckCircle2,
  Briefcase,
  Trash2,
  ShieldAlert,
  Mail,
  Building2,
  Key
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Badge } from "../../components/ui";
import { motion } from "framer-motion";

export default function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    designation: "",
    profileImage: ""
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get("/recruiter/profile").then(res => {
      if (res.data.profile) {
        setForm(res.data.profile);
      }
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
    try {
      await api.post("/recruiter/profile", form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Deactivate your recruiter account? This action cannot be undone.")) return;
    try {
      await api.delete("/auth/delete-account");
      localStorage.clear();
      navigate("/login");
    } catch {
      alert("Failed to delete account");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Recruiter Profile</h1>
          <p className="text-muted-foreground font-medium">Manage your personal recruiter identity.</p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 min-w-[160px]"
        >
          {saving ? "Saving..." : success ? <><CheckCircle2 size={18} className="mr-2" /> Saved</> : <><Save size={18} className="mr-2" /> Save Changes</>}
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
               <p className="text-primary font-bold text-sm tracking-tight">{form.designation || "Recruiter"}</p>
            </div>
          </Card>

          {/* DANGER ZONE */}
          <Card className="p-8 border-none bg-rose-500/5 space-y-6 rounded-[40px] ring-1 ring-rose-500/10">
             <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                   <ShieldAlert size={18}/>
                </div>
                <h3 className="text-lg font-black tracking-tight">Danger Zone</h3>
             </div>
             <p className="text-sm text-rose-700/70 font-medium">
                Deactivating your account will remove recruiter access and hide your jobs.
             </p>
             <Button
                variant="outline"
                onClick={handleDeleteAccount}
                className="w-full rounded-xl border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]"
             >
                <Trash2 size={16} className="mr-2" /> Deactivate Account
             </Button>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-10">
          {/* PROFILE INFO */}
          <Card className="p-8 space-y-8 rounded-[40px]">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                   <User size={18}/>
                </div>
                <h3 className="text-xl font-black tracking-tight">Identity Details</h3>
             </div>
             <div className="space-y-6">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  className="bg-muted/30 border-none rounded-xl h-12"
                />
                <Input
                  label="Job Title / Designation"
                  placeholder="Senior Talent Acquisition"
                  value={form.designation}
                  onChange={e => setForm({ ...form, designation: e.target.value })}
                  className="bg-muted/30 border-none rounded-xl h-12"
                />
             </div>
          </Card>

          {/* SECURITY & PREFERENCES (Placeholder for future) */}
          <Card className="p-8 space-y-8 rounded-[40px] opacity-60">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                   <Key size={18}/>
                </div>
                <h3 className="text-xl font-black tracking-tight">Preferences</h3>
             </div>
             <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground font-medium italic">More settings coming soon...</p>
                <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-widest">v2.0 Beta</Badge>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
