"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// import Header from "@/components/header";
import Loader from "@/components/AppLoading";
import EditAddressModal from "@/components/AddModalAdress";

/* ================= COMPONENTS ================= */

import ContactInfoSection from "@/components/shopping-cart/ContactInfoSection";
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

const ShoppingCartPage = () => {
  const router = useRouter();
  const { user } = useAuth();

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
    contactInfo,
    errors,
    isEditingContactInfo,
    contactIsCompleted,
    loading: loadingContact,
    onChange,
    onPhoneChange,
    onSave,
    onEdit,
  } = useContactInfo(user);

  /* ================= ORDERS ================= */

  const {
    orders,
    setOrders,
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

  const { handleCheckout } = useCheckout(
    user?.uid,
    contactInfo,
    orders,
    setOrders, //error
  );

  /* ================= TOTALS ================= */

  const { overallSubtotal, overallDeliveryFee, overallTotal } =
    calculateOverallTotals(orders);

  /* ================= AUTH GUARD ================= */

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  /* ================= LOADING ================= */

  useEffect(() => {
    if (!loadingContact) {
      setIsLoading(false);
    }
  }, [loadingContact, setIsLoading]);

  if (isLoading) {
    return <Loader size="md" color="green" />;
  }

  /* ================= RENDER ================= */

  return (
    <>
      {/* <Header /> */}

      <div className="container mx-auto px-2 pt-12">
        <h1 className="mb-6 mt-6 text-center text-2xl font-bold md:text-left">
          Daftar Orderan
        </h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* ================= LEFT ================= */}
          <div className="lg:w-2/3">
            <ContactInfoSection
              contactInfo={contactInfo}
              errors={errors}
              isEditingContactInfo={isEditingContactInfo}
              contactIsCompleted={contactIsCompleted}
              onChange={onChange}
              onPhoneChange={onPhoneChange}
              onSave={onSave}
              onEdit={onEdit}
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
            />
          </div>

          {/* ================= RIGHT ================= */}
          <div className="lg:w-1/3">
            <OrderAccordion
              orders={orders}
              contactIsCompleted={contactIsCompleted}
              expandedOrderIndex={expandedOrderIndex}
              onToggleAccordion={toggleAccordion}
              // onDeleteOrder={(index) =>
              //   setOrders((prev) => prev.filter((_, i) => i !== index))
              // }
              onDeleteOrder={(index) => {
                const orderId = orders[index]?.id;
                if (!orderId) return;

                handleDeleteOrder(orderId);
              }}
            />

            <AddOrderButton orders={orders} onAddOrder={handleAddOrder} />

            <PaymentSummary
              overallSubtotal={overallSubtotal}
              overallDeliveryFee={overallDeliveryFee}
              overallTotal={overallTotal}
              orders={orders}
              loadingCheckout={loadingCheckout}
              onCheckout={() => {
                setLoadingCheckout(true);
                handleCheckout();
              }}
            />
          </div>
        </div>
      </div>

      <EditAddressModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        currentAddress={currentAddress}
      />
    </>
  );
};

export default ShoppingCartPage;
