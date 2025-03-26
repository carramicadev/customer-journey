import React from "react";

export interface CardProps {
  senderName: string;
  senderPhone: string;
  address: string;
  email?: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

const Card: React.FC<CardProps> = ({
  senderName,
  senderPhone,
  address,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`cursor-pointer rounded-lg border p-4 ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
      }`}
      onClick={onSelect}
    >
      <h3 className="font-bold">{senderName}</h3>
      <p className="text-sm text-gray-600">{senderPhone}</p>
      <p className="text-sm text-gray-600">{address}</p>
    </div>
  );
};

export default Card;
