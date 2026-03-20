import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"

import {
  ArrowLeft,
  MessageCircle,
  MapPin,
  Briefcase,
  Mail,
  Award,
  GraduationCap,
  User
} from "lucide-react"

export default function ApplicantProfile() {

  const { applicationId, userId } = useParams()
  const navigate = useNavigate()

  const [data,setData] = useState(null)
  const [loading,setLoading] = useState(true)


useEffect(()=>{

  if(applicationId){
    api.get(`/applicants/${applicationId}/profile`)
      .then(res=>setData(res.data))
      .finally(()=>setLoading(false))
  }

  else if(userId){
    api.get(`/applicants/user/${userId}/profile`)
      .then(res=>setData(res.data))
      .finally(()=>setLoading(false))
  }

},[applicationId, userId])


  const handleStartChat = async () => {

  try {

    let res

    // ✅ CASE 1: FROM APPLICATION
    if (applicationId) {
      res = await api.post("/chat/start", { applicationId })
    }

    // ✅ CASE 2: FROM SEARCH (NO APPLICATION)
    else if (userId) {
      res = await api.post("/chat/start-direct", { userId })
    }

    navigate(`/recruiter/chat/${res.data.conversationId}`)

  } catch (err) {
    console.error(err)
    alert("Unable to start chat")
  }

}



  /* ---------- LOADING ---------- */

  if(loading){

    return(

      <div className="max-w-6xl mx-auto p-10 space-y-8 animate-pulse">

        <div className="h-48 bg-slate-200 rounded-3xl"/>
        <div className="h-96 bg-slate-200 rounded-3xl"/>

      </div>

    )

  }


  if(!data){

    return(

      <div className="max-w-6xl mx-auto p-10 text-center">

        <h1 className="text-2xl font-bold">
          Applicant not found
        </h1>

        <button
          onClick={()=>navigate(-1)}
          className="mt-4 text-indigo-600 font-bold"
        >
          Go Back
        </button>

      </div>

    )

  }



  const { profile,email } = data



  return(

    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">



      {/* ACTION BAR */}

      <div className="flex items-center justify-between">

        <button
          onClick={()=>navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16}/>
          Back
        </button>

        <button
          onClick={handleStartChat}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold"
        >
          <MessageCircle size={16}/>
          Message Candidate
        </button>

      </div>



      {/* PROFILE HEADER */}

      <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">

        <div className="h-40 bg-gradient-to-r from-indigo-600 to-slate-900"/>

        <div className="px-8 pb-8">

          <div className="flex flex-col md:flex-row gap-6 -mt-16">

            {/* AVATAR */}

            <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-white">

              {profile?.profileImage
                ? <img src={profile.profileImage} className="w-full h-full object-cover"/>
                : <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-black">
                    {profile?.fullName?.[0]}
                  </div>
              }

            </div>


            {/* INFO */}

            <div className="flex-1 pt-6">

              <h1 className="text-3xl font-black text-slate-900">
                {profile?.fullName}
              </h1>

              <p className="text-slate-500 font-medium">
                {profile?.headline}
              </p>

              <div className="flex flex-wrap gap-6 mt-4 text-sm text-slate-500 font-medium">

                <span className="flex items-center gap-2">
                  <MapPin size={16}/>
                  {profile?.location}
                </span>

                <span className="flex items-center gap-2">
                  <Briefcase size={16}/>
                  {profile?.experience} Years Experience
                </span>

                <span className="flex items-center gap-2">
                  <Mail size={16}/>
                  {email}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>



      {/* ABOUT */}

      <section className="bg-white border rounded-3xl p-8 shadow-sm">

        <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-slate-400">
          About Candidate
        </h3>

        <p className="text-slate-600 leading-relaxed text-lg">
          {profile?.bio || "No professional summary available"}
        </p>

      </section>



      {/* SKILLS */}

      <section className="bg-white border rounded-3xl p-8 shadow-sm">

        <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-slate-400">
          Skills
        </h3>

        <div className="flex flex-wrap gap-3">

          {profile?.skills?.map((skill,i)=>(

            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold"
            >

              <Award size={14}/>

              {skill}

            </div>

          ))}

        </div>

      </section>



      {/* EXPERIENCE */}

      <section className="bg-white border rounded-3xl p-8 shadow-sm">

        <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-slate-400">
          Work Experience
        </h3>


        <div className="space-y-6">

          {profile?.detailedExperience?.map((exp,i)=>(

            <div
              key={i}
              className="border rounded-2xl p-6 hover:shadow-md transition"
            >

              <div className="flex justify-between items-start mb-1">

                <h4 className="font-bold text-lg">
                  {exp.role}
                </h4>

                <span className="text-xs font-semibold text-indigo-600">
                  {exp.duration}
                </span>

              </div>

              <p className="text-slate-500 font-medium">
                {exp.company}
              </p>

              <p className="text-slate-600 mt-3">
                {exp.description}
              </p>

            </div>

          ))}

        </div>

      </section>



      {/* EDUCATION */}

      <section className="bg-white border rounded-3xl p-8 shadow-sm">

        <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-slate-400">
          Education
        </h3>


        <div className="space-y-4">

          {profile?.education?.map((edu,i)=>(

            <div
              key={i}
              className="flex gap-4 p-5 border rounded-2xl hover:shadow-sm transition"
            >

              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <GraduationCap size={18}/>
              </div>

              <div>

                <h4 className="font-bold text-slate-900">
                  {edu.degree}
                </h4>

                <p className="text-sm text-slate-500">
                  {edu.school}
                </p>

                <p className="text-xs text-slate-400">
                  {edu.year}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>


    </div>

  )

}