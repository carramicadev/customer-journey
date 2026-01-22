"use client";

import { useState } from "react";
import { ContactInfo } from "@/types/contact-info";

import ContactInfoEmpty from "./ContactInfoEmpty";
import ContactInfoPreview from "./ContactInfoPreview";
import SelectContactModal from "./SelectContactModal";
import EditAddressModal from "@/components/AddModalAddress";
import { on } from "events";

interface Props {
  contactInfo: ContactInfo | null;
  contacts: ContactInfo[];
  contactIsCompleted: boolean;
  onSelect: (c: ContactInfo) => void;
  onAdd: (c: ContactInfo) => void;
  onDelete: (id: string) => void;
}

export default function ContactInfoSection({
  contactInfo,
  contacts,
  contactIsCompleted,
  onSelect,
  onAdd,
  onDelete,
}: Props) {
  const [openSelect, setOpenSelect] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<any | null>(null);

  return (
    <div className="mb-6">
      {!contactIsCompleted ? (
        <ContactInfoEmpty onSelect={() => setOpenSelect(true)} />
      ) : (
        <ContactInfoPreview
          data={contactInfo!}
          onEdit={() => setOpenSelect(true)}
        />
      )}

      {/* ================= PILIH DATA ================= */}
      <SelectContactModal
        isOpen={openSelect}
        contacts={contacts}
        selectedContact={contactInfo}
        onClose={() => setOpenSelect(false)}
        onSelect={(c) => {
          onSelect(c);
          setOpenSelect(false);
        }}
        onAddNew={() => {
          setCurrentAddress(null);
          setOpenSelect(false);
          setIsEditing(true);
        }}
        onDelete={onDelete}
        onEdit={(data) => {
          onSelect(data);
          setCurrentAddress(data);
          setOpenSelect(false);
          setIsEditing(true);
        }}
      />

      {/* ================= ADD / EDIT ALAMAT (FULL) ================= */}
      <EditAddressModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        currentAddress={currentAddress}
        onSave={async (data) => {
          await onAdd(data);
          onSelect(data);
          setIsEditing(false);
        }}
      />
    </div>
  );
}
