"use client";

import { VENDOR_REWARDS } from '@/app/constants';
import Image from 'next/image';
import React, { useState, useMemo, useEffect } from 'react'; 

// --- INITIAL DATA (Coupons applied automatically) ---
const initialCheckoutData = [
    {
        vendor: "Amazon",
        items: [
            { id: 1, name: "iPhone 17 Pro", basePrice: 1000, imageUrl: '/iphone17.jpg' },
        ],
        baseShipping: 5.99,
        appliedCoupons: ['AMZ10', 'BIG5P', '25OFF', 'SHIPF'], 
    },
    {
        vendor: "Nike",
        items: [
            { id: 2, name: "Nike Shoes", basePrice: 120, imageUrl: '/nike-shoes.webp' },
            { id: 3, name: "Nike Socks", basePrice: 10, imageUrl: '/nike-socks.jpeg' },
        ],
        baseShipping: 7.99,
        appliedCoupons: ['NSPORT', '10OFF', 'FREESHIP', 'NIKE15'], 
    },
];

const calculatePrices = (data) => {
    const calculatedData = [];
    let grandSubtotal = 0;
    let grandShipping = 0;
    let totalDiscount = 0;

    data.forEach(vendorSection => {
        const rewards = VENDOR_REWARDS[vendorSection.vendor] || [];
        let totalItemsPrice = 0;
        let finalShipping = vendorSection.baseShipping;
        let shippingDiscount = 0;
        let vendorDiscount = 0;
        let finalVendorSubtotal = 0;
        
        // 1. Calculate base subtotal (sum all items)
        const calculatedItems = vendorSection.items.map(item => {
            totalItemsPrice += item.basePrice;
            return {
                ...item,
                priceAfter: item.basePrice,
                appliedDiscounts: [],
            };
        });

        finalVendorSubtotal = totalItemsPrice;
        const appliedVendorDiscounts = [];

        // 2. Apply item discounts to the entire vendor subtotal
        vendorSection.appliedCoupons?.forEach(couponCode => {
            const reward = rewards.find(r => r.code === couponCode);
            if (!reward || reward.type === 'shipping') return;

            let discountAmount = 0;
            
            if (finalVendorSubtotal >= reward.min) { 
                if (reward.type === 'percent') {
                    discountAmount = finalVendorSubtotal * reward.value;
                } else if (reward.type === 'dollar') {
                    discountAmount = reward.value;
                }
            }
            
            if (discountAmount > 0) {
                discountAmount = Math.min(discountAmount, finalVendorSubtotal); 
                finalVendorSubtotal -= discountAmount;
                vendorDiscount += discountAmount;
                totalDiscount += discountAmount;
                appliedVendorDiscounts.push({
                    code: couponCode,
                    amount: discountAmount,
                    description: reward.description
                });
            }
        });

        // 3. Calculate shipping discount
        vendorSection.appliedCoupons?.forEach(couponCode => {
            const reward = rewards.find(r => r.code === couponCode);
            if (reward && reward.type === 'shipping') {
                if (reward.value === 1) {
                    shippingDiscount = vendorSection.baseShipping;
                    finalShipping = 0;
                    totalDiscount += shippingDiscount;
                } else if (reward.value < 1) {
                    shippingDiscount = vendorSection.baseShipping * reward.value;
                    finalShipping = vendorSection.baseShipping - shippingDiscount;
                    totalDiscount += shippingDiscount;
                }
            }
        });

        grandSubtotal += finalVendorSubtotal;
        grandShipping += finalShipping;

        calculatedData.push({
            ...vendorSection,
            items: calculatedItems, 
            shippingBefore: vendorSection.baseShipping,
            shippingAfter: finalShipping,
            shippingDiscount: shippingDiscount,
            totalItemsPrice: totalItemsPrice,
            finalVendorSubtotal: finalVendorSubtotal,
            vendorDiscount: vendorDiscount,
            appliedVendorDiscounts: appliedVendorDiscounts,
        });
    });
    
    // Add tax
    const taxRate = 0.0333;
    const tax = grandSubtotal * taxRate;
    const orderTotal = grandSubtotal + grandShipping + tax;

    return {
        calculatedData,
        summary: {
            itemsTotal: grandSubtotal,
            shippingTotal: grandShipping,
            totalDiscount: totalDiscount,
            tax: tax,
            orderTotal: orderTotal,
        }
    };
};


interface ItemDeliveryDetailProps {
    setSummary: (summary: any) => void; 
}

