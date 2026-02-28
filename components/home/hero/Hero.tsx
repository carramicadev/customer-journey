"use client";

import { useEffect, useRef, useState } from "react";
import { heroSlides } from "./heroData";
import HeroSlide from "./HeroSlide";
import HeroDots from "./HeroDots";
import { gsap } from "gsap";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const refs = useRef<HTMLDivElement[]>([]);

  // autoplay
  useEffect(() => {
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % heroSlides.length);
    }, 7000);

    return () => clearInterval(t);
  }, []);

  // GSAP text animation
  useEffect(() => {
    const el = refs.current[index];

    if (!el) return;

    gsap.fromTo(
      el.querySelector(".hero-text"),
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.3, ease: "power3.out" },
    );
  }, [index]);

  return (
    <section className="relative overflow-hidden">
      {/* SLIDES */}
      <div className="relative min-h-[calc(100vh-80px)]">
        {heroSlides.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              if (el) refs.current[i] = el;
            }}
            className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "z-10 opacity-100" : "opacity-0"
            }`}
          >
            <HeroSlide {...s} />
          </div>
        ))}
      </div>

      {/* LEFT ARROW */}
      <button
        onClick={() =>
          setIndex((i) => (i === 0 ? heroSlides.length - 1 : i - 1))
        }
        className="absolute left-8 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/70 p-3 text-white md:flex"
      >
        ←
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={() => setIndex((i) => (i + 1) % heroSlides.length)}
        className="absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/70 p-3 text-white md:flex"
      >
        →
      </button>

      {/* DOTS (BOTTOM CENTER LIKE DESIGN) */}
      <HeroDots total={heroSlides.length} active={index} onChange={setIndex} />
    </section>
  );
}
