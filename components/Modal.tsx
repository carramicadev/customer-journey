import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {children}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;
