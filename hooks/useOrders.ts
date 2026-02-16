"use client";
import { emptyRecipient } from "@/utils/emptyRecipient";
import { query, orderBy } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/components/FirebaseProvider";
import { useRouter } from "next/navigation";
import { Order, ShippingService } from "@/types/shopping-cart";
import { ContactInfo } from "@/types/contact-info";
import { RecipientInfo } from "@/types/shopping-cart";
import { reset } from "numeral";

/* ================= HOOK ================= */

export const useOrders = (userId?: string) => {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);

  const resetReceiverAt = async (index: number) => {
    if (!userId) return;

    const orderId = orders[index]?.id;
    if (!orderId) return;

    const emptyRecipient = {
      receiverName: "",
      receiverPhone: "",
      address: "",
      // koordinateReceiver: undefined,
    };

    // 🔥 1. UPDATE STATE
    setOrders((prev) =>
      prev.map((order, i) =>
        i === index
          ? {
              ...order,
              recipient: emptyRecipient,
              sendToSelf: false,
              isEditing: true,
              dataComplete: false,
            }
          : order,
      ),
    );

    // 🔥 2. UPDATE FIRESTORE (INI KUNCI)
    await updateDoc(
      doc(firestore, "shopping-cart", userId, "orders", orderId),
      {
        recipient: emptyRecipient,
        sendToSelf: false,
        isEditing: true,
        dataComplete: false,
      },
    );
  };

  /* ================= FETCH ORDERS ================= */

  useEffect(() => {
    if (!userId) return;

    // const ref = collection(firestore, "shopping-cart", userId, "orders");

    const ref = query(
      collection(firestore, "shopping-cart", userId, "orders"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const updated = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          recipient: {
            receiverName: data.recipient?.receiverName ?? "",
            receiverPhone: data.recipient?.receiverPhone ?? "",
            address: data.recipient?.address ?? "",
            koordinateReceiver: data.recipient?.koordinateReceiver ?? undefined,
          },
          products: data.products ?? [],
          courier: data.courier ?? "",
          deliveryFee: data.deliveryFee ?? 0,
          giftCardMessage: data.giftCardMessage ?? "",
          isEditing: data.isEditing ?? false,
          dataCourier: data.dataCourier,
          listService: data.listService,
          dataComplete: data.dataComplete,
          sendToSelf: data.sendToSelf ?? false,
        };
      });

      setOrders(updated);
    });

    return () => unsubscribe();
  }, [userId]);

  /* ================= ADD ORDER ================= */

  const handleAddOrder = async () => {
    if (!userId || orders.length >= 10) return;

    try {
      const ref = collection(firestore, "shopping-cart", userId, "orders");

      const docRef = await addDoc(ref, {
        recipient: emptyRecipient,
        courier: "",
        giftCardMessage: "",
        isEditing: false,
        products: [],
        deliveryFee: 0,
        dataComplete: false,
        createdAt: serverTimestamp(),
      });

      setOrders((prev) => [
        ...prev,
        {
          id: docRef.id,
          recipient: emptyRecipient,
          courier: "",
          giftCardMessage: "",
          isEditing: false,
          products: [],
          deliveryFee: 0,
          dataComplete: false,
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= PRODUCT QTY ================= */
  const resetCourierFields = (order: Order) => ({
    ...order,
    courier: "",
    deliveryFee: 0,
    dataCourier: undefined,
    isEditing: true,
    dataComplete: false,
  });

  const handleQuantityChange = useCallback(
    async (orderIndex: number, productIndex: number, delta: number) => {
      const order = orders?.[orderIndex];
      if (!order) return; // 🔥 FIX 1
      const product = order.products?.[productIndex];
      if (!product) return; // 🔥 FIX 2

      if (delta > 0 && product.quantity >= product.stok) {
        alert(`Stok tersisa ${product.stok}`);
        return;
      }
      setOrders((prev) =>
        prev.map((order, oIdx) => {
          if (oIdx !== orderIndex) return order;

          const updatedProducts = order.products.map((product, pIdx) =>
            pIdx === productIndex
              ? {
                  ...product,
                  quantity: Math.max(1, product.quantity + delta),
                }
              : product,
          );

          // 🔥 SIMPAN KE FIRESTORE
          if (userId) {
            updateDoc(
              doc(firestore, "shopping-cart", userId, "orders", order.id),
              {
                products: updatedProducts,
                courier: "",
                deliveryFee: 0,
                dataCourier: null,
                isEditing: true,
                dataComplete: false,
              },
            );
          }

          return resetCourierFields({
            ...order,
            products: updatedProducts,
            // isEditing: true,
            // dataComplete: false,
          });
        }),
      );
    },
    [orders, userId],
  );

  /* ================= DELETE PRODUCT ================= */
  const handleDeleteProduct = async (
    orderIndex: number,
    productIndex: number,
  ) => {
    const order = orders[orderIndex];
    if (!order || !userId) return;

    const updatedProducts = order.products.filter(
      (_, idx) => idx !== productIndex,
    );

    // 🔥 1. Update state
    setOrders((prev) =>
      prev.map((o, i) =>
        i === orderIndex
          ? resetCourierFields({
              ...o,
              products: updatedProducts,
            })
          : o,
      ),
    );

    // 🔥 2. Update Firestore (INI KUNCI)

    await updateDoc(
      doc(firestore, "shopping-cart", userId, "orders", order.id),
      {
        products: updatedProducts,
        courier: "",
        deliveryFee: 0,
        dataCourier: null,
        isEditing: true,
        dataComplete: false,
      },
    );
  };

  /* ================= ADD PRODUCT ================= */

  const handleAddProduct = (orderIndex: number, orderId: string) => {
    router.push(`/all-product?orderIndex=${orderIndex}&&orderId=${orderId}`);
  };

  /* ================= GIFT CARD ================= */

  const handleGiftCardMessageChange = async (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    const order = orders[index];
    if (!order || !userId) return;

    // 1️⃣ update state
    setOrders((prev) =>
      prev.map((o, i) => (i === index ? { ...o, giftCardMessage: value } : o)),
    );

    // 2️⃣ update Firestore (INI KUNCI)
    await updateDoc(
      doc(firestore, "shopping-cart", userId, "orders", order.id),
      {
        giftCardMessage: value,
        isEditing: true,
        dataComplete: false,
      },
    );
  };

  /* ================= TOGGLE EDIT ================= */

  const toggleEditOrder = (index: number) => {
    setOrders((prev) =>
      prev.map((order, i) =>
        i === index ? { ...order, isEditing: !order.isEditing } : order,
      ),
    );
  };

  /* ================= COURIER ================= */

  const handleCourierChange = (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>,
    listService: Record<number, ShippingService[]>,
  ) => {
    const service =
      listService?.[index]?.find(
        (s) => s.courier_service_code === e.target.value,
      ) ?? null;

    if (!service) return;

    // setCurrentOrder(index);

    setOrders((prev) =>
      prev.map((order, i) =>
        i === index
          ? {
              ...order,
              courier: service.courier_name,
              deliveryFee: service.price,
              dataCourier: service,
              isEditing: false,
            }
          : order,
      ),
    );
  };

  /* ================= DELETE ORDER ================= */
  const handleDeleteOrder = async (orderId: string) => {
    if (!userId) return;

    try {
      await deleteDoc(
        doc(firestore, "shopping-cart", userId, "orders", orderId),
      );
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const applySenderAsReceiver = async (
    index: number,
    sender: ContactInfo,
    // userId?: string,
  ) => {
    setOrders((prev: Order[]) =>
      prev.map((order, i) => {
        if (i !== index) return order;
        if (!sender.coordinate) return order;
        const mapped: RecipientInfo = {
          receiverName: sender.name,
          receiverPhone: sender.phone,
          address: sender.address,
          koordinateReceiver: sender.coordinate,
        };

        // 🔥 SAVE KE FIRESTORE
        if (userId) {
          updateDoc(
            doc(firestore, "shopping-cart", userId, "orders", order.id),
            {
              recipient: mapped,
              sendToSelf: true,
              isEditing: true,
              dataComplete: false,
            },
          );
        }

        return {
          ...order,
          recipient: mapped,
          sendToSelf: true,
          isEditing: true,
          dataComplete: false,
        };
      }),
    );
  };

  /* ================= RETURN ================= */

  return {
    orders,
    setOrders,
    resetReceiverAt,
    applySenderAsReceiver,

    // currentOrder,
    // setCurrentOrder,

    handleAddOrder,
    handleQuantityChange,
    handleDeleteProduct,
    handleAddProduct,
    handleGiftCardMessageChange,
    toggleEditOrder,
    handleCourierChange,

    handleDeleteOrder,
  };
};
