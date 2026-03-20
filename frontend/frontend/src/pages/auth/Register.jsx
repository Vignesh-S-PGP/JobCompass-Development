import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../services/api"
import { Compass, ArrowRight, Eye, EyeOff, Briefcase, User } from "lucide-react"
import { motion } from "framer-motion"

export default function Register() {

  const navigate = useNavigate()

  const [form,setForm] = useState({
    email:"",
    password:"",
    confirmPassword:"",
    role:"job_seeker"
  })

  const [showPwd,setShowPwd] = useState(false)
  const [showConfirm,setShowConfirm] = useState(false)

  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)

  const handleSubmit = async(e)=>{

    e.preventDefault()

    if(form.password !== form.confirmPassword){
      return setError("Passwords do not match")
    }

    try{

      setLoading(true)

      const res = await api.post("/auth/register",{
        email: form.email,
        password: form.password,
        role: form.role
      })

      localStorage.setItem("token",res.data.accessToken)

      navigate(
        form.role === "recruiter"
          ? "/recruiter/dashboard"
          : "/jobseeker/dashboard"
      )

    }
    catch(err){
      setError(err.response?.data?.error || "Registration failed")
    }
    finally{
      setLoading(false)
    }

  }


  return(

    <div className="min-h-screen flex bg-slate-50">

      {/* LEFT SIDE */}

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-slate-900 text-white relative overflow-hidden">

        <div className="absolute inset-0 opacity-20">

          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"/>

          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"/>

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
            Start Your Journey
          </h2>

          <p className="text-slate-300 leading-relaxed text-sm">
            Create your JobCompass account to discover opportunities,
            optimize your resume with ATS insights, and connect directly
            with recruiters.
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
            Create your account
          </h1>

          <p className="text-slate-500 mb-8">
            Join JobCompass in seconds
          </p>


          {/* ERROR */}

          {error && (

            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>

          )}


          {/* FORM */}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(e)=>setForm({...form,email:e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

            </div>


            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPwd ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e)=>setForm({...form,password:e.target.value})}
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


            {/* CONFIRM PASSWORD */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e)=>setForm({...form,confirmPassword:e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <button
                  type="button"
                  onClick={()=>setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-slate-400"
                >
                  {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>

              </div>

            </div>


            {/* ROLE SELECTOR */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-3">
                I am a
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* JOB SEEKER */}

                <button
                  type="button"
                  onClick={()=>setForm({...form,role:"job_seeker"})}
                  className={`border rounded-xl p-4 flex flex-col items-center gap-2 transition
                    ${form.role==="job_seeker"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-200 hover:border-indigo-400"
                    }
                  `}
                >

                  <User size={20} className="text-indigo-600"/>

                  <span className="text-sm font-semibold">
                    Job Seeker
                  </span>

                </button>


                {/* RECRUITER */}

                <button
                  type="button"
                  onClick={()=>setForm({...form,role:"recruiter"})}
                  className={`border rounded-xl p-4 flex flex-col items-center gap-2 transition
                    ${form.role==="recruiter"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-200 hover:border-indigo-400"
                    }
                  `}
                >

                  <Briefcase size={20} className="text-indigo-600"/>

                  <span className="text-sm font-semibold">
                    Recruiter
                  </span>

                </button>

              </div>

            </div>


            {/* BUTTON */}

            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
            >

              {loading ? (

                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>

              ) : (

                <>
                  Create Account
                  <ArrowRight size={16}/>
                </>

              )}

            </button>

          </form>


          {/* LOGIN */}

          <p className="text-center text-sm text-slate-500 mt-6">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:underline"
            >

              Login

            </Link>

          </p>

        </motion.div>

      </div>

    </div>

  )

}