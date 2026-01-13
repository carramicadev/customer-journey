"use client";

import React from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Modal from "@/components/Modal";
import ReceiverCard from "@/components/ReceiverCard";
import CourierSelect from "./CourierSelect";
import { Address } from "@/app/profile/address";
import OrderItem from "./OrderItem";
import ReceiverModal from "./ReceiverModal";

import { Order, RecipientInfo, ShippingService } from "@/types/shopping-cart";

interface OrdersSectionProps {
  orders: Order[];
  addresses: Address[];
  listService: Record<number, ShippingService[]>;
  loadingRate: boolean;

  isReceiverModalOpen: boolean;
  selectedReceiverIndex: number | null;
  tempReceiver: RecipientInfo | null;

  onOpenReceiverModal: () => void;
  onCloseReceiverModal: () => void;
  onSelectReceiver: (index: number) => void;
  onConfirmReceiver: (orderIndex: number) => void;
  onAddNewAddress: () => void;

  onToggleEditOrder: (index: number) => void;
  onCourierChange: (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => void;

  onQuantityChange: (
    orderIndex: number,
    productIndex: number,
    delta: number,
  ) => void;
  onDeleteProduct: (orderIndex: number, productIndex: number) => void;
  onAddProduct: (orderIndex: number, orderId: string) => void;
  onGiftCardChange: (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;

  setCurrentOrder: (index: number) => void;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  addresses,
  listService,
  loadingRate,

  isReceiverModalOpen,
  selectedReceiverIndex,
  tempReceiver,

  onOpenReceiverModal,
  onCloseReceiverModal,
  onSelectReceiver,
  onConfirmReceiver,
  onAddNewAddress,

  onToggleEditOrder,
  onCourierChange,

  onQuantityChange,
  onDeleteProduct,
  onAddProduct,
  onGiftCardChange,

  setCurrentOrder,
}) => {
  return (
    <>
      {orders.map((order, index) => (
        <div key={index} className="mb-6 rounded-lg bg-green-100 p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Orderan {index + 1}</h2>

          {/* ================= DATA PENERIMA ================= */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <div className="flex justify-start">
              <h3 className="text-lg font-semibold">Data Penerima</h3>
              <CheckCircleIcon
                className={`${
                  order.recipient?.address &&
                  order.recipient?.receiverName &&
                  order.recipient?.receiverPhone
                    ? "ml-4 h-8 w-8 text-green-800"
                    : "ml-4 h-8 w-8 text-gray-800"
                }`}
              />
            </div>

            {order.isEditing ? (
              <div className="space-y-2">
                {order.recipient?.receiverName && (
                  <div className="grid grid-cols-1 gap-2">
                    <p>
                      <strong>Nama Penerima:</strong>{" "}
                      {order.recipient?.receiverName || "-"}
                    </p>

                    <p>
                      <strong>No. HP:</strong> {order.recipient.receiverPhone}
                    </p>
                    <p>
                      <strong>Alamat:</strong> {order.recipient.address}
                    </p>
                  </div>
                )}

                <button
                  onClick={onOpenReceiverModal}
                  className="w-full rounded-lg border-2 border-green-600 py-2 text-green-600 hover:bg-green-100"
                >
                  Pilih data penerima
                </button>

                <ReceiverModal
                  isOpen={isReceiverModalOpen}
                  addresses={addresses}
                  selectedReceiverIndex={selectedReceiverIndex}
                  tempReceiver={tempReceiver}
                  orderIndex={index}
                  onClose={onCloseReceiverModal}
                  onSelectReceiver={onSelectReceiver}
                  onConfirmReceiver={onConfirmReceiver}
                  onAddNewAddress={onAddNewAddress}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  <strong>Nama Penerima:</strong> {order.recipient.receiverName}
                </p>
                <p>
                  <strong>No. HP:</strong> {order.recipient.receiverPhone}
                </p>
                <p>
                  <strong>Alamat:</strong> {order.recipient.address}
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={() => onToggleEditOrder(index)}
                    className="px-4 py-2 font-bold text-green-600"
                  >
                    Ubah Detail
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= PRODUK ================= */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <div className="flex justify-start">
              <h3 className="text-lg font-semibold">Produk</h3>
              <CheckCircleIcon
                className={`${
                  order.products.length > 0
                    ? "ml-4 h-8 w-8 text-green-800"
                    : "ml-4 h-8 w-8 text-gray-800"
                }`}
              />
            </div>

            {order.products.map((product: any, pIndex: number) => (
              <OrderItem
                key={pIndex}
                product={product}
                orderIndex={index}
                productIndex={pIndex}
                onQuantityChange={onQuantityChange}
                onDeleteProduct={onDeleteProduct}
                setCurrentOrder={setCurrentOrder}
              />
            ))}

            <button
              onClick={() => onAddProduct(index + 1, order.id)}
              className="mt-4 w-full rounded-md bg-green-600 px-4 py-2 text-white"
            >
              Tambah Produk
            </button>

            <textarea
              value={order.giftCardMessage}
              onChange={(e) => onGiftCardChange(index, e)}
              className="mt-4 block w-full rounded-md border p-2"
              rows={3}
              placeholder="Enter your gift card message..."
            />
          </div>

          {/* ================= KURIR ================= */}
          <CourierSelect
            order={order}
            index={index}
            listService={listService}
            loadingRate={loadingRate}
            onChange={onCourierChange}
          />
        </div>
      ))}
    </>
  );
};

export default OrdersSection;
