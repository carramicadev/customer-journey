"use client";

import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore, functions } from "@/components/FirebaseProvider";
import { deleteCollection } from "@/components/DeleteShoppingCart";

import { Order } from "@/types/shopping-cart";
import { ContactInfo } from "@/types/contact-info";

/* ================= DECLARE MIDTRANS ================= */

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

/* ================= HOOK ================= */

export const useCheckout = (
  userId?: string,
  contactInfo?: ContactInfo,
  orders?: Order[],
  setOrders?: React.Dispatch<React.SetStateAction<Order[]>>,
) => {
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState<boolean>(false);

  /* ================= PREPARE TRANSACTION ================= */

  const prepareTransactionData = (orders: Order[], id: string) => {
    const items = orders.flatMap((order) =>
      order.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      })),
    );

    const deliveryFees = orders.map((order) => ({
      id: `delivery-${order.id}`,
      name: `Delivery Fee (${order.courier})`,
      price: order.deliveryFee,
      quantity: 1,
    }));

    const gross_amount = [...items, ...deliveryFees].reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      amount: gross_amount,
      item: [...items, ...deliveryFees],
      customer_details: {
        first_name: contactInfo?.name || "Customer",
        phone: contactInfo?.phone || "",
        email: contactInfo?.email || "customer@example.com",
      },
      id: `CUSTOMER_ORDER_${id}`,
    };
  };

  /* ================= DELETE CART ================= */

  const deleteUserOrders = async () => {
    if (!userId) throw new Error("User UID is required");

    const collectionPath = `shopping-cart/${userId}/orders`;
    await deleteCollection(collectionPath);
  };

  /* ================= CHECKOUT ================= */

  const handleCheckout = async () => {
    try {
      if (!userId || !orders) return;

      setLoadingCheckout(true);

      /* ===== SAVE CUSTOMER ORDER ===== */
      const ref = collection(firestore, "customer", userId, "orders");
      const orderDoc = await addDoc(ref, {
        sender: contactInfo,
        orders,
        paymentStatus: "pending",
        createdAt: serverTimestamp(),
      });

      /* ===== PREPARE TRANSACTION ===== */
      const transactionData = prepareTransactionData(orders, orderDoc.id);

      /* ===== CALL CLOUD FUNCTION ===== */
      const createTransaction = httpsCallable(functions, "createOrder");
      const result = await createTransaction(transactionData);

      const token = (result as any)?.data?.items?.token;
      setSnapToken(token);

      await setDoc(
        doc(firestore, "customer", userId, "orders", orderDoc.id),
        { midtrans: (result as any)?.data?.items, order_id: orderDoc.id },
        { merge: true },
      );

      setLoadingCheckout(false);

      /* ===== MIDTRANS PAY ===== */
      window.snap.pay(token, {
        async onSuccess(result: any) {
          const orderId = result?.order_id?.split("_")?.[3];

          await updateDoc(
            doc(firestore, "customer", userId, "orders", orderId),
            {
              paymentStatus: result.transaction_status,
              midtransRes: result,
            },
          );

          await Promise.all(
            orders.map(async (order) => {
              await Promise.all(
                order.products.map(async (prod) => {
                  await setDoc(
                    doc(firestore, "product", prod.id),
                    {
                      updatedAt: serverTimestamp(),
                      stok: increment(-prod.quantity),
                      qty_sold: increment(prod.quantity),
                    },
                    { merge: true },
                  );
                }),
              );
            }),
          );

          await deleteUserOrders();
          setOrders?.([]);
          alert("Payment successful!");
        },

        onError(error: any) {
          console.error("Payment failed:", error);
        },

        onClose() {
          setOrders?.([]);
          deleteUserOrders();
          console.log("Popup closed");
        },
      });
    } catch (error) {
      setLoadingCheckout(false);
      console.error("Checkout failed:", error);
      alert("Failed to initiate payment");
    }
  };

  /* ================= RETURN ================= */

  return {
    snapToken,
    loadingCheckout,
    handleCheckout,
  };
};
