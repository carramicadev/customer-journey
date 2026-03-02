"use client";

import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PaymentMethod } from "@/types/payment";

/* ========================================
   BANK LIST (MIDTRANS STYLE)
======================================== */

const BANKS: { id: PaymentMethod; logo: string; label: string }[] = [
  { id: "bca_va", logo: "/payment/bca.png", label: "BCA" },
  { id: "mandiri_va", logo: "/payment/mandiri.png", label: "Mandiri" },
  { id: "bni_va", logo: "/payment/bni.png", label: "BNI" },
  { id: "bri_va", logo: "/payment/bri.png", label: "BRI" },
  { id: "permata_va", logo: "/payment/permata.png", label: "Permata" },
];

/* ========================================
   COMPONENT
======================================== */

interface Props {
  selected: PaymentMethod | null;
  onSelect: (m: PaymentMethod) => void;
  status: string;
}

export default function PaymentAccordionSection({ selected, onSelect }: Props) {
  const [openVA, setOpenVA] = useState(true);

  return (
    <Card className="overflow-hidden p-0">
      {/* ================= RECOMMENDED ================= */}

      <div className="border-b p-6">
        <p className="mb-3 text-sm text-gray-400">Recommended payment method</p>

        <button
          onClick={() => onSelect("gopay")}
          className={`
                flex w-full items-center justify-between
                rounded-lg border p-4 transition
                hover:border-green-600 hover:bg-green-50
                ${selected === "gopay" ? "border-green-600 bg-green-50" : ""}
            `}
        >
          <div className="flex items-center gap-4">
            <Image src="/payment/gopay.png" alt="" width={80} height={30} />
            <span className="font-semibold">GoPay / GoPayLater</span>
          </div>
          <span>›</span>
        </button>
      </div>

      {/* ================= ALL ================= */}

      <div className="p-6">
        <p className="mb-3 text-sm text-gray-400">All payment methods</p>

        {/* ========= GOPAY ========= */}

        <button
          onClick={() => onSelect("gopay")}
          className={`
            flex w-full items-center justify-between
            rounded-lg border p-4 transition
            hover:border-green-600 hover:bg-green-50
            ${selected === "gopay" ? "border-green-600 bg-green-50" : ""}
            `}
        >
          <div className="flex items-center gap-4">
            <Image src="/payment/gopay.png" alt="" width={70} height={28} />
            <span>GoPay / GoPayLater</span>
          </div>
          ›
        </button>

        {/* ========= VA HEADER ========= */}

        <button
          onClick={() => setOpenVA(!openVA)}
          className="flex w-full items-center justify-between py-4"
        >
          <div className="flex items-center gap-3">
            <span className="font-semibold">Virtual account</span>
          </div>

          {openVA ? "▴" : "▾"}
        </button>

        {/* ========= VA GRID ========= */}

        {openVA && (
          <div className="grid grid-cols-2 gap-3 py-4">
            {BANKS.map((bank) => (
              <button
                key={bank.id}
                onClick={() => onSelect(bank.id)}
                className={`
                    flex items-center justify-between
                    rounded-lg border p-4
                    transition
                    hover:border-green-600 hover:bg-green-50
                    ${selected === bank.id ? "border-green-600 bg-green-50" : ""}
                    `}
              >
                <Image
                  src={bank.logo}
                  alt=""
                  width={80}
                  height={40}
                  className="object-contain"
                />

                <span>›</span>
              </button>
            ))}
          </div>
        )}

        {/* ========= QRIS ========= */}

        <button
          onClick={() => onSelect("qris")}
          className={`
            mt-2 flex w-full items-center
            justify-between rounded-lg border p-4 transition
            hover:border-green-600 hover:bg-green-50
            ${selected === "qris" ? "border-green-600 bg-green-50" : ""}
            `}
        >
          <div className="flex items-center gap-4">
            <Image src="/payment/qris.png" alt="" width={60} height={26} />
            QRIS
          </div>
          ›
        </button>

        {/* ========= SHOPEEPAY ========= */}

        <button
          onClick={() => onSelect("shopeepay")}
          className={`
            mt-2 flex w-full items-center
            justify-between rounded-lg border p-4 transition
            hover:border-green-600 hover:bg-green-50
            ${selected === "shopeepay" ? "border-green-600 bg-green-50" : ""}
            `}
        >
          <div className="flex items-center gap-4">
            <Image src="/payment/shopeepay.png" alt="" width={80} height={26} />
            ShopeePay
          </div>
          ›
        </button>
      </div>
    </Card>
  );
}
