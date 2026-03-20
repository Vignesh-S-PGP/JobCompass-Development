import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Building2 } from "lucide-react";

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

      setCompanies(res1.data.companies || []);
      setFilteredCompanies(res1.data.companies || []);
      setFollowedIds(res2.data.ids || []);

    });

  },[]);


  /* FILTER */

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


  /* FOLLOW */

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

    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* HEADER */}

      <div className="flex items-start justify-between mb-10">

        <div>

          <h1 className="text-3xl font-semibold text-slate-900">
            Companies
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Discover companies and follow the ones you like
          </p>

        </div>

        {/* COMPANY COUNT CARD */}

        <div className="bg-white border rounded-xl px-5 py-3 shadow-sm">

          <p className="text-xs text-slate-400">
            Companies
          </p>

          <p className="text-xl font-semibold text-indigo-600">
            {filteredCompanies.length}
          </p>

        </div>

      </div>


      {/* SEARCH + FILTER */}

      <div className="flex flex-col md:flex-row gap-4 mb-10">

        {/* SEARCH */}

        <div className="flex items-center bg-white border rounded-lg px-4 py-3 flex-1 shadow-sm">

          <Search size={18} className="text-slate-400"/>

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search company or industry"
            className="ml-3 w-full outline-none text-sm"
          />

        </div>

        {/* LOCATION FILTER */}

        <div className="flex items-center bg-white border rounded-lg px-4 py-3 shadow-sm">

          <MapPin size={18} className="text-slate-400"/>

          <select
            value={location}
            onChange={(e)=>setLocation(e.target.value)}
            className="ml-3 outline-none text-sm bg-transparent"
          >

            <option value="">All Locations</option>

            {locations.map(loc=>(
              <option key={loc}>{loc}</option>
            ))}

          </select>

        </div>

      </div>


      {/* COMPANY GRID */}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

        {filteredCompanies.map(c => (

  <div
    key={c._id}
    onClick={()=>navigate(`/jobseeker/companies/${c._id}`)}
    className="group bg-white border border-slate-200 rounded-xl p-5
    hover:border-indigo-500 hover:shadow-md transition-all duration-300
    cursor-pointer flex flex-col justify-between"
  >

    {/* TOP SECTION */}

    <div className="flex items-start gap-3">

      {/* LOGO */}

      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">

        {c.logo ? (

          <img
            src={c.logo}
            className="max-h-full object-contain"
          />

        ) : (

          <span className="font-semibold text-slate-400">
            {c.name?.[0] || "?"}
          </span>

        )}

      </div>


      {/* COMPANY INFO */}

      <div className="flex-1">

        <h3 className="text-sm font-semibold text-slate-900 leading-tight">
          {c.name}
        </h3>

        <p className="text-xs text-slate-500">
          {c.industry || "Industry"}
        </p>

        <p className="text-xs text-slate-400 mt-1">
          {c.location || "Location"}
        </p>

      </div>

    </div>


    {/* FOLLOW BUTTON */}

    <div className="mt-4">

      <button
        onClick={(e)=>toggleFollow(c._id,e)}
        className={`w-full py-2 rounded-lg text-xs font-medium transition-all duration-300
        ${
          followedIds.includes(c._id)
          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
          : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02]"
        }`}
      >

        {followedIds.includes(c._id)
          ? "Following"
          : "Follow"}

      </button>

    </div>

  </div>

))}

      </div>


      {/* EMPTY STATE */}

      {filteredCompanies.length === 0 && (

        <div className="text-center py-20">

          <p className="text-slate-400 text-sm">
            No companies match your filters
          </p>

        </div>

      )}

    </div>

  );

}