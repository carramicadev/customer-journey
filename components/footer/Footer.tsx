"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebookF } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<HTMLDivElement[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  /* ===============================
     SCROLL ANIMATION
  =============================== */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(colsRef.current, {
        y: 80,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      gsap.from(bottomRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      /* CTA Pulse */
      gsap.to(buttonRef.current, {
        scale: 1.05,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "power1.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} className="bg-primary px-6 pb-10 pt-20 text-white">
      <div className="mx-auto max-w-7xl">
        {/* ================= TOP GRID ================= */}
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div ref={(el) => el && (colsRef.current[0] = el)}>
            <Image
              src="/logoCarramicaWhite.svg"
              alt="Carramica"
              width={220}
              height={60}
            />

            <p className="font-subheading mt-6 max-w-sm text-lg leading-relaxed text-white/90">
              Where Beautiful Ceramics Become Meaningful Gifts
            </p>

            {/* SOCIAL */}
            <div className="mt-6 flex gap-5 text-xl">
              <a
                href="https://www.instagram.com/carramica"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 transition hover:scale-110 hover:opacity-100"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.tiktok.com/@carramicaofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 transition hover:scale-110 hover:opacity-100"
              >
                <FaTiktok />
              </a>

              <a
                href="https://www.facebook.com/CarramicaID/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 transition hover:scale-110 hover:opacity-100"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>

          {/* NAVIGATION */}
          <div ref={(el) => el && (colsRef.current[1] = el)}>
            <h3 className="font-heading mb-5 text-xl">Navigation</h3>

            <ul className="font-subheading space-y-3 text-lg text-white/90">
              <li className="transition hover:translate-x-1">Home</li>
              <li className="transition hover:translate-x-1">New Arrival</li>
              <li className="transition hover:translate-x-1">All Product</li>
              <li className="transition hover:translate-x-1">About Us</li>
              <li className="transition hover:translate-x-1">Blog</li>
            </ul>
          </div>

          {/* PRODUCT */}
          <div ref={(el) => el && (colsRef.current[2] = el)}>
            <h3 className="font-heading mb-5 text-xl">Our Product</h3>

            <ul className="font-subheading space-y-3 text-lg text-white/90">
              <li>Corporate Hampers</li>
              <li>Wedding Gift</li>
              <li>Wedding Souvenirs</li>
              <li>HORECA</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div ref={(el) => el && (colsRef.current[3] = el)}>
            <h3 className="font-heading mb-5 text-xl">
              We’d Love to Hear From You
            </h3>

            <div className="font-subheading space-y-4 text-lg">
              <div className="flex items-center gap-3">
                <Mail size={20} />
                info@carramica.com
              </div>

              <div className="flex items-center gap-3">
                <Phone size={20} />
                +62 8123 456 789
              </div>
            </div>

            {/* LETS TALK BUTTON */}
            <a
              ref={buttonRef}
              href="https://carramica.com/_/cs/rotate?group=1730371362232&text=hai%20micaa.."
              target="_blank"
              rel="noopener noreferrer"
              className="
                relative mt-8 inline-flex items-center
                rounded-full
                bg-white
                py-3
                pl-6
                pr-24
                text-primary
                shadow-lg
                transition-all duration-300
                hover:shadow-2xl"
            >
              <span className="font-heading text-lg">Let’s Talk</span>

              <div className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <FaWhatsapp className="text-white" size={22} />
              </div>
            </a>
          </div>
        </div>

        {/* ================= DIVIDER ================= */}
        <div className="my-12 h-[1px] w-full bg-white/40" />

        {/* ================= BOTTOM ================= */}
        <div
          ref={bottomRef}
          className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row"
        >
          <p className="font-subheading text-center text-lg text-white/90 md:text-left">
            Made with love © Copyright 2026 Carramica. All Right Reserved
          </p>

          <div className="font-subheading flex gap-6 text-white/90">
            <span className="cursor-pointer hover:underline">
              Privacy Policy
            </span>
            <span className="cursor-pointer hover:underline">
              Term. & Conditions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
