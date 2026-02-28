import { useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import api from "../../services/api"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow text-center">
            <h1 className="text-xl font-bold text-red-600 mb-4">Invalid Link</h1>
            <p className="mb-6">This password reset link is invalid or has expired.</p>
            <Link to="/login" className="text-indigo-600 hover:underline">Return to Login</Link>
        </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Set New Password</h1>
        <p className="text-gray-500 text-center mb-8">Please enter your new password below.</p>

        {message && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 text-center font-medium">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50 transition-colors"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
