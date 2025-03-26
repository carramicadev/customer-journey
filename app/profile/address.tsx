"use client";

import EditAddressModal from "@/components/AddModalAdress";
import Loader from "@/components/AppLoading";
import { firestore } from "@/components/FirebaseFrovider";
import { useAuth } from "@/context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
// import EditAddressModal from "./EditAddressModal";

export interface Address {
  id: string;
  receiverName: string;
  receiverPhone: string;
  address: string;
  district: string;
  postalCode: number;
  koordinateReceiver: {
    lat: number;
    lng: number;
  };
}

const AddressDataPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state

  useEffect(() => {
    if (user?.uid) {
      // const fetchData = async () => {
      const getDoc = collection(firestore, "customer", user?.uid, "address");
      // const documentSnapshots = await getDocs(getDoc);
      const unsubscribe = onSnapshot(getDoc, (snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAddresses(updatedData as Address[]);
      });
      setIsLoading(false);
      return () => unsubscribe();
      // };
      // fetchData();
    }
  }, [user?.uid]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

  const handleEdit = (address: Address) => {
    setCurrentAddress(address);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleAddNew = () => {
    setCurrentAddress({
      id: "",
      receiverName: "",
      receiverPhone: "",
      address: "",
      district: "",
      postalCode: 0,
      koordinateReceiver: {
        lat: 0,
        lng: 0,
      },
    });
    setIsEditing(true);
  };

  const handleSaveSuccess = (savedAddress: Address) => {
    // if (savedAddress.id) {
    //   // Edit existing address
    //   setAddresses((prev) =>
    //     prev.map((addr) => (addr.id === savedAddress.id ? savedAddress : addr)),
    //   );
    // } else {
    //   // Add new address
    //   setAddresses((prev) => [
    //     ...prev,
    //     { ...savedAddress, id: prev.length + 1 },
    //   ]);
    // }
  };
  if (isLoading) {
    return <Loader size="md" color="green" />;
  }
  return (
    <div className="w-full max-w-full">
      {/* Add New Address Button */}
      <button
        onClick={handleAddNew}
        className="mb-6 w-full rounded-lg bg-green-600 py-2 text-white hover:bg-green-700"
      >
        Add New Address
      </button>

      {/* Address List */}
      <div className="space-y-4">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <p className="text-lg font-semibold">{address.receiverName}</p>
              <p className="text-gray-600">{address.receiverPhone}</p>
              <p className="text-gray-600">{address.address}</p>
              <p className="text-gray-600">
                {address.district}, {address.postalCode}
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
          ))
        ) : (
          <div className="flex  flex-col items-center justify-center bg-gray-50">
            {/* Icon */}
            <svg
              className="mb-4 h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>

            {/* Message */}
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              No data available
            </h2>
            <p className="mb-6 text-gray-500">
              There is no data to display at the moment.
            </p>

            {/* Call-to-action Button */}
          </div>
        )}
      </div>

      {/* Edit/Add Address Modal */}
      <EditAddressModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        currentAddress={currentAddress}
        // onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default AddressDataPage;
