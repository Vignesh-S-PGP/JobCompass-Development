import React from 'react';
import logo from '../../assets/logo.png';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Left Panel: Narrative & Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 p-16 flex-col justify-between relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-900/10 rounded-full blur-[100px] -ml-40 -mb-40" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 bg-white rounded-xl p-2 flex items-center justify-center">
              <img src={logo} alt="JobCompass" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">JobCompass</span>
          </div>

          <h1 className="text-6xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
            Hire the <span className="text-primary-500 italic">future</span> of talent, today.
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-md leading-relaxed">
            The intelligent recruitment platform for high-growth teams and ambitious professionals.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/5 pt-12">
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                  {['JD', 'SM', 'AK', 'LP'][i-1]}
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-500">
              Trusted by <span className="text-white">50,000+</span> industry leading recruiters.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Form Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 relative animate-in fade-in duration-700">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-12 h-12" />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight leading-none">
              {title}
            </h2>
            {subtitle && (
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
            {children}
          </div>

          <div className="mt-12 text-center">
             <p className="text-xs font-black uppercase tracking-widest text-slate-400">
               JobCompass © 2024 • All Rights Reserved
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
