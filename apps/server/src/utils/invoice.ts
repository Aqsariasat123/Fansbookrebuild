import type { Payment, User } from '@prisma/client';

export interface Receipt {
  receiptNumber: string;
  date: string;
  amount: number;
  gateway: string;
  status: string;
  userName: string;
  userEmail: string;
}

export function generateReceipt(payment: Payment, user: User): Receipt {
  const suffix = payment.id.slice(-8).toUpperCase();

  return {
    receiptNumber: `FB-${suffix}`,
    date: payment.createdAt.toISOString(),
    amount: payment.amount,
    gateway: payment.gateway,
    status: payment.status,
    userName: user.displayName,
    userEmail: user.email,
  };
}
