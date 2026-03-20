import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import logo from "../../assets/logo.png";
import { motion } from "framer-motion";

export default function Sidebar({ isCollapsed, setIsCollapsed, menuItems }) {
  return (
    <aside
      className={`relative h-screen glass border-r border-border transition-all duration-300 ease-in-out z-50
      ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* LOGO */}
      <div className="flex items-center h-20 px-6 border-b border-border">
        <img src={logo} alt="JobCompass" className="w-10 h-10 object-contain" />
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3 text-xl font-black tracking-tight text-gradient"
          >
            JobCompass
          </motion.span>
        )}
      </div>

      {/* NAV ITEMS */}
      <nav className="flex-1 px-3 mt-6 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"}`
            }
          >
            <div className="flex items-center justify-center min-w-[20px]">
              {item.icon}
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {item.name}
              </span>
            )}

            {/* Active Glow Indicator */}
            <div className={`absolute left-0 w-1 h-6 bg-primary rounded-r-full transition-opacity duration-200 opacity-0 group-[.active]:opacity-100 ${isCollapsed ? "hidden" : ""}`} />
          </NavLink>
        ))}
      </nav>

      {/* COLLAPSE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-background border border-border
        rounded-full p-1.5 shadow-md hover:scale-110 transition z-50"
      >
        <ChevronRight
          size={16}
          className={`transition-transform duration-300 ${
            !isCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* FOOTER INFO (Optional) */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border mt-auto">
          <div className="p-3 rounded-xl bg-muted/40 text-[10px] text-muted-foreground font-black uppercase tracking-widest text-center">
            JobCompass v2.0
          </div>
        </div>
      )}
    </aside>
  );
}
