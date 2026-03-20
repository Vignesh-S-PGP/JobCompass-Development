import { useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Github, Chrome, Briefcase, User, Sparkles } from "lucide-react";
import { Button, Input, Card, Badge } from "../../components/ui";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") navigate("/admin/dashboard");
      else if (res.data.role === "recruiter") navigate("/recruiter/dashboard");
      else navigate("/jobseeker/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
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
              <Sparkles size={14} className="mr-2" /> Elevate your career
           </Badge>
           <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              Find your <span className="text-primary italic text-gradient">next chapter</span> with us.
           </h1>
           <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
              Join 50,000+ professionals discovering opportunities from the world's most innovative companies.
           </p>

           <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md">
                 <p className="text-3xl font-black text-white mb-1">12k+</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Jobs</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md">
                 <p className="text-3xl font-black text-white mb-1">94%</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Match Rate</p>
              </div>
           </div>
        </div>

        <div className="relative z-10 flex items-center gap-6">
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                   <User size={18} className="text-slate-400" />
                </div>
              ))}
           </div>
           <p className="text-xs font-bold text-slate-500">Join a thriving community of builders.</p>
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="w-full max-w-md space-y-10"
        >
          <div className="space-y-3">
            <h2 className="text-4xl font-black tracking-tight text-foreground">Welcome back.</h2>
            <p className="text-muted-foreground font-medium">Log in to your account to continue your journey.</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-sm font-bold animate-shake">
               <div className="w-2 h-2 rounded-full bg-rose-500" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
               <div className="relative">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 rounded-2xl bg-muted/40 border-none focus-visible:ring-primary/20 pl-4"
                  />
               </div>
               <div className="relative">
                  <div className="flex items-center justify-between mb-1.5 px-0.5">
                     <label className="text-sm font-medium text-muted-foreground">Password</label>
                     <Link to="/forgot-password" title="Forgot Password?" className="text-xs font-bold text-primary hover:underline">Reset here</Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 rounded-2xl bg-muted/40 border-none focus-visible:ring-primary/20 pl-4"
                  />
               </div>
            </div>

            <Button
               type="submit"
               className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
               isLoading={loading}
            >
              Sign In <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-4 text-muted-foreground font-black tracking-widest">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Button variant="outline" className="h-14 rounded-2xl border-2 font-bold gap-2">
                <Chrome size={18} /> Google
             </Button>
             <Button variant="outline" className="h-14 rounded-2xl border-2 font-bold gap-2">
                <Github size={18} /> GitHub
             </Button>
          </div>

          <p className="text-center text-sm font-bold text-muted-foreground">
            New to JobCompass? <Link to="/register" className="text-primary hover:underline ml-1">Create an account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
