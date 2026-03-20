import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../services/api"
import { getUserFromToken } from "../../utils/auth"
import { Compass, ArrowRight, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { GoogleLogin } from "@react-oauth/google"

export default function Login() {

  const navigate = useNavigate()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [showPwd,setShowPwd] = useState(false)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  const handleLogin = async(e)=>{
    e.preventDefault()

    setError("")
    setLoading(true)

    try{

      const res = await api.post("/auth/login",{ email,password })

      localStorage.setItem("token",res.data.accessToken)

      const user = getUserFromToken()

      if(user.role === "job_seeker") navigate("/jobseeker/dashboard")
      if(user.role === "recruiter") navigate("/recruiter/dashboard")
      if(user.role === "admin") navigate("/admin/dashboard")

    }
    catch{
      setError("Invalid email or password")
    }
    finally{
      setLoading(false)
    }
  }

  return(

    <div className="min-h-screen flex bg-slate-50">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-slate-900 text-white relative overflow-hidden">

        {/* BACKGROUND GLOW */}

        <div className="absolute inset-0 opacity-20">

          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500 rounded-full blur-3xl" />

          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />

        </div>

        <motion.div
          initial={{ opacity:0,y:20 }}
          animate={{ opacity:1,y:0 }}
          transition={{ duration:0.6 }}
          className="relative z-10 max-w-md text-center px-8"
        >

          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-6">

            <Compass size={32}/>

          </div>

          <h2 className="text-3xl font-bold mb-4">
            Navigate Your Career
          </h2>

          <p className="text-slate-300 leading-relaxed text-sm">
            JobCompass connects job seekers with the right opportunities using intelligent matching, resume analysis, and real-time recruiter communication.
          </p>

        </motion.div>

      </div>


      {/* RIGHT SIDE */}

      <div className="flex-1 flex items-center justify-center p-6">

        <motion.div
          initial={{ opacity:0,y:20 }}
          animate={{ opacity:1,y:0 }}
          transition={{ duration:0.4 }}
          className="w-full max-w-md"
        >

          {/* MOBILE LOGO */}

          <div className="flex items-center gap-3 mb-8 lg:hidden">

            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">

              <Compass size={20}/>

            </div>

            <span className="text-xl font-bold">
              JobCompass
            </span>

          </div>


          {/* TITLE */}

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome back
          </h1>

          <p className="text-slate-500 mb-8">
            Sign in to continue to your dashboard
          </p>


          {/* ERROR */}

          {error && (

            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">

              {error}

            </div>

          )}


          {/* GOOGLE LOGIN */}

          <div className="mb-6">

            <GoogleLogin
              onSuccess={async(credentialResponse)=>{

                try{

                  const res = await api.post("/auth/google-login",{
                    token: credentialResponse.credential
                  })

                  localStorage.setItem("token",res.data.accessToken)

                  const user = getUserFromToken()

                  if(user.role === "job_seeker") navigate("/jobseeker/dashboard")
                  if(user.role === "recruiter") navigate("/recruiter/dashboard")
                  if(user.role === "admin") navigate("/admin/dashboard")

                }
                catch{
                  alert("Google login failed")
                }

              }}
              onError={()=>alert("Google login failed")}
            />

          </div>


          {/* DIVIDER */}

          <div className="flex items-center gap-2 mb-6">

            <div className="flex-1 h-px bg-slate-200"/>

            <span className="text-xs text-slate-400">
              OR
            </span>

            <div className="flex-1 h-px bg-slate-200"/>

          </div>


          {/* FORM */}

          <form onSubmit={handleLogin} className="space-y-4">

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

            </div>


            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <button
                  type="button"
                  onClick={()=>setShowPwd(!showPwd)}
                  className="absolute right-3 top-2.5 text-slate-400"
                >

                  {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}

                </button>

              </div>

            </div>


            <div className="flex justify-end">

              <Link
                to="/forgot-password"
                className="text-xs text-indigo-600 hover:underline"
              >

                Forgot password?

              </Link>

            </div>


            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
            >

              {loading ? (

                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>

              ) : (

                <>
                  Sign In
                  <ArrowRight size={16}/>
                </>

              )}

            </button>

          </form>


          {/* REGISTER */}

          <p className="text-center text-sm text-slate-500 mt-6">

            Don’t have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:underline"
            >

              Create account

            </Link>

          </p>

        </motion.div>

      </div>

    </div>

  )

}