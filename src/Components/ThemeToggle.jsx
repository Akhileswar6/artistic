import { useEffect, useState } from "react";
import { Sun, Moon, } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Detect saved theme or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      const isDarkMode = savedTheme === "dark";
      document.documentElement.classList.toggle("dark", isDarkMode);
      setIsDark(isDarkMode);
    } else {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", systemPrefersDark);
      setIsDark(systemPrefersDark);
      localStorage.setItem("theme", systemPrefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;

    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    setIsDark(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-full border 
                 border-neutral-400 dark:border-neutral-700
                 bg-neutral-200 dark:bg-neutral-800
                 text-black dark:text-white
                  hover:bg-neutral-300 dark:hover:bg-neutral-700
                 transition-all duration-300 cursor-pointer"
    >
      {isDark ? (
        <Sun size={18} strokeWidth={2} />
      ) : (
        <Moon size={18} strokeWidth={2} />
      )}
    </button>
  );
}