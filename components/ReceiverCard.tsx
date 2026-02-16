import React from "react";

interface ReceiverCardProps {
  recipient: {
    name: string;
    phone: string;
    address: string;
    postalCode: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

const ReceiverCard: React.FC<ReceiverCardProps> = ({
  recipient,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`cursor-pointer rounded-lg border p-4 ${
        isSelected ? "border-primary bg-green-50" : "border-gray-200 bg-white"
      }`}
      onClick={onSelect}
    >
      <h3 className="font-bold">{recipient?.name}</h3>
      <p className="text-sm text-gray-600">{recipient?.phone}</p>
      <p className="text-sm text-gray-600">
        {recipient?.address}, {recipient?.postalCode}
      </p>
    </div>
  );
};

export default ReceiverCard;
