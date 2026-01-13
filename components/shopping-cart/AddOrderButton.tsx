"use client";

import React from "react";
import { Order } from "@/types/shopping-cart";

interface AddOrderButtonProps {
  orders: Order[];
  onAddOrder: () => void;
}

const AddOrderButton: React.FC<AddOrderButtonProps> = ({
  orders,
  onAddOrder,
}) => {
  if (orders.length >= 10) return null;

  const isDisabled =
    orders.length > 0 && !orders?.[orders.length - 1]?.dataComplete;

  return (
    <button
      disabled={isDisabled}
      onClick={onAddOrder}
      className={`mb-6 w-full rounded-md px-4 py-2 text-white ${
        isDisabled
          ? "cursor-not-allowed bg-gray-400"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      Tambah Order {orders.length + 1}/10
    </button>
  );
};

export default AddOrderButton;
