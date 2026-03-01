import { useState } from "react"
import api from "../../services/api"
import { Link } from "react-router-dom"
import AuthLayout from "./AuthLayout"
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")
    try {
      await api.post("/auth/forgot-password", { email })
      setMessage("If that email exists, a reset link has been sent.")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Lost access?"
      subtitle="Recover your JobCompass account."
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

      {!message ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email address"
            type="email"
            placeholder="name@company.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full py-4 text-xs uppercase tracking-widest font-black"
          >
            Send Reset Link
          </Button>
        </form>
      ) : (
        <div className="text-center py-4">
           <p className="text-slate-500 font-medium mb-8">
             Check your inbox for further instructions. If you don't see it, please check your spam folder.
           </p>
           <Button variant="outline" onClick={() => setMessage("")} className="w-full">
             Try another email
           </Button>
        </div>
      )}

      <div className="mt-10 text-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </div>
    </AuthLayout>
  )
}
