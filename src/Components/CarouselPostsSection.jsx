import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselPosts = [
  {
    id: 1,
    images: ["/carousel/process1.webp"]
  },
  {
    id: 2,
    images: ["/carousel/process2.webp"]
  },
  {
    id: 3,
    images: ["/carousel/process3.webp"]
  },
  {
    id: 4,
    images: ["/carousel/process4.webp"]
  },
  {
    id: 5,
    images: ["/carousel/process5.webp"]
  },
  {
    id: 6,
    images: ["/carousel/process6.webp"]
  },
  {
    id: 7,
    images: ["/carousel/process7.webp"]
  },
  {
    id: 8,
    images: ["/carousel/process8.webp"]
  },
  {
    id: 9,
    images: ["/carousel/process9.webp"]
  },
  {
    id: 10,
    images: ["/carousel/process10.webp"]
  }
];

export default function CarouselPostsSection({ isDark }) {
  const [expandedId, setExpandedId] = useState(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleDesktopColumnClick = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const scrollToMobileIndex = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const targetChild = container.children[index];
    if (targetChild) {
      targetChild.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setActiveMobileIndex(index);
    }
  };

  const handleMobileScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const children = Array.from(container.children);

    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeMobileIndex) {
      setActiveMobileIndex(closestIndex);
    }
  };

  // Center initial slide on mobile mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current && scrollRef.current.children[0]) {
        scrollRef.current.children[0].scrollIntoView({
          behavior: "auto",
          inline: "center",
          block: "nearest",
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-6 sm:py-10">
      <div className="mb-6 sm:mb-10 text-center">
        <h2
          className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 sm:mb-4 ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Interactive <span className="text-neutral-500">Carousel Gallery</span>
        </h2>
        <p
          className={`text-[13px] sm:text-[14px] leading-relaxed max-w-xl mx-auto px-2 ${
            isDark ? "text-neutral-400" : "text-neutral-500"
          }`}
        >
          <span className="hidden md:inline">
            Hover to expand and explore the different stages of the masterpiece in full detail.
          </span>
          <span className="md:hidden">
            Scroll horizontally to view each stage of the masterpiece in large detail.
          </span>
        </p>
      </div>

      {/* ======================================================== */}
      {/* DESKTOP VIEW (>= 768px): Expanding Hover Flex Accordion */}
      {/* ======================================================== */}
      <div className="hidden md:block w-full max-w-full mx-auto px-2 box-border">
        <div
          className={`flex flex-row gap-2 sm:gap-3 h-[420px] overflow-hidden group/wrapper ${
            expandedId ? "has-expanded" : ""
          }`}
        >
          {carouselPosts.map((post) => {
            const isExpanded = expandedId === post.id;
            return (
              <div
                key={post.id}
                onClick={() => handleDesktopColumnClick(post.id)}
                className={`relative flex-1 h-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group/column
                  ${isExpanded ? "md:flex-[4]" : ""}
                  md:hover:flex-[4]
                  md:group-hover/wrapper:not(:hover):not(.md\\:flex-\\[4\\]) ${
                    !isExpanded && expandedId ? "md:flex-[0.5] opacity-70" : ""
                  }
                `}
                style={!isExpanded && expandedId ? { flex: "0.5" } : {}}
              >
                <div className="block w-full h-full relative overflow-hidden bg-neutral-900/40">
                  <img
                    src={post.images[0]}
                    alt={`Process step ${post.id}`}
                    className={`w-full h-full object-cover object-center block rounded-2xl sm:rounded-3xl transition-transform duration-700 ease-in-out group-hover/column:scale-105 ${
                      isDark ? "opacity-90 hover:opacity-100" : ""
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover/column:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE VIEW (< 768px): Horizontal Scroll Track with Big Cards */}
      {/* ======================================================== */}
      <div className="block md:hidden w-full">
        {/* Horizontal Scroll Track */}
        <div
          ref={scrollRef}
          onScroll={handleMobileScroll}
          className="flex flex-row overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-3 px-4 py-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {carouselPosts.map((post, index) => {
            const isActive = activeMobileIndex === index;
            return (
              <div
                key={post.id}
                onClick={() => scrollToMobileIndex(index)}
                className={`snap-center shrink-0 w-[80vw] max-w-[340px] h-[390px] rounded-3xl overflow-hidden relative cursor-pointer transition-all duration-500 ease-out ${
                  isActive
                    ? "scale-100 opacity-100 shadow-2xl ring-1 ring-white/20"
                    : "scale-[0.92] opacity-60"
                } ${isDark ? "bg-neutral-900" : "bg-neutral-100"}`}
              >
                <img
                  src={post.images[0]}
                  alt={`Process step ${post.id}`}
                  className="w-full h-full object-cover object-center block rounded-3xl"
                  loading="lazy"
                />

                {/* Step Pill */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 shadow-lg">
                  Step {post.id} of {carouselPosts.length}
                </div>

                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Mobile Navigation Controls & Dots */}
        <div className="flex items-center justify-between px-6 mt-4">
          <button
            type="button"
            onClick={() => scrollToMobileIndex(Math.max(0, activeMobileIndex - 1))}
            disabled={activeMobileIndex === 0}
            className={`p-2 rounded-full border transition-all ${
              activeMobileIndex === 0
                ? "opacity-25 cursor-not-allowed border-transparent"
                : isDark
                ? "border-white/10 text-white hover:bg-white/10 active:scale-95"
                : "border-black/10 text-black hover:bg-black/5 active:scale-95"
            }`}
            aria-label="Previous step"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {carouselPosts.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToMobileIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeMobileIndex
                    ? isDark
                      ? "w-6 bg-white"
                      : "w-6 bg-black"
                    : isDark
                    ? "w-1.5 bg-white/30"
                    : "w-1.5 bg-black/25"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              scrollToMobileIndex(Math.min(carouselPosts.length - 1, activeMobileIndex + 1))
            }
            disabled={activeMobileIndex === carouselPosts.length - 1}
            className={`p-2 rounded-full border transition-all ${
              activeMobileIndex === carouselPosts.length - 1
                ? "opacity-25 cursor-not-allowed border-transparent"
                : isDark
                ? "border-white/10 text-white hover:bg-white/10 active:scale-95"
                : "border-black/10 text-black hover:bg-black/5 active:scale-95"
            }`}
            aria-label="Next step"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
