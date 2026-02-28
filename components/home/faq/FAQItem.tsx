"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";

export default function FAQItem({ item, active, onClick }: any) {
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!contentRef.current) return;

    if (!active) {
      gsap.to(contentRef.current, {
        height: contentRef.current.scrollHeight,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      });

      gsap.to(iconRef.current, {
        rotate: 180,
        duration: 0.4,
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });

      gsap.to(iconRef.current, {
        rotate: 0,
        duration: 0.4,
      });
    }

    onClick();
  };

  return (
    <div
      onClick={toggle}
      className="
        group cursor-pointer rounded-3xl
        bg-white
        p-6 shadow-sm
        transition-all
        duration-300 hover:-translate-y-1
        hover:shadow-lg
        md:p-8
      "
    >
      {/* QUESTION */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg md:text-xl">{item.question}</h3>

        <div ref={iconRef}>
          <ChevronDown className="transition-colors group-hover:text-primary" />
        </div>
      </div>

      {/* ANSWER */}
      <div
        ref={contentRef}
        style={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        <p className="font-subheading mt-4 text-lg text-gray-600">
          {item.answer}
        </p>
      </div>
    </div>
  );
}
