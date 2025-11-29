export const VENDOR_REWARDS = {
  Amazon: [
    {
      code: 'SHIPF',
      description: 'Free shipping on all orders',
      type: 'shipping',
      value: 1,
      min: 0,
    },
    { code: 'AMZ10', description: '$10 off $50+ order', type: 'dollar', value: 10, min: 50 },
    { code: '5OFF', description: '5% off $20+ order', type: 'percent', value: 0.05, min: 20 },
    { code: '15AMZ', description: '$15 off $75+ order', type: 'dollar', value: 15, min: 75 },
  ],
  Nike: [
    {
      code: 'SHIPF',
      description: 'Free shipping on all orders',
      type: 'shipping',
      value: 1,
      min: 0,
    },
    { code: 'NSPORT', description: '20% off sportswear', type: 'percent', value: 0.2, min: 0 },
    { code: '10OFF', description: '$10 off next purchase', type: 'dollar', value: 10, min: 0 },
    { code: '25APP', description: '25% off in-app purchase', type: 'percent', value: 0.25, min: 0 },
  ],
  Shopify: [
    { code: 'SHIP50', description: '50% off all orders', type: 'shipping', value: 0.5, min: 0 },
    { code: '15NEW', description: '15% off first order', type: 'percent', value: 0.15, min: 0 },
    { code: 'PLAT5', description: '5% off marketplace', type: 'percent', value: 0.05, min: 0 },
    { code: '5DOFF', description: '$5 off any purchase', type: 'dollar', value: 5, min: 0 },
  ],
  Walmart: [
    {
      code: 'FREER',
      description: 'Free shipping on all orders',
      type: 'shipping',
      value: 1,
      min: 0,
    },
    { code: 'GROC5', description: '$5 off grocery order', type: 'dollar', value: 5, min: 0 },
    { code: 'WM30', description: '$30 off $150+ order', type: 'dollar', value: 30, min: 150 },
    { code: '20WM', description: '20% off home goods', type: 'percent', value: 0.2, min: 0 },
  ],
  Target: [
    {
      code: 'FREE',
      description: 'Free shipping on all orders',
      type: 'shipping',
      value: 1,
      min: 0,
    },
    { code: 'RED5', description: '5% off entire cart', type: 'percent', value: 0.05, min: 0 },
    { code: 'T10OFF', description: '$10 off $50+ order', type: 'dollar', value: 10, min: 50 },
    { code: '15HOME', description: '15% off all orders', type: 'percent', value: 0.15, min: 0 },
  ],
  Costco: [
    {
      code: 'SHIPF',
      description: 'Free shipping on all orders',
      type: 'shipping',
      value: 1,
      min: 0,
    },
    { code: 'BULK10', description: '$10 off large bulk items', type: 'dollar', value: 10, min: 0 },
    {
      code: '20CST',
      description: '20% off online exclusives',
      type: 'percent',
      value: 0.2,
      min: 0,
    },
    { code: '50OFF', description: '$50 off $250+ order', type: 'dollar', value: 50, min: 250 },
  ],
};

export const VENDORS = Object.keys(VENDOR_REWARDS);
