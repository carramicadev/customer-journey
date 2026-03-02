import { Order } from "@/types/shopping-cart";
import { ContactInfo } from "@/types/contact-info";

export const prepareTransactionData = (
  orders: Order[],
  invoiceId: string,
  contactInfo?: ContactInfo,
  userId?: string,
) => {
  const now = new Date();

  const time =
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const finalOrderId = `ORDER_CUST_${invoiceId}_${time}`;

  const products = orders.flatMap((order) =>
    order.products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    })),
  );

  const delivery = orders.map((order) => ({
    id: `delivery-${order.id}`,
    name: `Delivery Fee (${order.courier})`,
    price: order.deliveryFee,
    quantity: 1,
  }));

  const item_details = [...products, ...delivery];

  const gross_amount = item_details.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    transaction_details: {
      order_id: finalOrderId,
      gross_amount,
    },

    item_details,

    customer_details: {
      first_name: contactInfo?.name ?? "Customer",
      phone: contactInfo?.phone ?? "",
      email: contactInfo?.email ?? "customer@email.com",
      user_id: userId,
    },
  };
};
