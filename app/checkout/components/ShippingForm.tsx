"use client";

import React, { useState } from "react";

interface ShippingFormProps {
  initialData: { name: string; address: string };
  onSave: (data: { name: string; address: string }) => void;
  onCancel: () => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [data, setData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(data);
  };

  return (
    <div className="space-y-4 pt-2">
      <div>
        <label
          className="block text-sm font-medium text-gray-400 mb-1"
          htmlFor="name"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={data.name}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-400 mb-1"
          htmlFor="address"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={data.address}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-300 hover:text-white rounded transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition-colors"
        >
          Save Address
        </button>
      </div>
    </div>
  );
};

export default ShippingForm;
