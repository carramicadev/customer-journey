"use client";
import Loader from "@/components/AppLoading";
import { firestore } from "@/components/FirebaseFrovider";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import the styles

interface User {
  senderName: string;
  email: string;
  senderPhone: string;
  address: string;
}

const UserInfoPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<User>({
    senderName: "",
    email: "",
    senderPhone: "",
    address: "",
  });
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state

  useEffect(() => {
    if (user?.uid) {
      const fetchUserData = async () => {
        setIsLoading(true);
        const userDocRef = doc(firestore, "customer", user?.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUserInfo(userData); // Update state with fetched data
        } else {
          setIsEditing(true);
          console.log("No user data found in Firestore.");
        }

        setIsLoading(false);
      };

      fetchUserData();
    }
  }, [user?.uid]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({}); // Track validation errors

  // Handle input change for standard fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    // Clear the error for the field when the userInfo starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Handle phone input change
  const handlePhoneChange = (value: string) => {
    setUserInfo((prevUser) => ({
      ...prevUser,
      senderPhone: value, // Add the "+" prefix
    }));

    // Clear the phone error when the userInfo starts typing
    if (errors.senderPhone) {
      setErrors((prevErrors) => ({ ...prevErrors, senderPhone: "" }));
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userInfo.senderName) newErrors.senderName = "Name is required.";
    // if (!userInfo.email) newErrors.email = "Email is required.";
    if (!userInfo.senderPhone) newErrors.senderPhone = "Phone is required.";
    if (!userInfo.address) newErrors.address = "Address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return; // Exit if validation fails

    if (!user?.uid) return; // Exit if user is not authenticated

    setIsLoading(true);
    const userDocRef = doc(firestore, "customer", user?.uid);

    try {
      await setDoc(userDocRef, userInfo, { merge: true }); // Update Firestore document
      console.log("User data saved to Firestore.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  //   console.l
  //   useEffect(()=>{
  //       if(!)
  //   })
  if (isLoading) {
    return <Loader size="md" color="green" />;
  }
  return (
    <div className="max-w w-full">
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          {isEditing ? (
            <>
              <input
                type="text"
                name="senderName"
                value={userInfo.senderName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.senderName && (
                <p className="mt-1 text-sm text-red-600">{errors.senderName}</p>
              )}
            </>
          ) : (
            <p className="mt-1 text-gray-900">{userInfo.senderName}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          {isEditing ? (
            <>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </>
          ) : (
            <p className="mt-1 text-gray-900">{userInfo.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          {isEditing ? (
            <>
              <PhoneInput
                inputClass="input"
                inputStyle={{ width: "100%" }}
                country={"id"} // Set a default country
                value={userInfo.senderPhone.replace("+", "")} // Remove the "+" prefix for the library
                onChange={handlePhoneChange}
                enableSearch={true} // Enable search in the country dropdown
                placeholder="Enter phone number"
              />
              {errors.senderPhone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.senderPhone}
                </p>
              )}
            </>
          ) : (
            <p className="mt-1 text-gray-900">{userInfo.senderPhone}</p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          {isEditing ? (
            <>
              <input
                type="text"
                name="address"
                value={userInfo.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </>
          ) : (
            <p className="mt-1 text-gray-900">{userInfo.address}</p>
          )}
        </div>
      </div>

      {/* Edit/Save Button */}
      <div className="mt-6">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="w-full rounded-lg bg-green-600 py-2 text-white hover:bg-green-700"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full rounded-lg bg-green-600 py-2 text-white hover:bg-green-700"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default UserInfoPage;
