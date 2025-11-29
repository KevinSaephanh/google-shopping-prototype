"use client";

import React, { useState } from "react";
import Image from "next/image";
import { VENDOR_REWARDS, VENDORS } from "../constants";
import { CouponReward, VendorKey } from "@/app/types";

const VendorManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [syncedVendors, setSyncedVendors] = useState<VendorKey[]>([
    "Amazon",
    "Nike",
    "Shopify",
    "Walmart",
  ] as VendorKey[]);
  const [selectedVendor, setSelectedVendor] = useState<VendorKey>("Amazon");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentRewards: CouponReward[] = VENDOR_REWARDS[selectedVendor] || [];

  // filteredVendors implicitly remains VendorKey[]
  const filteredVendors = VENDORS.filter(
    (vendor) =>
      vendor.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !syncedVendors.includes(vendor as VendorKey),
  ) as VendorKey[];

  const handleCopy = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedCode(code);
        setTimeout(() => {
          setCopiedCode(null);
        }, 2000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  const handleVendorSync = (vendorName: VendorKey) => {
    // Type added to function argument
    if (!syncedVendors.includes(vendorName)) {
      setSyncedVendors([...syncedVendors, vendorName]);
      setSearchTerm("");
    }
  };

  const handleVendorRemove = (vendorName: VendorKey) => {
    // Type added to function argument
    const newVendors = syncedVendors.filter((name) => name !== vendorName);
    setSyncedVendors(newVendors);
    if (vendorName === selectedVendor) {
      setSelectedVendor(newVendors[0] || ("" as VendorKey)); // Cast back to VendorKey
    }
  };

  const handleVendorClick = (vendorName: VendorKey) => {
    // Type added to function argument
    setSelectedVendor(vendorName);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* --- Header and Search Bar --- */}
      <header className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
        <div className="flex items-center space-x-2">
          <Image
            src="/google-shopping-logo.png"
            alt="Google Shopping Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <h1 className="text-2xl font-semibold pl-2 w-60">Google Shopping</h1>
        </div>
        <div className="relative w-full ml-6">
          <input
            type="text"
            placeholder="Search vendors to sync"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-4 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-base"
          />
          {/* Search Results Dropdown */}
          {searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-60 overflow-y-auto">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor: VendorKey) => (
                  <div
                    key={vendor}
                    className="p-3 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                    onClick={() => handleVendorSync(vendor)}
                  >
                    <span>{vendor}</span>
                    <span className="text-sm text-green-400">Sync</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-400">
                  {syncedVendors.includes(searchTerm as VendorKey)
                    ? `${searchTerm} is already synced.`
                    : "No vendors found."}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex max-w-5xl mx-auto border-t border-gray-800 pt-6">
        {/* My Vendor List */}
        <section className="w-1/3 pr-6">
          <h2 className="text-xl font-bold mb-4">My Vendors</h2>
          <div className="space-y-3">
            {syncedVendors.map((vendor: VendorKey, index: number) => (
              <div
                key={index}
                className={`flex justify-between items-center text-lg font-medium cursor-pointer transition-colors p-1 rounded-md ${
                  vendor === selectedVendor
                    ? "text-purple-400 bg-gray-800"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <span
                  onClick={() => handleVendorClick(vendor)}
                  className="flex-grow"
                >
                  {vendor}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVendorRemove(vendor);
                  }}
                  className="text-gray-500 hover:text-red-500 ml-3 p-1 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label={`Remove ${vendor}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="border-l border-gray-700 h-auto mx-4"></div>

        {/* --- Rewards/Coupons Section --- */}
        <section className="w-2/3 pl-6">
          <h2 className="text-xl font-bold mb-4">
            Rewards/Coupons for {selectedVendor || "No Vendor Selected"}
          </h2>
          <div className="space-y-4">
            {currentRewards.length > 0 ? (
              currentRewards.map((reward: CouponReward) => (
                <div
                  key={reward.code}
                  className="p-4 bg-gray-800 rounded-lg shadow-lg flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <div className="text-2xl font-extrabold text-white tracking-wider mb-1">
                      {reward.code}
                    </div>
                    <div className="text-sm text-gray-300">
                      {reward.description}
                    </div>
                  </div>

                  {/* Copy Button and Checkmark Cue */}
                  <div className="relative">
                    {copiedCode === reward.code ? (
                      <div className="p-3 text-green-400 transition-colors duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    ) : (
                      <button
                        className="p-3 text-gray-400 hover:text-white transition-colors"
                        onClick={() => handleCopy(reward.code)}
                        aria-label={`Copy coupon code ${reward.code}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-3 3h4a2 2 0 002-2v-4a2 2 0 00-2-2h-8a2 2 0 00-2 2v4a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 p-4 bg-gray-800 rounded-lg">
                No active rewards found for {selectedVendor}.
              </p>
            )}
          </div>
        </section>
      </main>

      {/* --- Footer/Info Bar --- */}
      <footer className="mt-8 pt-4 text-center text-sm text-gray-500 max-w-5xl mx-auto border-t border-gray-800">
        Linked vendors automatically sync eligible rewards to appropriate items.
      </footer>
    </div>
  );
};

export default VendorManagementPage;
