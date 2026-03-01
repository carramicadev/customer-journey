"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ===============================
   AVATARS
================================ */
const avatars = Array.from({ length: 16 }).map(
  (_, i) => `/about/turning/avatar${i + 1}.png`,
);

export default function TurningPoint() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const avatarsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const els = avatarsRef.current;

      /* ===============================
         ✅ RESPONSIVE RADIUS
      =============================== */
      const width = window.innerWidth;

      let radius = 260; // desktop default

      if (width < 640) {
        radius = 140; // ✅ MOBILE (circle shrink)
      } else if (width < 1024) {
        radius = 220; // ✅ TABLET
      }

      const total = els.length;

      const baseAngles = els.map((_, i) => (i / total) * Math.PI * 2);

      let orbitRotation = 0;

      gsap.set(els, { scale: 0, opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,

        onEnter: () => {
          /* SPAWN */
          els.forEach((el, i) => {
            gsap.to(el, {
              x: Math.cos(baseAngles[i]) * radius,
              y: Math.sin(baseAngles[i]) * radius,
              scale: 1,
              opacity: 1,
              duration: 1.2,
              delay: i * 0.04,
              ease: "power3.out",
            });
          });

          gsap.ticker.add(orbit);
        },
      });

      /* ===============================
         ORBIT LOOP
      =============================== */
      function orbit() {
        orbitRotation += 0.0025;

        els.forEach((el, i) => {
          const angle = baseAngles[i] + orbitRotation;

          gsap.set(el, {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          });
        });
      }

      return () => gsap.ticker.remove(orbit);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        /*
        ✅
        prevent
        mobile
        scroll   */ overflow-hidden bg-[#FAFAFA] px-6 py-32 text-center
      "
    >
      {/* TEXT */}
      <div className="mx-auto max-w-5xl">
        <h2 className="font-heading text-4xl text-primary md:text-5xl">
          The Turning Point
        </h2>

        <p className="font-subheading mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          With the trust and support of our growing community lovingly called
          Carramily, every profit was reinvested back into creation.
        </p>
      </div>

      {/* ORBIT AREA */}
      <div className="relative mx-auto mt-24 flex h-[520px] items-center justify-center md:h-[600px]">
        {/* CENTER LOGO */}
        <div className="relative z-20 w-[180px] md:w-[250px]">
          <Image
            src="/logoCarramicaBigPrimary.png"
            alt="Carramica"
            width={250}
            height={225}
            className="mx-auto"
          />
        </div>

        {/* AVATARS */}
        {avatars.map((src, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) avatarsRef.current[i] = el;
            }}
            className="
              absolute
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              will-change-transform
            "
          >
            <div className="relative h-[40px] w-[40px] overflow-hidden rounded-xl shadow-lg md:h-[70px] md:w-[70px]">
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
