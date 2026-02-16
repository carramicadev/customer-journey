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
  onConfirmReceiver: () => void;
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

      <div className="max-h-[60vh] w-full max-w-4xl space-y-4 overflow-y-auto pr-1">
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
        className="my-4 w-full rounded-lg bg-tertiary py-2 text-white hover:bg-tertiary/90"
      >
        Add New Address
      </button>

      <div>
        <button
          disabled={!tempReceiver}
          // onClick={() => onConfirmReceiver(orderIndex)}
          onClick={onConfirmReceiver}
          className="w-full rounded bg-primary px-4 py-2 text-white"
        >
          Confirm Selection
        </button>
      </div>
    </Modal>
  );
};

export default ReceiverModal;
