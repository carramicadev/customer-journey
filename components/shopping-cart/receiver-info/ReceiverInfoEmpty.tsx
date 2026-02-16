"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface Props {
  onSelect: () => void;
  sendToSelf: boolean;
  onToggleSendToSelf: (v: boolean) => void;
}

export default function ReceiverInfoEmpty({
  onSelect,
  sendToSelf,
  onToggleSendToSelf,
}: Props) {
  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-6 w-6 text-gray-300" />
        <h2 className="text-lg font-semibold">Data Penerima</h2>
      </div>

      <div className="rounded-md border px-4 py-3 text-sm text-gray-400">
        Data Penerima Belum Diisi
      </div>

      <Button
        variant="outline"
        className="w-full border-primary py-6 text-primary hover:bg-primary hover:text-white"
        onClick={onSelect}
      >
        Pilih Data Penerima
      </Button>

      {/* 🔥 CHECKBOX KUNCI */}
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
