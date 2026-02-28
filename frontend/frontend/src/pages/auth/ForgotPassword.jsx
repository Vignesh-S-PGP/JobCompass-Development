import { useState } from "react"
import api from "../../services/api"
import { Link } from "react-router-dom"

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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Forgot Password</h1>
        <p className="text-gray-500 text-center mb-8">Enter your email and we'll send you a link to reset your password.</p>

        {message && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 text-center font-medium">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50 transition-colors"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}
