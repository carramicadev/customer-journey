"use client";

import { PaymentResult } from "@/types/payment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  result: PaymentResult | null;
  status: string;
}

/**
 * ============================================
 * COPY HELPER
 * ============================================
 */

const copy = async (text?: string) => {
  if (!text) return;
  await navigator.clipboard.writeText(text);
  alert("Disalin!");
};

/**
 * ============================================
 * COMPONENT
 * ============================================
 */

export default function PaymentInstruction({ result, status }: Props) {
  const router = useRouter();
  const [showHow, setShowHow] = useState(false);

  if (!result) return null;

  const isVA = Boolean(result.vaNumber);
  const isRedirect = Boolean(result.redirectUrl);

  /**
   * ============================================
   * TRY DETECT QR IMAGE FROM MIDTRANS RAW
   * ============================================
   */

  let qrUrl: string | undefined;

  if (result.raw?.actions?.length) {
    const qrAction = result.raw.actions.find(
      (a: any) => a.name === "generate-qr-code" || a.url?.includes("qr"),
    );

    qrUrl = qrAction?.url;
  }

  return (
    <Card
      className={`mt-6 space-y-4 border-2  ${status === "EXPIRED" ? "border-red-900 bg-red-50" : "border-primary bg-green-50"}  p-6`}
    >
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <CheckCircle className="size-6 text-primary" />
        <h2 className="text-lg font-semibold text-primary">
          Instruksi Pembayaran
        </h2>
      </div>

      {/* ================= VA ================= */}
      {isVA && (
        <div className="space-y-3 rounded-md border bg-white p-4">
          <p className="text-sm text-gray-500">Transfer ke Virtual Account:</p>

          <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
            <div>
              <p className="text-xs text-gray-400">
                Bank {result.bank?.toUpperCase()}
              </p>

              <p className="text-lg font-bold tracking-wider">
                {result.vaNumber}
              </p>
            </div>

            <Button variant="outline" onClick={() => copy(result.vaNumber)}>
              Copy
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Silakan transfer sebelum batas waktu Midtrans.
          </p>
        </div>
      )}

      {/* ================= QRIS ================= */}
      {qrUrl && (
        <div className="space-y-3 rounded-md border bg-white p-4">
          <p className="text-sm text-gray-500">Scan QR untuk membayar:</p>

          <img src={qrUrl} alt="QR Payment" className="mx-auto max-h-64" />
        </div>
      )}

      {/* ================= REDIRECT ================= */}
      {isRedirect && !qrUrl && (
        <div className="space-y-3 rounded-md border bg-white p-4">
          <p className="text-sm text-gray-500">Lanjutkan pembayaran:</p>

          <Button
            className="w-full bg-primary hover:bg-green-700"
            onClick={() => window.open(result.redirectUrl, "_blank")}
          >
            Buka Halaman Pembayaran
          </Button>
        </div>
      )}

      {/* ================= STATUS ================= */}
      {/* ================= HOW TO PAY ================= */}

      <div className="mt-4 rounded-md border bg-white">
        <button
          onClick={() => setShowHow(!showHow)}
          className="flex w-full justify-between p-4 text-left font-semibold"
        >
          How to pay
          <span>{showHow ? "▴" : "▾"}</span>
        </button>

        {showHow && (
          <div className="space-y-2 border-t p-4 text-sm text-gray-600">
            <p>1. Login ke aplikasi bank</p>
            <p>2. Pilih transfer virtual account</p>
            <p>3. Masukkan nomor VA</p>
            <p>4. Bayar sesuai jumlah</p>
          </div>
        )}
      </div>

      {/* ================= ACTION BUTTONS ================= */}

      <div className="flex flex-col gap-3 pt-4">
        <Button
          onClick={() =>
            window.dispatchEvent(new Event("CHECK_PAYMENT_STATUS"))
          }
          className="bg-primary hover:bg-green-700"
        >
          Check Status
        </Button>

        <button
          onClick={() => router.push("/")}
          className="text-center text-sm text-primary underline"
        >
          Leave this page
        </button>
      </div>

      {/* ================= STATUS ================= */}

      {/* <div className="pt-2 text-xs text-gray-500">
        Status transaksi: {result.status}
      </div> */}
    </Card>
  );
}
