'use client';

import Link from 'next/link';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { getPayUrl } from '@/lib/invoices';
import type { Invoice } from '@/lib/types';

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  async function copyLink() {
    await navigator.clipboard.writeText(getPayUrl(invoice.id));
    toast.success('Payment link copied');
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{invoice.clientName}</p>
              <Badge variant={invoice.status === 'paid' ? 'paid' : 'sent'}>
                {invoice.status === 'paid' ? 'Paid' : 'Sent'}
              </Badge>
            </div>
            <p className="mt-1 truncate font-body text-sm text-muted-foreground">
              {invoice.packageName}
            </p>
            <p className="mt-0.5 truncate font-body text-xs text-muted-foreground">
              {invoice.contact} · via {invoice.sendVia}
            </p>
          </div>
          <p className="font-body text-base font-semibold">{formatCurrency(invoice.amount)}</p>
        </div>

        {invoice.status === 'sent' && (
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => void copyLink()}>
              <Copy className="h-4 w-4" />
              Copy link
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/pay/${invoice.id}`}>
                <ExternalLink className="h-4 w-4" />
                Pay page
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
