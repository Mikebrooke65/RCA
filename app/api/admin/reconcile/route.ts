import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

interface ASBTransaction {
  date: string;
  amount: number;
  reference: string;
  particulars: string;
}

function parseASBCSV(csvText: string): ASBTransaction[] {
  const lines = csvText.split('\n').slice(1); // Skip header
  return lines
    .filter(line => line.trim())
    .map(line => {
      const [date, , , amount, , reference, particulars] = line.split(',');
      return {
        date: date.trim(),
        amount: parseFloat(amount.trim()),
        reference: reference?.trim() || '',
        particulars: particulars?.trim() || '',
      };
    });
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin auth check
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const csvText = await file.text();
    const transactions = parseASBCSV(csvText);

    // Get unpaid payments
    const { data: unpaidPayments } = await supabaseAdmin
      .from('payments')
      .select('*, members(first_name, last_name, email)')
      .eq('payment_status', 'unpaid');

    let matched = 0;
    let unmatched = 0;

    for (const transaction of transactions) {
      // Try to match by amount and date (within 3 days)
      const match = unpaidPayments?.find(payment => {
        const amountMatch = Math.abs(payment.amount - transaction.amount) < 0.01;
        const dateMatch = true; // TODO: Implement date range matching
        return amountMatch && dateMatch;
      });

      if (match) {
        await supabaseAdmin
          .from('payments')
          .update({
            payment_status: 'paid',
            payment_method: 'bank_transfer',
            payment_date: transaction.date,
            bank_reference: transaction.reference,
            reconciled_at: new Date().toISOString(),
          })
          .eq('id', match.id);

        matched++;
      } else {
        unmatched++;
      }
    }

    // TODO: Log reconciliation to audit trail

    return NextResponse.json({ matched, unmatched });
  } catch (error) {
    console.error('Reconciliation error:', error);
    return NextResponse.json({ error: 'Reconciliation failed' }, { status: 500 });
  }
}
