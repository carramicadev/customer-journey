"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TodayCarramica() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const smallImagesRef = useRef<HTMLDivElement[]>([]);

  /* ===============================
     HOVER EFFECT (ART STYLE)
  =============================== */
  const hover = (el: HTMLDivElement, enter: boolean) => {
    const shine = el.querySelector(".shine");

    gsap.to(el, {
      scale: enter ? 1.04 : 1,
      duration: 0.45,
      ease: "power2.out",
    });

    if (!shine) return;

    if (enter) {
      gsap.fromTo(
        shine,
        {
          x: "-120%",
          y: "-120%",
          opacity: 1,
        },
        {
          x: "120%",
          y: "120%",
          duration: 2.4,
          ease: "power2.out",
        },
      );
    } else {
      gsap.set(shine, {
        x: "-120%",
        y: "-120%",
        opacity: 0,
      });
    }
  };

  /* ===============================
     SCROLL ANIMATION
  =============================== */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        y: 80,
        scale: 1.08,
        opacity: 0,
        filter: "blur(12px)",
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(textRef.current?.children || [], {
        y: 60,
        opacity: 0,
        filter: "blur(8px)",
        stagger: 0.18,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(smallImagesRef.current, {
        y: 80,
        opacity: 0,
        scale: 0.9,
        stagger: 0.2,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
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
        <div className="grid items-stretch gap-16 lg:grid-cols-2">
          {/* ================= BIG IMAGE ================= */}
          <div
            ref={imageRef}
            onMouseEnter={(e) => hover(e.currentTarget, true)}
            onMouseLeave={(e) => hover(e.currentTarget, false)}
            className="mx-auto w-full max-w-[609px]"
          >
            <div className="relative h-[420px] overflow-hidden rounded-3xl sm:h-[560px] lg:h-[759px]">
              <Image
                src="/about/today/main.png"
                alt=""
                fill
                className="object-cover"
              />

              {/* ✅ SHINE */}
              <div className="shine pointer-events-none absolute inset-0 z-10" />
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex flex-col">
            {/* TEXT */}
            <div ref={textRef} className="space-y-6 text-primary">
              <h2 className="font-heading text-4xl md:text-5xl">
                Today’s Carramica
              </h2>

              <p className="font-subheading text-lg leading-relaxed text-gray-700">
                Today, Carramica proudly presents exclusive ceramic collections
                designed entirely in-house. Every product is crafted with
                export-quality standards, certified SNI, and guaranteed food,
                grade safety, ensuring beauty that is not only elegant, but
                trusted.
              </p>

              <p className="font-subheading text-lg leading-relaxed text-gray-700">
                What once began as a humble dream has evolved into a growing
                movement embraced by thousands of customers across Indonesia.
                Through continuous innovation, dedication to craftsmanship, and
                the unwavering support of our Carramily community, Carramica
                continues to transform meaningful moments into lasting
                experiences
              </p>
            </div>

            {/* ================= SMALL IMAGES ================= */}
            <div className="mt-auto flex gap-6 pt-10">
              {["/about/today/1.png", "/about/today/2.png"].map((src, i) => (
                <div
                  key={i}
                  ref={(el) => el && (smallImagesRef.current[i] = el)}
                  onMouseEnter={(e) => hover(e.currentTarget, true)}
                  onMouseLeave={(e) => hover(e.currentTarget, false)}
                  className="
                      relative
                      h-[220px]
                      w-[150px]
                      overflow-hidden
                      rounded-3xl
                      sm:h-[280px]
                      sm:w-[190px]
                      lg:h-[338px]
                      lg:w-[225px]
                    "
                >
                  <Image src={src} alt="" fill className="object-cover" />

                  {/* ✅ SHINE */}
                  <div className="shine pointer-events-none absolute inset-0 z-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
