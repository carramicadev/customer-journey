"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, User, Home, Grid2X2 } from "lucide-react";

import { collection, onSnapshot } from "firebase/firestore";
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

  const [cart, setCart] = useState<any[]>([]);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await signOut(auth);

      document.cookie =
        "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* ================= CART LISTENER ================= */
  useEffect(() => {
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

  /* ================= MOBILE NAV ITEMS ================= */
  const mobileMenus = [
    {
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      label: "Products",
      icon: Grid2X2,
      path: "/all-product",
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      path: "/shopping-cart",
    },
    {
      label: "Profile",
      icon: User,
      path: user ? "/profile" : "/login",
    },
  ];

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fixed inset-x-0 top-0 z-50 bg-primary shadow">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:h-20">
          {/* LOGO */}
          <div
            className="flex cursor-pointer items-center"
            onClick={() => router.push("/")}
          >
            <Image
              src="/logoCarramica.svg"
              alt="Carramica"
              width={120}
              height={60}
              priority
            />
          </div>

          {/* DESKTOP MENU */}
          <nav className="mx-auto hidden gap-10 md:flex">
            <Button
              variant="ghost"
              className={`rounded-full px-5 py-2 font-medium transition
      ${
        pathname === "/"
          ? "bg-white/10 text-white hover:bg-white/10 hover:text-white"
          : "text-white hover:bg-white/10 hover:text-white"
      }
    `}
              onClick={() => router.push("/")}
            >
              New Arrival
            </Button>

            <Button
              variant="ghost"
              className={`rounded-full px-5 py-2 font-medium transition
      ${
        pathname.startsWith("/all-product")
          ? "bg-white/10 text-white hover:bg-white/10 hover:text-white"
          : "text-white hover:bg-white/10 hover:text-white"
      }
    `}
              onClick={() => router.push("/all-product")}
            >
              All Products
            </Button>
          </nav>

          {/* SEARCH (mobile + desktop only when needed) */}
          {pathname === "/all-product" && (
            <Input
              value={searchTerm}
              onChange={(e) =>
                router.push(`/all-product?search=${e.target.value}`)
              }
              placeholder="Search product..."
              className=" flex-1 bg-white"
            />
          )}

          {/* DESKTOP RIGHT */}
          <div className="ml-auto hidden items-center gap-4 md:flex">
            {/* CART */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-white/10"
              onClick={() => router.push("/shopping-cart")}
            >
              <ShoppingCart className="size-6" />

              {cart.length > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 text-xs text-white">
                  {cart.length}
                </span>
              )}
            </Button>

            {/* USER */}
            {!user ? (
              <Button
                className="bg-white text-primary hover:bg-gray-100"
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
                    className="text-white hover:bg-white/10"
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
      </header>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
        <div className="grid h-16 grid-cols-4">
          {mobileMenus.map((menu, index) => {
            const Icon = menu.icon;
            const isActive = pathname === menu.path;

            return (
              <button
                key={index}
                onClick={() => router.push(menu.path)}
                className={`flex flex-col items-center justify-center text-xs font-medium ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                <div className="relative">
                  <Icon className="size-6" strokeWidth={3} />

                  {/* CART BADGE */}
                  {menu.label === "Cart" && cart.length > 0 && (
                    <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 text-[10px] text-white">
                      {cart.length}
                    </span>
                  )}
                </div>

                {menu.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SPACER FOR MOBILE BOTTOM NAV */}
      <div className="h-16 md:hidden" />
    </>
  );
}
