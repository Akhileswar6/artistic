import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ isDark, setIsDark }) {

  const handleMode = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={handleMode}
      className={`p-1.5 rounded-full 
                  transition-colors duration-300 cursor-pointer
                  ${
                    isDark
                      ? "text-white"
                      : "text-black"
                  }`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}