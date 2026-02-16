"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderVisibility() {
  const pathname = usePathname();

  if (pathname.startsWith("/payment-method")) {
    return null;
  }

  return <Header />;
}
