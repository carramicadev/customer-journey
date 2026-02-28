"use client";

import Image from "next/image";
import { whyItems } from "./whyData";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Why() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // LEFT TEXT ANIMATION
      gsap.from(leftRef.current, {
        x: -80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // CARDS ANIMATION
      gsap.from(cardsRef.current, {
        y: 80,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#FAFAFA] px-6 py-24 lg:px-0">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2">
        {/* LEFT SIDE TEXT */}
        <div ref={leftRef} className="space-y-8">
          <div className="inline-block rounded-lg bg-[#425c52] px-6 py-3 text-white">
            Why Choose Carramica
          </div>

          <h2 className="font-heading text-3xl leading-tight text-primary sm:text-4xl lg:text-5xl">
            Because every meaningful gift deserves craftsmanship, durability,
            and timeless beauty.
          </h2>

          <p className="font-subheading max-w-xl text-xl text-gray-600">
            Carramica combines export-quality ceramics, long-lasting decal
            technology, and thoughtful design to create premium gifts that
            remain beautiful for years. Trusted by leading companies and crafted
            with care, every Carramica piece is made to deliver both elegance
            and lasting value.
          </p>
        </div>

        {/* RIGHT SIDE GRID */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {whyItems.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => el && (cardsRef.current[i] = el)}
              className="group h-[260px] [perspective:1000px] lg:h-[300px]"
            >
              <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* FRONT */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl [backface-visibility:hidden]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="font-heading text-lg">{item.title}</p>
                  </div>
                </div>

                {/* BACK */}
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-primary p-6 text-center text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <p className="font-subheading text-lg">{item.backText}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
