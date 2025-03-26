"use client";
import React, { useEffect, useState } from "react";
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
import { signOut } from "firebase/auth";
import { auth, firestore } from "@/components/FirebaseFrovider";
import { useRouter } from "next/navigation";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
interface Coordinate {
  lat: number;
  lng: number;
}

interface Product {
  sku: string;
  weight: number;
  quantity: number;
  length: number;
  imageUrl: string;
  price: number;
  id: string;
  width: number;
  stok: number;
  name: string;
  height: number;
}

interface Recipient {
  koordinateReceiver: Coordinate;
  receiverPhone: string;
  postalCode: number;
  receiverName: string;
  district: string;
  address: string;
  id: string;
}

interface Order {
  listService: any[];
  dataCourier: any;
  courier: string;
  deliveryFee: number;
  id: string;
  products: Product[];
  isEditing: boolean;
  dataComplete: boolean;
  createdAt: any;
  recipient: Recipient;
  giftCardMessage?: string;
}

interface Sender {
  senderName: string;
  email: string;
  address: string;
  senderPhone: string;
}

interface MidtransInfo {
  token: string;
  redirect_url: string;
}

interface OrderGroup {
  id: string;
  orders: Order[];
  sender: Sender;
  createdAt: any;
  paymentStatus: string;
  midtrans: MidtransInfo;
  deliveryFee: number;
}

const OrderHistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Order History");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // State for mobile sidebar toggle

  const [orders, setOrders] = useState<OrderGroup[]>([]);

  // get history orders
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      // setIsLoading(true);
      // const fetchData = async () => {
      const getDoc = collection(firestore, "customer", user?.uid, "orders");
      // const documentSnapshots = await getDocs(getDoc);
      const unsubscribe = onSnapshot(getDoc, (snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          deliveryFee: doc.data()?.deliveryFee ?? 0,
        }));
        console.log(updatedData);
        setOrders(updatedData as OrderGroup[]);
      });
      // setIsLoading(false);
      return () => unsubscribe();
      // };
      // fetchData();
    }
  }, [user?.uid]);

  const tabs = [
    { name: "Order History", icon: ClipboardDocumentListIcon },
    { name: "Account Info", icon: UserCircleIcon },
    { name: "Address Data", icon: MapPinIcon },
    { name: "Logout", icon: ArrowLeftOnRectangleIcon },
  ];

  // payment
  const handlePayment = async (token: string) => {
    if (!token) {
      alert("Token not found");
      return;
    }

    try {
      window.snap.pay(token, {
        async onSuccess(result: any) {
          console.log("Payment success:", result);
          const orderId = result?.order_id?.split("_")?.[3];
          // Update payment status in Firestore
          const orderRef = doc(
            firestore,
            `customer/${user?.uid}/orders/${orderId}`,
          );

          await updateDoc(orderRef, {
            paymentStatus: result?.transaction_status,
            // updatedAt: new Date(), // Optional: add update timestamp
            midtransRes: result, // Optional: store payment details
          });

          alert("Payment successful!");
          // handleDeleteOrders(); // Uncomment if needed
          // setOrders([]); // Uncomment if needed
        },
        onError(error: any) {
          console.error("Payment failed:", error);
          alert("Payment failed. Please try again.");
        },
        onClose() {
          console.log("Popup closed");
        },
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("An error occurred during payment.");
    }
  };

  //   logout
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      console.log("User logged out successfully.");
      router.replace("/");
      // Redirect or update UI after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // useEffect(() => {
  //   if (!user?.uid) {
  //     router.replace("/login");
  //   }
  // }, [user]);

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
                            ? "bg-green-100 text-green-600"
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
                    <div className="">
                      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-lg font-semibold">
                            Order ID: {order.id}
                          </p>
                          <p>Data Pengirim</p>
                          <p className="text-gray-600">
                            {order.sender?.senderName} |{" "}
                            {order.sender?.senderPhone}
                          </p>
                        </div>
                        <div className=" flex items-center">
                          <p>Status Pembayaran:</p>
                          <p
                            className={`${order?.paymentStatus === "settlement" ? " rounded-lg bg-green-100 p-2 text-lg font-semibold text-green-800" : "rounded-lg bg-red-100 p-2 text-lg font-semibold text-red-800"}`}
                          >
                            {order?.paymentStatus}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {order?.orders?.map((ord, idx) => {
                          return (
                            <div
                              key={idx}
                              className={`${order?.paymentStatus === "settlement" ? "rounded-lg bg-green-100 p-6 shadow-md" : "rounded-lg bg-red-100 p-6 shadow-md"}`}
                              // className="rounded-lg bg-green-100 p-6 shadow-md"
                            >
                              <p>Orderan {idx + 1}</p>
                              <div>
                                <p className="text-gray-600">
                                  Delivery Address:
                                </p>
                                <p className="text-gray-800">
                                  {ord.recipient?.address}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">
                                  Courier: {ord?.courier}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Items:</p>
                                <ul className="list-inside list-disc text-gray-800">
                                  {ord.products.map((item, index) => (
                                    <li key={index}>
                                      {item?.name} x {item?.quantity}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between">
                        <button className="mr-1 mt-4 rounded-lg bg-green-800 px-4 py-2 text-white hover:bg-green-600">
                          Download Invoice
                        </button>
                        {order?.paymentStatus === "pending" &&
                          order?.midtrans?.token && (
                            <button
                              onClick={() =>
                                handlePayment(order?.midtrans?.token)
                              }
                              className="ml-1 mt-4 rounded-lg bg-green-800 px-4 py-2 text-white hover:bg-green-600"
                            >
                              Bayar sekarang
                            </button>
                          )}
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
    </>
  );
};

export default OrderHistoryPage;
