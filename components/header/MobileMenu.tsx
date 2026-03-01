"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MobileMenu({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
  const router = useRouter();

  if (!open) return null;

  const go = (url: string) => {
    router.push(url);
    close();
  };

  return (
    <div
      className="
    fixed
    inset-x-0
    top-16 z-40
    w-full
    border-t
    bg-white
    shadow-lg
    md:top-20
    md:hidden
  "
    >
      <div className="flex flex-col gap-1 p-4">
        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => go("/new-arrival")}
        >
          New Arrival
        </Button>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => go("/all-product")}
        >
          All Products
        </Button>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => go("/about-us")}
        >
          About Us
        </Button>
      </div>
    </div>
  );
}
