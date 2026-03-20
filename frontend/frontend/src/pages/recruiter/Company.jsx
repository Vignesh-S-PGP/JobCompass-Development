import { useEffect, useState } from "react"
import api from "../../services/api"

import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Camera,
  Save,
  ExternalLink
} from "lucide-react"

export default function Company() {

  const [form,setForm] = useState({
    name:"",
    industry:"",
    location:"",
    size:"",
    website:"",
    about:"",
    logo:""
  })

  const [saving,setSaving] = useState(false)

  /* LOAD COMPANY */

  useEffect(()=>{

    api.get("/companies/my")
      .then(res=>{
        if(res.data.company){
          setForm(res.data.company)
        }
      })

  },[])


  /* LOGO UPLOAD */

  const handleLogoUpload = e => {

    const file = e.target.files[0]

    if(!file) return

    const reader = new FileReader()

    reader.onload = () => setForm({...form,logo:reader.result})

    reader.readAsDataURL(file)

  }


  /* SAVE */

  const handleSubmit = async()=>{

    setSaving(true)

    await api.post("/companies", form)

    setSaving(false)

    alert("Company profile saved")

  }


  return(

    <div className="max-w-6xl mx-auto space-y-8">

      {/* HERO */}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

        <div className="h-40 bg-gradient-to-r from-indigo-600 to-slate-900"/>

        <div className="px-8 pb-8">

          <div className="flex gap-6 -mt-14 items-end">

            {/* LOGO */}

            <div className="relative group">

              <img
                src={form.logo || "/company-placeholder.png"}
                className="w-32 h-32 rounded-2xl bg-white object-cover border-4 border-white shadow-md"
              />

              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition">

                <Camera size={22} className="text-white"/>

                <input type="file" hidden onChange={handleLogoUpload}/>

              </label>

            </div>


            {/* COMPANY NAME */}

            <div className="flex-1">

              <input
                value={form.name}
                onChange={e=>setForm({...form,name:e.target.value})}
                placeholder="Company Name"
                className="text-3xl font-bold text-slate-900 outline-none w-full bg-transparent placeholder:text-slate-300"
              />

              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">

                <span className="flex items-center gap-1">

                  <Briefcase size={14}/>
                  {form.industry || "Industry"}

                </span>

                <span className="flex items-center gap-1">

                  <MapPin size={14}/>
                  {form.location || "Location"}

                </span>

              </div>

            </div>


            {/* WEBSITE */}

            {form.website && (

              <a
                href={form.website}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition"
              >

                <ExternalLink size={20}/>

              </a>

            )}

          </div>

        </div>

      </div>



      {/* MAIN GRID */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ABOUT */}

        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

          <div className="flex items-center gap-2 mb-6">

            <Building2 className="text-slate-400" size={20}/>

            <h3 className="font-semibold text-slate-900">
              About Company
            </h3>

          </div>

          <textarea
            value={form.about}
            onChange={e=>setForm({...form,about:e.target.value})}
            placeholder="Describe your company mission, culture and values..."
            className="w-full bg-slate-50 rounded-xl p-4 min-h-[220px] focus:ring-2 focus:ring-indigo-600 outline-none text-slate-600"
          />

        </div>



        {/* DETAILS */}

        <div className="space-y-6">

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">

            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-4">
              Company Details
            </h3>


            <Input
              icon={<Briefcase size={16}/>}
              label="Industry"
              value={form.industry}
              onChange={v=>setForm({...form,industry:v})}
              placeholder="Technology"
            />


            <Input
              icon={<MapPin size={16}/>}
              label="Location"
              value={form.location}
              onChange={v=>setForm({...form,location:v})}
              placeholder="Bangalore"
            />


            <Input
              icon={<Users size={16}/>}
              label="Company Size"
              value={form.size}
              onChange={v=>setForm({...form,size:v})}
              placeholder="11-50 employees"
            />


            <Input
              icon={<Globe size={16}/>}
              label="Website"
              value={form.website}
              onChange={v=>setForm({...form,website:v})}
              placeholder="https://company.com"
            />

          </div>


          {/* SAVE BUTTON */}

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-100"
          >

            {saving
              ? "Saving..."
              : <>
                  <Save size={18}/>
                  Save Company Profile
                </>
            }

          </button>

        </div>

      </div>

    </div>

  )

}



/* INPUT COMPONENT */

function Input({label,icon,value,onChange,placeholder}){

  return(

    <div className="space-y-1">

      <label className="text-xs text-slate-400 font-semibold uppercase ml-1">
        {label}
      </label>

      <div className="relative">

        <div className="absolute left-3 top-3 text-slate-400">
          {icon}
        </div>

        <input
          value={value}
          onChange={e=>onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
        />

      </div>

    </div>

  )

}