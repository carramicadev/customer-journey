// types/shopping-cart.ts

/* ================= GLOBAL (MIDTRANS) ================= */

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

/**
 * ⚠️ WAJIB ADA
 * Agar file ini dianggap module oleh TypeScript
 */
export {};

/* ================= CONTACT / SENDER ================= */

export interface ContactInfo {
  senderName: string;
  senderPhone: string;
  address: string;
  email?: string;
}

/* ================= RECEIVER ================= */

export interface RecipientInfo {
  receiverName: string;
  receiverPhone: string;
  address: string;
  koordinateReceiver: {
    lat: number;
    lng: number;
  };
}

/* ================= PRODUCT ================= */

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stok: number;
  sku: string;
  weight: number;
  height: number;
  width: number;
  length: number;
}

/* ================= ORDER ================= */

export interface Order {
  id: string;

  recipient: RecipientInfo;
  products: Product[];

  courier: string;
  deliveryFee: number;

  giftCardMessage: string;

  /** UI / workflow */
  isEditing: boolean;

  /** dari API ongkir */
  dataCourier?: any;
  listService?: any[];

  /** validasi data order */
  dataComplete?: boolean;
}

/* ================= SHIPPING ================= */

export interface ShippingService {
  courier_name: string;
  courier_service_name: string;
  courier_service_code: string;
  duration: string;
  price: number;
}

/* ================= CHECKOUT ================= */

export interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TransactionData {
  amount: number;
  item: CheckoutItem[];
  customer_details: {
    first_name: string;
    phone: string;
    email: string;
  };
  id: string;
}
