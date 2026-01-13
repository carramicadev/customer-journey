"use client";

import React from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

import { Order, ShippingService } from "@/types/shopping-cart";

interface CourierSelectProps {
  order: Order;
  index: number;
  listService: Record<number, ShippingService[]>;
  loadingRate: boolean;
  onChange: (index: number, e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CourierSelect: React.FC<CourierSelectProps> = ({
  order,
  index,
  listService,
  loadingRate,
  onChange,
}) => {
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <div className="mt-4">
        <div className="flex justify-start">
          <h3 className="text-lg font-semibold">Kurir</h3>
          <CheckCircleIcon
            className={`${
              order.courier
                ? "ml-4 h-8 w-8 text-green-800 dark:text-white"
                : "ml-4 h-8 w-8 text-gray-800 dark:text-white"
            }`}
          />
        </div>

        <label className="block text-sm font-medium text-gray-700">
          Pilih Kurir
        </label>

        <select
          value={order?.dataCourier?.courier_service_code}
          onChange={(e) => onChange(index, e)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        >
          <option selected hidden>
            {loadingRate ? "loading.." : "Jenis Service"}
          </option>

          {listService?.[index]
            ? listService[index].map((kur: any) => (
                <option
                  key={kur?.courier_service_code}
                  value={kur?.courier_service_code}
                >
                  {kur?.courier_name}, {kur?.courier_service_name},{" "}
                  {kur?.duration}, Rp.{kur?.price}
                </option>
              ))
            : order?.listService
              ? order.listService.map((kur: any) => (
                  <option
                    key={kur?.courier_service_code}
                    value={kur?.courier_service_code}
                  >
                    {kur?.courier_name}, {kur?.courier_service_name},{" "}
                    {kur?.duration}, Rp.{kur?.price}
                  </option>
                ))
              : null}
        </select>
      </div>
    </div>
  );
};

export default CourierSelect;
