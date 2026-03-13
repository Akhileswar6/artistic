import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ isDark, setIsDark }) {

  const handleMode = (e) => {

    const { clientX, clientY } = e;

    document.documentElement.style.setProperty("--x", `${clientX}px`);
    document.documentElement.style.setProperty("--y", `${clientY}px`);

    if (!document.startViewTransition) {
      setIsDark(!isDark);
      return;
    }

    document.startViewTransition(() => {
      setIsDark(!isDark);
    });
  };

  return (
    <button
      onClick={handleMode}
      className={`p-1.5 rounded-full transition-colors duration-300 cursor-pointer ${
        isDark ? "text-white" : "text-black"
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}