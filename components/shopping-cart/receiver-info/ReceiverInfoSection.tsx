"use client";

import { RecipientInfo } from "@/types/shopping-cart";

import ReceiverInfoEmpty from "./ReceiverInfoEmpty";
import ReceiverInfoPreview from "./ReceiverInfoPreview";
import ReceiverModal from "../ReceiverModal";

interface Props {
  recipient: RecipientInfo;
  isCompleted: boolean;

  isReceiverModalOpen: boolean;
  selectedReceiverIndex: number | null;
  tempReceiver: RecipientInfo | null;

  onOpenModal: () => void;
  onCloseModal: () => void;
  onSelectReceiver: (index: number) => void;
  onConfirmReceiver: () => void;

  orderIndex: number;
  addresses: any[];
  onAddNewAddress: () => void;

  // 🔥 DARI PAGE
  sendToSelf: boolean;
  onToggleSendToSelf: (v: boolean) => void;
}

export default function ReceiverInfoSection({
  recipient,
  isCompleted,

  isReceiverModalOpen,
  selectedReceiverIndex,
  tempReceiver,

  onOpenModal,
  onCloseModal,
  onSelectReceiver,
  onConfirmReceiver,

  onAddNewAddress,

  orderIndex,
  addresses,

  sendToSelf,
  onToggleSendToSelf,
}: Props) {
  return (
    <div className="mb-6">
      {!isCompleted ? (
        <ReceiverInfoEmpty
          onSelect={onOpenModal}
          sendToSelf={sendToSelf}
          onToggleSendToSelf={onToggleSendToSelf}
        />
      ) : (
        <ReceiverInfoPreview
          data={recipient}
          onEdit={onOpenModal}
          sendToSelf={sendToSelf}
          onToggleSendToSelf={onToggleSendToSelf}
        />
      )}

      <ReceiverModal
        isOpen={isReceiverModalOpen}
        addresses={addresses}
        selectedReceiverIndex={selectedReceiverIndex}
        tempReceiver={tempReceiver}
        orderIndex={orderIndex}
        onClose={onCloseModal}
        onSelectReceiver={onSelectReceiver}
        onConfirmReceiver={onConfirmReceiver}
        onAddNewAddress={onAddNewAddress}
      />
    </div>
  );
}
