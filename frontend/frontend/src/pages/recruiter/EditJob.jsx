import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"

import {
  ArrowLeft,
  Save,
  MapPin,
  Briefcase,
  CircleDollarSign,
  FileText
} from "lucide-react"

export default function RecruiterEditJob() {

  const { jobId } = useParams()
  const navigate = useNavigate()

  const [form,setForm] = useState(null)
  const [saving,setSaving] = useState(false)

  useEffect(()=>{

    api.get(`/jobs/${jobId}`)
      .then(res=>setForm(res.data.job))

  },[jobId])


  const update = async()=>{

    setSaving(true)

    await api.put(`/jobs/${jobId}`,{
      title:form.title,
      description:form.description,
      location:form.location,
      jobType:form.jobType,
      salaryRange:form.salaryRange
    })

    setSaving(false)

    navigate(`/recruiter/jobs/${jobId}`)

  }



  if(!form){
    return(
      <div className="flex items-center justify-center h-60">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }



  return(

    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">

      {/* BACK */}

      <button
        onClick={()=>navigate(-1)}
        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
      >
        <ArrowLeft size={16}/>
        Back
      </button>



      {/* HEADER */}

      <div className="space-y-1">

        <h1 className="text-3xl font-black text-slate-900">
          Edit Job Posting
        </h1>

        <p className="text-slate-500 font-medium">
          Update job details and keep your listing accurate
        </p>

      </div>



      {/* FORM GRID */}

      <div className="grid lg:grid-cols-12 gap-8">

        {/* LEFT */}

        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">

          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-indigo-600"/>
            <h3 className="text-xs font-black uppercase tracking-widest">
              Job Information
            </h3>
          </div>


          {/* TITLE */}

          <div>

            <label className="text-xs font-black uppercase text-slate-400">
              Job Title
            </label>

            <input
              value={form.title}
              onChange={e=>setForm({...form,title:e.target.value})}
              className="w-full mt-1 bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
              placeholder="Senior Frontend Developer"
            />

          </div>



          {/* DESCRIPTION */}

          <div>

            <label className="text-xs font-black uppercase text-slate-400">
              Job Description
            </label>

            <textarea
              rows={10}
              value={form.description}
              onChange={e=>setForm({...form,description:e.target.value})}
              className="w-full mt-1 bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
              placeholder="Describe responsibilities, expectations and requirements..."
            />

          </div>

        </div>



        {/* RIGHT */}

        <div className="lg:col-span-4 space-y-6">

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">

            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Job Settings
            </h3>



            {/* LOCATION */}

            <div>

              <label className="text-xs font-black uppercase text-slate-400">
                Location
              </label>

              <div className="relative mt-1">

                <MapPin size={16} className="absolute left-3 top-3 text-slate-400"/>

                <input
                  value={form.location}
                  onChange={e=>setForm({...form,location:e.target.value})}
                  className="w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="Bangalore"
                />

              </div>

            </div>



            {/* JOB TYPE */}

            <div>

              <label className="text-xs font-black uppercase text-slate-400">
                Job Type
              </label>

              <div className="relative mt-1">

                <Briefcase size={16} className="absolute left-3 top-3 text-slate-400"/>

                <select
                  value={form.jobType}
                  onChange={e=>setForm({...form,jobType:e.target.value})}
                  className="w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>

              </div>

            </div>



            {/* SALARY */}

            <div>

              <label className="text-xs font-black uppercase text-slate-400">
                Salary Range
              </label>

              <div className="relative mt-1">

                <CircleDollarSign size={16} className="absolute left-3 top-3 text-slate-400"/>

                <input
                  value={form.salaryRange}
                  onChange={e=>setForm({...form,salaryRange:e.target.value})}
                  className="w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="₹8L - ₹12L"
                />

              </div>

            </div>

          </div>

        </div>

      </div>



      {/* ACTIONS */}

      <div className="flex gap-4 pt-4 border-t">

        <button
          onClick={update}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition"
        >
          <Save size={16}/>
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={()=>navigate(-1)}
          className="px-6 py-3 border rounded-xl text-sm font-bold hover:bg-slate-100 transition"
        >
          Cancel
        </button>

      </div>

    </div>

  )

}