'use client';

import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    void params.then((p) => setInvoiceId(p.id));
  }, [params]);

  useEffect(() => {
    if (!invoiceId) return;

    async function load() {
      try {
        const res = await fetch(`/api/invoices/${invoiceId}`, { cache: 'no-store' });
        if (!res.ok) {
          setError('Invoice not found');
          return;
        }
        setInvoice((await res.json()) as Invoice);
      } catch {
        setError('Could not load invoice');
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
      setInvoice((await res.json()) as Invoice);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="font-body text-muted-foreground">Loading invoice…</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold">Invoice not found</p>
        <p className="mt-2 font-body text-sm text-muted-foreground">
          This link may have expired or is invalid.
        </p>
      </div>
    );
  }

  const isPaid = invoice.status === 'paid';

  return (
    <div className="mx-auto w-full space-y-6 py-2">
      <header className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Camera className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-primary">{BUSINESS_NAME}</p>
        <h1 className="mt-1 text-2xl font-bold">Invoice for {invoice.clientName}</h1>
        <div className="mt-2 flex justify-center">
          <Badge variant={isPaid ? 'paid' : 'sent'}>{isPaid ? 'Paid' : 'Payment due'}</Badge>
        </div>
      </header>

      <Card>
        <CardHeader>
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
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="font-body">{formatCurrency(invoice.amount)}</span>
          </div>
        </CardContent>
      </Card>

      {isPaid ? (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-6 text-center">
            <p className="font-semibold text-emerald-800">This invoice has been paid</p>
            <p className="mt-1 font-body text-sm text-emerald-700">
              Thank you! Matt has been notified.
            </p>
          </CardContent>
        </Card>
      ) : (
        <PayCheckout amount={invoice.amount} onPay={handlePay} />
      )}
    </div>
  );
}
