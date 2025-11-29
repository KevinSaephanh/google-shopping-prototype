"use client";

import React, { useState, useCallback } from 'react';
import AccordionItem from './components/AccordionItem'; 
import ShippingForm from './components/ShippingForm'; 
import PaymentForm from './components/PaymentForm'; 
import ItemDeliveryDetail from './components/ItemDeliveryDetail'; 
import Image from 'next/image';

const initialShippingData = { name: "John Doe", address: "123 Main St, OogaBooga, TX 77777" };
const initialPaymentData = { cardType: "Visa", lastFour: "4242", expires: "12/28" };
const initialSummary = { itemsTotal: 0, shippingTotal: 0, totalDiscount: 0, tax: 0, orderTotal: 0 };


const CheckoutPage = () => {
    const [openPanel, setOpenPanel] = useState(3); 
    const [isEditing, setIsEditing] = useState(0); 
    const [shippingData, setShippingData] = useState(initialShippingData);
    const [paymentData, setPaymentData] = useState(initialPaymentData);
    const [summary, setSummary] = useState(initialSummary); 

    const togglePanel = (panelNumber: number) => {
        setIsEditing(0); 
        setOpenPanel(openPanel === panelNumber ? 0 : panelNumber);
    };

    const stableSetSummary = useCallback((newSummary) => {
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
                        isOpen={openPanel === 1}
                        onClick={() => togglePanel(1)}
                    >
                        {isEditing === 1 ? (
                            <ShippingForm 
                                initialData={shippingData}
                                onSave={(data) => {
                                    setShippingData(data);
                                    setIsEditing(0);
                                }}
                                onCancel={() => setIsEditing(0)}
                            />
                        ) : (
                            <div className="space-y-2">
                                <p className="font-semibold text-white">Recipient: {shippingData.name}</p>
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
                        isOpen={openPanel === 2}
                        onClick={() => togglePanel(2)}
                    >
                        {isEditing === 2 ? (
                            <PaymentForm
                                initialData={paymentData}
                                onSave={(data) => {
                                    setPaymentData(data);
                                    setIsEditing(0);
                                }}
                                onCancel={() => setIsEditing(0)}
                            />
                        ) : (
                            <div className="space-y-2">
                                <p className="font-semibold text-white">Method: {paymentData.cardType}</p>
                                <p className="text-gray-400">Card ending: **** {paymentData.lastFour}</p>
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
                        isOpen={openPanel === 3}
                        onClick={() => togglePanel(3)}
                    >
                        <ItemDeliveryDetail setSummary={stableSetSummary} />
                    </AccordionItem>
                </div>

                {/* 2. Right Panel: Order Summary */}
                <div className="w-1/3 bg-gray-700 p-8 rounded-lg self-start sticky top-6">
                    <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                    
                    <div className="space-y-3 pb-4 border-b border-gray-600">
                        <div className="flex justify-between">
                            <span>Items Subtotal:</span>
                            <span className="text-green-400">${summary.itemsTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-400">
                            <span>Coupons Discount:</span>
                            <span>-${summary.totalDiscount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping & handling:</span>
                            <span className="text-green-400">${summary.shippingTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax:</span>
                            <span className="text-green-400">${summary.tax.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        <span className="text-lg font-bold text-green-400">Order Total</span>
                        <span className="text-lg font-bold">${summary.orderTotal.toFixed(2)}</span>
                    </div>

                    <button className="w-full mt-6 py-3 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg transition-colors cursor-pointer">
                        Confirm Purchase
                    </button>
                </div>

            </main>
        </div>
    );
};

export default CheckoutPage;