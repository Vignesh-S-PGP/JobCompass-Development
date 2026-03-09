import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";

export default function Companies() {

  const [companies,setCompanies] = useState([]);
  const [filteredCompanies,setFilteredCompanies] = useState([]);
  const [followedIds,setFollowedIds] = useState([]);
  const [search,setSearch] = useState("");
  const [location,setLocation] = useState("");

  const navigate = useNavigate();

  /* FETCH DATA */
  useEffect(()=>{
    Promise.all([
      api.get("/companies"),
      api.get("/companies/followed/ids")
    ]).then(([res1,res2])=>{
      setCompanies(res1.data.companies);
      setFilteredCompanies(res1.data.companies);
      setFollowedIds(res2.data.ids);
    });
  },[]);


  /* FILTER LOGIC */
  useEffect(()=>{

    let result = [...companies];

    if(search){
      result = result.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.industry?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if(location){
      result = result.filter(c => c.location === location);
    }

    setFilteredCompanies(result);

  },[search,location,companies]);


  /* FOLLOW TOGGLE */
  const toggleFollow = async(companyId,e)=>{
    e.stopPropagation();

    const res = await api.post(`/companies/${companyId}/follow`);

    setFollowedIds(prev =>
      res.data.followed
        ? [...prev,companyId]
        : prev.filter(id => id !== companyId)
    );
  };

  /* UNIQUE LOCATIONS */
  const locations = [...new Set(companies.map(c => c.location).filter(Boolean))];

  return(
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-5xl font-black mb-6">
          Companies
        </h1>

        <div className="flex gap-4">

          {/* SEARCH */}
          <div className="flex items-center border rounded-xl px-4 py-2 bg-white w-full max-w-md">
            <Search size={18} className="text-slate-400"/>
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search company or industry..."
              className="ml-2 outline-none w-full text-sm"
            />
          </div>

          {/* LOCATION FILTER */}
          <div className="flex items-center border rounded-xl px-3 bg-white">
            <MapPin size={16} className="text-slate-400"/>
            <select
              value={location}
              onChange={(e)=>setLocation(e.target.value)}
              className="ml-2 outline-none text-sm bg-transparent"
            >
              <option value="">All Locations</option>
              {locations.map(loc=>(
                <option key={loc}>{loc}</option>
              ))}
            </select>
          </div>

        </div>

      </div>


      {/* COMPANY GRID */}
      <div className="grid grid-cols-3 gap-6">

        {filteredCompanies.map(c => (

          <div
            key={c._id}
            onClick={()=>navigate(`/jobseeker/companies/${c._id}`)}
            className="bg-white p-6 rounded-3xl border cursor-pointer hover:shadow-lg transition"
          >

            <img
              src={c.logo || "/placeholder.png"}
              className="h-12 mb-4 object-contain"
            />

            <h3 className="font-black text-xl">
              {c.name}
            </h3>

            <p className="text-sm text-slate-500">
              {c.industry}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              {c.location}
            </p>

            <button
              onClick={(e)=>toggleFollow(c._id,e)}
              className={`mt-4 px-4 py-2 rounded-lg text-sm font-bold
                ${followedIds.includes(c._id)
                  ? "bg-slate-200 text-slate-700"
                  : "bg-indigo-600 text-white"}
              `}
            >
              {followedIds.includes(c._id) ? "Following" : "Follow"}
            </button>

          </div>

        ))}

      </div>


      {/* EMPTY STATE */}
      {filteredCompanies.length === 0 && (
        <div className="text-center py-20 text-slate-400 font-bold">
          No companies match your filters
        </div>
      )}

    </div>
  );
}