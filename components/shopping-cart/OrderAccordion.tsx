"use client";

import React from "react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { Order } from "@/types/shopping-cart";

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
      {orders.map((order, index) => (
        <div
          key={index}
          className={`${
            order.recipient?.address &&
            order.recipient?.receiverName &&
            order.recipient?.receiverPhone &&
            contactIsCompleted &&
            order.products.length > 0 &&
            order.courier
              ? "mb-6 rounded-lg bg-green-100 p-6 shadow-md"
              : "mb-6 rounded-lg bg-white p-6 shadow-md"
          }`}
        >
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => onToggleAccordion(index)}
          >
            <div className="flex items-center justify-start">
              <h2 className="text-xl font-semibold">Orderan {index + 1}</h2>

              <CheckCircleIcon
                className={`${
                  order.recipient?.address &&
                  order.recipient?.receiverName &&
                  order.recipient?.receiverPhone &&
                  contactIsCompleted &&
                  order.products.length > 0 &&
                  order.courier
                    ? "ml-4 h-6 w-6 text-green-800"
                    : "ml-4 h-6 w-6 text-gray-800"
                }`}
              />

              <p
                className={`${
                  order.recipient?.address &&
                  order.recipient?.receiverName &&
                  order.recipient?.receiverPhone &&
                  contactIsCompleted &&
                  order.products.length > 0 &&
                  order.courier
                    ? "text-sm font-semibold text-green-800"
                    : "text-sm font-semibold text-gray-500"
                }`}
              >
                {order.recipient?.address &&
                order.recipient?.receiverName &&
                order.recipient?.receiverPhone &&
                contactIsCompleted &&
                order.products.length > 0 &&
                order.courier
                  ? "Data Lengkap"
                  : "Data Belum Lengkap"}
              </p>
            </div>

            {expandedOrderIndex === index ? (
              <ChevronUpIcon className="ml-4 h-8 w-8 text-gray-800" />
            ) : (
              <ChevronDownIcon className="ml-4 h-8 w-8 text-gray-800" />
            )}
          </div>

          {expandedOrderIndex === index && (
            <div className="mt-4">
              <div className="space-y-2">
                <p>
                  <strong>Nama Penerima:</strong> {order.recipient.receiverName}
                </p>
                <p>
                  <strong>No. HP:</strong> {order.recipient.receiverPhone}
                </p>
                <p>
                  <strong>Kurir:</strong> {order.courier}
                </p>
                <p>
                  <strong>Alamat Penerima:</strong> {order.recipient.address}
                </p>
                <p>
                  <strong>Gift Card Message:</strong>{" "}
                  {order.giftCardMessage || "N/A"}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold">Order</h3>
                {order.products.map((product: any, pIndex: number) => (
                  <div
                    key={pIndex}
                    className="mb-2 flex items-center justify-between"
                  >
                    <span>{product.name}</span>
                    <span>
                      {product.quantity} x Rp {product.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white"
                onClick={() => onDeleteOrder(index)}
              >
                Hapus Order
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default OrderAccordion;
