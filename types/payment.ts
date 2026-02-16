/* =========================================================
   PAYMENT TYPES (MIDTRANS CORE API READY)
   ========================================================= */

/**
 * Semua metode pembayaran yang didukung
 * (disesuaikan dengan Midtrans Core API)
 */
export type PaymentMethod =
  | "bca_va"
  | "bni_va"
  | "bri_va"
  | "mandiri_va"
  | "permata_va"
  | "gopay"
  | "shopeepay"
  | "qris";

/* =========================================================
   PAYMENT UI ITEM
   ========================================================= */

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  logo: string;
  group: "bank" | "ewallet" | "qris";
}

/* =========================================================
   MIDTRANS REQUEST BODY (CORE API)
   ========================================================= */

export interface MidtransTransactionRequest {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };

  item_details: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  customer_details: {
    first_name: string;
    phone: string;
    email: string;
  };

  payment_type: string;

  bank_transfer?: {
    bank: string;
  };

  qris?: Record<string, never>;

  gopay?: Record<string, never>;

  shopeepay?: Record<string, never>;
}

/* =========================================================
   MIDTRANS RESPONSE TYPES
   ========================================================= */

export interface MidtransVAResponse {
  transaction_id: string;
  order_id: string;
  transaction_status: string;

  va_numbers?: {
    bank: string;
    va_number: string;
  }[];

  permata_va_number?: string;

  payment_type: string;

  gross_amount: string;
}

export interface MidtransEWalletResponse {
  transaction_id: string;
  order_id: string;
  transaction_status: string;

  actions?: {
    name: string;
    method: string;
    url: string;
  }[];

  redirect_url?: string;

  payment_type: string;

  gross_amount: string;
}

/* =========================================================
   PAYMENT RESULT (UNIFIED)
   ========================================================= */

export interface PaymentResult {
  orderId: string;
  status: string;

  /**
   * untuk VA
   */
  vaNumber?: string;
  bank?: string;

  /**
   * untuk redirect ewallet / QRIS
   */
  redirectUrl?: string;

  /**
   * raw midtrans response
   */
  raw?: any;
}
