"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signatureTabs } from "./signatureData";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaWhatsapp } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function Signature() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState(signatureTabs[0]);
  const [mainImage, setMainImage] = useState(signatureTabs[0].mainImage);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".signature-main",
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" },
    );
  }, [mainImage]);

  return (
    <section ref={sectionRef} className="bg-[#EEF1EF] px-6 py-28 lg:px-0">
      <div className="mx-auto max-w-7xl">
        {/* TOP AREA */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* LEFT HEADING */}
          <div>
            <div className="mb-6 inline-block rounded-lg bg-primary px-6 py-3 text-white shadow-md">
              Signature Offering
            </div>

            <h2 className="font-heading text-4xl leading-tight text-primary sm:text-5xl lg:text-6xl">
              Curated ceramic gifts and custom solutions for every need
            </h2>
          </div>

          {/* RIGHT QUOTE */}
          <div className="font-subheading text-lg leading-relaxed text-gray-600 lg:pt-32">
            <p>
              “Since you get more joy out of giving joy to others, you should
              put a good deal of thought into the happiness that you are able to
              give.”
            </p>
            <span className="mt-4 block">— Eleanor Roosevelt</span>
          </div>
        </div>

        {/* TAB MENU */}
        {/* TAB MENU */}
        <div className="font-heading mt-20 flex flex-wrap justify-center gap-16 text-lg text-primary">
          {signatureTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab);
                setMainImage(tab.mainImage);
              }}
              className={`rounded-xl px-6 py-3 transition-all duration-300
              ${
                activeTab.id === tab.id
                  ? "bg-tertiary text-white shadow-sm"
                  : "hover:text-primary/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div
          ref={contentRef}
          className="mt-16 grid justify-items-center gap-16 lg:grid-cols-2 lg:items-center lg:justify-items-stretch"
        >
          {/* LEFT IMAGE */}
          <div className="mx-auto w-full max-w-[673px] lg:mx-0">
            <div className="signature-main relative h-[260px] overflow-hidden rounded-2xl sm:h-[350px] md:h-[438px]">
              <Image
                src={mainImage}
                alt="Signature"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* RIGHT TEXT AREA */}
          <div className="mx-auto w-full max-w-[673px] space-y-8 lg:mx-0">
            <h3 className="font-heading text-4xl text-primary">
              {activeTab.label}
            </h3>

            <p className="font-subheading text-lg leading-relaxed text-gray-700">
              {activeTab.description}
            </p>

            {/* THUMBNAILS */}
            <div className="flex flex-wrap justify-center gap-6 lg:justify-start">
              {activeTab.thumbnails.map((img, i) => (
                <div
                  key={i}
                  onMouseDown={() => setMainImage(img)}
                  className="relative h-[80px] w-[120px] cursor-pointer overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:scale-105 md:h-[100px] md:w-[154px]"
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>

            <div className="font-heading cursor-pointer text-lg underline underline-offset-4">
              Read More
            </div>

            {/* ORDER BUTTON */}
            <div className="flex justify-center lg:justify-start">
              <a
                href="https://carramica.com/_/cs/rotate?group=1730371362232&text=hai%20micaa.."
                target="_blank"
                className="relative inline-flex items-center rounded-full bg-primary py-3 pl-5 pr-24 text-white shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <span className="font-heading text-lg tracking-wide">
                  Order Now
                </span>

                {/* White Circle */}
                <div className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <FaWhatsapp className="text-primary" size={28} />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
