'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import MemberNav from '@/components/MemberNav';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface Payment {
  id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  payment_date?: string;
  created_at: string;
}

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabaseBrowser.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const res = await fetch('/api/member/payments', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      setPayments(data.payments || []);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <Layout title="Payment History">
      <MemberNav />
      <div className="text-center py-12 text-gray-500">Loading...</div>
    </Layout>
  );

  return (
    <Layout title="Payment History">
      <MemberNav />
      <div className="max-w-3xl mx-auto mt-6">
        <div className="bg-white rounded-lg p-6 border">
          {payments.length === 0 ? (
            <p className="text-gray-500 text-sm">No payment history yet.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-semibold">${payment.amount.toFixed(2)} NZD</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {payment.payment_method.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {payment.payment_date
                        ? new Date(payment.payment_date).toLocaleDateString('en-NZ')
                        : new Date(payment.created_at).toLocaleDateString('en-NZ')}
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    payment.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                    payment.payment_status === 'exempt' ? 'bg-gray-100 text-gray-600' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {payment.payment_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
