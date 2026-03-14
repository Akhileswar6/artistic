import { Star } from "lucide-react";

export default function Testimonials({ isDark }) {

const testimonials = [
  {
    name: "Nina Taylor",
    city: "Chennai",
    style: "Charcoal Drawing",
    img: "https://i.pravatar.cc/150?u=nina",
    text: "The attention to detail is unbelievable. Every shade and line looks exactly like the original photo. My family couldn't believe it was hand drawn. Truly impressive work."
  },
  {
    name: "Priya S.",
    city: "Bangalore",
    style: "Pencil Sketch",
    img: "https://i.pravatar.cc/150?u=priya",
    text: "I gifted this sketch to my parents on their anniversary and it became the highlight of the celebration. The likeness is perfect and the emotions in the artwork are beautiful."
  },
  {
    name: "Rahul K.",
    city: "Mumbai",
    style: "Color Portrait",
    img: "https://i.pravatar.cc/150?u=rahul",
    text: "Absolutely amazing work. The colors are vibrant and the detailing is exceptional. It looks even better in person than in the preview images."
  },
  {
    name: "James Chen",
    city: "Delhi",
    style: "Caricature",
    img: "https://i.pravatar.cc/150?u=james",
    text: "The caricature was hilarious and beautifully done. It captured the personality perfectly while still looking elegant and artistic."
  },
  {
    name: "David Wilson",
    city: "Hyderabad",
    style: "Pencil Sketch",
    img: "https://i.pravatar.cc/150?u=david",
    text: "Clean, professional, and incredibly detailed artwork. The sketch feels alive and every small feature is captured perfectly."
  },
  {
    name: "Sneha P.",
    city: "Pune",
    style: "Charcoal Drawing",
    img: "https://i.pravatar.cc/150?u=sneha",
    text: "I ordered a charcoal sketch for my sister's birthday and she absolutely loved it. The shading and texture look so realistic."
  },
  {
    name: "Arjun R.",
    city: "Kolkata",
    style: "Pencil Sketch",
    img: "https://i.pravatar.cc/150?u=arjun",
    text: "One of the best artworks I have ever received. The artist perfectly captured the emotions in the photograph."
  },
  {
    name: "Meera L.",
    city: "Ahmedabad",
    style: "Color Portrait",
    img: "https://i.pravatar.cc/150?u=meera",
    text: "The colors are stunning and the artwork feels premium. Everyone who visits my house asks about the portrait."
  },
  {
    name: "Karan D.",
    city: "Delhi",
    style: "Caricature",
    img: "https://i.pravatar.cc/150?u=karan",
    text: "Such a fun and creative caricature. It perfectly represents our personalities and makes everyone smile."
  },
  {
    name: "Ayesha N.",
    city: "Lucknow",
    style: "Charcoal Drawing",
    img: "https://i.pravatar.cc/150?u=ayesha",
    text: "The portrait exceeded my expectations. The detailing in the eyes and hair is incredible and the overall finish looks very professional."
  }
];


  return (
    <div className="mt-32 overflow-hidden relative">

      {/* Title */}
      <div className="text-center mb-16">
        <h2
          className="text-4xl font-semibold"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Loved by Customers
        </h2>

        <p className={`mt-3 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
          Real reviews from happy clients
        </p>
      </div>

      {/* TOP ROW */}
<div
  className={`pointer-events-none absolute left-0 top-0 h-full w-40 z-10 ${
    isDark
      ? "bg-gradient-to-r from-black to-transparent"
      : "bg-gradient-to-r from-white to-transparent"
  }`}
/>
<div
  className={`pointer-events-none absolute right-0 top-0 h-full w-40 z-10 ${
    isDark
      ? "bg-gradient-to-l from-black to-transparent"
      : "bg-gradient-to-l from-white to-transparent"
  }`}
/>
      <div className="scroll-row scroll-left">

        {[...testimonials, ...testimonials].map((t, i) => (

  <div
  key={i}
  className={`min-w-[320px] max-w-[320px] border rounded-2xl p-6 flex-shrink-0 transition duration-300 hover:-translate-y-2 ${
    isDark
      ? "bg-[#111] border-neutral-700"
      : "bg-white border-neutral-200 shadow-md"
  }`}
>

            <div className="flex items-center gap-3 mb-3">

              <img src={t.img} className="w-10 h-10 rounded-full" />

              <div>
                <p className="font-semibold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>{t.name}</p>
                <p className="text-sm text-neutral-500">
                  {t.city} · {t.style}
                </p>
              </div>

            </div>

            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#facc15" color="#facc15" />
              ))}
            </div>

            <p className="text-sm opacity-90">{t.text}</p>

          </div>

        ))}

      </div>
      

      {/* BOTTOM ROW */}
      <div className="scroll-row scroll-right mt-6">

        {[...testimonials, ...testimonials].map((t, i) => (

          <div
  key={i}
  className={`min-w-[320px] max-w-[320px] border rounded-2xl p-6 flex-shrink-0 transition duration-300 hover:-translate-y-2 ${
    isDark
      ? "bg-[#111] border-neutral-700"
      : "bg-white border-neutral-200 shadow-md"
  }`}
>

            <div className="flex items-center gap-3 mb-3">

              <img src={t.img} className="w-10 h-10 rounded-full" />

              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-neutral-500">
                  {t.city} · {t.style}
                </p>
              </div>

            </div>

            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#facc15" color="#facc15" />
              ))}
            </div>

            <p className="text-sm opacity-90">{t.text}</p>

          </div>

        ))}

      </div>

    </div>
  );
}