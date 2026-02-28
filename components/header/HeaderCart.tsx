"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HeaderCart({
  count,
  user,
}: {
  count: number;
  user: any;
}) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-primary hover:bg-primary/10"
      onClick={() => router.push(user ? "/shopping-cart" : "/login")}
    >
      <ShoppingCart className="size-6" />

      {count > 0 && (
        <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 text-xs text-white">
          {count}
        </span>
      )}
    </Button>
  );
}
