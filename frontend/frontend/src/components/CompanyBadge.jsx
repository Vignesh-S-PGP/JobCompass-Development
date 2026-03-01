import Badge from "./ui/Badge"

export default function CompanyBadge({ company }) {
  const logo =
    company?.logo ||
    `https://logo.clearbit.com/${company?.website?.replace("https://", "")}`

  return (
    <div className="flex items-center gap-5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-primary-200 transition-all duration-300">
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-50 flex items-center justify-center shrink-0 group-hover:shadow-lg transition-all">
        <img
          src={logo}
          alt={company?.name}
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            e.currentTarget.src = "/company-placeholder.svg"
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-black text-slate-900 uppercase tracking-tight truncate leading-tight group-hover:text-primary-600 transition-colors">
          {company?.name || "IDENTITY_NULL"}
        </h3>
        <div className="flex items-center gap-2 mt-1">
           <Badge variant="primary" className="text-[8px] border-none px-2 py-0.5">Verified Entity</Badge>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
             {company?.industry || "Sector TBD"}
           </p>
        </div>
      </div>
    </div>
  )
}
