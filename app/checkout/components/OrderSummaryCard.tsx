import React from 'react';
import { Summary } from '@/app/types';

interface OrderSummaryCardProps {
  summary: Summary;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ summary }) => {
  return (
    <div className="w-1/3 p-6 bg-gray-800 rounded-xl shadow-2xl h-fit sticky top-6">
      <h3 className="text-xl font-bold mb-6 text-white border-b border-gray-700 pb-3">
        Order Summary
      </h3>

      <div className="space-y-3">
        {/* Items Subtotal */}
        <div className="flex justify-between">
          <span className="text-red-400">Items Subtotal:</span>
          <span className="font-medium text-red-400">
            ${summary.itemsTotal.toFixed(2)}
          </span>
        </div>

        {/* Coupons Discount */}
        <div className="flex justify-between">
          <span className="text-green-400 font-semibold">Coupons Discount:</span>
          <span className="font-semibold text-green-400">
            -${summary.totalDiscount.toFixed(2)}
          </span>
        </div>

        {/* Shipping & Handling */}
        <div className="flex justify-between">
          <span className="text-red-400">Shipping & handling:</span>
          <span className="font-medium text-red-400">
            ${summary.shippingTotal.toFixed(2)}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between border-b border-gray-700 pb-3">
          <span className="text-red-400">Tax:</span>
          <span className="font-medium text-red-400">
            ${summary.tax.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Order Total */}
      <div className="flex justify-between pt-4">
        <span className="text-xl font-extrabold text-red-400">Order Total</span>
        <span className="text-xl font-extrabold text-red-400">
          ${summary.orderTotal.toFixed(2)}
        </span>
      </div>

      <button className="mt-8 w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition duration-200 shadow-lg shadow-green-900/50">
        Confirm Purchase
      </button>
    </div>
  );
};

export default OrderSummaryCard;