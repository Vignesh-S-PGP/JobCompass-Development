import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const ThemeProviderContext = createContext({
  theme: "indigo",
  setTheme: () => null,
  darkMode: false,
  toggleDarkMode: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "indigo",
  storageKey = "jobcompass-theme",
  darkKey = "jobcompass-dark",
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(darkKey) === "true"
  );

  // Initial fetch for global theme (optional, fallback to local)
  useEffect(() => {
    const fetchGlobalTheme = async () => {
       try {
         const res = await api.get("/admin/theme");
         if (res.data.theme) {
           setTheme(res.data.theme);
         }
       } catch (err) {}
    };
    fetchGlobalTheme();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    // Theme application
    root.removeAttribute("data-theme");
    if (theme !== "indigo") {
      root.setAttribute("data-theme", theme);
    }

    // Dark mode application
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(storageKey, theme);
    localStorage.setItem(darkKey, darkMode.toString());
  }, [theme, darkMode, storageKey, darkKey]);

  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    const role = localStorage.getItem("role");
    if (role === "admin") {
      try {
        await api.post("/admin/theme", { theme: newTheme });
      } catch (err) {}
    }
  };

  const value = {
    theme,
    setTheme: updateTheme,
    darkMode,
    toggleDarkMode: () => setDarkMode(!darkMode),
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
