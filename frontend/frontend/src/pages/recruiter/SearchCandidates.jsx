import { useEffect,useState } from "react"
import { useSearchParams,useNavigate } from "react-router-dom"
import api from "../../services/api"

export default function SearchCandidates(){

const [params] = useSearchParams()
const query = params.get("q")

const navigate = useNavigate()

const [candidates,setCandidates] = useState([])

useEffect(()=>{

if(!query) return

api.get(`/search/candidates?q=${query}`)
.then(res=>setCandidates(res.data.candidates || []))

},[query])


return(

<div className="max-w-6xl mx-auto space-y-8">

<h1 className="text-2xl font-black">
Search candidates for "{query}"
</h1>

{candidates.length===0 ? (

<p className="text-slate-400">
No candidates found
</p>

):( 

candidates.map(c=>(

<div
key={c._id}
onClick={()=>navigate(`/recruiter/candidates/${c.userId}`)}
className="bg-white border rounded-xl p-4 cursor-pointer hover:border-indigo-600 flex items-center gap-4"
>

<img
src={c.profileImage || "/avatar.png"}
className="w-12 h-12 rounded-full object-cover"
/>

<div>

<p className="font-bold">
{c.fullName}
</p>

<p className="text-sm text-slate-500">
{c.headline}
</p>

<p className="text-xs text-slate-400">
{c.location}
</p>

</div>

</div>

))

)}

</div>

)

}