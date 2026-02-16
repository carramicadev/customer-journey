"use client";

import Image from "next/image";
import { PaymentOption, PaymentMethod } from "@/types/payment";
import { cn } from "@/lib/utils"; // kalau tidak ada -> hapus & pakai template string biasa

interface Props {
  option: PaymentOption;

  /** method yg sedang dipilih */
  selected?: PaymentMethod | null;

  /** klik pilih */
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodCard({
  option,
  selected,
  onSelect,
}: Props) {
  const isActive = selected === option.id;

  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`
        flex w-full items-center justify-between
        rounded-xl border px-4 py-4
        transition-all duration-150
        ${
          isActive
            ? "border-green-600 bg-green-50"
            : "border-gray-200 bg-white hover:border-green-400"
        }
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* LOGO */}
        <div className="relative h-8 w-16 shrink-0">
          <Image
            src={option.logo}
            alt={option.label}
            fill
            className="object-contain"
          />
        </div>

        {/* LABEL */}
        <span className="text-sm font-medium text-gray-800">
          {option.label}
        </span>
      </div>

      {/* RIGHT ARROW */}
      <div
        className={`
          text-lg font-bold
          ${isActive ? "text-primary" : "text-gray-400"}
        `}
      >
        ›
      </div>
    </button>
  );
}
