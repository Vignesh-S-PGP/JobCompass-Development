import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Camera,
  Save,
  User,
  CheckCircle2,
  Briefcase,
  Trash2,
  ShieldAlert
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const navigate = useNavigate()

  const [form,setForm] = useState({
    fullName:"",
    designation:"",
    profileImage:""
  })

  const [saving,setSaving] = useState(false)
  const [success,setSuccess] = useState(false)

  /* LOAD PROFILE */

  useEffect(()=>{

    api.get("/recruiter/profile")
      .then(res=>{
        if(res.data.profile){
          setForm(res.data.profile)
        }
      })

  },[])


  /* IMAGE UPLOAD */

  const handleImageUpload = e => {

    const file = e.target.files[0]

    if(!file) return

    const reader = new FileReader()

    reader.onload = () =>
      setForm({...form,profileImage:reader.result})

    reader.readAsDataURL(file)

  }


  /* SAVE PROFILE */

  const handleSubmit = async()=>{

    setSaving(true)

    await api.post("/recruiter/profile",form)

    setSaving(false)

    setSuccess(true)

    setTimeout(()=>setSuccess(false),3000)

  }


  /* DELETE ACCOUNT */

  const handleDeleteAccount = async()=>{

    if(!window.confirm("Deactivate your recruiter account?")) return

    try{

      await api.delete("/auth/delete-account")

      localStorage.clear()

      navigate("/login")

    }
    catch{
      alert("Failed to delete account")
    }

  }



  return(

    <div className="max-w-6xl mx-auto space-y-8">

      {/* PAGE HEADER */}

      <div className="flex items-center justify-between border-b pb-6">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Recruiter Profile
          </h1>

          <p className="text-slate-500 text-sm">
            Manage your recruiter identity and personal information
          </p>

        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
          ${saving
            ? "bg-slate-200 text-slate-500"
            : success
              ? "bg-emerald-600 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"}
          `}
        >

          {saving
            ? "Saving..."
            : success
              ? <CheckCircle2 size={18}/>
              : <>
                  <Save size={18}/>
                  Save Changes
                </>
          }

        </button>

      </div>



      {/* GRID */}

      <div className="grid md:grid-cols-3 gap-8">

        {/* PROFILE CARD */}

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm h-fit">

          <div className="flex flex-col items-center">

            <div className="relative group">

              <img
                src={form.profileImage || "/avatar-placeholder.png"}
                className="w-36 h-36 rounded-2xl object-cover border-4 border-white shadow-md"
              />

              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition cursor-pointer">

                <Camera size={20} className="text-white"/>

                <input
                  type="file"
                  hidden
                  onChange={handleImageUpload}
                />

              </label>

            </div>

            <div className="text-center mt-6">

              <h2 className="text-lg font-semibold text-slate-900">
                {form.fullName || "Your Name"}
              </h2>

              <p className="text-sm text-slate-500">
                {form.designation || "Recruiter"}
              </p>

            </div>

          </div>

        </div>



        {/* FORM */}

        <div className="md:col-span-2 space-y-6">

          {/* PERSONAL INFO */}

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">

            <h3 className="text-sm font-semibold text-slate-900">
              Personal Information
            </h3>


            {/* NAME */}

            <div>

              <label className="text-xs font-semibold text-slate-400 uppercase ml-1">
                Full Name
              </label>

              <div className="relative mt-1">

                <User
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />

                <input
                  value={form.fullName}
                  onChange={e=>setForm({...form,fullName:e.target.value})}
                  placeholder="Enter your name"
                  className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-600 outline-none"
                />

              </div>

            </div>



            {/* DESIGNATION */}

            <div>

              <label className="text-xs font-semibold text-slate-400 uppercase ml-1">
                Job Title
              </label>

              <div className="relative mt-1">

                <Briefcase
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />

                <input
                  value={form.designation}
                  onChange={e=>setForm({...form,designation:e.target.value})}
                  placeholder="Senior Technical Recruiter"
                  className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-600 outline-none"
                />

              </div>

            </div>

          </div>



          {/* DANGER ZONE */}

          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex items-center justify-between">

            <div>

              <div className="flex items-center gap-2 mb-1">

                <ShieldAlert size={18} className="text-red-500"/>

                <h3 className="font-semibold text-red-900">
                  Danger Zone
                </h3>

              </div>

              <p className="text-sm text-red-700">
                Deactivating your account will remove recruiter access and hide your jobs.
              </p>

            </div>


            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg border border-red-300 font-semibold hover:bg-red-600 hover:text-white transition"
            >

              <Trash2 size={18}/>

              Deactivate

            </button>

          </div>

        </div>

      </div>

    </div>

  )

}