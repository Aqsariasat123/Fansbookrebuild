import { z } from 'zod';

export const COIN_PACKAGES = [
  { id: 'pack_100', coins: 100, price: 100, currency: 'EUR', label: '100 Coins' },
  { id: 'pack_250', coins: 250, price: 250, currency: 'EUR', label: '250 Coins', tag: 'Popular' },
  { id: 'pack_500', coins: 500, price: 500, currency: 'EUR', label: '500 Coins' },
  {
    id: 'pack_1000',
    coins: 1000,
    price: 1000,
    currency: 'EUR',
    label: '1,000 Coins',
    tag: 'Best Value',
  },
  { id: 'pack_2500', coins: 2500, price: 2500, currency: 'EUR', label: '2,500 Coins' },
  { id: 'pack_5000', coins: 5000, price: 5000, currency: 'EUR', label: '5,000 Coins', tag: 'VIP' },
];

export const purchaseSchema = z.object({ packageId: z.string().min(1) });
export const customPurchaseSchema = z.object({ coins: z.number().int().min(1).max(100000) });

export const VALID_TX_TYPES = [
  'DEPOSIT',
  'SUBSCRIPTION',
  'TIP_SENT',
  'TIP_RECEIVED',
  'PPV_PURCHASE',
  'PPV_EARNING',
  'WITHDRAWAL',
  'REFUND',
  'MARKETPLACE_PURCHASE',
  'MARKETPLACE_EARNING',
] as const;
