import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../services/api"
import { getUserFromToken } from "../../utils/auth"
import AuthLayout from "./AuthLayout"
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { GoogleLogin } from "@react-oauth/google"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await api.post("/auth/login", { email, password })
      localStorage.setItem("token", res.data.accessToken)

      const user = getUserFromToken()
      if (!user) throw new Error()

      if (user.role === "job_seeker") navigate("/jobseeker/dashboard")
      if (user.role === "recruiter") navigate("/recruiter/dashboard")
      if (user.role === "admin") navigate("/admin/dashboard")

    } catch {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your JobCompass portal."
    >
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3 animate-in slide-up">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative group">
          <Input
            label="Password"
            type={showPwd ? "text" : "password"}
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <div className="flex justify-end -mt-2">
          <Link to="/forgot-password" title="Forgot password" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
            Reset Password?
          </Link>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full py-4 text-xs uppercase tracking-widest font-black"
        >
          Sign In <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or continue with</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        <div className="flex justify-center transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <GoogleLogin
            width="100%"
            onSuccess={async (credentialResponse) => {
              try {
                const res = await api.post("/auth/google-login", {
                  token: credentialResponse.credential
                })

                localStorage.setItem("token", res.data.accessToken)

                const user = getUserFromToken()
                if (user.role === "job_seeker") navigate("/jobseeker/dashboard")
                if (user.role === "recruiter") navigate("/recruiter/dashboard")
                if (user.role === "admin") navigate("/admin/dashboard")
              } catch (err) {
                setError("Google login failed")
              }
            }}
            onError={() => setError("Google login failed")}
          />
        </div>
      </form>

      <div className="mt-10 text-center">
        <p className="text-sm font-medium text-slate-500">
          Don’t have an account yet?{" "}
          <Link to="/register" className="font-black text-primary-600 uppercase tracking-tight hover:underline">
            Get Started
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
