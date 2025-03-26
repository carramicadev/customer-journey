"use client";

import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react"; // Add useEffect
import PhoneInput from "react-phone-input-2";
import { firestore, functions } from "./FirebaseFrovider";
import "react-phone-input-2/lib/style.css";
import MapComponent, { Coordinate } from "./Map/page";
import { httpsCallable } from "firebase/functions";

interface Address {
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

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: Address | null;
}

interface AreaResult {
  id: string;
  name: string;
  country_name: string;
  country_code: string;
  administrative_division_level_1_name: string;
  administrative_division_level_1_type: string;
  administrative_division_level_2_name: string;
  administrative_division_level_2_type: string;
  administrative_division_level_3_name: string;
  administrative_division_level_3_type: string;
  postal_code: number;
}

const EditAddressModal: React.FC<EditAddressModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
}) => {
  console.log(currentAddress);

  const { user } = useAuth();
  const [formData, setFormData] = useState<Address>({
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

  useEffect(() => {
    if (currentAddress?.id) {
      setFormData(currentAddress);
    }
  }, [currentAddress?.id]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [koordinateReceiver, setKoordinateReceiver] = useState<Coordinate>({
    lat: 0,
    lng: 0,
  });
  // search district/kecamatan
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AreaResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  // Handle search input change
  const handleInputChangeDistrict = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setQuery(value);

    // Filter results based on the query
    // if (value) {
    //   const filteredResults = sampleData.filter((item) =>
    //     item.name.toLowerCase().includes(value.toLowerCase()),
    //   );
    //   setResults(filteredResults);
    // } else {
    //   setResults([]);
    // }
  };

  // call getDistrict
  useEffect(() => {
    if (query !== "") {
      const timer = setTimeout(() => {
        async function getKec() {
          setIsLoading(true);
          const helloWorld = httpsCallable(functions, "getDistrict");
          try {
            const result = await helloWorld({ value: query });
            // console.log(result.data?.items?.areas)
            setResults((result?.data as any)?.items?.areas ?? []);
          } catch (error) {
            console.error("Error calling function:", error);
            setResults([]);
          }
          setIsLoading(false);
        }
        getKec();
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [query]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling
    }

    // Cleanup function to re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      receiverPhone: value,
    }));
    if (errors.receiverPhone) {
      setErrors((prev) => ({ ...prev, receiverPhone: "" }));
    }
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!formData.receiverName) newErrors.receiverName = "Name is required.";
    if (!formData.receiverPhone) newErrors.receiverPhone = "Phone is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.district) newErrors.district = "City is required.";
    if (!formData.postalCode) newErrors.postalCode = "Postal Code is required.";
    return newErrors;
  };

  const validateCoordinate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!koordinateReceiver.lat || !koordinateReceiver.lng)
      newErrors.koordinate = "Coordinate is required.";
    return newErrors;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form and coordinate
    const formErrors = validateForm();
    const coordinateErrors = validateCoordinate();

    // Combine errors (provide fallback empty objects to avoid spread errors)
    const combinedErrors = {
      ...(formErrors || {}),
      ...(coordinateErrors || {}),
    };

    // Set combined errors
    setErrors(combinedErrors);

    // Check if there are no errors
    if (Object.keys(combinedErrors).length === 0) {
      try {
        if (!user) throw new Error("User is not authenticated.");

        const addressCollection = collection(
          firestore,
          `customer/${user.uid}/address`,
        );

        if (currentAddress?.id) {
          // Update existing address
          const addressDoc = doc(
            firestore,
            `customer/${user.uid}/address/${currentAddress.id}`,
          );
          await setDoc(
            addressDoc,
            { ...formData, koordinateReceiver },
            { merge: true },
          );
        } else {
          // Add new address
          const addAddress = await addDoc(addressCollection, formData);
          const addressDoc = doc(
            firestore,
            `customer/${user.uid}/address/${addAddress.id}`,
          );
          await setDoc(
            addressDoc,
            { ...formData, id: addAddress.id, koordinateReceiver },
            { merge: true },
          );
        }

        onClose(); // Close the modal after saving
      } catch (error) {
        console.error("Error saving address to Firestore:", error);
        alert("An error occurred while saving the address.");
      }
    }
  };
  // console.log(errors);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="z-50 flex h-[90vh] max-h-[600px] w-full max-w-lg flex-col rounded-lg bg-white shadow-lg">
        {/* Modal Header */}
        <div className="border-b p-6">
          <h3 className="text-xl font-bold">
            {formData.id ? "Edit Address" : "Add New Address"}
          </h3>
        </div>

        {/* Modal Body (Scrollable Content) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama
              </label>
              <input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
              {errors.receiverName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.receiverName}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nomor Telepon
              </label>
              <PhoneInput
                inputClass="input"
                inputStyle={{ width: "100%" }}
                country={"id"}
                value={formData.receiverPhone.replace("+", "")}
                onChange={handlePhoneChange}
                enableSearch={true}
                placeholder="Enter phone number"
              />
              {errors.receiverPhone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.receiverPhone}
                </p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <textarea
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* City Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kecamatan
              </label>
              <input
                type="text"
                value={formData?.district}
                // onChange={handleInputChangeDistrict}
                placeholder="Kecamatan"
                disabled
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative mt-6 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Kecamatan
                </label>
                {/* Search Input */}
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChangeDistrict}
                  placeholder="Search for an area..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Results Dropdown */}
                {(isLoading || results.length > 0) && (
                  <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
                    {/* Loader */}
                    {isLoading && (
                      <div className="flex items-center justify-center p-4">
                        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
                      </div>
                    )}

                    {/* Results (Scrollable) */}
                    {!isLoading && (
                      <div className="max-h-60 overflow-y-auto">
                        {" "}
                        {/* Set max height and enable scrolling */}
                        {results.map((item) => (
                          <div
                            key={item.id}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                district: item?.name,
                                postalCode: item?.postal_code,
                              });
                              setErrors({
                                ...errors,
                                district: "",
                                postalCode: "",
                              });
                              // setQuery(item.name); // Set the input value to the selected result's name
                              setResults([]); // Clear the results
                            }}
                          >
                            <p className="text-sm text-gray-700">{item.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.district && (
                <p className="mt-1 text-sm text-red-600">{errors.district}</p>
              )}
            </div>

            {/* Postal Code Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
              )}
            </div>

            {/* Map Component */}
            <div>
              <MapComponent
                setKoordinateReceiver={setKoordinateReceiver}
                koordinateReceiver={koordinateReceiver}
                setErrors={setErrors}
                errors={errors}
              />
              {errors.koordinate && (
                <p className="mt-1 text-sm text-red-600">{errors.koordinate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer (Fixed Buttons) */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="w-full rounded-lg bg-green-600 py-2 text-white hover:bg-green-700"
            >
              Simpan
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-gray-600 py-2 text-white hover:bg-gray-700"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAddressModal;
