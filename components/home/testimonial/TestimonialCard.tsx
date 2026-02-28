"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface Props {
  item: {
    id: number;
    name: string;
    text: string;
    image: string;
    instagram: string;
  };
  active: boolean;
}

export default function TestimonialCard({ item, active }: Props) {
  return (
    <div
      className={`
        relative shrink-0 transition-all duration-700 ease-out
        ${
          active
            ? "w-[395px] scale-100 opacity-100"
            : "w-[383px] scale-90 opacity-60"
        }
      `}
    >
      {/* CARD */}
      <div className="relative h-[550px] overflow-hidden rounded-3xl">
        {/* IMAGE */}
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="395px"
          priority={active}
          className="
            object-cover
            transition-transform duration-700
            hover:scale-110
          "
        />

        {/* DARK GRADIENT */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* TOP RIGHT ICON */}
        <a
          href={item.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="
            absolute right-4 top-4
            flex h-10 w-10 items-center justify-center
            rounded-full
            border border-white/70
            text-white
            backdrop-blur-md
            transition
            hover:scale-110
            hover:bg-white/20
          "
        >
          <ExternalLink size={18} />
        </a>

        {/* CONTENT */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          {/* stars */}
          <div className="mb-2 text-sm tracking-widest">⭐⭐⭐⭐⭐</div>

          <p className="font-subheading text-lg leading-relaxed">
            "{item.text}"
          </p>

          <p className="font-body mt-3 border-t pt-3 text-sm opacity-90">
            {item.name}
          </p>
        </div>
      </div>
    </div>
  );
}
