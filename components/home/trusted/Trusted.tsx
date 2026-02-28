"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { trustedLogos } from "./trustedData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Trusted() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);

  // 🎯 FINAL TARGET POSITIONS
  const getPositions = () => [
    { x: -220, y: 0 },
    { x: 0, y: 0 },
    { x: 220, y: 0 },

    { x: -330, y: 160 },
    { x: -110, y: 160 },
    { x: 110, y: 160 },
    { x: 330, y: 160 },

    { x: -120, y: 320 },
    { x: 120, y: 320 },
  ];

  useEffect(() => {
    if (!isDesktop) return;

    const cards = cardsRef.current;
    const positions = getPositions();

    gsap.set(cards, {
      x: 0,
      y: 0,
      scale: 0.7,
      opacity: 0,
      rotate: () => gsap.utils.random(-25, 25),
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        cards.forEach((card, i) => {
          gsap.to(card, {
            y: "+=6",
            repeat: -1,
            yoyo: true,
            duration: 2 + Math.random(),
            ease: "sine.inOut",
            delay: 1.5,
          });

          gsap.to(card, {
            x: positions[i]?.x || 0,
            y: positions[i]?.y || 0,
            rotate: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            delay: gsap.utils.random(0, 0.5),
            ease: "power3.out",
          });
        });
      },
    });
  }, [isDesktop]);

  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleHover = (el: HTMLDivElement, enter: boolean) => {
    if (enter) {
      gsap.to(el, {
        y: "-=18",
        scale: 1.05,
        boxShadow: "0px 25px 40px rgba(0,0,0,0.15)",
        duration: 0.35,
        ease: "power2.out",
      });
    } else {
      gsap.to(el, {
        y: "+=18",
        scale: 1,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
        duration: 0.35,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#FAFAFA] px-6 py-28 text-center md:px-0"
    >
      <h2 className="font-heading mb-4 text-3xl text-primary md:text-4xl">
        Trusted By Companies
      </h2>

      <p className="font-subheading mx-auto mb-24 max-w-xl text-sm text-gray-600 md:text-lg">
        From global corporations to distinguished local brands, Carramica is
        trusted to craft gifts that leave a lasting impression.
      </p>

      {/* CENTER STACK AREA */}
      <div
        className={`mx-auto ${
          isDesktop
            ? "relative h-[520px] max-w-[900px]"
            : "grid max-w-md grid-cols-2 gap-6 sm:grid-cols-3"
        }`}
      >
        {trustedLogos.map((src, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
            onMouseEnter={(e) => handleHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleHover(e.currentTarget, false)}
            className={`${
              isDesktop
                ? "absolute left-1/2 top-0 -translate-x-1/2"
                : "relative"
            } mx-auto w-[120px] cursor-pointer rounded-xl bg-white p-5 shadow-sm`}
          >
            <Image
              src={src}
              alt=""
              width={128}
              height={117}
              className="mx-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
