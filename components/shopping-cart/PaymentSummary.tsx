"use client";

import React from "react";
import { Order } from "@/types/shopping-cart";

interface PaymentSummaryProps {
  overallSubtotal: number;
  overallDeliveryFee: number;
  overallTotal: number;

  orders: Order[];
  loadingCheckout: boolean;

  onCheckout: () => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  overallSubtotal,
  overallDeliveryFee,
  overallTotal,
  orders,
  loadingCheckout,
  onCheckout,
}) => {
  const isDisabled =
    orders.some(
      (order) =>
        order.dataComplete === undefined || order.dataComplete === false,
    ) ||
    loadingCheckout ||
    orders.length < 1;

  return (
    <div>
      {/* <h2 className="mb-4 text-xl font-semibold">Ringkasan Pembayaran</h2> */}

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rp {overallSubtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span>Total Discount</span>
          <span>Rp 0</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>Rp {overallDeliveryFee.toLocaleString()}</span>
        </div>

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>Rp {overallTotal.toLocaleString()}</span>
        </div>
      </div>

      <button
        disabled={isDisabled}
        onClick={onCheckout}
        className={`${
          isDisabled
            ? "mt-4 w-full cursor-not-allowed rounded-md bg-gray-400 px-4 py-3 text-white"
            : "mt-4 w-full rounded-md bg-primary px-4 py-3 text-white hover:bg-primary/90"
        }`}
      >
        {loadingCheckout ? "loading..." : "Lanjut ke Pembayaran"}
      </button>

      {orders.some(
        (order) =>
          order.dataComplete === undefined || order.dataComplete === false,
      ) && (
        <p className="mt-1 text-xs text-red-600">
          Data order belum lengkap semua
        </p>
      )}
    </div>
  );
};

export default PaymentSummary;
