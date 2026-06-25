'use client';

import Link from 'next/link';
import { PlusCircle, Sparkles, TrendingUp } from 'lucide-react';
import { InvoiceCard } from '@/components/invoice-card';
import { useInvoices } from '@/components/invoice-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BUSINESS_NAME, BUSINESS_TAGLINE, getTodayRevenue } from '@/lib/invoices';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const { invoices, loading } = useInvoices();
  const todayRevenue = getTodayRevenue(invoices);
  const paidCount = invoices.filter((inv) => inv.status === 'paid').length;

  return (
    <div className="space-y-6 pb-4">
      <header className="pt-2">
        <p className="text-sm font-medium text-primary">SnapPay</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Hey Matt 👋</h1>
        <p className="mt-1 font-body text-sm text-muted-foreground">{BUSINESS_TAGLINE}</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Today</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{formatCurrency(todayRevenue)}</p>
            <p className="font-body text-xs text-muted-foreground">Revenue collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Paid</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{paidCount}</p>
            <p className="font-body text-xs text-muted-foreground">Invoices settled</p>
          </CardContent>
        </Card>
      </div>

      <Button asChild size="lg" className="w-full">
        <Link href="/invoice/new">
          <PlusCircle className="h-5 w-5" />
          New Invoice
        </Link>
      </Button>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent invoices</h2>
          <p className="font-body text-xs text-muted-foreground">{BUSINESS_NAME}</p>
        </div>

        {loading ? (
          <p className="font-body text-sm text-muted-foreground">Loading invoices…</p>
        ) : invoices.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="font-body text-sm text-muted-foreground">
                No invoices yet. Create one before you leave the venue!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
