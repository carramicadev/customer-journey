"use client";

import React from "react";
import Modal from "@/components/Modal";
import ReceiverCard from "@/components/ReceiverCard";
import { Address } from "@/app/profile/address";

interface ReceiverModalProps {
  isOpen: boolean;
  addresses: Address[];

  selectedReceiverIndex: number | null;
  tempReceiver: any;

  onClose: () => void;
  onSelectReceiver: (index: number) => void;
  onConfirmReceiver: (orderIndex: number) => void;
  onAddNewAddress: () => void;

  orderIndex: number;
}

const ReceiverModal: React.FC<ReceiverModalProps> = ({
  isOpen,
  addresses,
  selectedReceiverIndex,
  tempReceiver,
  onClose,
  onSelectReceiver,
  onConfirmReceiver,
  onAddNewAddress,
  orderIndex,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-4 text-xl font-bold">Pilih data penerima</h2>

      <div className="space-y-4">
        {addresses.map((item, i) => (
          <ReceiverCard
            key={i}
            recipient={item}
            isSelected={selectedReceiverIndex === i}
            onSelect={() => onSelectReceiver(i)}
          />
        ))}
      </div>

      <button
        onClick={onAddNewAddress}
        className="mb-6 mt-6 w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
      >
        Add New Address
      </button>

      <div className="mt-4">
        <button
          disabled={!tempReceiver}
          onClick={() => onConfirmReceiver(orderIndex)}
          className="w-full rounded bg-green-600 px-4 py-2 text-white"
        >
          Confirm Selection
        </button>
      </div>
    </Modal>
  );
};

export default ReceiverModal;
