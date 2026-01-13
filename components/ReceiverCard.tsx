import React from "react";

interface ReceiverCardProps {
  recipient: {
    receiverName: string;
    receiverPhone: string;
    address: string;
    postalCode: number;
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
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
      }`}
      onClick={onSelect}
    >
      <h3 className="font-bold">{recipient?.receiverName}</h3>
      <p className="text-sm text-gray-600">{recipient?.receiverPhone}</p>
      <p className="text-sm text-gray-600">
        {recipient?.address}, {recipient?.postalCode}
      </p>
    </div>
  );
};

export default ReceiverCard;
