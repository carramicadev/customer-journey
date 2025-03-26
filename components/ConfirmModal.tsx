"use client";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import React from "react";

interface Product {
  name: string;
  quantity: number;
  price: number;
  id: string;
  imageUrl: string;
  stok: number;
}

interface ModalConfirmProps {
  product: Product;
  onContinueShopping: () => void;
  onGoToCart: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  product,
  onContinueShopping,
  onGoToCart,
}) => {
  return (
    <div
      style={{ zIndex: 99999 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-6">
        <p className="flex text-green-600">
          <CheckCircleIcon className="mr-4 h-6 w-6 text-green-600 dark:text-white" />{" "}
          Berhasil masuk keranjang
        </p>
        <div className="flex items-center space-x-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-20 w-20 rounded-lg object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">
              Quantity: {product.quantity}
            </p>
            <p className="text-sm text-gray-600">
              Price: Rp{product.price.toLocaleString()}
            </p>
            {/* <p className="text-sm text-gray-600">Stock: {product.stok}</p> */}
          </div>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={onContinueShopping}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Lanjut Belanja
          </button>
          <button
            onClick={onGoToCart}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Masuk ke Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
