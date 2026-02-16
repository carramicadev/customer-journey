"use client";

import { PaymentMethod, PaymentOption } from "@/types/payment";
import PaymentMethodCard from "./PaymentMethodCard";
import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

/**
 * 🔥 MASTER LIST PAYMENT OPTION
 * logo → simpan di /public/payment/
 *
 * contoh:
 * /public/payment/bca.png
 * /public/payment/gopay.png
 */
const PAYMENT_OPTIONS: PaymentOption[] = [
  // ===== BANK VA =====
  {
    id: "bca_va",
    label: "BCA Virtual Account",
    logo: "/payment/bca.png",
    group: "bank",
  },
  {
    id: "bni_va",
    label: "BNI Virtual Account",
    logo: "/payment/bni.png",
    group: "bank",
  },
  {
    id: "bri_va",
    label: "BRI Virtual Account",
    logo: "/payment/bri.png",
    group: "bank",
  },
  {
    id: "mandiri_va",
    label: "Mandiri Virtual Account",
    logo: "/payment/mandiri.png",
    group: "bank",
  },
  {
    id: "permata_va",
    label: "Permata Virtual Account",
    logo: "/payment/permata.png",
    group: "bank",
  },

  // ===== EWALLET =====
  { id: "gopay", label: "GoPay", logo: "/payment/gopay.png", group: "ewallet" },
  {
    id: "shopeepay",
    label: "ShopeePay",
    logo: "/payment/shopeepay.png",
    group: "ewallet",
  },

  // ===== QRIS =====
  { id: "qris", label: "QRIS", logo: "/payment/qris.png", group: "qris" },
];

export default function PaymentMethodSection({ selected, onSelect }: Props) {
  const renderGroup = (title: string, group: PaymentOption["group"]) => {
    const items = PAYMENT_OPTIONS.filter((p) => p.group === group);

    if (!items.length) return null;

    return (
      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>

        {items.map((opt) => (
          <PaymentMethodCard
            key={opt.id}
            option={opt}
            selected={selected}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  };

  const isCompleted = Boolean(selected);

  return (
    <Card
      className={`space-y-4 p-6 ${
        isCompleted ? "border-2 border-green-600 bg-green-50" : ""
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <CheckCircle
          className={`size-6 ${
            isCompleted ? "text-green-600" : "text-gray-300"
          }`}
        />

        <h2
          className={`text-lg font-semibold ${
            isCompleted ? "text-green-700" : ""
          }`}
        >
          Metode Pembayaran
        </h2>
      </div>

      {/* GROUPS */}
      {renderGroup("Transfer Bank", "bank")}
      {renderGroup("E-Wallet", "ewallet")}
      {renderGroup("QR Code", "qris")}
    </Card>
  );
}
