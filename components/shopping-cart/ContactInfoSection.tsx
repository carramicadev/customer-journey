"use client";

import React from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { CardProps } from "@/components/Card";

interface ContactInfoSectionProps {
  contactInfo: CardProps;
  errors: Record<string, string>;
  isEditingContactInfo: boolean;
  contactIsCompleted: boolean;

  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onPhoneChange: (value: string) => void;
  onSave: () => void;
  onEdit: () => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  contactInfo,
  errors,
  isEditingContactInfo,
  contactIsCompleted,
  onChange,
  onPhoneChange,
  onSave,
  onEdit,
}) => {
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <div className="flex justify-start">
        <h2 className="mb-4 text-xl font-semibold">Data Pengirim</h2>
        <CheckCircleIcon
          className={`${
            contactIsCompleted
              ? "ml-4 h-8 w-8 text-green-800 dark:text-white"
              : "ml-4 h-8 w-8 text-gray-800 dark:text-white"
          }`}
        />
      </div>

      {isEditingContactInfo ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              type="text"
              name="senderName"
              value={contactInfo.senderName}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
            {errors.senderName && (
              <p className="mt-1 text-sm text-red-600">{errors.senderName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={contactInfo.email}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <PhoneInput
              inputClass="input"
              inputStyle={{ width: "100%" }}
              country={"id"}
              value={contactInfo.senderPhone.replace("+", "")}
              onChange={onPhoneChange}
              enableSearch={true}
              placeholder="Enter phone number"
            />
            {errors.senderPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.senderPhone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alamat
            </label>
            <textarea
              name="address"
              rows={3}
              value={contactInfo.address}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onSave}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-white"
            >
              Simpan
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p>
            <strong>Nama:</strong> {contactInfo.senderName}
          </p>
          <p>
            <strong>Email:</strong> {contactInfo.email}
          </p>
          <p>
            <strong>No. HP:</strong> {contactInfo.senderPhone}
          </p>
          <p>
            <strong>Alamat:</strong> {contactInfo.address}
          </p>

          <div className="flex justify-end">
            <button
              onClick={onEdit}
              className="px-4 py-2 font-bold text-green-600"
            >
              Ubah Detail
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfoSection;
