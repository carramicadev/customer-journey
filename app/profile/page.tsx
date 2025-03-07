"use client";
import React, { useState } from "react";
import Header from "../../components/header";
// import { ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  MapPinIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import UserInfoPage from "./user-info";
import AddressDataPage from "./address";
interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  courier: string;
  address: string;
  items: string[];
  invoiceLink: string;
}

const OrderHistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Order History");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // State for mobile sidebar toggle

  const orders: Order[] = [
    {
      id: "12345",
      customerName: "Ralsha",
      phoneNumber: "+62 82376474634",
      courier: "Lalamove bike",
      address: "Permata hijau 2 blok B 82",
      items: ["3 x Imperial Forest", "3 x Nestling"],
      invoiceLink: "#",
    },
    // Add more orders here
  ];

  const tabs = [
    { name: "Order History", icon: ClipboardDocumentListIcon },
    { name: "Account Info", icon: UserCircleIcon },
    { name: "Address Data", icon: MapPinIcon },
    { name: "Logout", icon: ArrowLeftOnRectangleIcon },
  ];
  return (
    <>
      <Header />
      <div className="container mx-auto px-2 pt-28">
        <div className="flex min-h-screen bg-gray-100">
          {/* Mobile Hamburger Button */}
          <button
            className={`fixed left-8 top-1/2 z-50 -translate-y-1/2 rounded-br-lg rounded-tr-lg bg-green-800 p-2 text-white transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? "translate-x-56" : "-translate-x-full"} z-40 md:relative md:flex-none md:translate-x-0`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ChevronRightIcon className="h-10 w-10 text-white dark:text-white" />
          </button>

          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0  w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${isSidebarOpen ? "top-24 translate-x-0" : "-translate-x-full"} z-5  md:relative md:flex-none md:translate-x-0`}
          >
            <div className="p-6">
              <h1 className="text-xl font-bold">User Info</h1>
            </div>
            <nav>
              <ul>
                {tabs.map((tab) => {
                  const Icon = tab.icon; // Dynamically assign the icon component
                  return (
                    <li key={tab.name}>
                      <button
                        className={`flex w-full items-center space-x-3 px-6 py-3 text-left hover:bg-gray-200 ${
                          activeTab === tab.name
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-700"
                        }`}
                        onClick={() => {
                          setActiveTab(tab.name);
                          setIsSidebarOpen(false); // Close sidebar on mobile after clicking a tab
                        }}
                      >
                        <Icon className="h-6 w-6" /> {/* Render the icon */}
                        <span>{tab.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Overlay for Mobile Sidebar */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          {/* Main Content */}
          <div className="flex-1 p-8">
            <h2 className="mb-6 text-2xl font-bold">{activeTab}</h2>

            {activeTab === "Order History" && (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg bg-white p-6 shadow-md"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-lg font-semibold">
                          Order ID: {order.id}
                        </p>
                        <p className="text-gray-600">
                          {order.customerName} | {order.phoneNumber}
                        </p>
                        <p className="text-gray-600">
                          Courier: {order.courier}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Delivery Address:</p>
                        <p className="text-gray-800">{order.address}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Items:</p>
                        <ul className="list-inside list-disc text-gray-800">
                          {order.items.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <button className="mt-4 rounded-lg bg-green-800 px-4 py-2 text-white hover:bg-green-600">
                          Download Invoice
                        </button>
                      </div>
                    </div>
                    {/* <div className="mt-4">
                      <p className="text-gray-600">Items:</p>
                      <ul className="list-inside list-disc text-gray-800">
                        {order.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4">
                      <button className="mt-4 rounded-lg bg-green-800 px-4 py-2 text-white hover:bg-green-600">
                        Download Invoice
                      </button>
                    </div> */}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Account Info" && (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <UserInfoPage />
              </div>
            )}

            {activeTab === "Address Data" && (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <AddressDataPage />
              </div>
            )}

            {activeTab === "Logout" && (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <p>Are you sure you want to log out?</p>
                <button className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderHistoryPage;
