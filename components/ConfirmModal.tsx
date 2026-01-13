"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
  stok: number;
}

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: Product;
  onContinueShopping: () => void;
  onGoToCart: () => void;
}

export default function ConfirmModal({
  open,
  onOpenChange,
  product,
  onContinueShopping,
  onGoToCart,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="size-5" />
            Berhasil masuk keranjang
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold">{product.name}</p>
            <p className="text-muted-foreground text-sm">
              Qty: {product.quantity}
            </p>
            <p className="text-muted-foreground text-sm">
              Rp{product.price.toLocaleString()}
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onContinueShopping}>
            Lanjut Belanja
          </Button>
          <Button onClick={onGoToCart}>Ke Keranjang</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
