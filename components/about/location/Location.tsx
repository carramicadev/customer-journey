"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Location() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /* ======================
         LEFT IMAGE
      ====================== */
      gsap.from(leftImageRef.current, {
        xPercent: -20,
        autoAlpha: 0,
        scale: 1.05,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      /* ======================
         RIGHT IMAGE
      ====================== */
      gsap.from(rightImageRef.current, {
        xPercent: 20,
        autoAlpha: 0,
        scale: 1.05,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      /* ======================
         TEXT STAGGER
      ====================== */
      gsap.from(textRef.current?.children || [], {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          once: true,
        },
      });

      /* ======================
         MAP REVEAL
      ====================== */
      gsap.from(mapRef.current, {
        opacity: 0,
        y: 80,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-x-hidden bg-[#EEF1EF] px-6 py-28 lg:px-0"
    >
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <h2 className="font-heading text-4xl text-primary md:text-5xl">
            Visit Our Store
          </h2>

          <p className="font-subheading mt-6 text-lg text-gray-600">
            Experience Carramica up close at our official showroom, where
            craftsmanship, design, and inspiration come together in one
            beautifully curated space.
          </p>
        </div>

        {/* ================= TOP GRID ================= */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* LEFT BIG IMAGE */}
          <div
            ref={leftImageRef}
            className="mx-auto w-full max-w-[560px] will-change-transform"
          >
            <div className="relative h-[420px] overflow-hidden rounded-3xl sm:h-[600px] lg:h-[713px]">
              <Image
                src="/about/location/store.png"
                alt="Carramica Store"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-8">
            {/* RIGHT IMAGE */}
            <div
              ref={rightImageRef}
              className="relative h-[260px] overflow-hidden rounded-3xl will-change-transform sm:h-[350px] lg:h-[449px]"
            >
              <Image
                src="/about/location/interior.png"
                alt="Carramica Interior"
                fill
                className="object-cover"
              />
            </div>

            {/* TEXT INFO */}
            <div
              ref={textRef}
              className="font-subheading space-y-6 text-lg text-gray-700"
            >
              <p>
                <strong>Address :</strong> Foodcity 26-27, Jl. Green Lake City
                Boulevard, Duri Kosambi, Kecamatan Cengkareng, Kota Jakarta
                Barat, Banten 15147
              </p>

              <div className="flex items-center gap-3">
                <Mail size={20} />
                info@carramica.com
              </div>

              <div className="flex items-center gap-3">
                <Phone size={20} />
                +62 812 9136 6950
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAP ================= */}
        <div ref={mapRef} className="mt-20 overflow-hidden rounded-3xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6308392925403!2d106.709391!3d-6.1801414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f94d5bd6f15d%3A0x8a23e965a6b53be8!2sCarramica!5e0!3m2!1sen!2sid!4v1772351747403!5m2!1sen!2sid"
            width="100%"
            height="450"
            loading="lazy"
            className="border-0"
          />
        </div>
      </div>
    </section>
  );
}
