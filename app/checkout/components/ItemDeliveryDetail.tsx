"use client";

import Image from "next/image";
import React, { useState, useMemo, useEffect } from "react";
import { VENDOR_REWARDS } from "@/app/constants";
import {
  VendorSection,
  PriceCalculationResult,
  AppliedDiscount,
  CalculatedItem,
  CalculatedVendorSection,
  CouponReward,
  Summary,
} from "@/app/types";

const initialCheckoutData: VendorSection[] = [
  {
    vendor: "Amazon",
    items: [
      {
        id: 1,
        name: "iPhone 17 Pro",
        basePrice: 1000,
        imageUrl: "/iphone17.jpg",
      },
    ],
    baseShipping: 5.99,
    appliedCoupons: ["SHIPF", "15AMZ", "5OFF"],
  },
  {
    vendor: "Nike",
    items: [
      {
        id: 2,
        name: "Nike Shoes",
        basePrice: 120,
        imageUrl: "/nike-shoes.webp",
      },
      {
        id: 3,
        name: "Nike Socks",
        basePrice: 10,
        imageUrl: "/nike-socks.jpeg",
      },
    ],
    baseShipping: 7.99,
    appliedCoupons: ["NSPORT", "25APP"],
  },
];

/**
 * Calculates the final prices, discounts, and totals for all vendor sections.
 * @param data The initial VendorSection data.
 * @returns The comprehensive PriceCalculationResult.
 */
