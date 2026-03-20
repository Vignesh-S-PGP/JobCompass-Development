import { useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, User, Sparkles, ShieldCheck } from "lucide-react";
import { Button, Input, Badge } from "../../components/ui";
import { motion } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "job_seeker"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", formData);
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "recruiter") navigate("/recruiter/dashboard");
      else navigate("/jobseeker/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-background">
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
           <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Briefcase size={20} className="text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">JobCompass.</span>
           </Link>
        </div>

        <div className="relative z-10 max-w-md">
           <Badge variant="secondary" className="mb-6 bg-primary/20 text-primary border-none py-1 px-4 text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} className="mr-2" /> Start your journey
           </Badge>
           <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              Create your <span className="text-primary italic text-gradient">future</span> today.
           </h1>
           <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
              Set up your profile in minutes and get matched with companies looking for your exact skills.
           </p>

           <div className="space-y-6">
              {[
                { title: "Smart Matching", desc: "Our AI finds the best roles for you." },
                { title: "Direct Contact", desc: "Chat with recruiters in real-time." },
                { title: "ATS Optimization", desc: "Improve your resume ranking automatically." }
              ].map((f, i) => (
                <div key={i} className="flex gap-4 items-start">
                   <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <ShieldCheck size={14} className="text-primary" />
                   </div>
                   <div>
                      <p className="text-white font-bold text-sm">{f.title}</p>
                      <p className="text-slate-500 text-xs">{f.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="relative z-10 pt-10 border-t border-white/5">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Trusted by builders from</p>
           <div className="flex gap-8 opacity-50 grayscale contrast-125">
              <span className="text-white font-black text-xl tracking-tighter italic">Vercel</span>
              <span className="text-white font-black text-xl tracking-tighter">LINEAR</span>
              <span className="text-white font-black text-xl tracking-tighter">stripe</span>
           </div>
        </div>

        {/* Decor */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full" />
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="w-full max-w-md space-y-10"
        >
          <div className="space-y-3">
            <h2 className="text-4xl font-black tracking-tight text-foreground">Join JobCompass.</h2>
            <p className="text-muted-foreground font-medium">Create your account to start your application journey.</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-sm font-bold animate-shake">
               <div className="w-2 h-2 rounded-full bg-rose-500" /> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
               <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-14 rounded-2xl bg-muted/40 border-none focus-visible:ring-primary/20 pl-4"
               />
               <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-14 rounded-2xl bg-muted/40 border-none focus-visible:ring-primary/20 pl-4"
                  />
                  <Input
                    label="Confirm"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="h-14 rounded-2xl bg-muted/40 border-none focus-visible:ring-primary/20 pl-4"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground ml-0.5">I want to join as a</label>
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-muted/40 rounded-[20px] border border-border/50">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "job_seeker" })}
                      className={`flex flex-col items-center justify-center p-4 rounded-[16px] transition-all ${
                        formData.role === "job_seeker" ? "bg-background text-primary shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <User size={20} className="mb-1" />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Job Seeker</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "recruiter" })}
                      className={`flex flex-col items-center justify-center p-4 rounded-[16px] transition-all ${
                        formData.role === "recruiter" ? "bg-background text-primary shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Briefcase size={20} className="mb-1" />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Recruiter</span>
                    </button>
                  </div>
               </div>
            </div>

            <Button
               type="submit"
               className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
               isLoading={loading}
            >
              Create Account <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm font-bold text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline ml-1">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
