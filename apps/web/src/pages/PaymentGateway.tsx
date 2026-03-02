import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function PaymentGateway() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = params.get('paymentId');
  const amount = params.get('amount') || '0';
  const gateway = params.get('gateway') || 'CCBILL';

  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePay = async () => {
    if (!paymentId) return;
    setProcessing(true);
    try {
      await api.post(`/payments/${paymentId}/simulate-complete`);
      setStatus('success');
      setTimeout(() => navigate('/wallet'), 2000);
    } catch {
      setStatus('failed');
    }
    setProcessing(false);
  };

  if (!paymentId) {
    return (
      <div className="min-h-screen bg-[#15191c] flex items-center justify-center">
        <div className="bg-[#0e1012] rounded-2xl p-8 text-center">
          <p className="text-red-400">Invalid payment session</p>
          <button onClick={() => navigate('/wallet')} className="mt-4 text-blue-400 underline">
            Back to Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#15191c] flex items-center justify-center p-4">
      <div className="bg-[#0e1012] rounded-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Secure Checkout</h1>
          <p className="text-gray-400 text-sm mt-1">via {gateway} (Demo Mode)</p>
        </div>

        <div className="bg-[#1a1d21] rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-white">${Number(amount).toFixed(2)}</p>
          <p className="text-gray-400 text-sm">Total Amount</p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-900 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-green-400 font-medium">Payment Successful!</p>
            <p className="text-gray-400 text-sm mt-1">Redirecting to wallet...</p>
          </div>
        ) : status === 'failed' ? (
          <div className="text-center py-6">
            <p className="text-red-400 font-medium">Payment Failed</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-3 text-blue-400 underline text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Card Number</label>
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1d21] text-white border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Expiry</label>
                <input
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1d21] text-white border border-gray-700 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">CVV</label>
                <input
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  type="password"
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1d21] text-white border border-gray-700 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 disabled:opacity-50"
            >
              {processing ? 'Processing...' : `Pay $${Number(amount).toFixed(2)}`}
            </button>
            <p className="text-xs text-gray-500 text-center">
              This is a demo payment gateway. No real charges will be made.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
