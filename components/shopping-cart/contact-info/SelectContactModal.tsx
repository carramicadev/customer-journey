"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContactInfo } from "@/types/contact-info";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Props {
  isOpen: boolean;
  contacts: ContactInfo[];
  selectedContact: ContactInfo | null;
  onClose: () => void;
  onSelect: (data: ContactInfo) => void;
  onAddNew: () => void;
  onDelete: (id: string) => void;
  onEdit: (data: ContactInfo) => void; // 🔥 WAJIB
}

export default function SelectContactModal({
  isOpen,
  contacts,
  selectedContact,
  onClose,
  onSelect,
  onAddNew,
  onDelete,
  onEdit,
}: Props) {
  const [confirm, setConfirm] = useState<ContactInfo | null>(null);

  return (
    <>
      <Dialog open={!!confirm} onOpenChange={() => setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Konfirmasi penghapusan data Pengirim
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm">
            Apakah Anda yakin ingin menghapus data:
            <br />
            <strong>{confirm?.name}</strong> – {confirm?.phone}
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                console.log("CONFIRM DELETE ID:", confirm);
                onDelete(confirm!.id!);
                setConfirm(null);
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className="mb-4 text-lg font-semibold">Pilih Data Pengirim</h2>

        {contacts.length === 0 ? (
          <p className="mb-4 text-sm text-gray-500">Belum Ada Data Pengirim</p>
        ) : (
          <div className="max-h-[60vh] w-full max-w-4xl space-y-3 overflow-y-auto pr-1">
            {contacts.map((c, i) => (
              <Card
                // key={c.id ?? i}
                key={`contact-${c.id ?? i}`}
                className={`p-4 hover:border-primary ${
                  c.id === selectedContact?.id
                    ? "border-2 border-green-600"
                    : ""
                }`}
              >
                <div className="cursor-pointer" onClick={() => onSelect(c)}>
                  {c.id === selectedContact?.id && (
                    <span className="mb-1 inline-block text-xs font-semibold text-green-600">
                      Dipilih
                    </span>
                  )}
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm">{c.phone}</p>
                  <p className="text-xs text-gray-500">{c.address || "-"}</p>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(c)}>
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setConfirm(c)}
                  >
                    Hapus
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Button
          className="mt-6 w-full bg-primary hover:bg-green-700"
          onClick={onAddNew}
        >
          + Tambah Alamat Baru
        </Button>
      </Modal>
    </>
  );
}
