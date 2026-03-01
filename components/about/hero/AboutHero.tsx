"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function AboutHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.3,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100vh-80px)] w-full"
    >
      {/* IMAGE */}
      <Image
        src="/about/hero/aboutHero.png"
        alt="Carramica About"
        fill
        priority
        className="object-cover"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/45" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex items-center">
        <div ref={textRef} className="max-w-2xl pl-[8%] text-white">
          <h1 className="font-heading text-5xl leading-tight md:text-6xl">
            Crafted with
            <br />
            Timeless Care
          </h1>

          <p className="font-subheading mt-6 text-xl opacity-90 md:text-2xl">
            Every Carramica piece tells a story, blending craftsmanship,
            elegance, and meaningful moments into timeless ceramics.
          </p>
        </div>
      </div>
    </section>
  );
}
