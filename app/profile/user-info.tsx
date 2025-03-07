"use client";
import React, { useState } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const UserInfoPage: React.FC = () => {
  const [user, setUser] = useState<User>({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+62 823 7647 4634",
    address: "Permata Hijau 2, Blok B 82",
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you can add logic to save the updated user info to your backend
    console.log("Updated User Info:", user);
  };

  return (
    // <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
    <div className="max-w w-full ">
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-gray-900">{user.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-gray-900">{user.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-gray-900">{user.phone}</p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-gray-900">{user.address}</p>
          )}
        </div>
      </div>

      {/* Edit/Save Button */}
      <div className="mt-6">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </div>
    </div>
    // </div>
  );
};

export default UserInfoPage;
