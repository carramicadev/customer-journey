"use client";

import React from "react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { Order } from "@/types/shopping-cart";
import { isRecipientComplete } from "@/utils/isRecipientComplete";
import { Trash2, TrashIcon } from "lucide-react";

interface OrderAccordionProps {
  orders: Order[];
  contactIsCompleted: boolean;
  expandedOrderIndex: number | null;

  onToggleAccordion: (index: number) => void;
  onDeleteOrder: (index: number) => void;
}

const OrderAccordion: React.FC<OrderAccordionProps> = ({
  orders,
  contactIsCompleted,
  expandedOrderIndex,
  onToggleAccordion,
  onDeleteOrder,
}) => {
  return (
    <>
      {orders.map((order, index) => {
        const isComplete =
          isRecipientComplete(order.recipient) &&
          contactIsCompleted &&
          order.products.length > 0 &&
          Boolean(order.courier);

        return (
          <div
            key={index}
            className={`mb-6 rounded-xl p-6 shadow-md ${
              isComplete ? "border-2 border-green-600 bg-green-50" : "bg-white"
            }`}
          >
            {/* ================= HEADER ================= */}
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => onToggleAccordion(index)}
            >
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Orderan {index + 1}</h2>

                <CheckCircleIcon
                  className={`size-6 ${
                    isComplete ? "text-primary" : "text-gray-400"
                  }`}
                />

                <span
                  className={`text-sm font-semibold ${
                    isComplete ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {isComplete ? "Data Lengkap" : "Data Belum Lengkap"}
                </span>
              </div>

              {expandedOrderIndex === index ? (
                <ChevronUpIcon className="size-6 text-gray-700" />
              ) : (
                <ChevronDownIcon className="size-6 text-gray-700" />
              )}
            </div>

            {/* ================= CONTENT ================= */}
            {expandedOrderIndex === index && (
              <div className="mt-6 space-y-6">
                {/* ===== DATA PENERIMA ===== */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Nama Penerima</p>
                    <p className="font-semibold">
                      {order.recipient.receiverName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">No Hp</p>
                    <p className="font-semibold">
                      {order.recipient.receiverPhone}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Alamat Penerima</p>
                    <p className="font-semibold">{order.recipient.address}</p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Gift Card Message</p>
                    <p className="font-medium">
                      {order.giftCardMessage || "-"}
                    </p>
                  </div>
                </div>

                <hr />

                {/* ===== TABEL PRODUK ===== */}
                <div>
                  <div className="grid grid-cols-4 text-sm font-semibold text-gray-600">
                    <span>Order</span>
                    <span>Banyak</span>
                    <span>Harga</span>
                    <span>Jumlah</span>
                  </div>

                  {order.products.map((product, pIndex) => (
                    <div key={pIndex} className="mt-3 grid grid-cols-4 text-sm">
                      <span>{product.name}</span>
                      <span>{product.quantity}</span>
                      <span>Rp {product.price.toLocaleString()}</span>
                      <span>
                        Rp {(product.price * product.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <hr />

                {/* ===== KURIR ===== */}
                <div>
                  <p className="text-sm text-gray-500">Kurir</p>

                  <div className="mt-2 flex justify-between text-sm font-medium">
                    <span>
                      {order.dataCourier?.courier_name} -{" "}
                      {order.dataCourier?.courier_service_name}
                    </span>
                    <span>Rp {order.deliveryFee.toLocaleString()}</span>
                  </div>
                </div>

                {/* ===== DELETE BUTTON ===== */}
                <div className="flex justify-end border-t pt-4">
                  <button
                    onClick={() => onDeleteOrder(index)}
                    className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    <Trash2 className="size-6" />
                    Hapus Order
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default OrderAccordion;
