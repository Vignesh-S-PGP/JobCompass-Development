import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"
import { getUserFromToken } from "../../utils/auth"

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
  e.preventDefault()
  setError("")
  setLoading(true)

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    })

    localStorage.setItem("token", res.data.accessToken)

const user = getUserFromToken()

if (user.role === "job_seeker") {
  navigate("/jobseeker/dashboard")
} else if (user.role === "recruiter") {
  navigate("/recruiter/dashboard")
}


  } catch (err) {
    setError(err.response?.data?.error || "Login failed")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow w-96"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          JobCompass Login
        </h1>

        {error && (
          <p className="text-red-600 mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}
