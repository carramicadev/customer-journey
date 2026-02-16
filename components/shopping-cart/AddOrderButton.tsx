"use client";

import React from "react";
import { Order } from "@/types/shopping-cart";
import { CirclePlusIcon } from "lucide-react";

interface AddOrderButtonProps {
  orders: Order[];
  onAddOrder: () => void;
}

const AddOrderButton: React.FC<AddOrderButtonProps> = ({
  orders,
  onAddOrder,
}) => {
  if (orders.length >= 10) return null;

  // const isDisabled =
  //   orders.length > 0 && !orders?.[orders.length - 1]?.dataComplete;
  const isDisabled = orders.length >= 10;

  return (
    <button
      disabled={isDisabled}
      onClick={onAddOrder}
      className={`mb-2 w-full rounded-md px-4 py-3 text-white ${
        isDisabled
          ? "cursor-not-allowed bg-gray-400"
          : "bg-primary hover:bg-primary/90"
      }`}
    >
      <CirclePlusIcon className="mr-2 inline-block" />
      Tambah Order {orders.length + 1}/10
    </button>
  );
};

export default AddOrderButton;
