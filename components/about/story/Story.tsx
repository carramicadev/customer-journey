"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /* =========================
         TEXT REVEAL
      ========================= */
      gsap.from(textRef.current?.children || [], {
        x: -80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      /* =========================
         IMAGE REVEAL
      ========================= */
      gsap.from(imageRef.current, {
        x: 120,
        scale: 1.08,
        opacity: 0,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#EEF1EF] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* GRID */}
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* ================= TEXT ================= */}
          <div ref={textRef} className="space-y-8 text-primary">
            <h2 className="font-heading text-5xl md:text-6xl">The Story</h2>

            <p className="font-subheading text-lg leading-relaxed text-gray-700">
              Every journey has a humble beginning. Carramica started with a
              simple dream, to build a ceramic brand we could truly call our
              own.
            </p>

            <p className="font-subheading text-lg leading-relaxed text-gray-700">
              In the early days, creating original designs felt nearly
              impossible. Producing custom ceramic collections required
              thousands of pieces for a single design, far beyond what we could
              afford.
            </p>

            <p className="font-subheading text-lg leading-relaxed text-gray-700">
              With limited resources, Carramica began by offering leftover
              export-quality ceramics, pieces originally made for international
              markets and rediscovered by local customers who valued
              craftsmanship and quality.
            </p>

            <p className="font-subheading text-lg leading-relaxed text-gray-700">
              It was not easy. Building a brand from almost nothing rarely is.
            </p>
          </div>

          {/* ================= IMAGE ================= */}
          <div
            ref={imageRef}
            className="
              mx-auto
              w-full
              max-w-[530px]
            "
          >
            <div
              className="
                relative
                h-[420px]
                overflow-hidden
                rounded-3xl
                sm:h-[520px]
                md:h-[664px]
              "
            >
              <Image
                src="/about/story/story.png"
                alt="Carramica Beginning"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 530px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
