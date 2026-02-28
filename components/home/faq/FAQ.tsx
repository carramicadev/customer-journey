"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FAQItem from "./FAQItem";
import { faqData } from "./faqData";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const [active, setActive] = useState<number | null>(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(itemsRef.current, {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#EEF1EF] px-6 py-28">
      <div className="mx-auto max-w-4xl text-center">
        {/* TITLE */}
        <h2 className="font-heading text-4xl text-primary md:text-5xl">
          Frequently Asked Questions
        </h2>

        <p className="font-subheading mx-auto mt-4 max-w-2xl text-gray-600">
          From global corporations to distinguished local brands, Carramica is
          trusted to craft gifts that leave a lasting impression.
        </p>
      </div>

      {/* FAQ LIST */}
      <div className="mx-auto mt-16 max-w-4xl space-y-6">
        {faqData.map((item, i) => (
          <div key={i} ref={(el) => el && (itemsRef.current[i] = el)}>
            <FAQItem
              item={item}
              active={active === i}
              onClick={() => setActive(active === i ? null : i)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
