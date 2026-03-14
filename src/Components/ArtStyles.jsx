import pencil from "../assets/Pencil.webp";
import charcoal from "../assets/Charcoal.jpg";
import sketching from "../assets/Sketch.webp";
import caricature from "../assets/Caricature.jpg";


export default function ArtStyles({ isDark }) {

  const styles = [
    {
      icon: pencil,
      title: "Realistic Pencil Portraits",
      desc: "Realistic portraits created with fine graphite pencil strokes capturing detailed expressions and textures."
    },
    {
      icon: charcoal,
      title: "Charcoal Art",
      desc: "Bold and dramatic artwork using charcoal to create deep shadows and striking contrast."
    },
    {
      icon: sketching,
      title: "Sketching",
      desc: "Quick and expressive sketches that capture the subject with minimal strokes and natural flow."
    },
    {
      icon: caricature,
      title: "Caricature",
      desc: "Fun and exaggerated portraits highlighting unique facial features in a playful artistic style."
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
            className={`rounded-2xl border p-5 text-center transition hover:-translate-y-2 ${
              isDark
                ? "bg-[#111] border-neutral-800"
                : "bg-white border-neutral-200 shadow-md"
            }`}
          >

<div className="mb-4 overflow-hidden rounded-xl">
  <img
    src={style.icon}
    alt={style.title}
    className="w-full h-70 object-cover"
  />
</div>

            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
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