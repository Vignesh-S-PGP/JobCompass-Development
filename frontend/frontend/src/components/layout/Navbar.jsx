import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Moon,
  Sun,
  User,
  Menu,
  X,
  Briefcase,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';
import NotificationBell from '../notifications/NotificationBell';
import api from '../../services/api';

const Navbar = ({ profile, userRole, onToggleSidebar }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [query, setQuery] = useState("");
  const [suggest, setSuggest] = useState({ jobs: [], companies: [] });
  const [candidates, setCandidates] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggest({ jobs: [], companies: [] });
      setCandidates([]);
      return;
    }

    const timer = setTimeout(() => {
      if (userRole === "job_seeker") {
        api.get(`/search/suggest?q=${query}`)
          .then(res => setSuggest(res.data))
          .catch(() => {});
      } else if (userRole === "recruiter") {
        api.get(`/search/candidates?q=${query}`)
          .then(res => setCandidates(res.data.candidates || []))
          .catch(() => {});
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, userRole]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleSearchSubmit = () => {
    const basePath = userRole.replace('_', '');
    navigate(`/${basePath}/search?q=${query}`);
    setShowSuggest(false);
    setShowMobileSearch(false);
  };

  const profileMenuItems = [
    {
      label: 'Profile',
      icon: <User size={16} />,
      onClick: () => navigate(`/${userRole.replace('_', '')}/profile`)
    },
    {
      label: 'Settings',
      icon: <Settings size={16} />,
      onClick: () => navigate(`/${userRole.replace('_', '')}/profile`)
    },
    {
      label: 'Logout',
      icon: <LogOut size={16} />,
      className: 'text-destructive hover:bg-destructive/10',
      onClick: handleLogout
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">

        {/* Left Section - Mobile Menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onToggleSidebar}
          >
            <Menu size={20} />
          </Button>

          {/* Search Bar */}
          <div className="hidden md:flex relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggest(true);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              onFocus={() => setShowSuggest(true)}
              placeholder={userRole === "recruiter" ? "Search candidates..." : "Search jobs, companies..."}
              className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
            />

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggest && query.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-12 left-0 w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {userRole === "job_seeker" && (
                    <div className="py-2">
                      {suggest.jobs.length > 0 && (
                        <div>
                          <div className="px-4 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/30">Jobs</div>
                          {suggest.jobs.map(job => (
                            <div
                              key={job._id}
                              onClick={() => {
                                setQuery(job.title);
                                handleSearchSubmit();
                              }}
                              className="px-4 py-2 text-sm hover:bg-muted cursor-pointer flex items-center gap-2 transition-colors"
                            >
                              <Briefcase size={14} className="text-primary" />
                              <span>{job.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {suggest.companies.length > 0 && (
                        <div className="mt-1 border-t border-border/50 pt-1">
                          <div className="px-4 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/30">Companies</div>
                          {suggest.companies.map(c => (
                            <div
                              key={c._id}
                              onClick={() => {
                                navigate(`/jobseeker/companies/${c._id}`);
                                setShowSuggest(false);
                              }}
                              className="px-4 py-2 text-sm hover:bg-muted cursor-pointer flex items-center gap-2 transition-colors"
                            >
                              <Building2 size={14} className="text-primary" />
                              <span>{c.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {suggest.jobs.length === 0 && suggest.companies.length === 0 && (
                        <div className="px-4 py-6 text-center text-sm text-muted-foreground italic">No suggestions found</div>
                      )}
                    </div>
                  )}

                  {userRole === "recruiter" && (
                    <div className="py-2">
                       {candidates.length > 0 ? (
                         candidates.map(user => (
                           <div
                            key={user._id}
                            onClick={() => {
                              navigate(`/recruiter/candidates/${user.userId}`);
                              setShowSuggest(false);
                            }}
                            className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-3 transition-colors"
                           >
                             <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                                {user.profileImage ? <img src={user.profileImage} className="h-full w-full object-cover" /> : <User size={16} />}
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user.fullName}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.headline}</p>
                             </div>
                           </div>
                         ))
                       ) : (
                         <div className="px-4 py-6 text-center text-sm text-muted-foreground italic">No candidates found</div>
                       )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {showSuggest && (
              <div
                className="fixed inset-0 z-[-1]"
                onClick={() => setShowSuggest(false)}
              />
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/${userRole.replace('_', '')}/chat`)}
          >
            <MessageSquare size={20} />
          </Button>

          <div className="relative">
            <NotificationBell />
          </div>

          <div className="h-8 w-px bg-border mx-2 hidden sm:block" />

          <Dropdown
            trigger={
              <button className="flex items-center gap-2 rounded-full hover:bg-accent p-1 transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center overflow-hidden border border-border">
                  {profile?.profileImage ? (
                    <img src={profile.profileImage} alt="profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-primary-foreground font-semibold text-xs">
                      {profile?.fullName?.[0] || 'U'}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none pr-1">
                  <span className="text-xs font-semibold">{profile?.fullName || 'User'}</span>
                  <span className="text-[10px] text-muted-foreground capitalize">{userRole.replace('_', ' ')}</span>
                </div>
              </button>
            }
            items={profileMenuItems}
            placement="right"
          />
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-x-0 top-full p-4 bg-background border-b border-border md:hidden"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                placeholder="Search anything..."
                className="pl-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowMobileSearch(false)}
              >
                <X size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
