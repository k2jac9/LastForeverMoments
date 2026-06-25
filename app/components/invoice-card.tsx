import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { Invoice, InvoiceStatus } from '@/lib/types';

function statusVariant(status: InvoiceStatus): 'paid' | 'sent' | 'pending' {
  if (status === 'paid') return 'paid';
  if (status === 'sent') return 'sent';
  return 'pending';
}

function statusLabel(status: InvoiceStatus): string {
  if (status === 'paid') return 'Paid';
  if (status === 'sent') return 'Sent';
  return 'Pending';
}

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const content = (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{invoice.clientName}</p>
            <Badge variant={statusVariant(invoice.status)}>{statusLabel(invoice.status)}</Badge>
          </div>
          <p className="mt-1 truncate font-body text-sm text-muted-foreground">
            {invoice.packageName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-body text-base font-semibold">{formatCurrency(invoice.amount)}</p>
          {invoice.status !== 'paid' && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardContent>
    </Card>
  );

  if (invoice.status === 'paid') {
    return content;
  }

  return (
    <Link href={`/pay/${invoice.id}`} className="block">
      {content}
    </Link>
  );
}
