// utils/calculateTotals.ts

import { Order } from "@/types/shopping-cart";

/**
 * ===============================
 * HITUNG TOTAL PER ORDER
 * ===============================
 * Sama persis dengan logic di page.tsx
 */
export const calculateOrderTotals = (orders: Order[]) => {
  return orders.map((order) => {
    const subtotal = order.products.reduce(
      (sum, product) => sum + product.quantity * product.price,
      0,
    );

    const total = subtotal + order.deliveryFee;

    return {
      subtotal,
      total,
    };
  });
};

/**
 * ===============================
 * HITUNG TOTAL KESELURUHAN
 * ===============================
 * Sama persis dengan logic di page.tsx
 */
export const calculateOverallTotals = (orders: Order[]) => {
  const orderTotals = calculateOrderTotals(orders);

  const overallSubtotal = orderTotals.reduce(
    (sum, order) => sum + order.subtotal,
    0,
  );

  const overallDeliveryFee = orders.reduce(
    (sum, order) => sum + order.deliveryFee,
    0,
  );

  const overallTotal = overallSubtotal + overallDeliveryFee;

  return {
    overallSubtotal,
    overallDeliveryFee,
    overallTotal,
  };
};
