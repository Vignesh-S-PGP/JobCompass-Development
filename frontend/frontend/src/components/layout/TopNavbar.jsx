import { Moon, Sun, Search, Palette, Settings, LogOut, MessageSquare } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import NotificationBell from "../notifications/NotificationBell";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui";

const THEMES = [
  { id: "indigo", label: "Indigo Professional", color: "#4F46E5" },
  { id: "emerald", label: "Emerald Growth", color: "#10B981" },
  { id: "blue", label: "Blue Corporate", color: "#2563EB" },
  { id: "purple", label: "Purple Modern SaaS", color: "#9333EA" },
  { id: "orange", label: "Orange Startup", color: "#F97316" },
  { id: "teal", label: "Teal Minimal", color: "#14B8A6" },
  { id: "neon", label: "Dark Neon", color: "#A855F7" },
  { id: "rose", label: "Rose Elegant", color: "#E11D48" },
  { id: "slate", label: "Slate Neutral", color: "#475569" },
  { id: "gradient", label: "Gradient Premium", color: "#7C3AED" },
];

export default function TopNavbar({ profile, role }) {
  const { darkMode, toggleDarkMode, theme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggest, setSuggest] = useState({ jobs: [], companies: [] });
  const [showSuggest, setShowSuggest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setSuggest({ jobs: [], companies: [] });
      return;
    }
    const t = setTimeout(() => {
      api.get(`/search/suggest?q=${query}`)
        .then(res => setSuggest(res.data))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/${role}/search?q=${query}`);
      setShowSuggest(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-border h-16 flex items-center justify-between px-8">
      {/* Search Section */}
      <div className="flex-1 max-w-md relative">
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggest(true);
            }}
            onKeyDown={handleSearch}
            onFocus={() => setShowSuggest(true)}
            placeholder="Search jobs, companies..."
            className="w-full bg-muted/40 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground"
          />
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggest && query.length >= 2 && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setShowSuggest(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-12 left-0 w-full glass border border-border rounded-xl shadow-2xl overflow-hidden z-50 p-2"
              >
                {suggest.jobs.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Jobs</p>
                    {suggest.jobs.map(job => (
                      <button
                        key={job._id}
                        onClick={() => {
                          navigate(`/${role}/search?q=${job.title}`);
                          setShowSuggest(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        {job.title}
                      </button>
                    ))}
                  </div>
                )}
                {suggest.companies.length > 0 && (
                  <div>
                    <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Companies</p>
                    {suggest.companies.map(c => (
                      <button
                        key={c._id}
                        onClick={() => {
                          navigate(`/${role}/companies/${c._id}`);
                          setShowSuggest(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
                {suggest.jobs.length === 0 && suggest.companies.length === 0 && (
                  <p className="p-4 text-center text-xs text-muted-foreground">No suggestions found</p>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Selector */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setThemeOpen(!themeOpen)}
            className="rounded-full"
          >
            <Palette size={20} className="text-muted-foreground" />
          </Button>

          <AnimatePresence>
            {themeOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setThemeOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-56 glass border border-border rounded-2xl shadow-2xl p-4 z-50 grid grid-cols-5 gap-2"
                >
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setThemeOpen(false);
                      }}
                      title={t.label}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                        theme === t.id ? "border-primary scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: t.color }}
                    />
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full"
        >
          {darkMode ? <Sun size={20} className="text-muted-foreground" /> : <Moon size={20} className="text-muted-foreground" />}
        </Button>

        {/* Messaging */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/${role}/chat`)}
          className="rounded-full"
        >
          <MessageSquare size={20} className="text-muted-foreground" />
        </Button>

        {/* Notifications */}
        <div className="flex items-center justify-center p-2 rounded-full hover:bg-accent transition">
          <NotificationBell />
        </div>

        {/* Profile Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden border-2 border-primary/20 transition-transform active:scale-95"
          >
            {profile?.profileImage ? (
              <img src={profile.profileImage} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary-foreground font-semibold">
                {profile?.fullName?.[0] || "U"}
              </span>
            )}
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-4 w-64 glass border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 bg-muted/20 border-b border-border">
                    <p className="font-bold text-foreground">{profile?.fullName || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate(`/${role}/profile`);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent rounded-xl transition-colors"
                    >
                      <Settings size={16} />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
