"use client";

import React from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

import { Order, ShippingService } from "@/types/shopping-cart";
import { Card } from "../ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { isRecipientComplete } from "@/utils/isRecipientComplete";
import { isProductsComplete } from "@/utils/isProductsComplete";

interface CourierSelectProps {
  order: Order;
  index: number;
  onOpen: (index: number) => void;
  listService: Record<number, ShippingService[]>;
  loadingRate: boolean;
  onChange: (index: number, e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CourierSelect: React.FC<CourierSelectProps> = ({
  order,
  index,
  onOpen,
  listService,
  loadingRate,
  onChange,
}) => {
  const recipientReady = isRecipientComplete(order.recipient);
  const productReady = isProductsComplete(order.products);
  const canSelectCourier = recipientReady && productReady;
  const isCourierComplete = Boolean(order.courier);
  return (
    <Card
      className={`mb-6 rounded-lg p-6 ${
        isCourierComplete ? "border-2 border-green-600 bg-green-50" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <CheckCircle
          className={`size-6 ${
            isCourierComplete ? "text-primary" : "text-gray-400"
          }`}
        />
        <h3
          className={`text-lg font-semibold ${
            isCourierComplete ? "text-primary" : "text-gray-400"
          }`}
        >
          Pilih Kurir
        </h3>
      </div>
      <button
        disabled={!canSelectCourier}
        onClick={() => {
          if (!canSelectCourier) {
            alert("Harap isi data penerima atau data produk terlebih dahulu");
            return;
          }
          onOpen(index);
        }}
        className={`mt-4 flex w-full items-center justify-between rounded-lg border p-4 text-left ${
          !canSelectCourier
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : "hover:border-green-600"
        }`}
      >
        {loadingRate && !order.courier ? (
          <p className="animate-pulse text-gray-500">Memuat pilihan kurir...</p>
        ) : order.courier ? (
          <div>
            <p className="font-semibold">
              {order.dataCourier?.courier_name} -{" "}
              {order.dataCourier?.courier_service_name}
            </p>
            <p className="text-sm text-gray-500">
              {order.dataCourier?.duration} | Rp{" "}
              {order.dataCourier?.price?.toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-400">Pilih Kurir</p>
        )}

        <span className="rounded-full bg-green-700 px-2 py-2 text-white">
          <ArrowRight className="h-4 w-4" />
        </span>
      </button>
      {!canSelectCourier && (
        <p className="mt-2 text-xs text-red-500">
          Harap isi data penerima atau data produk terlebih dahulu
        </p>
      )}
    </Card>
  );
};

export default CourierSelect;
