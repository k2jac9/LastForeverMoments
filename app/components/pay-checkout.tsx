'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { BUSINESS_NAME } from '@/lib/invoices';

interface PayCheckoutProps {
  amount: number;
  onPay: () => Promise<void>;
}

export function PayCheckout({ amount, onPay }: PayCheckoutProps) {
  const [paying, setPaying] = useState(false);

  async function handlePay() {
    setPaying(true);
    try {
      await onPay();
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-muted/30 p-4">
        <p className="font-body text-sm text-muted-foreground">Amount due</p>
        <p className="font-body text-3xl font-bold">{formatCurrency(amount)}</p>
        <p className="mt-1 font-body text-xs text-muted-foreground">
          Paid to {BUSINESS_NAME}
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="card">Card number</Label>
          <Input id="card" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="exp">Expiry</Label>
            <Input id="exp" placeholder="MM/YY" defaultValue="12/28" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="123" defaultValue="123" />
          </div>
        </div>
      </div>

      <Button className="w-full" size="lg" disabled={paying} onClick={() => void handlePay()}>
        <CreditCard className="h-4 w-4" />
        {paying ? 'Processing…' : `Pay ${formatCurrency(amount)}`}
      </Button>
    </div>
  );
}
