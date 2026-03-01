import { useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import api from "../../services/api"
import AuthLayout from "./AuthLayout"
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
        return setError("Passwords do not match")
    }

    setLoading(true)
    setMessage("")
    setError("")
    try {
      await api.post("/auth/reset-password", { token, password })
      setMessage("Password reset successful! You can now login.")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  if (!token) return (
    <AuthLayout title="Invalid Request">
        <div className="text-center py-8">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertCircle size={32} className="text-rose-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Invalid or Expired Link</h2>
            <p className="text-slate-500 font-medium mb-10">This password reset link is no longer valid. Please request a new one.</p>
            <Link to="/forgot-password" title="Request new link" className="w-full">
              <Button variant="primary" className="w-full">Get New Link</Button>
            </Link>
        </div>
    </AuthLayout>
  )

  return (
    <AuthLayout
      title="Set password"
      subtitle="Almost there! Choose a secure password."
    >
      {message && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3 animate-in slide-up">
          <CheckCircle size={18} />
          {message}
        </div>
      )}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3 animate-in slide-up">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <Input
            label="New Password"
            type={showPwd ? "text" : "password"}
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
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
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full py-4 text-xs uppercase tracking-widest font-black"
        >
          Reset Password <ArrowRight size={18} className="ml-2" />
        </Button>
      </form>
    </AuthLayout>
  )
}
