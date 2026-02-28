"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { howItems } from "./howData";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function How() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  console.log(ScrollTrigger.getAll());
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // TITLE
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        },
      );

      // CARDS
      gsap.fromTo(
        cardsRef.current,
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      );

      // PARALLAX
      gsap.to(cardsRef.current, {
        yPercent: -5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    console.log("Triggers:", ScrollTrigger.getAll());
    return () => ctx.revert();
  }, []);

  const handleHover = (el: HTMLDivElement, enter: boolean) => {
    if (enter) {
      gsap.to(el, {
        y: -12,
        scale: 1.03,
        boxShadow: "0px 25px 50px rgba(0,0,0,0.15)",
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(el, {
        y: 0,
        scale: 1,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.08)",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="bg-[#FAFAFA] px-6 py-24 text-center md:px-0"
    >
      <div className="mx-auto max-w-7xl">
        {/* TITLE */}
        <div ref={titleRef} className="mb-16">
          <h2 className="font-heading mb-6 text-3xl text-primary sm:text-4xl md:text-5xl">
            How It Works
          </h2>

          <p className="font-subheading mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            A seamless journey from concept to delivery — thoughtfully designed,
            crafted with precision, and beautifully presented for every
            meaningful occasion.
          </p>
        </div>

        {/* IMAGES GRID */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {howItems.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el && !cardsRef.current.includes(el)) {
                  cardsRef.current.push(el);
                }
              }}
              onMouseEnter={(e) => handleHover(e.currentTarget, true)}
              onMouseLeave={(e) => handleHover(e.currentTarget, false)}
              className="relative overflow-hidden rounded-3xl bg-white shadow-md transition-all"
            >
              <div className="relative h-[380px] w-full sm:h-[420px] md:h-[460px]">
                <Image
                  src={item.image}
                  alt="How Carramica Works"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
