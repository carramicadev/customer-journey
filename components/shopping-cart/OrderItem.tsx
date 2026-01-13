"use client";

import React from "react";
import { Product } from "@/types/shopping-cart";

interface OrderItemProps {
  product: Product;
  orderIndex: number;
  productIndex: number;

  onQuantityChange: (
    orderIndex: number,
    productIndex: number,
    delta: number,
  ) => void;

  onDeleteProduct: (orderIndex: number, productIndex: number) => void;

  setCurrentOrder: (index: number) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({
  product,
  orderIndex,
  productIndex,
  onQuantityChange,
  onDeleteProduct,
  setCurrentOrder,
}) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          {/* Product Image */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="mr-4 h-16 w-16 rounded-md object-cover"
          />
          <span>{product.name}</span>
        </div>

        <div className="flex items-center">
          {/* Quantity Adjustment */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange(orderIndex, productIndex, -1);
              setCurrentOrder(orderIndex);
            }}
            className="rounded-l-md bg-gray-200 px-2 py-1"
          >
            -
          </button>

          <span className="bg-gray-100 px-4 py-1">{product.quantity}</span>

          <button
            disabled={product.quantity >= product.stok}
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange(orderIndex, productIndex, 1);
              setCurrentOrder(orderIndex);
            }}
            className="rounded-r-md bg-gray-200 px-2 py-1"
          >
            +
          </button>

          {/* Product Price */}
          <span className="ml-4">Rp {product.price.toLocaleString()}</span>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteProduct(orderIndex, productIndex);
              setCurrentOrder(orderIndex);
            }}
            className="ml-4 text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        {product.quantity >= product.stok && (
          <p className="mt-1 text-xs text-red-600">Stok habis</p>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
