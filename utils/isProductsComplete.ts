import { Product } from "@/types/shopping-cart";

export const isProductsComplete = (products: Product[]) => {
  if (!products.length) return false;

  return products.every(
    (p) => p.stok > 0 && p.quantity > 0 && p.quantity <= p.stok,
  );
};
