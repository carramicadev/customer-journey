"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaWhatsapp } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  /* ===============================
     SCROLL REVEAL
  =============================== */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(imageRef.current, {
        scale: 1.15,
        opacity: 0,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      /* ===============================
         BUTTON PULSE LOOP
      =============================== */
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      /* subtle parallax */
      gsap.to(imageRef.current, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#FAFAFA] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* CONTAINER */}
        <div className="rounded-3xl">
          <div className="relative overflow-hidden rounded-3xl">
            {/* IMAGE */}
            <div
              ref={imageRef}
              className="relative h-[420px] w-full md:h-[620px]"
            >
              <Image
                src="/home/cta/cta.png"
                style={{ clipPath: "inset(0 round 24px)" }}
                alt="Carramica Gift"
                fill
                priority
                className="object-cover [transform:translateZ(0)]"
              />

              {/* overlay */}
              <div className="absolute inset-0 rounded-3xl bg-black/35 " />
            </div>

            {/* CONTENT */}
            <div
              ref={textRef}
              className="
              absolute inset-0
              flex flex-col
              justify-center
              px-6
              md:px-16
              lg:max-w-2xl
            "
            >
              <h2 className="font-heading text-3xl leading-tight text-white sm:text-4xl md:text-5xl">
                Create Gifts That Leave
                <br />a Lasting Impression
              </h2>

              <p className="font-subheading mt-6 max-w-xl text-lg text-white/90">
                Share your gifting vision with us, and our team will craft a
                refined ceramic experience tailored perfectly for your special
                occasion.
              </p>

              {/* BUTTON */}
              <a
                ref={buttonRef}
                href="https://carramica.com/_/cs/rotate?group=1730371362232&text=hai%20micaa.."
                target="_blank"
                className="
                relative mt-10 inline-flex w-fit
                items-center
                rounded-full
                bg-primary
                py-3
                pl-6
                pr-24
                text-white
                shadow-lg
                transition-all duration-300
                hover:shadow-2xl
              "
              >
                <span className="font-heading text-lg tracking-wide">
                  Order Now
                </span>

                {/* WHITE ICON */}
                <div className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <FaWhatsapp className="text-primary" size={26} />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
