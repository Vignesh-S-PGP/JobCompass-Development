export default function CompanyBadge({ company }) {
  const logo =
    company?.logo ||
    `https://logo.clearbit.com/${company?.website?.replace("https://", "")}`

  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border flex items-center justify-center">
        <img
          src={logo}
          alt={company?.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = "/company-placeholder.svg"
          }}
        />
      </div>

      <div>
        <h3 className="font-semibold text-lg">
          {company?.name}
        </h3>
        <p className="text-sm text-gray-500">
          {company?.industry} • {company?.location}
        </p>
      </div>
    </div>
  )
}
