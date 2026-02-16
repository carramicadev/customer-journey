"use client";

import React, { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Modal from "@/components/Modal";
import ReceiverCard from "@/components/ReceiverCard";
import CourierSelect from "./CourierSelect";
import { Address } from "@/app/profile/address";
import OrderItem from "./OrderItem";
import ReceiverModal from "./ReceiverModal";
import CourierModal from "./CourierModal";
import { isRecipientComplete } from "@/utils/isRecipientComplete";
import { isProductsComplete } from "@/utils/isProductsComplete";

import { Order, RecipientInfo, ShippingService } from "@/types/shopping-cart";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import ReceiverInfoSection from "./receiver-info/ReceiverInfoSection";
import { doc, updateDoc } from "firebase/firestore";
import { ContactInfo } from "@/types/contact-info";
import { firestore } from "@/components/FirebaseProvider";
import { CheckCircle } from "lucide-react";

interface OrdersSectionProps {
  orders: Order[];
  addresses: Address[];
  listService: Record<number, ShippingService[]>;
  loadingRate: boolean;
  userId?: string;

  isReceiverModalOpen: boolean;
  selectedReceiverIndex: number | null;
  tempReceiver: RecipientInfo | null;

  expandedOrderIndex: number | null;

  onOpenReceiverModal: (index: number) => void;
  onCloseReceiverModal: () => void;
  onSelectReceiver: (index: number) => void;
  onConfirmReceiver: () => void;
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

  // 🔥 TAMBAHAN
  selectedContact: ContactInfo | null;
  // sendToSelf: Record<number, boolean>;
  // setSendToSelf: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  applySenderAsReceiver: (index: number, sender: ContactInfo) => void;

  resetReceiverAt: (index: number) => void;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  addresses,
  listService,
  loadingRate,

  userId,

  isReceiverModalOpen,
  selectedReceiverIndex,
  tempReceiver,
  resetReceiverAt,
  onOpenReceiverModal,
  onCloseReceiverModal,
  onSelectReceiver,
  onConfirmReceiver,
  onAddNewAddress,

  expandedOrderIndex,

  onToggleEditOrder,
  onCourierChange,

  onQuantityChange,
  onDeleteProduct,
  onAddProduct,
  onGiftCardChange,

  setCurrentOrder,
  // sendToSelf,
  // setSendToSelf,
  selectedContact,
  applySenderAsReceiver,
}) => {
  // const [sendToSelf, setSendToSelf] = useState<Record<number, boolean>>({});
  const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
  const [courierOrderIndex, setCourierOrderIndex] = useState<number | null>(
    null,
  );
  const isRecipientCompleted = (r?: RecipientInfo) =>
    Boolean(
      r?.receiverName?.trim() &&
        r?.receiverPhone?.trim() &&
        r?.address?.trim() &&
        r?.koordinateReceiver &&
        !Number.isNaN(r.koordinateReceiver.lat) &&
        !Number.isNaN(r.koordinateReceiver.lng),
    );

  return (
    <>
      {/* {orders.map((order, index) => ( */}
      {orders
        .map((order, index) => ({ order, index }))
        .filter(({ index }) =>
          expandedOrderIndex === null
            ? index === 0
            : index === expandedOrderIndex,
        )
        .map(({ order, index }) => (
          <div key={index}>
            <h2 className="pb-2 text-xl font-bold text-primary underline">
              ORDERAN-{index + 1}
            </h2>

            {/* ================= DATA PENERIMA ================= */}
            <ReceiverInfoSection
              recipient={order.recipient}
              isCompleted={isRecipientComplete(order.recipient)}
              isReceiverModalOpen={isReceiverModalOpen}
              selectedReceiverIndex={selectedReceiverIndex}
              tempReceiver={tempReceiver}
              orderIndex={index}
              addresses={addresses}
              // onOpenModal={onOpenReceiverModal}
              onOpenModal={() => onOpenReceiverModal(index)}
              onCloseModal={onCloseReceiverModal}
              onSelectReceiver={onSelectReceiver}
              onConfirmReceiver={onConfirmReceiver}
              onAddNewAddress={onAddNewAddress}
              // 🔥 INI KUNCI
              sendToSelf={Boolean(order.sendToSelf)}
              onToggleSendToSelf={(v) => {
                if (!v) {
                  resetReceiverAt(index);
                } else if (selectedContact) {
                  applySenderAsReceiver(index, selectedContact);
                }
              }}
              // sendToSelf={sendToSelf[index] ?? false}
              // onToggleSendToSelf={(v) => {
              //   setSendToSelf((prev) => ({ ...prev, [index]: v }));

              //   if (!v) {
              //     resetReceiverAt(index);
              //     return;
              //   }

              //   if (v && selectedContact) {
              //     applySenderAsReceiver(index, selectedContact);
              //   }
              // }}
            />

            {/* ================= PRODUK ================= */}
            <Card
              className={`mb-6 rounded-lg p-6 ${
                isProductsComplete(order.products)
                  ? "border-2 border-green-600 bg-green-50"
                  : "bg-white"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle
                  className={`size-6 ${
                    isProductsComplete(order.products)
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold ${
                    isProductsComplete(order.products)
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                >
                  Produk
                </h3>
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
                onClick={() => onAddProduct(index, order.id)}
                className="mt-4 w-full rounded-md bg-tertiary px-4 py-2 text-white"
              >
                Tambah Produk
              </button>
              {/* Gift Card Wishes */}
              <h2 className="mt-4 block text-sm font-medium text-gray-700">
                Gift Card Wishes
              </h2>
              <textarea
                value={order.giftCardMessage}
                onChange={(e) => onGiftCardChange(index, e)}
                className="mt-4 block w-full rounded-md border p-2"
                rows={3}
                placeholder="Enter your gift card message..."
              />
            </Card>

            {/* ================= KURIR ================= */}
            <CourierSelect
              order={order}
              index={index}
              listService={listService}
              loadingRate={loadingRate}
              onChange={onCourierChange}
              onOpen={(orderIndex) => {
                setCourierOrderIndex(orderIndex);
                setIsCourierModalOpen(true);
              }}
            />

            <CourierModal
              isOpen={isCourierModalOpen}
              services={
                courierOrderIndex !== null
                  ? listService[courierOrderIndex] || []
                  : []
              }
              onClose={() => {
                setIsCourierModalOpen(false);
                setCourierOrderIndex(null);
              }}
              onSelect={(service) => {
                if (courierOrderIndex === null) return;

                // 🔥 panggil logic lama yang sudah ada
                onCourierChange(courierOrderIndex, {
                  target: { value: service.courier_service_code },
                } as any);

                setIsCourierModalOpen(false);
                setCourierOrderIndex(null);
              }}
            />
          </div>
        ))}
    </>
  );
};

export default OrdersSection;
