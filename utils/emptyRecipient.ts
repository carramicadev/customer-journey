import { RecipientInfo } from "@/types/shopping-cart";

export const emptyRecipient: RecipientInfo = {
  receiverName: "",
  receiverPhone: "",
  address: "",
  // ❌ JANGAN SET koordinateReceiver sama sekali
};
