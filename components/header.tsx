"use client";
import { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartBarIcon,
  CursorArrowRaysIcon,
  DocumentChartBarIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "@/node_modules/next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "./FirebaseFrovider";
import { usePathname } from "next/navigation";

interface HeaderProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  // Optional additional props
}
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header({
  searchTerm,
  setSearchTerm = () => {},
}: HeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const pathname = usePathname();

  const [cart, setCart] = useState<any>();
  useEffect(() => {
    if (user?.uid) {
      // const fetchData = async () => {
      const getDoc = collection(
        firestore,
        "shopping-cart",
        user?.uid,
        "orders",
      );
      // const documentSnapshots = await getDocs(getDoc);
      const unsubscribe = onSnapshot(getDoc, (snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCart(updatedData);
      });
      return () => unsubscribe();
      // };
      // fetchData();
    }
  }, [user?.uid]);
  console.log(pathname);
  return (
    <Popover className="relative bg-white">
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          paddingTop: 0,
          paddingBottom: 0,
          zIndex: 8,
          backgroundColor: "#fff",
        }}
        className="flex items-center justify-between p-6 shadow md:justify-start md:space-x-10"
      >
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <a href="/">
            {/* <span className="sr-only">Your Company</span> */}
            <img height={70} width={70} src="/logoFull.png" alt="" />
          </a>
        </div>
        {pathname === "/all-product" && (
          <form
            className="mx-auto ml-4 mr-4 max-w-md md:hidden"
            style={{ padding: 0 }}
          >
            <label
              htmlFor="default-search"
              className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
                id="default-search"
                className="block  rounded-lg border border-gray-300 bg-gray-50  ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Search Product"
                required
              />
              {/* <button
                      type="submit"
                      className="absolute bottom-2.5 end-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Search
                    </button> */}
            </div>
          </form>
        )}
        <div className="-my-2 -mr-2 md:hidden">
          <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>
        <Popover.Group as="nav" className="hidden space-x-10 md:flex">
          <a
            href="/"
            className="text-base font-medium text-gray-500 hover:text-gray-900"
          >
            New Arrival
          </a>
          <a
            href="/all-product"
            className="text-base font-medium text-gray-500 hover:text-gray-900"
          >
            All Products
          </a>
        </Popover.Group>
        <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
          <div style={{ marginRight: "20px" }}>
            {pathname === "/all-product" && (
              <form className="mx-auto max-w-md" style={{ padding: 0 }}>
                <label
                  htmlFor="default-search"
                  className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                    <svg
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="search"
                    id="default-search"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Search Product"
                    required
                  />
                  {/* <button
                      type="submit"
                      className="absolute bottom-2.5 end-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Search
                    </button> */}
                </div>
              </form>
            )}
          </div>
          <div
            className="relative cursor-pointer"
            style={{ marginRight: "20px" }}
            onClick={() => {
              if (user) {
                router.push("/shopping-cart");
              } else {
                router.push("/login");
              }
            }}
          >
            <ShoppingCartIcon className="h-10 w-10 text-gray-700 dark:text-white" />

            {/* {cartCount > 0 && ( */}
            <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
              {cart?.length}
            </span>
            {/* )} */}
          </div>
          {/* <a
            style={{ marginRight: "10px" }}
            href="#"
            className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
          >
            <ShoppingCartIcon className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
              {5}
            </span>
          </a> */}
          <div
            className="relative cursor-pointer "
            onClick={() => {
              if (user) {
                router.push("/profile");
              } else {
                router.push("/login");
              }
            }}
          >
            <UserCircleIcon className="h-10 w-10" />
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="fixed inset-x-0 top-0 z-50 origin-top-right transform p-2 transition md:hidden"
        >
          <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pb-6 ">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    className="h-20 w-auto"
                    src="/logoFull.png"
                    alt="Your Company"
                  />
                </div>

                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <a
                  href="/all-product"
                  className="-m-3 flex items-center rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="ml-4 text-base font-medium text-gray-900">
                    All Products
                  </div>
                </a>
                <a
                  href="/"
                  className="-m-3 flex items-center rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="ml-4 text-base font-medium text-gray-900">
                    New Arrival
                  </div>
                </a>
              </div>

              {/* <div className="mt-6"> */}
              <div
                className="relative mr-6 flex cursor-pointer justify-end"
                onClick={() => {
                  if (user) {
                    router.push("/shopping-cart");
                  } else {
                    router.push("/login");
                  }
                }}
              >
                <ShoppingCartIcon className="h-10 w-10 text-gray-700 dark:text-white" />

                {/* {cartCount > 0 && ( */}
                <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  {cart?.length}
                </span>
                {/* )} */}
              </div>
              {/* <a
            style={{ marginRight: "10px" }}
            href="#"
            className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
          >
            <ShoppingCartIcon className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
              {5}
            </span>
          </a> */}
              <div
                className="relative  mr-6 flex cursor-pointer justify-end"
                onClick={() => {
                  if (user) {
                    router.push("/profile");
                  } else {
                    router.push("/login");
                  }
                }}
              >
                <UserCircleIcon className="h-10 w-10" />
              </div>
            </div>
          </div>
          {/* </div> */}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
