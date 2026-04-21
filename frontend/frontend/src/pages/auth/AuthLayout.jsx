import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe, Users, Briefcase } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
  const features = [
    { icon: <Zap className="text-amber-500" size={20} />, text: "Fast & seamless application process" },
    { icon: <ShieldCheck className="text-emerald-500" size={20} />, text: "Verified recruiters & companies" },
    { icon: <Globe className="text-blue-500" size={20} />, text: "Opportunities across the globe" },
  ];

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
         {/* Decorative Background for Mobile */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
         </div>

         <div className="w-full max-w-md z-10">
            {children}
         </div>
      </div>

      {/* Right Column - Informative */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
         {/* Premium Background Elements */}
         <div className="absolute top-0 right-0 w-full h-full opacity-30">
            <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-primary/40 blur-[140px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/40 blur-[140px]" />
         </div>

         {/* Animated Grid Lines */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

         <div className="relative z-10 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
               <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-2xl shadow-primary/40">
                  <Briefcase size={32} />
               </div>

               <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
                    Find your dream job <span className="text-primary">faster</span> than ever before.
                  </h2>
                  <p className="text-lg text-slate-400 font-medium">
                    JobCompass uses advanced matching algorithms to connect you with the most relevant opportunities based on your skills and experience.
                  </p>
               </div>

               <div className="space-y-4 pt-4">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                    >
                       <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                          {feature.icon}
                       </div>
                       <span className="text-white font-semibold text-sm">{feature.text}</span>
                    </motion.div>
                  ))}
               </div>

               <div className="pt-8 flex items-center gap-6">
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="h-10 w-10 rounded-full border-4 border-slate-900 bg-slate-800" />
                     ))}
                     <div className="h-10 w-10 rounded-full border-4 border-slate-900 bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                        10k+
                     </div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Joined by 10,000+ professionals</p>
               </div>
            </motion.div>
         </div>
      </div>
    </div>
  );
}
