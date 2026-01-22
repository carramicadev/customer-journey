// utils/prepareTransactionData.ts

import { Order } from "@/types/shopping-cart";
import { ContactInfo } from "@/types/contact-info";

/**
 * ===============================
 * PREPARE MIDTRANS TRANSACTION DATA
 * ===============================
 * ⚠️ LOGIC 100% IDENTIK dengan yang ada di page.tsx
 * ❌ Tidak ada perubahan behavior
 */
export const prepareTransactionData = (
  orders: Order[],
  orderId: string,
  contactInfo?: ContactInfo,
) => {
  /* ================= FLATTEN PRODUCTS ================= */

  const items = orders.flatMap((order) =>
    order.products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    })),
  );

  /* ================= DELIVERY FEES ================= */

  const deliveryFees = orders.map((order) => ({
    id: `delivery-${order.id}`,
    name: `Delivery Fee (${order.courier})`,
    price: order.deliveryFee,
    quantity: 1,
  }));

  /* ================= TOTAL AMOUNT ================= */

  const gross_amount = [...items, ...deliveryFees].reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  /* ================= RETURN FORMAT ================= */

  return {
    amount: gross_amount,
    item: [...items, ...deliveryFees],
    customer_details: {
      first_name: contactInfo?.name || "Customer",
      phone: contactInfo?.phone || "",
      email: contactInfo?.email || "customer@example.com",
    },
    id: `CUSTOMER_ORDER_${orderId}`,
  };
};
