export default function Order({ isDark }) {
  return (
    <div
      className={`min-h-screen p-10 transition-colors duration-300 ${
        isDark
          ? "bg-[#0f1115] text-white"
          : "bg-white text-black"
      }`}
    >
      <h1 className="text-3xl font-bold">
        Order Page
      </h1>
    </div>
  );
}