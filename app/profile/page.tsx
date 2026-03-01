"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  MapPinIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

import UserInfoPage from "./user-info";
import AddressDataPage from "./address";

import { signOut } from "firebase/auth";
import { auth, firestore } from "@/components/FirebaseProvider";
import { useRouter } from "next/navigation";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

/* ================= TYPES ================= */

interface OrderGroup {
  id: string;
  orders: any[];
  sender: any;
  paymentStatus: string;
  deliveryFee: number;
}

/* ================= PAGE ================= */

const OrderHistoryPage: React.FC = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("Order History");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<OrderGroup[]>([]);

  const { user, loading } = useAuth();

  /* ================= AUTH ================= */

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading]);

  /* ================= FETCH ORDERS ================= */

  useEffect(() => {
    if (user?.uid) {
      const getDoc = collection(firestore, "customer", user.uid, "orders");

      const unsubscribe = onSnapshot(getDoc, (snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          deliveryFee: doc.data()?.deliveryFee ?? 0,
        }));

        setOrders(updatedData as OrderGroup[]);
      });

      return () => unsubscribe();
    }
  }, [user?.uid]);

  /* ================= TABS ================= */

  const tabs = [
    { name: "Order History", icon: ClipboardDocumentListIcon },
    { name: "Account Info", icon: UserCircleIcon },
    { name: "Address Data", icon: MapPinIcon },
    { name: "Logout", icon: ArrowLeftOnRectangleIcon },
  ];

  /* ================= PAYMENT ================= */

  const handlePayment = async (ord: any) => {
    try {
      const draftId = `${ord?.id}-${ord?.sender?.phone}`;
      router.push(`/payment-method?draft=${draftId}`);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    try {
      await signOut(auth);

      document.cookie =
        "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.carramica.org";

      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  /* ================= UI ================= */

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 pb-12">
      <div className="flex min-h-screen gap-4 bg-gray-100">
        {/* MOBILE BUTTON */}
        <button
          className={`fixed left-8 top-1/2 z-50 -translate-y-1/2 rounded-r-lg bg-green-800 p-2 text-white transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? "translate-x-56" : "-translate-x-full"} z-40 md:relative md:flex-none md:translate-x-0`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <ChevronRightIcon className="size-10 text-white dark:text-white" />
        </button>

        {/* OVERLAY */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <div
          className={`
            fixed left-0 top-0 z-50  w-64 transform bg-white
            shadow-xl transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "h-full translate-x-0" : "-translate-x-full"}
            md:relative md:z-auto md:translate-x-0 md:rounded-2xl
          `}
        >
          <div className="border-b p-6">
            <h1 className="text-xl font-bold">User Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your account</p>
          </div>

          <nav className="p-3">
            <ul className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <li key={tab.name}>
                    <button
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                        activeTab === tab.name
                          ? "bg-green-100 text-green-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        if (tab.name === "Logout") {
                          setActiveTab("Logout");
                        } else {
                          setActiveTab(tab.name);
                        }
                        setIsSidebarOpen(false);
                      }}
                    >
                      <Icon className="size-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-6 rounded-2xl bg-white p-5 shadow-sm md:p-8">
          {/* TITLE */}
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold">{activeTab}</h2>
            <p className="text-sm text-gray-500">
              Manage your {activeTab.toLowerCase()}
            </p>
          </div>

          {/* ================= ORDER HISTORY ================= */}

          {activeTab === "Order History" && (
            <div className="space-y-6">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    {/* HEADER */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-semibold">{order.id}</p>

                        <p className="mt-2 text-sm text-gray-500">Sender</p>
                        <p className="text-gray-700">
                          {order.sender?.name} | {order.sender?.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          Payment Status:
                        </span>

                        <span
                          className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                            order?.paymentStatus === "settlement"
                              ? "bg-green-100 text-primary"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order?.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* SHIPMENTS */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {order?.orders?.map((ord: any, idx: number) => (
                        <div
                          key={idx}
                          className={`rounded-xl border p-4 ${
                            order?.paymentStatus === "settlement"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          <p className="mb-2 font-semibold">
                            Shipment {idx + 1}
                          </p>

                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-gray-600">Delivery Address:</p>
                              <p className="text-gray-800">
                                {ord.recipient?.address}
                              </p>
                            </div>

                            <p className="text-gray-600">
                              Courier: {ord?.courier}
                            </p>

                            <div>
                              <p className="text-gray-600">Items:</p>
                              <ul className="list-disc pl-5 text-gray-800">
                                {ord.products?.map(
                                  (item: any, index: number) => (
                                    <li key={index}>
                                      {item?.name} x {item?.quantity}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
                      <button className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-green-600">
                        Download Invoice
                      </button>

                      {order?.paymentStatus === "pending" && (
                        <button
                          onClick={() => handlePayment(order)}
                          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-green-600"
                        >
                          Bayar sekarang
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 py-12">
                  <svg
                    className="mb-4 size-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <h2 className="mb-2 text-xl font-semibold text-gray-800">
                    No data available
                  </h2>

                  <p className="text-gray-500">
                    There is no data to display at the moment.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ================= ACCOUNT INFO ================= */}

          {activeTab === "Account Info" && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <UserInfoPage />
            </div>
          )}

          {/* ================= ADDRESS ================= */}

          {activeTab === "Address Data" && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <AddressDataPage />
            </div>
          )}

          {/* ================= LOGOUT ================= */}

          {activeTab === "Logout" && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p>Are you sure you want to log out?</p>

              <button
                onClick={handleLogout}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
