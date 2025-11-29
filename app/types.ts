export type CouponReward = {
  code: string;
  description: string;
  type: "shipping" | "dollar" | "percent";
  value: number;
  min: number;
};

export type VendorKey =
  | "Amazon"
  | "Nike"
  | "Shopify"
  | "Walmart"
  | "Target"
  | "Costco";

export type VendorRewards = Record<VendorKey, CouponReward[]>;

export type Item = {
  id: number;
  name: string;
  basePrice: number;
  imageUrl: string;
};

export type ShippingData = {
  name: string;
  address: string;
};

export type PaymentData = {
  cardType: string;
  lastFour: string;
  expires: string;
};

export type VendorSection = {
  vendor: VendorKey;
  items: Item[];
  baseShipping: number;
  appliedCoupons: string[];
};

export type AppliedDiscount = {
  code: string;
  amount: number;
  description: string;
};

export type CalculatedItem = Item & {
  priceAfter: number;
  appliedDiscounts: AppliedDiscount[];
};

export type CalculatedVendorSection = Omit<VendorSection, "items"> & {
  items: CalculatedItem[];
  shippingBefore: number;
  shippingAfter: number;
  shippingDiscount: number;
  totalItemsPrice: number;
  finalVendorSubtotal: number;
  vendorDiscount: number;
  appliedVendorDiscounts: AppliedDiscount[];
};

export type Summary = {
  itemsTotal: number;
  shippingTotal: number;
  totalDiscount: number;
  tax: number;
  orderTotal: number;
};

export type PriceCalculationResult = {
  calculatedData: CalculatedVendorSection[];
  summary: Summary;
};
