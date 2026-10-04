import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { API_BASE_URL } from '../config';

const defaultTestimonials = [
  { name: "Ananya Sharma", city: "Mumbai", artStyle: "Charcoal Drawing", text: "The attention to detail is unbelievable.", rating: 5 },
  { name: "Priya Singh", city: "Bangalore", artStyle: "Pencil Sketch", text: "I gifted this sketch to my parents on their anniversary and it became the highlight of the celebration.", rating: 5 },
  { name: "Rahul Kapoor", city: "Delhi", artStyle: "Color Portrait", text: "Absolutely amazing work.", rating: 5 },
  { name: "Ishaan Mehta", city: "Pune", artStyle: "Caricature", text: "The caricature was hilarious and beautifully done.", rating: 5 },
];

export default function Testimonials({ isDark }) {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/testimonials`);
        if (res.ok) {
          const data = await res.json();
          const featured = data.filter(t => t.isFeatured);
          if (featured.length > 0) {
            setTestimonials(featured);
          }
        }
      } catch (err) {
        console.error('Failed to load testimonials');
      }
    };
    fetchTestimonials();
  }, []);

  const midPoint = Math.ceil(testimonials.length / 2);
  const row1 = [...testimonials.slice(0, midPoint), ...testimonials.slice(0, midPoint)];
  const row2 = [...testimonials.slice(midPoint), ...testimonials.slice(midPoint)];

  if (testimonials.length === 0) return null;

  const TestimonialCard = ({ t }) => (
    <div className={`min-w-[300px] max-w-[300px] sm:min-w-[350px] sm:max-w-[350px] border rounded-2xl p-4 flex-shrink-0 transition duration-300 hover:-translate-y-1 ${
      isDark
        ? "bg-[#111] border-neutral-700 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        : "bg-white border-neutral-200 shadow-xl"
    }`}>
      <div className="flex items-center gap-3 mb-3">
        {t.imageUrl ? (
          <img src={t.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${isDark ? "bg-neutral-800 text-white" : "bg-neutral-100 text-black"}`}>
            <span className="font-bold text-[14px]">{t.name.charAt(0)}</span>
          </div>
        )}
        <div>
          <p className="font-semibold text-[14px] sm:text-[15px]" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>{t.name}</p>
          <p className="text-[11px] sm:text-[12px] text-neutral-500">
            {t.city} · {t.artStyle}
          </p>
        </div>
      </div>
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={11} className="sm:w-[12px] sm:h-[12px]" fill={i < t.rating ? '#facc15' : 'transparent'} color={i < t.rating ? '#facc15' : 'currentColor'} opacity={i < t.rating ? 1 : 0.3} />
        ))}
      </div>
      <p className="text-[12px] sm:text-[13px] opacity-90 leading-relaxed">{t.text}</p>
    </div>
  );

  return (
    <div className="mt-20 md:mt-32 overflow-hidden relative py-12">
      <div className="text-center mb-12 md:mb-16 px-4">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight" style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Loved by <span className="text-neutral-500 font-bold">Customers</span>
        </h2>
        <p className={`mt-2 sm:mt-3 text-[13px] sm:text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
          Real reviews from happy clients
        </p>
      </div>

      <div className={`pointer-events-none absolute left-0 top-0 h-full w-12 sm:w-20 md:w-40 z-10 ${
        isDark ? "bg-gradient-to-r from-black to-transparent" : "bg-gradient-to-r from-white to-transparent"
      }`} />
      <div className={`pointer-events-none absolute right-0 top-0 h-full w-12 sm:w-20 md:w-40 z-10 ${
        isDark ? "bg-gradient-to-l from-black to-transparent" : "bg-gradient-to-l from-white to-transparent"
      }`} />
      
      <div className="scroll-row scroll-left">
        {row1.map((t, i) => <TestimonialCard key={i} t={t} />)}
      </div>
      
      {row2.length > 0 && (
        <div className="scroll-row scroll-right mt-6">
          {row2.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>
      )}
    </div>
  );
}
