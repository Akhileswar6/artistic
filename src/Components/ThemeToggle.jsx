import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ isDark, setIsDark }) {

  const handleMode = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={handleMode}
      className="p-1.5 rounded-full border 
                 border-neutral-400 dark:border-neutral-700
                 bg-neutral-200 dark:bg-neutral-800
                 text-black dark:text-white
                 hover:bg-neutral-300 dark:hover:bg-neutral-700
                 transition-all duration-300 cursor-pointer"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}