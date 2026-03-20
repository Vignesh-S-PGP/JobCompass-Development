import { useEffect,useState } from "react"
import { useSearchParams,useNavigate } from "react-router-dom"
import api from "../../services/api"

export default function SearchResults(){

const [params] = useSearchParams()
const query = params.get("q")

const navigate = useNavigate()

const [jobs,setJobs] = useState([])
const [companies,setCompanies] = useState([])


useEffect(()=>{

if(!query) return

api.get(`/search?q=${query}`)
.then(res=>{
setJobs(res.data.jobs || [])
setCompanies(res.data.companies || [])
})

},[query])


return(

<div className="max-w-6xl mx-auto space-y-10">

<h1 className="text-2xl font-black">
Search results for "{query}"
</h1>


{/* JOB RESULTS */}

<section className="space-y-4">

<div className="flex justify-between">

<h2 className="text-lg font-bold">
Jobs
</h2>

<button
onClick={()=>navigate("/jobseeker/jobs")}
className="text-indigo-600 text-sm font-bold"
>
View All
</button>

</div>

{jobs.length===0 ? (
<p className="text-slate-400">
No jobs found
</p>
) : (

jobs.map(job=>(
<div
key={job._id}
onClick={()=>navigate("/jobseeker/jobs",{
state:{openJobId:job._id}
})}
className="bg-white border rounded-xl p-4 cursor-pointer hover:border-indigo-600"
>

<h3 className="font-bold">
{job.title}
</h3>

<p className="text-sm text-slate-500">
{job.location}
</p>

</div>
))

)}

</section>



{/* COMPANY RESULTS */}

<section className="space-y-4">

<div className="flex justify-between">

<h2 className="text-lg font-bold">
Companies
</h2>

<button
onClick={()=>navigate("/jobseeker/companies")}
className="text-indigo-600 text-sm font-bold"
>
View All
</button>

</div>

{companies.length===0 ? (
<p className="text-slate-400">
No companies found
</p>
) : (

companies.map(c=>(
<div
key={c._id}
onClick={()=>navigate(`/jobseeker/companies/${c._id}`)}
className="bg-white border rounded-xl p-4 cursor-pointer hover:border-indigo-600 flex items-center gap-4"
>

<img
src={c.logo}
className="w-10 h-10 rounded"
/>

<div>

<p className="font-bold">
{c.name}
</p>

<p className="text-sm text-slate-500">
{c.industry}
</p>

</div>

</div>
))

)}

</section>

</div>

)

}