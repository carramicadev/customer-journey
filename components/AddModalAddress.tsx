"use client";

import { useAuth } from "@/context/AuthContext";

import React, { useState, useEffect } from "react"; // Add useEffect
import PhoneInput from "react-phone-input-2";
import { firestore, functions } from "./FirebaseProvider";
import "react-phone-input-2/lib/style.css";
import MapComponent, { Coordinate } from "./Map/page";
import { httpsCallable } from "firebase/functions";
import { ContactInfo } from "@/types/contact-info";

interface Address {
  id: string;
  name: string;
  phone: string;

  address: string; // 🔥 alamat manual
  pinAddress: string; // 🔥 TAMBAH INI (hasil pin point)

  district: string;
  postalCode: string;
  coordinate: {
    lat: number;
    lng: number;
  };
  type?: "sender" | "receiver" | "both";
}

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: Address | null;
  onSave?: (data: ContactInfo) => Promise<void>;
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
  onSave,
}) => {
  // console.log(currentAddress);
  const [isSelecting, setIsSelecting] = useState(false);

  const { user } = useAuth();
  const [formData, setFormData] = useState<Address>({
    id: "",
    name: "",
    phone: "",
    address: "",
    pinAddress: "",
    district: "",
    postalCode: "",
    coordinate: {
      lat: 0,
      lng: 0,
    },
    type: "both",
  });

  useEffect(() => {
    if (currentAddress) {
      setFormData(currentAddress);

      // 🔥 TAMBAH INI
      setQuery(currentAddress.district || "");
    } else {
      setFormData({
        id: "",
        name: "",
        phone: "",
        address: "",
        pinAddress: "",
        district: "",
        postalCode: "",
        coordinate: { lat: 0, lng: 0 },
        type: "both",
      });

      setQuery(""); // 🔥 reset query
    }
  }, [currentAddress]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [coordinate, setCoordinate] = useState<Coordinate>({
  //   lat: 0,
  //   lng: 0,
  // });
  // search district/kecamatan
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AreaResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  // Handle search input change
  const handleInputChangeDistrict = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    // 🔥 JIKA SEDANG SELECT, STOP TOTAL
    if (isSelecting) return;

    setQuery(value);
  };

  const isQueryLocked = Boolean(formData.district);

  // call getDistrict
  useEffect(() => {
    // 🔥 STOP TOTAL JIKA SEDANG SELECT
    if (isSelecting) return;

    if (query !== "") {
      const timer = setTimeout(() => {
        async function getKec() {
          setIsLoading(true);
          const helloWorld = httpsCallable(functions, "getDistrict");

          try {
            const result = await helloWorld({ value: query });
            setResults((result?.data as any)?.items?.areas ?? []);
          } catch (error) {
            console.error("Error calling function:", error);
            setResults([]);
          }

          setIsLoading(false);
        }
        getKec();
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query, isSelecting]);

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
      phone: value,
    }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.phone) newErrors.phone = "Phone is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.district) newErrors.district = "City is required.";
    if (!formData.postalCode) newErrors.postalCode = "Postal Code is required.";
    return newErrors;
  };

  const validateCoordinate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (formData.coordinate.lat === 0 || formData.coordinate.lng === 0) {
      newErrors.coordinate = "Coordinate is required.";
    }

    return newErrors;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    const coordinateErrors = validateCoordinate();
    const combinedErrors = { ...formErrors, ...coordinateErrors };

    setErrors(combinedErrors);
    if (Object.keys(combinedErrors).length > 0) return;

    try {
      if (onSave) {
        await onSave({
          ...formData,
          coordinate: formData.coordinate,
        });
      } else {
        console.warn("onSave not provided, skipping callback");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div className="z-50 flex h-[90vh] max-h-[600px] w-full max-w-4xl flex-col rounded-lg bg-white shadow-lg">
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
                value={formData.phone.replace("+", "")}
                onChange={handlePhoneChange}
                enableSearch={true}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
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
                value={formData.address} // alamat manual
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
              {errors.pinAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.pinAddress}</p>
              )}
            </div>

            {/* City Field */}
            <div>
              <div className="relative mt-6 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Kecamatan / Kota / Provinsi / Kode Pos
                </label>
                <p className="text-xs text-gray-400">
                  Pilih wilayah, lalu isi alamat lengkap secara manual
                </p>
                {/* Search Input */}
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChangeDistrict}
                  placeholder="Cari kecamatan, kota, provinsi, atau kode pos"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Results Dropdown */}
                {!isQueryLocked && (isLoading || results.length > 0) && (
                  <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
                    {/* Loader */}
                    {isLoading && (
                      <div className="flex items-center justify-center p-4">
                        <div className="size-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
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
                            onClick={async () => {
                              setIsSelecting(true);

                              const fullText = `${item.name}, ${item.administrative_division_level_2_name}, ${item.administrative_division_level_1_name}, Indonesia`;

                              // 1. KUNCI QUERY → tutup dropdown
                              setResults([]);
                              setQuery(item.name); // 🔥 tampilkan hanya nama kecamatan
                              setFormData((prev) => ({
                                ...prev,
                                district: item.name,
                                postalCode: String(item.postal_code),
                              }));

                              try {
                                const geocoder = new google.maps.Geocoder();

                                geocoder.geocode(
                                  { address: fullText },
                                  (results, status) => {
                                    if (
                                      status === "OK" &&
                                      results &&
                                      results[0]
                                    ) {
                                      const location =
                                        results[0].geometry.location;
                                      const lat = location.lat();
                                      const lng = location.lng();

                                      // 🔥 HANYA SET COORDINATE, JANGAN SET ADDRESS
                                      setFormData((prev) => ({
                                        ...prev,
                                        coordinate: {
                                          lat: parseFloat(lat.toFixed(6)),
                                          lng: parseFloat(lng.toFixed(6)),
                                        },
                                      }));
                                    } else {
                                      console.error("Geocode failed:", status);
                                    }
                                  },
                                );
                              } finally {
                                setTimeout(() => {
                                  setIsSelecting(false);
                                }, 300);
                              }
                            }}
                          >
                            <p className="text-sm text-gray-700">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.administrative_division_level_2_name},{" "}
                              {item.administrative_division_level_1_name},{" "}
                              {item.postal_code}
                            </p>
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
                coordinate={formData.coordinate}
                address={formData.pinAddress} // 🔥 TAMBAH INI
                setCoordinate={(c) =>
                  setFormData((p) => ({ ...p, coordinate: c }))
                }
                setAddress={(addr) =>
                  setFormData((p) => ({ ...p, pinAddress: addr }))
                }
                errors={errors}
                setErrors={setErrors}
              />

              {formData.coordinate.lat !== 0 && (
                <div className="mt-4 rounded-md bg-gray-50 p-3 text-sm">
                  <p className="font-semibold text-gray-700">
                    Alamat Terpilih:
                  </p>
                  <p className="text-gray-500">{formData.pinAddress || "-"}</p>

                  <p className="text-xs text-gray-400">
                    Lat: {formData.coordinate.lat}, Lng:{" "}
                    {formData.coordinate.lng}
                  </p>
                </div>
              )}

              {errors.coordinate && (
                <p className="mt-1 text-sm text-red-600">{errors.coordinate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer (Fixed Buttons) */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="w-full rounded-lg bg-primary py-2 text-white hover:bg-green-700"
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
