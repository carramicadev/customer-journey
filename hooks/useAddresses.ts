"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "@/components/FirebaseFrovider";
import { Address } from "@/app/profile/address";
import { doc, updateDoc } from "firebase/firestore";

import { RecipientInfo, Order } from "@/types/shopping-cart";

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

/* ================= HOOK ================= */

export const useAddresses = (
  userId?: string,
  setOrders?: React.Dispatch<React.SetStateAction<Order[]>>,
  setCurrentOrder?: (index: number) => void,
) => {
  /* ================= STATE ================= */

  const [addresses, setAddresses] = useState<Address[]>([]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [activeReceiverOrderIndex, setActiveReceiverOrderIndex] = useState<
    number | null
  >(null);

  const [isReceiverModalOpen, setIsReceiverModalOpen] =
    useState<boolean>(false);

  const [selectedReceiverIndex, setSelectedReceiverIndex] = useState<
    number | null
  >(null);

  const [tempReceiver, setTempReceiver] = useState<RecipientInfo | null>(null);

  /* ================= FETCH ADDRESSES ================= */

  useEffect(() => {
    if (!userId) return;

    const ref = collection(firestore, "customer", userId, "address");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const updated = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAddresses(updated as Address[]);
    });

    return () => unsubscribe();
  }, [userId]);

  /* ================= HANDLERS ================= */

  const handleAddNew = () => {
    setCurrentAddress({
      id: "",
      name: "",
      phone: "",
      address: "",
      pinAddress: "",
      district: "",
      postalCode: "",
      coordinate: {
        lat: 0,
        lng: 0,
      },
      type: "both",
    });

    setIsEditing(true);
  };

  const openReceiverModal = (orderIndex: number) => {
    setActiveReceiverOrderIndex(orderIndex);
    setIsReceiverModalOpen(true);
  };

  const closeReceiverModal = () => {
    setIsReceiverModalOpen(false);
    setSelectedReceiverIndex(null);
    setTempReceiver(null);
  };

  const handleSelectReceiver = (index: number) => {
    setSelectedReceiverIndex(index);

    const addr = addresses[index];

    const mapped: RecipientInfo = {
      receiverName: addr.name,
      receiverPhone: addr.phone,
      address: addr.address,
      koordinateReceiver: {
        lat: addr.coordinate?.lat ?? 0,
        lng: addr.coordinate?.lng ?? 0,
      },
    };

    setTempReceiver(mapped);
  };

  const handleReceiverChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!tempReceiver) return;

    const { name, value } = e.target;
    setTempReceiver({
      ...tempReceiver,
      [name]: value,
    });
  };

  // const handleConfirmReceiverSelection = async (orderIndex: number) => {
  //   if (!tempReceiver || selectedReceiverIndex === null || !userId) return;

  //   if (setCurrentOrder) {
  //     setCurrentOrder(orderIndex);
  //   }

  //   let orderId: string | null = null;

  //   if (setOrders) {
  //     setOrders((prev) =>
  //       prev.map((order, idx) => {
  //         if (idx === orderIndex) {
  //           orderId = order.id;
  //           return {
  //             ...order,
  //             recipient: tempReceiver,
  //             sendToSelf: false, // 🔥 MATIKAN PAKSA
  //             isEditing: true,
  //             dataComplete: false,
  //           };
  //         }
  //         return order;
  //       }),
  //     );
  //   }

  //   // 🔥 SIMPAN KE FIRESTORE (INI KUNCI UTAMA)
  //   if (orderId) {
  //     try {
  //       await updateDoc(
  //         doc(firestore, "shopping-cart", userId, "orders", orderId),
  //         {
  //           recipient: tempReceiver,
  //           sendToSelf: false, // 🔥 KUNCI
  //           isEditing: true,
  //           dataComplete: false,
  //         },
  //       );
  //     } catch (e) {
  //       console.error("Failed to save recipient:", e);
  //     }
  //   }

  //   closeReceiverModal();
  // };
  const handleConfirmReceiverSelection = async () => {
    if (!tempReceiver || activeReceiverOrderIndex === null || !userId) return;

    const orderIndex = activeReceiverOrderIndex;
    setCurrentOrder?.(orderIndex);

    if (setCurrentOrder) {
      setCurrentOrder(orderIndex);
    }

    let orderId: string | null = null;

    setOrders?.((prev) =>
      prev.map((order, idx) => {
        if (idx === orderIndex) {
          orderId = order.id;
          // return {
          //   ...order,
          //   recipient: tempReceiver,
          //   sendToSelf: false,
          //   isEditing: true,
          //   dataComplete: false,
          // };
          return {
            ...order,
            recipient: tempReceiver,
            courier: "",
            deliveryFee: 0,
            dataCourier: undefined,
            sendToSelf: false,
            isEditing: true,
            dataComplete: false,
          };
        }
        return order;
      }),
    );

    if (orderId) {
      await updateDoc(
        doc(firestore, "shopping-cart", userId, "orders", orderId),
        {
          recipient: tempReceiver,
          courier: "",
          deliveryFee: 0,
          dataCourier: null,
          sendToSelf: false,
          isEditing: true,
          dataComplete: false,
        },
      );

      // await updateDoc(
      //   doc(firestore, "shopping-cart", userId, "orders", orderId),
      //   {
      //     recipient: tempReceiver,
      //     sendToSelf: false,
      //     isEditing: true,
      //     dataComplete: false,
      //   },
      // );
    }

    closeReceiverModal();
  };

  /* ================= RETURN ================= */

  return {
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
    handleReceiverChange,
    handleConfirmReceiverSelection,
  };
};