const ItemDeliveryDetail: React.FC<ItemDeliveryDetailProps> = ({ setSummary }) => {
    const [data] = useState(initialCheckoutData);

    const { calculatedData, summary } = useMemo(() => {
        // Calculate prices based on current (fixed) data
        return calculatePrices(data); 
    }, [data]);

    const summaryDependencyString = JSON.stringify([
        summary.itemsTotal, 
        summary.shippingTotal, 
        summary.totalDiscount, 
        summary.tax, 
        summary.orderTotal
    ]);

    useEffect(() => {
        setSummary(summary);
    }, [summaryDependencyString, setSummary]);


    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-400 mb-6">
                Items are categorized by vendor, and all available discounts have been applied.
            </p>

            {/* Vendor/Item Sections */}
            {calculatedData.map((vendorSection, vIndex) => (
                <div key={vIndex} className={`pb-6 ${vIndex < calculatedData.length - 1 ? 'border-b border-gray-700' : ''}`}>
                    
                    {/* Vendor Header */}
                    <h4 className="text-lg font-semibold mb-2">{vendorSection.vendor}</h4>
                    
                    {/* COUPON DISPLAY SECTION */}
                    {vendorSection.appliedCoupons && vendorSection.appliedCoupons.length > 0 && (
                        <div className="flex flex-wrap items-start space-x-2 mb-4">
                            <span className="text-sm text-gray-400 mr-2">Applied Discounts:</span>
                            {vendorSection.appliedCoupons.map(couponCode => {
                                const reward = VENDOR_REWARDS[vendorSection.vendor].find(r => r.code === couponCode);
                                if (!reward) return null;
                                
                                const isShipping = reward.type === 'shipping';
                                let amount = 0;
                                
                                if (isShipping) {
                                    amount = vendorSection.shippingDiscount;
                                } else {
                                    const discountData = vendorSection.appliedVendorDiscounts.find(d => d.code === couponCode);
                                    amount = discountData ? discountData.amount : 0;
                                }
                                
                                // Only show coupons that resulted in a discount (amount > 0)
                                if (amount === 0 && !isShipping) return null;
                                
                                return (
                                    <div 
                                        key={couponCode} 
                                        className={`flex items-center text-xs px-2 py-1 rounded mb-1 ${isShipping ? 'bg-gray-700 text-yellow-400' : 'bg-gray-700 text-green-400'}`}
                                    >
                                        <span className="font-mono mr-1">{couponCode}</span>
                                        <span className="text-gray-400">
                                            ({amount > 0 ? (isShipping ? 'FREE SHIPPING' : `-$${amount.toFixed(2)}`) : reward.description})
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Items within Vendor */}
                    {vendorSection.items.map((item, iIndex) => (
                        <div key={iIndex} className="flex space-x-4 mb-4 items-center">
                            <div className="rounded-lg overflow-hidden flex-shrink-0">
                                {item.imageUrl ? (
                                    <Image 
                                        src={item.imageUrl} 
                                        alt={item.name} 
                                        width={80}
                                        height={80}
                                        className="object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            
                            {/* Item Details */}
                            <div className="flex-grow">
                                <p className="font-medium text-white mb-1">{item.name}</p>
                            </div>

                            {/* Price Details - Only show base price */}
                            <div className="text-right">
                                <p className="text-lg">${item.basePrice.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                    
                    {/* Discount Summary for Vendor */}
                    {vendorSection.vendorDiscount > 0 && (
                        <div className="flex justify-between text-sm mt-2 text-red-400">
                            <span>Vendor Item Discount:</span>
                            <span>-${vendorSection.vendorDiscount.toFixed(2)}</span>
                        </div>
                    )}
                    
                    {/* Vendor Subtotal Line */}
                    <div className="flex justify-between text-base font-semibold mt-2 pt-2 border-t border-gray-700/50">
                        <span>Items Subtotal for {vendorSection.vendor}:</span>
                        <span className={vendorSection.vendorDiscount > 0 ? 'text-green-400' : 'text-white'}>
                            ${vendorSection.finalVendorSubtotal.toFixed(2)}
                        </span>
                    </div>

                    {/* Shipping Footer */}
                    <div className="text-sm mt-2">
                        Shipping & handling: 
                        {vendorSection.shippingDiscount > 0 ? (
                            <>
                                <span className="line-through text-red-400 ml-1">${vendorSection.shippingBefore.toFixed(2)}</span>
                                <span className="text-green-400 ml-1">${vendorSection.shippingAfter.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="ml-1">${vendorSection.shippingAfter.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemDeliveryDetail;