"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RecipientInfo } from "@/types/shopping-cart";

// import Header from "@/components/header";
import Loader from "@/components/AppLoading";
import EditAddressModal from "@/components/AddModalAddress";

/* ================= COMPONENTS ================= */

import ContactInfoSection from "@/components/shopping-cart/contact-info/ContactInfoSection";
import OrdersSection from "@/components/shopping-cart/OrdersSection";
import OrderAccordion from "@/components/shopping-cart/OrderAccordion";
import PaymentSummary from "@/components/shopping-cart/PaymentSummary";
import AddOrderButton from "@/components/shopping-cart/AddOrderButton";

/* ================= CONTEXT ================= */

import { useAuth } from "@/context/AuthContext";

/* ================= HOOKS ================= */

import { useContactInfo } from "@/hooks/useContactInfo";
import { useOrders } from "@/hooks/useOrders";
import { useAddresses } from "@/hooks/useAddresses";
import { useShippingRates } from "@/hooks/useShippingRates";
import { useCheckout } from "@/hooks/useCheckout";
import { useUIState } from "@/hooks/useUIState";

/* ================= UTILS ================= */

import { calculateOverallTotals } from "@/utils/calculateTotals";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/components/FirebaseProvider";
import { Card } from "@/components/ui/card";

const ShoppingCartPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  // const [sendToSelf, setSendToSelf] = useState<Record<number, boolean>>({});

  /* ================= UI STATE ================= */

  const {
    isLoading,
    setIsLoading,
    expandedOrderIndex,
    toggleAccordion,
    currentOrder,
    setCurrentOrder,
    loadingCheckout,
    setLoadingCheckout,
  } = useUIState();

  /* ================= CONTACT INFO ================= */

  const {
    contacts,
    selectedContact,
    setSelectedContact,
    contactIsCompleted,
    addContact,
    deleteContact,
    saveContact,
  } = useContactInfo(user?.uid);

  /* ================= ORDERS ================= */

  const {
    orders,
    setOrders,
    resetReceiverAt,
    applySenderAsReceiver,
    handleAddOrder,
    handleQuantityChange,
    handleDeleteProduct,
    handleAddProduct,
    handleGiftCardMessageChange,
    toggleEditOrder,
    handleCourierChange,
    handleDeleteOrder,
  } = useOrders(user?.uid);

  /* ================= ADDRESSES / RECEIVER ================= */

  const {
    addresses,
    isEditing,
    currentAddress,
    setIsEditing,
    isReceiverModalOpen,
    selectedReceiverIndex,
    tempReceiver,
    handleAddNew,
    openReceiverModal,
    closeReceiverModal,
    handleSelectReceiver,
    handleConfirmReceiverSelection,
  } = useAddresses(user?.uid, setOrders, setCurrentOrder);

  /* ================= SHIPPING ================= */

  const { listService, loadingRate } = useShippingRates(
    user?.uid,
    orders,
    setOrders,
    currentOrder,
    setCurrentOrder,
  );

  /* ================= CHECKOUT ================= */

  /* ================= TOTALS ================= */

  const { overallSubtotal, overallDeliveryFee, overallTotal } =
    calculateOverallTotals(orders);

  /* ================= AUTH GUARD ================= */

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  // Update 3
  useEffect(() => {
    if (!selectedContact || !orders.length) return;

    orders.forEach((order, index) => {
      if (order.sendToSelf && !order.recipient?.receiverName) {
        applySenderAsReceiver(index, selectedContact);
      }
    });
  }, [selectedContact?.id]);

  /* ================= LOADING ================= */

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (!user) return null;

  /* ================= RENDER ================= */

  return (
    <>
      {/* <Header /> */}

      <div className="container mx-auto px-2 pb-12 pt-2 lg:pt-4">
        <h1 className="my-6 text-center text-xl font-bold text-gray-900 md:text-left lg:text-2xl">
          Form Order Hampers
        </h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* ================= LEFT ================= */}
          <div className="lg:w-1/2">
            <ContactInfoSection
              contactInfo={selectedContact}
              contacts={contacts}
              contactIsCompleted={contactIsCompleted}
              onSelect={setSelectedContact}
              onAdd={saveContact}
              onDelete={deleteContact}
            />

            <OrdersSection
              orders={orders}
              addresses={addresses}
              listService={listService}
              loadingRate={loadingRate}
              isReceiverModalOpen={isReceiverModalOpen}
              selectedReceiverIndex={selectedReceiverIndex}
              tempReceiver={tempReceiver}
              onOpenReceiverModal={openReceiverModal}
              onCloseReceiverModal={closeReceiverModal}
              onSelectReceiver={handleSelectReceiver}
              onConfirmReceiver={handleConfirmReceiverSelection}
              onAddNewAddress={handleAddNew}
              onToggleEditOrder={toggleEditOrder}
              onCourierChange={(index, e) =>
                handleCourierChange(index, e, listService)
              }
              onQuantityChange={handleQuantityChange}
              onDeleteProduct={handleDeleteProduct}
              onAddProduct={handleAddProduct}
              onGiftCardChange={handleGiftCardMessageChange}
              setCurrentOrder={setCurrentOrder}
              selectedContact={selectedContact}
              resetReceiverAt={resetReceiverAt}
              applySenderAsReceiver={applySenderAsReceiver} // 🔥
              userId={user?.uid}
              expandedOrderIndex={expandedOrderIndex}
            />
          </div>

          {/* ================= RIGHT ================= */}
          <div className="lg:w-1/2">
            <Card className="border-2 p-6">
              <h2 className="mb-4 text-xl font-semibold text-primary">
                Daftar Orderan
              </h2>
              <OrderAccordion
                orders={orders}
                contactIsCompleted={contactIsCompleted}
                expandedOrderIndex={expandedOrderIndex}
                onToggleAccordion={toggleAccordion}
                onDeleteOrder={(index) => {
                  const orderId = orders[index]?.id;
                  if (!orderId) return;

                  handleDeleteOrder(orderId);
                }}
              />

              <AddOrderButton orders={orders} onAddOrder={handleAddOrder} />

              {orders.length < 10 && (
                <p className="mb-4 text-base text-red-500">
                  Kamu bisa membuat 10 orderan ke 10 alamat berbeda, bisa klik
                  tombol diatas ya.
                </p>
              )}

              <PaymentSummary
                overallSubtotal={overallSubtotal}
                overallDeliveryFee={overallDeliveryFee}
                overallTotal={overallTotal}
                orders={orders}
                loadingCheckout={loadingCheckout}
                onCheckout={async () => {
                  const ref = collection(
                    firestore,
                    "customer",
                    user.uid,
                    "orders",
                  );

                  const orderDoc = await addDoc(ref, {
                    sender: selectedContact,
                    orders,
                    paymentStatus: "draft",
                    createdAt: serverTimestamp(),
                  });

                  const cartRef = collection(
                    firestore,
                    "shopping-cart",
                    user.uid,
                    "orders",
                  );

                  const cartSnap = await getDocs(cartRef);

                  await Promise.all(cartSnap.docs.map((d) => deleteDoc(d.ref)));

                  setOrders([]);

                  localStorage.removeItem("selectedContactId");
                  setSelectedContact(null);

                  const phone = selectedContact?.phone ?? "";

                  router.push(`/payment-method?draft=${orderDoc.id}-${phone}`);
                }}
              />
            </Card>
          </div>
        </div>
      </div>
      {isEditing && (
        <EditAddressModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          currentAddress={currentAddress}
          onSave={async (data) => {
            await saveContact(data);
            setSelectedContact(data);
            setIsEditing(false);
          }}
        />
      )}
    </>
  );
};

export default ShoppingCartPage;
