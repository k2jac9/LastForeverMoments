'use client';

import { useState } from 'react';
import { CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';

interface PayCheckoutProps {
  amount: number;
  onPay: () => Promise<void>;
}

export function PayCheckout({ amount, onPay }: PayCheckoutProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');

  async function handlePay() {
    setStep('processing');
    await new Promise((r) => setTimeout(r, 1200));
    await onPay();
    setStep('success');
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold">Payment confirmed!</h2>
        <p className="mt-2 font-body text-muted-foreground">
          {formatCurrency(amount)} paid to Matt Morrison Photography
        </p>
        <p className="mt-4 text-sm text-muted-foreground">Thank you for your payment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CreditCard className="h-4 w-4" />
        <span>Secure demo checkout</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="card">Card number</Label>
        <Input
          id="card"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="4242 4242 4242 4242"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry</Label>
          <Input id="expiry" defaultValue="12/28" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input id="cvc" defaultValue="123" />
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={() => void handlePay()} disabled={step === 'processing'}>
        {step === 'processing' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>Pay {formatCurrency(amount)}</>
        )}
      </Button>
    </div>
  );
}
