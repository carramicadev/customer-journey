"use client";

import { useState } from "react";

import {
  PaymentMethod,
  PaymentResult,
  MidtransTransactionRequest,
} from "@/types/payment";

/**
 * ============================================
 * MAP PAYMENT METHOD → MIDTRANS CONFIG
 * ============================================
 */

const mapPaymentToMidtrans = (
  method: PaymentMethod,
): Pick<
  MidtransTransactionRequest,
  "payment_type" | "bank_transfer" | "qris" | "gopay" | "shopeepay"
> => {
  switch (method) {
    /* ===== BANK VA ===== */

    case "bca_va":
      return {
        payment_type: "bank_transfer",
        bank_transfer: { bank: "bca" },
      };

    case "bni_va":
      return {
        payment_type: "bank_transfer",
        bank_transfer: { bank: "bni" },
      };

    case "bri_va":
      return {
        payment_type: "bank_transfer",
        bank_transfer: { bank: "bri" },
      };

    case "mandiri_va":
      return {
        payment_type: "bank_transfer",
        bank_transfer: { bank: "mandiri" },
      };

    case "permata_va":
      return {
        payment_type: "bank_transfer",
        bank_transfer: { bank: "permata" },
      };

    /* ===== EWALLET ===== */

    case "gopay":
      return {
        payment_type: "gopay",
        gopay: {},
      };

    case "shopeepay":
      return {
        payment_type: "shopeepay",
        shopeepay: {
          callback_url: "https://customerdev.carramica.org/",
        },
      };

    /* ===== QRIS ===== */

    case "qris":
      return {
        payment_type: "qris",
        qris: {},
      };

    default:
      throw new Error("Unsupported payment method");
  }
};

/**
 * ============================================
 * PARSE MIDTRANS RESPONSE → UNIFIED RESULT
 * ============================================
 */

const parseMidtransResult = (res: any): PaymentResult => {
  const paymentType = res.payment_type;

  /* ===== BANK VA ===== */

  if (paymentType === "bank_transfer") {
    const va =
      res.va_numbers?.[0]?.va_number ?? res.permata_va_number ?? undefined;

    const bank =
      res.va_numbers?.[0]?.bank ??
      (res.permata_va_number ? "permata" : undefined);

    return {
      orderId: res.order_id,
      status: res.transaction_status ?? "pending",
      vaNumber: va,
      bank,
      raw: res,
    };
  }

  /* ===== EWALLET / QRIS ===== */

  const redirect =
    res.actions?.find((a: any) => a.name === "deeplink-redirect")?.url ??
    res.redirect_url ??
    res.actions?.[0]?.url;

  return {
    orderId: res.order_id,
    status: res.transaction_status,
    redirectUrl: redirect,
    raw: res,
  };
};

/**
 * ============================================
 * HOOK
 * ============================================
 */

export const usePaymentMethod = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * ============================================
   * CREATE CORE API TRANSACTION
   * ============================================
   *
   * backend wajib punya endpoint:
   *
   * POST /api/midtrans/create
   *
   * yang call Midtrans Core API
   *
   */

  const createTransaction = async (
    baseRequest: Omit<MidtransTransactionRequest, "payment_type">,
    method: PaymentMethod,
  ) => {
    try {
      setLoading(true);
      setError(null);

      /* ===== MAP PAYMENT ===== */

      const paymentConfig = mapPaymentToMidtrans(method);

      /* ===== BUILD FINAL BODY ===== */

      const body: MidtransTransactionRequest = {
        ...baseRequest,
        ...paymentConfig,
      };
      console.log(body);
      /**
       * ====================================
       * CALL BACKEND (WAJIB SERVER SIDE)
       * ====================================
       *
       * ❗ JANGAN langsung ke Midtrans dari client
       */

      const res = await fetch("/api/midtrans/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed create transaction");
      }

      const json = await res.json();
      const parsed = parseMidtransResult(json.data);

      setResult(parsed);

      return parsed;
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Payment error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    result,
    error,
    createTransaction,
  };
};
