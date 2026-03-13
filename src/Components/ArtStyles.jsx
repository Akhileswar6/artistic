import { Pencil, Palette, Smile } from "lucide-react";

export default function ArtStyles({ isDark }) {

  const styles = [
    {
      icon: "✏️",
      title: "Pencil",
      desc: "Classic fine-line pencil portraits"
    },
    {
      icon: "🖤",
      title: "Charcoal",
      desc: "Rich, dramatic charcoal artwork"
    },
    {
      icon: "🎨",
      title: "Color",
      desc: "Vibrant watercolor & color pencil"
    },
    {
      icon: "😄",
      title: "Caricature",
      desc: "Fun exaggerated caricatures"
    }
  ];

  return (
    <div className="mt-32">

      {/* Title */}
      <div className="text-center mb-16">

        <span
          className={`text-xs px-3 py-1 rounded-full border ${
            isDark ? "border-neutral-700" : "border-neutral-300"
          }`}
        >
          Multiple Styles
        </span>

        <h2
          className="text-4xl mt-4 font-semibold"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Choose Your Art Style
        </h2>

        <p
          className={`mt-3 ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          From classic pencil to vibrant color — pick the style that speaks to you.
        </p>

      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-4 gap-6">

        {styles.map((style, i) => (

          <div
            key={i}
            className={`rounded-2xl border p-8 text-center transition hover:-translate-y-2 ${
              isDark
                ? "bg-[#111] border-neutral-800"
                : "bg-white border-neutral-200 shadow-md"
            }`}
          >

            <div className="text-4xl mb-4">
              {style.icon}
            </div>

            <h3 className="text-lg font-semibold mb-2">
              {style.title}
            </h3>

            <p
              className={`text-sm ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              {style.desc}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}