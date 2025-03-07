"use client";
import React, { useState } from "react";

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

const AddressDataPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: "John Doe",
      phone: "+62 823 7647 4634",
      address: "Permata Hijau 2, Blok B 82",
      city: "Jakarta",
      postalCode: "12345",
    },
  ]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAddress((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (currentAddress) {
      if (currentAddress.id) {
        // Edit existing address
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === currentAddress.id ? currentAddress : addr,
          ),
        );
      } else {
        // Add new address
        setAddresses((prev) => [
          ...prev,
          { ...currentAddress, id: prev.length + 1 },
        ]);
      }
      setIsEditing(false);
      setCurrentAddress(null);
    }
  };

  const handleEdit = (address: Address) => {
    setCurrentAddress(address);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleAddNew = () => {
    setCurrentAddress({
      id: 0,
      name: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
    });
    setIsEditing(true);
  };

  return (
    // <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
    <div className="w-full max-w-full ">
      {/* <h2 className="mb-6 text-center text-2xl font-bold">Address Data</h2> */}

      {/* Add New Address Button */}
      <button
        onClick={handleAddNew}
        className="mb-6 w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
      >
        Add New Address
      </button>

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="rounded-lg border border-gray-200 p-4"
          >
            <p className="text-lg font-semibold">{address.name}</p>
            <p className="text-gray-600">{address.phone}</p>
            <p className="text-gray-600">{address.address}</p>
            <p className="text-gray-600">
              {address.city}, {address.postalCode}
            </p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleEdit(address)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(address.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Address Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold">
              {currentAddress?.id ? "Edit Address" : "Add New Address"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentAddress?.name || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={currentAddress?.phone || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={currentAddress?.address || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={currentAddress?.city || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={currentAddress?.postalCode || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex space-x-2">
              <button
                onClick={handleSave}
                className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="w-full rounded-lg bg-gray-600 py-2 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
};

export default AddressDataPage;
