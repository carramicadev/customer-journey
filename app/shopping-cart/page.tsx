"use client";
import Header from "@/components/header";
import React, { useState } from "react";

// Define TypeScript interfaces
interface ContactInfo {
  name: string;
  phone: string;
  address: string;
}

interface RecipientInfo {
  name: string;
  phone: string;
  address: string;
}

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  recipient: RecipientInfo;
  products: Product[];
  courier: string;
}

const CheckoutPage: React.FC = () => {
  // State for form fields
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: "Hamish Daud",
    phone: "+62 82376474634",
    address: "Dala kengluya",
  });

  const [orders, setOrders] = useState<Order[]>([
    {
      recipient: {
        name: "Raisha",
        phone: "+62 82376474634",
        address: "Permata Hijau 2 blok B 82",
      },
      courier: "Lalamove bike",
      products: [
        { name: "Imperial Forest", quantity: 3, price: 699000 },
        { name: "Nestling", quantity: 3, price: 500000 },
      ],
    },
    {
      recipient: {
        name: "Hamish Daud",
        phone: "+62 82376474634",
        address: "Dala kengluya",
      },
      courier: "Lalamove bike",
      products: [
        { name: "Imperial Forest", quantity: 2, price: 699000 },
        { name: "Nestling", quantity: 1, price: 500000 },
      ],
    },
  ]);

  const [deliveryFee, setDeliveryFee] = useState<number>(31000);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [expandedOrderIndex, setExpandedOrderIndex] = useState<number | null>(
    null,
  );

  // Calculate totals
  const subtotal = orders.reduce(
    (sum, order) =>
      sum +
      order.products.reduce(
        (orderSum, product) => orderSum + product.quantity * product.price,
        0,
      ),
    0,
  );
  const total = subtotal + deliveryFee;

  // Handle adding a new order
  const handleAddOrder = () => {
    if (orders.length < 10) {
      const newOrder: Order = {
        recipient: {
          name: "",
          phone: "",
          address: "",
        },
        courier: "Lalamove bike",
        products: [],
      };
      setOrders([...orders, newOrder]);
    }
  };

  // Handle toggling accordion
  const toggleAccordion = (index: number) => {
    setExpandedOrderIndex(expandedOrderIndex === index ? null : index);
  };

  // Handle input changes
  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleRecipientInfoChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const updatedOrders = [...orders];
    updatedOrders[index].recipient = {
      ...updatedOrders[index].recipient,
      [name]: value,
    };
    setOrders(updatedOrders);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-2 pt-28">
        <h1 className="mb-6 text-2xl font-bold">Daftar Orderan</h1>

        {/* Main Layout */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Section */}
          <div className="lg:w-2/3">
            {/* Contact Information */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Informasi Kontak</h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactInfo.name}
                      onChange={handleContactInfoChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nomor Telepon
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={contactInfo.phone}
                      onChange={handleContactInfoChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Alamat
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={contactInfo.address}
                      onChange={handleContactInfoChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                  </div>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-md bg-green-600 px-4 py-2 text-white"
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>
                    <strong>Nama:</strong> {contactInfo.name}
                  </p>
                  <p>
                    <strong>No. HP:</strong> {contactInfo.phone}
                  </p>
                  <p>
                    <strong>Alamat:</strong> {contactInfo.address}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 rounded-md bg-green-600 px-4 py-2 text-white"
                  >
                    Ubah Detail
                  </button>
                </div>
              )}
            </div>

            {/* Orders */}
            {orders.map((order, index) => (
              <div
                key={index}
                className="mb-6 rounded-lg bg-white p-6 shadow-md"
              >
                <h2 className="mb-4 text-xl font-semibold">
                  Orderan {index + 1}
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Data Penerima</h3>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nama Penerima
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={order.recipient.name}
                            onChange={(e) =>
                              handleRecipientInfoChange(index, e)
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nomor Telepon Penerima
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={order.recipient.phone}
                            onChange={(e) =>
                              handleRecipientInfoChange(index, e)
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Alamat Penerima
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={order.recipient.address}
                            onChange={(e) =>
                              handleRecipientInfoChange(index, e)
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p>
                          <strong>Nama Penerima:</strong> {order.recipient.name}
                        </p>
                        <p>
                          <strong>No. HP:</strong> {order.recipient.phone}
                        </p>
                        <p>
                          <strong>Alamat:</strong> {order.recipient.address}
                        </p>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="mt-4 rounded-md bg-green-600 px-4 py-2 text-white"
                        >
                          Ubah Detail
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Produk</h3>
                    {order.products.map((product, pIndex) => (
                      <div
                        key={pIndex}
                        className="mb-2 flex items-center justify-between"
                      >
                        <span>{product.name}</span>
                        <span>
                          {product.quantity} x Rp{" "}
                          {product.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="lg:w-1/3">
            {/* Orders Accordion */}
            {orders.map((order, index) => (
              <div
                key={index}
                className="mb-6 rounded-lg bg-white p-6 shadow-md"
              >
                <div
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => toggleAccordion(index)}
                >
                  <h2 className="text-xl font-semibold">Orderan {index + 1}</h2>
                  <span>{expandedOrderIndex === index ? "▲" : "▼"}</span>
                </div>
                {expandedOrderIndex === index && (
                  <div className="mt-4">
                    <div className="space-y-2">
                      <p>
                        <strong>Nama Penerima:</strong> {order.recipient.name}
                      </p>
                      <p>
                        <strong>No. HP:</strong> {order.recipient.phone}
                      </p>
                      <p>
                        <strong>Kurir:</strong> {order.courier}
                      </p>
                      <p>
                        <strong>Alamat Penerima:</strong>{" "}
                        {order.recipient.address}
                      </p>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">Order</h3>
                      {order.products.map((product, pIndex) => (
                        <div
                          key={pIndex}
                          className="mb-2 flex items-center justify-between"
                        >
                          <span>{product.name}</span>
                          <span>
                            {product.quantity} x Rp{" "}
                            {product.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white"
                      onClick={() => {
                        const updatedOrders = orders.filter(
                          (_, i) => i !== index,
                        );
                        setOrders(updatedOrders);
                      }}
                    >
                      Hapus Order
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Add Order Button */}
            {orders.length < 10 && (
              <button
                className="mb-6 w-full rounded-md bg-green-600 px-4 py-2 text-white"
                onClick={handleAddOrder}
              >
                Tambah Order {orders.length + 1}/10
              </button>
            )}

            {/* Summary Section */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">
                Ringkasan Pembayaran
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Discount</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>Rp {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString()}</span>
                </div>
              </div>
              <button className="mt-4 w-full rounded-md bg-green-600 px-4 py-2 text-white">
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
