import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Briefcase, UserCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import AuthLayout from "./AuthLayout";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("job_seeker");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", { fullName, email, password, role });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8 lg:text-left">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 mb-4"
          >
            <UserCircle size={24} />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an Account</h1>
          <p className="text-muted-foreground mt-2">Join JobCompass to start your career journey</p>
        </div>

        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>Enter your details below to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setRole("job_seeker")}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
                    ${role === "job_seeker"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border/50 text-muted-foreground hover:bg-muted"}
                  `}
                >
                  <UserCircle size={20} />
                  <span className="text-xs font-semibold">Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
                    ${role === "recruiter"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border/50 text-muted-foreground hover:bg-muted"}
                  `}
                >
                  <Briefcase size={20} />
                  <span className="text-xs font-semibold">Recruiter</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 mt-4"
                isLoading={loading}
              >
                Create Account
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col border-t border-border/50 pt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}
