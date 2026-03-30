'use client';

import { useEffect, useState } from 'react';

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  payment_date?: string;
  created_at: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetch('/api/member/payments')
      .then(res => res.json())
      .then(data => setPayments(data.payments || []));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Payment History</h1>

      <div className="bg-white rounded-lg p-6">
        {payments.length === 0 ? (
          <p className="text-gray-500">No payment history</p>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="p-4 border rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">${payment.amount.toFixed(2)}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {payment.payment_method.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.payment_date 
                        ? new Date(payment.payment_date).toLocaleDateString()
                        : 'Pending'}
                    </div>
                  </div>
                  
                  <div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      payment.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                      payment.payment_status === 'exempt' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {payment.payment_status}
                    </span>
                    {payment.payment_status === 'paid' && (
                      <button className="ml-2 text-xs text-blue-600 hover:underline">
                        Download Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
