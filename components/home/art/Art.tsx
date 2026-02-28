"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Art() {
  const section = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // INITIAL STATE (APPLE CINEMATIC)
      gsap.set(cards.current, {
        opacity: 0,
        y: 80,
        scale: 0.9,
        filter: "blur(18px)",
      });

      // MAIN REVEAL
      gsap.to(cards.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.8,
        stagger: 0.22,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section.current,
          start: "top 70%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // DEPTH PARALLAX (APPLE STYLE)
      cards.current.forEach((card, i) => {
        gsap.to(card, {
          yPercent: i === 0 ? -1 : -3,
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top 80%",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const hover = (el: HTMLDivElement, enter: boolean) => {
    const shine = el.querySelector(".shine");

    gsap.to(el, {
      scale: enter ? 1.04 : 1,
      duration: 0.45,
      ease: "power2.out",
    });

    if (shine) {
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
            opacity: 1,
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
    }
  };

  const box = "relative overflow-hidden rounded-3xl";

  return (
    <section ref={section} className="bg-[#eef1ef] py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* TAG */}
        <div className="mb-8 inline-block rounded-xl bg-[#425c52] px-6 py-3 text-white">
          The Art of Carramica
        </div>

        {/* TITLE */}
        <h2 className="font-heading mb-16 max-w-4xl text-3xl leading-tight text-primary sm:text-4xl md:text-6xl">
          Where craftsmanship meets timeless ceramic beauty
        </h2>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-center">
          {/* LEFT BIG */}
          <div
            ref={(el) => {
              if (el && !cards.current.includes(el)) {
                cards.current.push(el);
              }
            }}
            onMouseEnter={(e) => hover(e.currentTarget, true)}
            onMouseLeave={(e) => hover(e.currentTarget, false)}
            className="relative h-[380px] w-full overflow-hidden rounded-3xl sm:h-[420px] lg:h-[616px] lg:w-[440px]"
          >
            <Image
              src="/home/art/art1.png"
              alt=""
              fill
              className="relative z-0 object-cover"
            />
            <div className="shine pointer-events-none absolute inset-0 z-10" />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-6 lg:w-auto">
            {/* TOP ROW */}
            <div className="flex flex-col gap-6 sm:flex-row">
              <div
                ref={(el) => {
                  if (el && !cards.current.includes(el)) {
                    cards.current.push(el);
                  }
                }}
                onMouseEnter={(e) => hover(e.currentTarget, true)}
                onMouseLeave={(e) => hover(e.currentTarget, false)}
                className="relative h-[240px] w-full overflow-hidden rounded-3xl sm:h-[260px] lg:h-[296px] lg:w-[358px]"
              >
                <Image
                  src="/home/art/art2.png"
                  alt=""
                  fill
                  className="relative z-0 object-cover"
                />
                <div className="shine pointer-events-none absolute inset-0 z-10" />
              </div>

              <div
                ref={(el) => {
                  if (el && !cards.current.includes(el)) {
                    cards.current.push(el);
                  }
                }}
                onMouseEnter={(e) => hover(e.currentTarget, true)}
                onMouseLeave={(e) => hover(e.currentTarget, false)}
                className="relative h-[240px] w-full overflow-hidden rounded-3xl sm:h-[260px] lg:h-[296px] lg:w-[489px]"
              >
                <Image
                  src="/home/art/art3.png"
                  alt=""
                  fill
                  className="relative z-0 object-cover"
                />
                <div className="shine pointer-events-none absolute inset-0 z-10" />
              </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="flex flex-col gap-6 sm:flex-row">
              <div
                ref={(el) => {
                  if (el && !cards.current.includes(el)) {
                    cards.current.push(el);
                  }
                }}
                onMouseEnter={(e) => hover(e.currentTarget, true)}
                onMouseLeave={(e) => hover(e.currentTarget, false)}
                className="relative h-[240px] w-full overflow-hidden rounded-3xl sm:h-[260px] lg:h-[296px] lg:w-[489px]"
              >
                <Image
                  src="/home/art/art4.png"
                  alt=""
                  fill
                  className="relative z-0 object-cover"
                />
                <div className="shine pointer-events-none absolute inset-0 z-10" />
              </div>

              <div
                ref={(el) => {
                  if (el && !cards.current.includes(el)) {
                    cards.current.push(el);
                  }
                }}
                className="flex h-[240px] w-full flex-col justify-between rounded-3xl bg-primary p-6 text-white sm:h-[260px] lg:h-[296px] lg:w-[358px] lg:p-10"
              >
                <div>
                  <h3 className="font-heading mb-4 text-xl italic">
                    Timeless Craftsmanship
                  </h3>

                  <p className="font-subheading text-sm opacity-90">
                    Carramica transforms export-quality ceramics into elegant
                    gifts, crafted with lasting durability and thoughtful design
                    to bring beauty and meaning to every table.
                  </p>
                </div>

                <div className="flex justify-end opacity-80">
                  <Image
                    src="/logoCarramicaWhite.svg"
                    alt="Carramica"
                    width={140}
                    height={40}
                    className="h-auto w-[90px] sm:w-[110px] lg:w-[140px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
