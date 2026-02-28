import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../services/api"
import AuthLayout from "./AuthLayout"

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "job_seeker"
  })
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
      title="Create your account"
      subtitle="Join JobCompass in seconds"
    >
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-3 rounded-lg"
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
        />

        <select
          className="w-full border p-3 rounded-lg"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="job_seeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-bold"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-black">
          Login
        </Link>
      </p>
    </AuthLayout>
  )
}