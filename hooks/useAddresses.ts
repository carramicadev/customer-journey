"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "@/components/FirebaseFrovider";
import { Address } from "@/app/profile/address";

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
      receiverName: "",
      receiverPhone: "",
      address: "",
      district: "",
      postalCode: 0,
      koordinateReceiver: {
        lat: 0,
        lng: 0,
      },
    });

    setIsEditing(true);
  };

  const openReceiverModal = () => {
    setIsReceiverModalOpen(true);
  };

  const closeReceiverModal = () => {
    setIsReceiverModalOpen(false);
    setSelectedReceiverIndex(null);
    setTempReceiver(null);
  };

  const handleSelectReceiver = (index: number) => {
    setSelectedReceiverIndex(index);
    setTempReceiver(addresses[index] as RecipientInfo);
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

  const handleConfirmReceiverSelection = (orderIndex: number) => {
    if (!tempReceiver || selectedReceiverIndex === null) return;

    if (setCurrentOrder) {
      setCurrentOrder(orderIndex);
    }

    if (setOrders) {
      setOrders((prev) =>
        prev.map((order, idx) =>
          idx === orderIndex
            ? {
                ...order,
                recipient: tempReceiver,
                dataComplete: false,
              }
            : order,
        ),
      );
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
