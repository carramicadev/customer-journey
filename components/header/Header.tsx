"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, User } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";

import { firestore } from "../FirebaseProvider";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../FirebaseProvider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCookieDomain } from "@/lib/cookie";

interface HeaderProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

export default function Header({
  searchTerm,
  setSearchTerm = () => {},
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const [cart, setCart] = useState<any[]>([]);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      const domain = getCookieDomain();

      document.cookie = `auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;${domain}`;

      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ======================
  // 🔒 LOGIC CART (TIDAK DIUBAH)
  // ======================
  useEffect(() => {
    // ⬇️ PENTING: reset cart saat user logout
    if (!user?.uid) {
      setCart([]);
      return;
    }

    const ref = collection(firestore, "shopping-cart", user.uid, "orders");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const updated = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCart(updated);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <header className="fixed relative inset-x-0 top-0 z-50 bg-white shadow">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-3 md:h-20 md:px-4">
        <button
          className="mr-auto text-primary md:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu />
        </button>

        {/* ===== LEFT: LOGO ===== */}
        <div
          className="flex cursor-pointer items-center"
          onClick={() => router.push("/")}
        >
          <Image
            src="/logoCarramica2.svg"
            alt="Carramica"
            width={140}
            height={70}
          />
        </div>

        {/* ===== CENTER: MENU ===== */}
        <nav className="mx-auto hidden gap-10 md:flex">
          <Button
            variant="ghost"
            className="text-primary hover:bg-primary/10 hover:text-primary"
            onClick={() => router.push("/new-arrival")}
          >
            New Arrival
          </Button>
          <Button
            variant="ghost"
            className="text-primary hover:bg-primary/10 hover:text-primary"
            onClick={() => router.push("/all-product")}
          >
            All Products
          </Button>
          <Button
            variant="ghost"
            className="text-primary hover:bg-primary/10 hover:text-primary"
            onClick={() => router.push("/about-us")}
          >
            About Us
          </Button>
        </nav>

        {/* ===== RIGHT: SEARCH + CART + USER ===== */}
        <div className="ml-auto flex items-center gap-4">
          {/* SEARCH (HANYA DI /all-product) */}
          {pathname === "/all-product" && (
            <Input
              value={searchTerm}
              onChange={(e) =>
                router.push(`/all-product?search=${e.target.value}`)
              }
              placeholder="Search product"
              className="hidden w-64 border border-primary bg-white md:block"
            />
          )}

          {/* CART */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-primary hover:bg-primary/10 hover:text-primary"
            onClick={() => router.push(user ? "/shopping-cart" : "/login")}
          >
            <ShoppingCart className="size-6" />
            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 text-xs text-primary">
                {cart.length}
              </span>
            )}
          </Button>

          {/* USER / LOGIN */}
          {!user ? (
            <Button
              className="bg-primary text-white hover:bg-green-700"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:bg-white/10"
                >
                  <User className="size-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <MobileMenu open={open} close={() => setOpen(false)} />
    </header>
  );
}
