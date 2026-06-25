'use client';

import { Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { getEmailPreview, getSmsPreview } from '@/lib/invoices';
import type { Invoice } from '@/lib/types';

interface SendPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  payUrl: string;
  sendVia: 'sms' | 'email';
  onSendViaChange: (via: 'sms' | 'email') => void;
  onConfirm: () => void;
  sending?: boolean;
}

export function SendPreviewSheet({
  open,
  onOpenChange,
  invoice,
  payUrl,
  sendVia,
  onSendViaChange,
  onConfirm,
  sending,
}: SendPreviewSheetProps) {
  if (!invoice) return null;

  const preview =
    sendVia === 'sms'
      ? getSmsPreview(invoice, payUrl)
      : getEmailPreview(invoice, payUrl);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-h-[90dvh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Preview & Send</SheetTitle>
          <SheetDescription>
            Review what {invoice.clientName} will receive.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border bg-muted/40 p-4">
            <p className="text-sm font-medium">{invoice.packageName}</p>
            <p className="mt-1 font-body text-2xl font-bold">{formatCurrency(invoice.amount)}</p>
            <p className="mt-1 font-body text-sm text-muted-foreground">To: {invoice.contact}</p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={sendVia === 'sms' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => onSendViaChange('sms')}
            >
              <MessageSquare className="h-4 w-4" />
              SMS
            </Button>
            <Button
              type="button"
              variant={sendVia === 'email' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => onSendViaChange('email')}
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">Message preview</p>
            <pre className="whitespace-pre-wrap rounded-xl border bg-card p-4 font-body text-sm leading-relaxed text-muted-foreground">
              {preview}
            </pre>
          </div>

          <Button className="w-full" size="lg" onClick={onConfirm} disabled={sending}>
            {sending ? 'Sending…' : 'Send & Get Paid'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
