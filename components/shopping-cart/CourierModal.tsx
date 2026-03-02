"use client";

import Modal from "@/components/Modal";
import { ShippingService } from "@/types/shopping-cart";

interface Props {
  isOpen: boolean;
  services: ShippingService[];
  onClose: () => void;
  onSelect: (service: ShippingService) => void;
}

export default function CourierModal({
  isOpen,
  services,
  onClose,
  onSelect,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-4 text-xl font-bold">Pilih Kurir</h2>

      <div className="max-h-[60vh] space-y-3 overflow-y-auto">
        {services.length === 0 && (
          <p className="animate-pulse text-gray-400">Memuat data kurir...</p>
        )}

        {services.map((s, i) => (
          <div
            key={i}
            onClick={() => onSelect(s)}
            className="cursor-pointer rounded-lg border p-4 hover:border-green-600"
          >
            <p className="font-semibold">
              {s.courier_name} - {s.courier_service_name}
            </p>
            <p className="text-sm text-gray-500">{s.duration}</p>
            <p className="mt-1 font-semibold">Rp {s.price.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full rounded-lg bg-primary py-3 text-white"
      >
        Pilih Kurir
      </button>
    </Modal>
  );
}
