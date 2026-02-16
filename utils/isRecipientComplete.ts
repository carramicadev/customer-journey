import { RecipientInfo } from "@/types/shopping-cart";

export const isRecipientComplete = (r?: RecipientInfo | null): boolean => {
  if (!r) return false;

  return Boolean(
    r.receiverName?.trim() &&
      r.receiverPhone?.trim() &&
      r.address?.trim() &&
      r.koordinateReceiver &&
      !Number.isNaN(r.koordinateReceiver.lat) &&
      !Number.isNaN(r.koordinateReceiver.lng),
  );
};
