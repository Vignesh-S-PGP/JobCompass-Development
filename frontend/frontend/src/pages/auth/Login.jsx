import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../services/api"
import { getUserFromToken } from "../../utils/auth"
import AuthLayout from "./AuthLayout"
import { Eye, EyeOff } from "lucide-react"
import { GoogleLogin } from "@react-oauth/google"

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
      subtitle="Login to continue to JobCompass"
    >
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
          {error}
        </div>
      )}


      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">OR</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          className="w-full border p-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            className="w-full border p-3 rounded-lg pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-3 text-slate-400"
          >
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-indigo-600">
            Forgot password?
          </Link>
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
        <div className="mt-4">
  <GoogleLogin
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
        alert("Google login failed")
      }
    }}
    onError={() => alert("Google login failed")}
  />
</div>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Don’t have an account?{" "}
        <Link to="/register" className="font-semibold text-black">
          Register
        </Link>
      </p>
    </AuthLayout>
  )
}