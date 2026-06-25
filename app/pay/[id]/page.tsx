'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PayCheckout } from '@/components/pay-checkout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BUSINESS_NAME } from '@/lib/invoices';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/lib/types';

export default function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    void params.then(({ id }) => setInvoiceId(id));
  }, [params]);

  useEffect(() => {
    if (!invoiceId) return;

    async function load() {
      try {
        const res = await fetch(`/api/invoices/${invoiceId}`);
        if (res.ok) {
          const data = (await res.json()) as Invoice;
          setInvoice(data);
          setPaid(data.status === 'paid');
        }
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [invoiceId]);

  async function handlePay() {
    if (!invoiceId) return;
    const res = await fetch(`/api/invoices/${invoiceId}/pay`, { method: 'POST' });
    if (res.ok) {
      const updated = (await res.json()) as Invoice;
      setInvoice(updated);
      setPaid(true);
    }
  }

  if (loading) {
    return <p className="py-12 text-center font-body text-muted-foreground">Loading invoice…</p>;
  }

  if (!invoice) {
    return <p className="py-12 text-center font-body text-muted-foreground">Invoice not found.</p>;
  }

  if (paid) {
    return (
      <div className="flex flex-col items-center space-y-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold">Payment received</h1>
        <p className="font-body text-muted-foreground">
          Thank you! Matt has been notified.
        </p>
        <p className="font-body text-2xl font-bold">{formatCurrency(invoice.amount)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <header className="pt-2 text-center">
        <p className="text-sm font-medium text-primary">{BUSINESS_NAME}</p>
        <h1 className="mt-1 text-xl font-bold">Invoice for {invoice.clientName}</h1>
        <Badge variant="sent" className="mt-2">
          Awaiting payment
        </Badge>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{invoice.packageName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {invoice.lineItems.map((item) => (
            <div key={item.description} className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">{item.description}</span>
              <span>{formatCurrency(item.amount)}</span>
            </div>
          ))}
          {invoice.note && (
            <p className="font-body text-sm text-muted-foreground">Note: {invoice.note}</p>
          )}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="font-body text-lg">{formatCurrency(invoice.amount)}</span>
          </div>
        </CardContent>
      </Card>

      <PayCheckout amount={invoice.amount} onPay={handlePay} />
    </div>
  );
}
