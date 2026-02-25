import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../services/api"

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "job_seeker"
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match")
    }

    try {
      setLoading(true)
      setError("")

      const res = await api.post("/auth/register", {
        email: form.email,
        password: form.password,
        role: form.role
      })

      localStorage.setItem("token", res.data.accessToken)

      // Redirect based on role
      if (form.role === "recruiter") {
        navigate("/recruiter/dashboard")
      } else {
        navigate("/jobseeker/dashboard")
      }

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-3"
          required
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-3"
          required
          onChange={handleChange}
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-3 rounded mb-4"
          required
          onChange={handleChange}
        />

        <label className="block text-sm font-medium mb-1">
          Register as
        </label>
        <select
          name="role"
          className="w-full border p-3 rounded mb-6"
          onChange={handleChange}
          value={form.role}
        >
          <option value="job_seeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-900"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}