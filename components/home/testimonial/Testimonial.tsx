"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { testimonials as original } from "./testimonialData";
import TestimonialCard from "./TestimonialCard";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonial() {
  const testimonials = [...original, ...original, ...original];
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // center index
  const [index, setIndex] = useState(2);

  const CARD_WIDTH = 420; // width + gap

  /* ===============================
     SCROLL REVEAL
  =============================== */
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  /* ===============================
     SLIDER MOVE
  =============================== */
  useLayoutEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const activeCard = slider.children[index] as HTMLElement;
    if (!activeCard) return;

    const viewportCenter = window.innerWidth / 2;

    const cardRect = activeCard.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;

    const moveX = viewportCenter - cardCenter;

    gsap.to(slider, {
      x: `+=${moveX}`,
      duration: 0.9,
      ease: "power3.out",
    });
  }, [index]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (index >= original.length * 2) {
      setTimeout(() => {
        gsap.set(sliderRef.current, {
          x: -(original.length * CARD_WIDTH),
        });

        setIndex(original.length);
      }, 900);
    }
  }, [index]);
  /* ===============================
     NAVIGATION
  =============================== */
  const prev = () => setIndex((p) => Math.max(0, p - 1));

  const next = () => setIndex((p) => Math.min(testimonials.length - 1, p + 1));

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#FAFAFA] py-28">
      <div className="container mx-auto max-w-7xl">
        <div className=" px-6 lg:mx-0">
          {/* ================= HEADER ================= */}
          <div className="flex flex-col gap-10  md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-5 inline-block rounded-lg bg-primary px-6 py-3 text-white shadow-sm">
                Testimonials
              </div>

              <h2 className="font-heading text-4xl leading-tight text-primary md:text-5xl">
                Trusted by Thousands of Happy Customers
              </h2>

              <p className="font-subheading mt-4 max-w-xl text-lg text-gray-600">
                More than 50,000 customers have chosen Carramica to create
                meaningful ceramic gifts for their special moments.
              </p>
            </div>

            {/* arrows */}
            <div className="hidden gap-4 md:flex">
              <button
                onClick={prev}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 text-primary transition hover:bg-primary hover:text-white"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={next}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 text-primary transition hover:bg-primary hover:text-white"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SLIDER ================= */}
      <div className="mt-20 overflow-hidden">
        {/* center offset */}
        <div className="px-[18vw]">
          <div ref={sliderRef} className="flex gap-8 will-change-transform">
            {testimonials.map((item, i) => (
              <TestimonialCard key={item.id} item={item} active={i === index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
