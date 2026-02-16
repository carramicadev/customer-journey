"use client";

import React from "react";
import { Product } from "@/types/shopping-cart";
import Image from "next/image";
import { Trash, Trash2 } from "lucide-react";

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
  const isOutOfStock = product.stok <= 0;

  return (
    <div>
      <div className="mb-4 flex items-start gap-4 border-b pb-4">
        <div
          className={`flex flex-1 gap-4 ${isOutOfStock ? "opacity-50 grayscale" : ""}`}
        >
          {/* Image */}
          <Image
            src={product.imageUrl}
            alt={product.name}
            className={`size-20 rounded-md object-cover ${
              isOutOfStock ? "grayscale" : ""
            }`}
            width={80}
            height={80}
          />

          {/* Info */}
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex justify-between">
              <p className="font-semibold text-primary">{product.name}</p>
              <div className="flex justify-end">
                {/* {product.quantity >= product.stok && (
                <p className="mt-1 text-xs text-red-600">Stok habis</p>
              )} */}
                {isOutOfStock && (
                  <p className="text-xs font-semibold text-red-600">
                    Stok Habis
                  </p>
                )}
              </div>
            </div>
            <p className="line-clamp-2 text-xs text-gray-500">
              {product.name || "Deskripsi produk"}
            </p>

            <p className="mt-1 text-sm font-semibold">
              {product.quantity} x Rp {product.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2">
          {/* Delete */}
          <button
            onClick={() => onDeleteProduct(orderIndex, productIndex)}
            className="text-red-400 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>

          {/* Qty Control */}
          <div className="flex items-center rounded border">
            <button
              onClick={() => onQuantityChange(orderIndex, productIndex, -1)}
              disabled={isOutOfStock}
              className="px-2 py-1"
            >
              -
            </button>

            <span className="px-3">{product.quantity}</span>

            <button
              onClick={() => onQuantityChange(orderIndex, productIndex, 1)}
              disabled={isOutOfStock || product.quantity >= product.stok}
              className="px-2 py-1"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
