"use client";

import React, { useState } from 'react';

interface PaymentFormProps {
    initialData: { cardType: string, lastFour: string, expires: string };
    onSave: (data: { cardType: string, lastFour: string, expires: string }) => void;
    onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ initialData, onSave, onCancel }) => {
    const [data, setData] = useState(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(data);
    };

    return (
        <div className="space-y-4 pt-2">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="cardType">Card Type</label>
                <select
                    id="cardType"
                    name="cardType"
                    value={data.cardType}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">Amex</option>
                </select>
            </div>
            <div className="flex space-x-4">
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="lastFour">Last Four Digits</label>
                    <input
                        type="text"
                        id="lastFour"
                        name="lastFour"
                        maxLength={4}
                        value={data.lastFour}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="expires">Expires (MM/YY)</label>
                    <input
                        type="text"
                        id="expires"
                        name="expires"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={data.expires}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
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
                    Save Payment
                </button>
            </div>
        </div>
    );
};

export default PaymentForm;