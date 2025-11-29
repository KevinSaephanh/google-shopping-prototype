"use client";

import React, { useState, useCallback } from "react";
import AccordionItem from "./components/AccordionItem";
import ShippingForm from "./components/ShippingForm";
import PaymentForm from "./components/PaymentForm";
import ItemDeliveryDetail from "./components/ItemDeliveryDetail";
import Image from "next/image";
import { Summary, ShippingData, PaymentData } from "@/app/types";
import OrderSummaryCard from "./components/OrderSummaryCard";

const initialShippingData: ShippingData = {
  name: "John Doe",
  address: "123 Main St, OogaBooga, TX 77777",
};
const initialPaymentData: PaymentData = {
  cardType: "Visa",
  lastFour: "4242",
  expires: "12/28",
};
const initialSummary: Summary = {
  itemsTotal: 0,
  shippingTotal: 0,
  totalDiscount: 0,
  tax: 0,
  orderTotal: 0,
};

const CheckoutPage = () => {
  const [openPanels, setOpenPanels] = useState<number[]>([3]);
  const [isEditing, setIsEditing] = useState<number>(0);
  const [shippingData, setShippingData] =
    useState<ShippingData>(initialShippingData);
  const [paymentData, setPaymentData] =
    useState<PaymentData>(initialPaymentData);
  const [summary, setSummary] = useState<Summary>(initialSummary);

  /**
   * Toggles the open state of a specific panel.
   * If the panel is open, it closes it; if closed, it opens it.
   */
  const togglePanel = (panelNumber: number) => {
    setIsEditing(0);
    setOpenPanels((prevOpenPanels) => {
      if (prevOpenPanels.includes(panelNumber)) {
        // Panel is currently open, so close it (remove from array)
        return prevOpenPanels.filter((p) => p !== panelNumber);
      } else {
        // Panel is currently closed, so open it (add to array)
        return [...prevOpenPanels, panelNumber];
      }
    });
  };

  const stableSetSummary = useCallback((newSummary: Summary) => {
    setSummary(newSummary);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
        <div className="flex items-center space-x-2">
          <Image
            src="/google-shopping-logo.png"
            alt="Google Shopping Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <h1 className="text-xl font-semibold">Google Shopping</h1>
        </div>
        <h2 className="text-2xl font-bold">Checkout</h2>
      </header>

      <main className="flex max-w-6xl mx-auto space-x-8">
        {/* 1. Left Panel: Checkout Steps (Accordion Group) */}
        <div className="w-2/3 space-y-4">
          {/* Step 1: Shipping Address */}
          <AccordionItem
            step={1}
            title="Shipping Address"
            summaryContent={shippingData.address}
            isOpen={openPanels.includes(1)}
            onClick={() => togglePanel(1)}
          >
            {isEditing === 1 ? (
              <ShippingForm
                initialData={shippingData}
                onSave={(data: ShippingData) => {
                  // Type the onSave callback argument
                  setShippingData(data);
                  setIsEditing(0);
                }}
                onCancel={() => setIsEditing(0)}
              />
            ) : (
              <div className="space-y-2">
                <p className="font-semibold text-white">
                  Recipient: {shippingData.name}
                </p>
                <p className="text-gray-400">Address: {shippingData.address}</p>
                <p
                  className="text-sm text-purple-400 cursor-pointer hover:text-purple-300 pt-2"
                  onClick={() => setIsEditing(1)}
                >
                  Edit Address
                </p>
              </div>
            )}
          </AccordionItem>

          {/* Step 2: Payment Information */}
          <AccordionItem
            step={2}
            title="Payment Information"
            summaryContent={`${paymentData.cardType} ending in ${paymentData.lastFour}`}
            isOpen={openPanels.includes(2)}
            onClick={() => togglePanel(2)}
          >
            {isEditing === 2 ? (
              <PaymentForm
                initialData={paymentData}
                onSave={(data: PaymentData) => {
                  // Type the onSave callback argument
                  setPaymentData(data);
                  setIsEditing(0);
                }}
                onCancel={() => setIsEditing(0)}
              />
            ) : (
              <div className="space-y-2">
                <p className="font-semibold text-white">
                  Method: {paymentData.cardType}
                </p>
                <p className="text-gray-400">
                  Card ending: **** {paymentData.lastFour}
                </p>
                <p className="text-gray-400">Expires: {paymentData.expires}</p>
                <p
                  className="text-sm text-purple-400 cursor-pointer hover:text-purple-300 pt-2"
                  onClick={() => setIsEditing(2)}
                >
                  Change Payment
                </p>
              </div>
            )}
          </AccordionItem>

          {/* Step 3: Items and Delivery (Passes stableSetSummary) */}
          <AccordionItem
            step={3}
            title="Items and Delivery"
            // Display the item count from summary state
            summaryContent={`Items ($${summary.itemsTotal.toFixed(2)})`}
            isOpen={openPanels.includes(3)}
            onClick={() => togglePanel(3)}
          >
            {/* setSummary prop type must be defined in ItemDeliveryDetailProps as (newSummary: Summary) => void */}
            <ItemDeliveryDetail setSummary={stableSetSummary} />
          </AccordionItem>
        </div>

        {/* 2. Right Panel: Order Summary */}
        <OrderSummaryCard summary={summary} />
      </main>
    </div>
  );
};

export default CheckoutPage;