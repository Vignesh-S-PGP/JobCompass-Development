import { useEffect, useState } from "react"
import api from "../../services/api"
import { X, FileText, ShieldCheck, Download, ExternalLink } from "lucide-react"
import Card from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"

export default function ResumePreviewModal({ resumeId, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!resumeId) return

    let objectUrl = null
    setError(null)
    setPdfUrl(null)
    setLoading(true)

    api.get(`/resumes/view/${resumeId}`, {
      responseType: "blob",
      timeout: 20000
    })
      .then(res => {
        const blob = new Blob([res.data], {
          type: "application/pdf"
        })
        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      })
      .catch(err => {
        console.error("❌ Resume load failed:", err)
        setError("Transmision Error: Unable to synchronize document from vault.")
      })
      .finally(() => setLoading(false))

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [resumeId])

  if (!resumeId) return null

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <Card className="w-full max-w-7xl h-[92vh] border-none shadow-2xl overflow-hidden flex flex-col rounded-[3rem]">

        {/* HEADER */}
        <header className="bg-white px-10 py-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-primary-600 border border-slate-100">
               <FileText size={24} />
            </div>
            <div>
               <h3 className="text-xl font-black uppercase tracking-tight text-slate-950">Asset Inspection</h3>
               <div className="flex items-center gap-3">
                  <Badge variant="primary" className="text-[8px] bg-primary-50 text-primary-700 border-none">Vault ID: {resumeId.slice(-8).toUpperCase()}</Badge>
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Integrity Verified</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {pdfUrl && (
               <a href={pdfUrl} download="resume.pdf">
                 <Button variant="outline" size="sm" className="px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border-slate-100" icon={Download}>
                   Export Asset
                 </Button>
               </a>
             )}
             <button
               onClick={onClose}
               className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-950 border border-transparent hover:border-slate-100"
             >
               <X size={24} />
             </button>
          </div>
        </header>

        {/* PDF VIEWPORT */}
        <div className="flex-1 bg-slate-50/50 relative overflow-hidden">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-6">
               <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Decrypting PDF Module...</p>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center gap-6">
              <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center">
                 <ShieldCheck size={40} className="text-rose-500" />
              </div>
              <div>
                 <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Transmission Terminated</h4>
                 <p className="text-sm font-medium text-slate-400 max-w-sm uppercase tracking-widest leading-relaxed">{error}</p>
              </div>
              <Button variant="ghost" onClick={onClose} className="text-[10px] font-black uppercase tracking-widest">Return to Vault</Button>
            </div>
          ) : (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full border-none"
              title="Vault Asset Preview"
            />
          )}

          {/* Subtle overlay to prevent right click on iframe if needed or just for aesthetics */}
          {!loading && !error && (
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="px-6 py-2 bg-slate-900/10 backdrop-blur-md rounded-full border border-white/20 text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">
                   JobCompass Secure View
                </div>
             </div>
          )}
        </div>

      </Card>
    </div>
  )
}
