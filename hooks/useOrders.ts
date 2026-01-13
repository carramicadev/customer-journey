"use client";

import { useEffect, useState, useCallback } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "@/components/FirebaseFrovider";
import { useRouter } from "next/navigation";
import { Order, ShippingService } from "@/types/shopping-cart";

/* ================= TYPES ================= */

// interface RecipientInfo {
//   receiverName: string;
//   receiverPhone: string;
//   address: string;
//   koordinateReceiver: {
//     lat: number;
//     lng: number;
//   };
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   imageUrl: string;
//   stok: number;
//   sku: string;
//   weight: number;
//   height: number;
//   width: number;
//   length: number;
// }

// export interface Order {
//   id: string;
//   recipient: RecipientInfo;
//   products: Product[];
//   courier: string;
//   deliveryFee: number;
//   giftCardMessage: string;
//   isEditing: boolean;
//   dataCourier?: any;
//   listService?: any[];
//   dataComplete?: boolean;
// }

/* ================= HOOK ================= */

export const useOrders = (userId?: string) => {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  //   const [currentOrder, setCurrentOrder] = useState<number>(0);

  /* ================= FETCH ORDERS ================= */

  useEffect(() => {
    if (!userId) return;

    const ref = collection(firestore, "shopping-cart", userId, "orders");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      //   const updated = snapshot.docs.map((doc) => ({
      //     id: doc.id,
      //     ...doc.data(),
      //     deliveryFee: doc.data()?.deliveryFee ?? 0,
      //   })) as Order[];
      const updated = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          recipient: data.recipient ?? {
            receiverName: "",
            receiverPhone: "",
            address: "",
            koordinateReceiver: { lat: 0, lng: 0 },
          },
          products: data.products ?? [],
          courier: data.courier ?? "",
          deliveryFee: data.deliveryFee ?? 0,
          giftCardMessage: data.giftCardMessage ?? "",
          isEditing: data.isEditing ?? false,
          dataCourier: data.dataCourier,
          listService: data.listService,
          dataComplete: data.dataComplete,
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
        recipient: {
          receiverName: "",
          receiverPhone: "",
          address: "",
          koordinateReceiver: { lat: 0, lng: 0 },
        },
        courier: "",
        giftCardMessage: "",
        isEditing: false,
        products: [],
        deliveryFee: 0,
        createdAt: serverTimestamp(),
      });

      setOrders((prev) => [
        ...prev,
        {
          id: docRef.id,
          recipient: {
            receiverName: "",
            receiverPhone: "",
            address: "",
            koordinateReceiver: { lat: 0, lng: 0 },
          },
          courier: "",
          giftCardMessage: "",
          isEditing: false,
          products: [],
          deliveryFee: 0,
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= PRODUCT QTY ================= */

  const handleQuantityChange = useCallback(
    (orderIndex: number, productIndex: number, delta: number) => {
      setOrders((prev) =>
        prev.map((order, oIdx) => {
          if (oIdx !== orderIndex) return order;

          return {
            ...order,
            products: order.products.map((product, pIdx) =>
              pIdx === productIndex
                ? {
                    ...product,
                    quantity: Math.max(1, product.quantity + delta),
                  }
                : product,
            ),
            isEditing: true,
            dataComplete: false,
          };
        }),
      );
    },
    [],
  );

  /* ================= DELETE PRODUCT ================= */

  const handleDeleteProduct = (orderIndex: number, productIndex: number) => {
    setOrders((prev) =>
      prev.map((order, i) =>
        i === orderIndex
          ? {
              ...order,
              products: order.products.filter((_, idx) => idx !== productIndex),
              isEditing: true,
              dataComplete: false,
            }
          : order,
      ),
    );
  };

  /* ================= ADD PRODUCT ================= */

  const handleAddProduct = (orderIndex: number, orderId: string) => {
    router.push(`/all-product?orderIndex=${orderIndex}&&orderId=${orderId}`);
  };

  /* ================= GIFT CARD ================= */

  const handleGiftCardMessageChange = (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;

    setOrders((prev) =>
      prev.map((order, i) =>
        i === index ? { ...order, giftCardMessage: value } : order,
      ),
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

  /* ================= RETURN ================= */

  return {
    orders,
    setOrders,

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