const calculatePrices = (data: VendorSection[]): PriceCalculationResult => {
  const calculatedData: CalculatedVendorSection[] = [];
  let grandSubtotal: number = 0;
  let grandShipping: number = 0;
  let totalDiscount: number = 0;

  data.forEach((vendorSection) => {
    // Safe indexing now that vendorSection.vendor is typed as VendorKey
    const rewards: CouponReward[] = VENDOR_REWARDS[vendorSection.vendor] || [];
    let totalItemsPrice: number = 0;
    let finalShipping: number = vendorSection.baseShipping;
    let shippingDiscount: number = 0;
    let vendorDiscount: number = 0;
    let finalVendorSubtotal: number = 0;

    // 1. Calculate base subtotal (sum all items)
    const calculatedItems: CalculatedItem[] = vendorSection.items.map(
      (item) => {
        totalItemsPrice += item.basePrice;
        return {
          ...item,
          priceAfter: item.basePrice,
          appliedDiscounts: [],
        };
      },
    );

    finalVendorSubtotal = totalItemsPrice;
    // Use the strongly typed AppliedDiscount[]
    const appliedVendorDiscounts: AppliedDiscount[] = [];

    // 2. Apply item discounts to the entire vendor subtotal
    vendorSection.appliedCoupons?.forEach((couponCode) => {
      const reward = rewards.find((r) => r.code === couponCode);
      // Reward type check now uses the CouponReward type
      if (!reward || reward.type === "shipping") return;

      let discountAmount: number = 0;

      if (finalVendorSubtotal >= reward.min) {
        if (reward.type === "percent") {
          discountAmount = finalVendorSubtotal * reward.value;
        } else if (reward.type === "dollar") {
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
          description: reward.description,
        });
      }
    });

    // 3. Calculate shipping discount
    vendorSection.appliedCoupons?.forEach((couponCode) => {
      const reward = rewards.find((r) => r.code === couponCode);
      if (reward && reward.type === "shipping") {
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

    // Push the fully typed CalculatedVendorSection object
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
  const taxRate: number = 0.0333;
  const tax: number = grandSubtotal * taxRate;
  const orderTotal: number = grandSubtotal + grandShipping + tax;

  return {
    calculatedData,
    summary: {
      itemsTotal: grandSubtotal,
      shippingTotal: grandShipping,
      totalDiscount: totalDiscount,
      tax: tax,
      orderTotal: orderTotal,
    },
  };
};

interface ItemDeliveryDetailProps {
  setSummary: (summary: Summary) => void;
}

// --- Component (Typed) ---
const ItemDeliveryDetail: React.FC<ItemDeliveryDetailProps> = ({
  setSummary,
}) => {
  const [data] = useState<VendorSection[]>(initialCheckoutData);

  const { calculatedData, summary } = useMemo<PriceCalculationResult>(() => {
    return calculatePrices(data);
  }, [data]);

  const summaryDependencyString: string = JSON.stringify([
    summary.itemsTotal,
    summary.shippingTotal,
    summary.totalDiscount,
    summary.tax,
    summary.orderTotal,
  ]);

  useEffect(() => {
    // Update the parent component's summary state
    setSummary(summary);
  }, [summaryDependencyString, setSummary]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-400 mb-6">
        Items are categorized by vendor, and all available discounts have been
        applied.
      </p>

      {/* Vendor/Item Sections */}
      {calculatedData.map((vendorSection, vIndex) => (
        <div
          key={vIndex}
          className={`pb-6 ${vIndex < calculatedData.length - 1 ? "border-b border-gray-700" : ""}`}
        >
          {/* Vendor Header */}
          <h4 className="text-lg font-semibold mb-2">{vendorSection.vendor}</h4>

          {/* COUPON DISPLAY SECTION */}
          {vendorSection.appliedCoupons &&
            vendorSection.appliedCoupons.length > 0 && (
              <div className="flex flex-wrap items-start space-x-2 mb-4">
                <span className="text-sm text-gray-400 mr-2">
                  Applied Discounts:
                </span>
                {vendorSection.appliedCoupons.map((couponCode) => {
                  const reward: CouponReward | undefined = VENDOR_REWARDS[
                    vendorSection.vendor
                  ].find((r) => r.code === couponCode);
                  if (!reward) return null;

                  const isShipping: boolean = reward.type === "shipping";
                  let amount: number = 0;

                  if (isShipping) {
                    amount = vendorSection.shippingDiscount;
                  } else {
                    // Explicitly type discountData for safety
                    const discountData: AppliedDiscount | undefined =
                      vendorSection.appliedVendorDiscounts.find(
                        (d) => d.code === couponCode,
                      );
                    amount = discountData ? discountData.amount : 0;
                  }

                  // Only render coupons that resulted in a discount OR are free shipping
                  if (amount === 0 && !isShipping) return null;

                  return (
                    <div key={couponCode} className="relative mb-1 group">
                      {/* Coupon Tag - Added hover effect */}
                      <div
                        className={`flex items-center text-xs px-2 py-1 rounded cursor-pointer transition-colors ${isShipping ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-gray-700 text-green-400 hover:bg-gray-600"}`}
                      >
                        <span className="font-mono mr-1">{couponCode}</span>
                        <span className="text-gray-400">
                          (
                          {amount > 0
                            ? isShipping
                              ? "Applied"
                              : `-$${amount.toFixed(2)}`
                            : "Eligible"}
                          )
                        </span>
                      </div>

                      {/* 2. Tooltip Content */}
                      <div
                        className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 z-20 
                                                       opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                                                       pointer-events-none w-max max-w-xs p-3 bg-gray-800 border border-gray-700 text-xs text-white rounded-lg shadow-xl"
                      >
                        <p className="font-semibold mb-1 text-purple-300">
                          Reward Details:
                        </p>
                        {reward.description}
                        {reward.min > 0 && (
                          <p className="mt-1 text-gray-400 italic">
                            Min Purchase: ${reward.min.toFixed(2)}
                          </p>
                        )}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-[8px] border-x-[8px] border-solid border-transparent border-t-gray-800 bottom-[-8px]"></div>
                      </div>
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
                  <div className="w-[80px] h-[80px] bg-gray-700 flex items-center justify-center text-xs text-gray-400 rounded-lg">
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
            <span
              className={
                vendorSection.vendorDiscount > 0
                  ? "text-green-400"
                  : "text-white"
              }
            >
              ${vendorSection.finalVendorSubtotal.toFixed(2)}
            </span>
          </div>

          {/* Shipping Footer */}
          <div className="text-sm mt-2">
            Shipping & handling:
            {vendorSection.shippingDiscount > 0 ? (
              <>
                <span className="line-through text-red-400 ml-1">
                  ${vendorSection.shippingBefore.toFixed(2)}
                </span>
                <span className="text-green-400 ml-1">
                  ${vendorSection.shippingAfter.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="ml-1">
                ${vendorSection.shippingAfter.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemDeliveryDetail;
