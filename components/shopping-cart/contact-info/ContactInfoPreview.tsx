// components/shopping-cart/contact-info/ContactInfoPreview.tsx

"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactInfo } from "@/types/contact-info";
import { CheckCircle } from "lucide-react";

interface Props {
  data: ContactInfo;
  onEdit: () => void;
}

export default function ContactInfoPreview({ data, onEdit }: Props) {
  return (
    <Card className="space-y-4 border-2 border-green-600 p-6">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-6 w-6 text-green-600" />
        <h2 className="text-lg font-semibold text-green-700">Data Pengirim</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-md border p-4 text-sm md:grid-cols-2">
        <div>
          <p className="text-gray-500">Nama Pengirim</p>
          <p className="font-medium">{data.name}</p>
        </div>

        <div>
          <p className="text-gray-500">No HP</p>
          <p className="font-medium">{data.phone}</p>
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
        Pilih Data Pengirim
      </Button>
    </Card>
  );
}
