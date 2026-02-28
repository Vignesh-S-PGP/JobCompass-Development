export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-black text-center mb-1">{title}</h1>
        {subtitle && (
          <p className="text-center text-sm text-slate-500 mb-6">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}