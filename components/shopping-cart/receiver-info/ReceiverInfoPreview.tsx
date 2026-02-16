"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { RecipientInfo } from "@/types/shopping-cart";

interface Props {
  data: RecipientInfo;
  onEdit: () => void;
  sendToSelf: boolean;
  onToggleSendToSelf: (v: boolean) => void;
}

export default function ReceiverInfoPreview({
  data,
  onEdit,
  sendToSelf,
  onToggleSendToSelf,
}: Props) {
  return (
    <Card className="space-y-4 border-2 border-primary bg-green-50 p-6">
      <div className="flex items-center gap-2">
        <CheckCircle className="size-6 text-primary" />
        <h2 className="text-lg font-semibold text-primary">Data Penerima</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-md border p-4 text-sm md:grid-cols-2">
        <div>
          <p className="text-gray-500">Nama Penerima</p>
          <p className="font-medium">{data.receiverName}</p>
        </div>

        <div>
          <p className="text-gray-500">No HP</p>
          <p className="font-medium">{data.receiverPhone}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-gray-500">Alamat</p>
          <p className="font-medium">{data.address}</p>
        </div>

        <button
          onClick={onEdit}
          className="mt-2 text-left text-sm font-semibold text-primary hover:underline"
        >
          Ubah Detail
        </button>
      </div>

      <Button
        variant="outline"
        className="w-full border-primary py-6 text-primary hover:bg-primary hover:text-white"
        onClick={onEdit}
      >
        Pilih Data Penerima
      </Button>

      {/* 🔥 CHECKBOX TETAP ADA SAAT PREVIEW */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          checked={sendToSelf}
          onChange={(e) => onToggleSendToSelf(e.target.checked)}
          className="text-primary"
        />
        <label className="text-sm text-primary">
          Saya kirim untuk diri sendiri
        </label>
      </div>
    </Card>
  );
}
