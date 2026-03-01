import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../services/api"
import AuthLayout from "./AuthLayout"
import { Mail, Lock, User, Briefcase, AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "job_seeker"
  })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match")
    }

    try {
      setLoading(true)
      const res = await api.post("/auth/register", {
        email: form.email,
        password: form.password,
        role: form.role
      })

      localStorage.setItem("token", res.data.accessToken)

      navigate(
        form.role === "recruiter"
          ? "/recruiter/dashboard"
          : "/jobseeker/dashboard"
      )
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Join the ecosystem"
      subtitle="Start your journey with JobCompass today."
    >
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3 animate-in slide-up">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'job_seeker' })}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
              ${form.role === 'job_seeker'
                ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                : 'border-slate-100 hover:border-slate-200 text-slate-400'}
            `}
          >
            <User size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Job Seeker</span>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'recruiter' })}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
              ${form.role === 'recruiter'
                ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                : 'border-slate-100 hover:border-slate-200 text-slate-400'}
            `}
          >
            <Briefcase size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Recruiter</span>
          </button>
        </div>

        <Input
          label="Email address"
          type="email"
          placeholder="name@example.com"
          icon={Mail}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <div className="relative group">
          <Input
            label="Password"
            type={showPwd ? "text" : "password"}
            placeholder="••••••••"
            icon={Lock}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-4 top-[38px] text-slate-400 hover:text-primary-600 transition-colors"
          >
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Input
          label="Confirm Password"
          type={showPwd ? "text" : "password"}
          placeholder="••••••••"
          icon={Lock}
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full py-4 text-xs uppercase tracking-widest font-black"
        >
          Create Account <ArrowRight size={18} className="ml-2" />
        </Button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-black text-primary-600 uppercase tracking-tight hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
