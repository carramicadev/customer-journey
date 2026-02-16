"use client";

import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { doc, setDoc } from "firebase/firestore";
import { firestore, functions } from "@/components/FirebaseFrovider";

import { Order, ShippingService } from "@/types/shopping-cart";

/* ================= HOOK ================= */

export const useShippingRates = (
  userId?: string,
  orders?: Order[],
  setOrders?: React.Dispatch<React.SetStateAction<Order[]>>,
  currentOrder?: number,
  setCurrentOrder?: (index: number) => void,
) => {
  /* ================= STATE ================= */

  const [listService, setListService] = useState<
    Record<number, ShippingService[]>
  >({});
  const [loadingRate, setLoadingRate] = useState<boolean>(false);

  const [koordinateOrigin] = useState({
    lat: -6.198153,
    lng: 106.698915,
  });

  /* ================= FETCH SHIPPING RATES ================= */

  useEffect(() => {
    const fetchShippingRates = async () => {
      if (!orders || currentOrder === undefined) return;

      const currentOrderData = orders[currentOrder];

      // 🔥 GUARD PALING ATAS
      if (!currentOrderData?.isEditing) return;

      if (
        !currentOrderData?.products?.length ||
        !currentOrderData?.recipient?.koordinateReceiver?.lat ||
        !currentOrderData?.recipient?.koordinateReceiver?.lng
      ) {
        return;
      }

      const ordersProduct = currentOrderData.products.map((prod: any) => ({
        name: prod?.name,
        sku: prod?.sku,
        weight: prod?.weight,
        height: prod?.height,
        width: prod?.width,
        length: prod?.length,
        quantity: prod?.quantity,
      }));

      // RESET ORDER STATE
      if (setOrders) {
        setOrders((prev) =>
          prev.map((order, i) =>
            i === currentOrder
              ? {
                  ...order,
                  deliveryFee: 0,
                  courier: "",
                  dataCourier: {},
                  listService: [],
                }
              : order,
          ),
        );
      }

      setListService((prev) => ({ ...prev, [currentOrder]: [] }));
      setLoadingRate(true);

      try {
        const getRates = httpsCallable(functions, "getRates");
        const result = await getRates({
          items: ordersProduct,
          origin_latitude: koordinateOrigin.lat,
          origin_longitude: koordinateOrigin.lng,
          destination_latitude:
            currentOrderData.recipient.koordinateReceiver.lat,
          destination_longitude:
            currentOrderData.recipient.koordinateReceiver.lng,
        });

        setListService((prev) => ({
          ...prev,
          [currentOrder]: (result as any)?.data?.items?.pricing,
        }));
      } catch (error) {
        console.error("Error fetching shipping rates:", error);
        setListService((prev) => ({ ...prev, [currentOrder]: [] }));
      } finally {
        setLoadingRate(false);
      }
    };

    const timer = setTimeout(fetchShippingRates, 500);
    return () => clearTimeout(timer);
  }, [
    orders?.[currentOrder!]?.products,
    orders?.[currentOrder!]?.recipient?.koordinateReceiver?.lat,
    orders?.[currentOrder!]?.recipient?.koordinateReceiver?.lng,
    koordinateOrigin.lat,
    koordinateOrigin.lng,
    orders?.[currentOrder!]?.isEditing,
  ]);

  /* ================= SAVE COURIER ================= */

  useEffect(() => {
    if (
      !orders ||
      currentOrder === undefined ||
      !orders?.[currentOrder] ||
      !userId
    )
      return;

    const current = orders[currentOrder];

    if (
      current?.dataCourier?.courier_service_code &&
      !current?.isEditing &&
      listService?.[currentOrder]
    ) {
      const saveCourier = async () => {
        try {
          await setDoc(
            doc(firestore, "shopping-cart", userId, "orders", current.id),
            {
              ...current,
              dataComplete: true,
              // listService: listService[currentOrder],
            },
            { merge: true },
          );

          if (setCurrentOrder) {
            setCurrentOrder(currentOrder + 1);
          }
        } catch (e) {
          console.error(e);
        }
      };

      saveCourier();
    }
  }, [
    orders?.[currentOrder!]?.dataCourier?.courier_service_code,
    userId,
    orders?.[currentOrder!]?.isEditing,
  ]);

  /* ================= RETURN ================= */

  return {
    listService,
    loadingRate,
    koordinateOrigin,
  };
};
