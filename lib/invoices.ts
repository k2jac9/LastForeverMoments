import type { Invoice, WeddingPackage } from './types';

export const BUSINESS_NAME = 'Matt Morrison Photography';
export const BUSINESS_TAGLINE = 'Invoice before you leave the venue.';

export const WEDDING_PACKAGES: WeddingPackage[] = [
  {
    id: 'full-wedding',
    name: 'Full Wedding Day',
    price: 3500,
    description: '8hr coverage, 500+ edited photos, online gallery',
    lineItems: [
      { description: '8 hours wedding coverage', amount: 2800 },
      { description: '500+ edited photos', amount: 500 },
      { description: 'Online gallery delivery', amount: 200 },
    ],
  },
  {
    id: 'engagement',
    name: 'Engagement Session',
    price: 850,
    description: '2hr session, 75 edited photos',
    lineItems: [
      { description: '2 hour engagement session', amount: 650 },
      { description: '75 edited photos', amount: 200 },
    ],
  },
  {
    id: 'elopement',
    name: 'Elopement Package',
    price: 1800,
    description: '4hr coverage, 200 photos',
    lineItems: [
      { description: '4 hours elopement coverage', amount: 1400 },
      { description: '200 edited photos', amount: 400 },
    ],
  },
  {
    id: 'second-shooter',
    name: 'Second Shooter Add-on',
    price: 500,
    description: 'Additional photographer',
    lineItems: [{ description: 'Second shooter (full day)', amount: 500 }],
  },
  {
    id: 'custom',
    name: 'Custom',
    price: null,
    description: 'Manual amount + optional note',
    lineItems: [],
  },
];

export const SEED_INVOICES: Invoice[] = [
  {
    id: 'demo-paid-1',
    clientName: 'Emily & David',
    contact: 'emily@email.com',
    packageId: 'engagement',
    packageName: 'Engagement Session',
    lineItems: WEDDING_PACKAGES[1].lineItems,
    amount: 850,
    status: 'paid',
    sendVia: 'email',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-sent-1',
    clientName: 'Priya & Alex',
    contact: '+1 (416) 555-0142',
    packageId: 'full-wedding',
    packageName: 'Full Wedding Day',
    lineItems: WEDDING_PACKAGES[0].lineItems,
    amount: 3500,
    status: 'sent',
    sendVia: 'sms',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getPackageById(id: string): WeddingPackage | undefined {
  return WEDDING_PACKAGES.find((pkg) => pkg.id === id);
}

export function getPayUrl(invoiceId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/pay/${invoiceId}`;
  }
  return `/pay/${invoiceId}`;
}

export function getSmsPreview(invoice: Invoice, payUrl: string): string {
  return `Hi ${invoice.clientName}! Your invoice from ${BUSINESS_NAME} for ${invoice.packageName} ($${invoice.amount.toLocaleString()}) is ready. Pay here: ${payUrl}`;
}

export function getEmailPreview(invoice: Invoice, payUrl: string): string {
  return `Subject: Invoice from ${BUSINESS_NAME}\n\nHi ${invoice.clientName},\n\nThank you for choosing us for your special day! Your invoice for ${invoice.packageName} totals $${invoice.amount.toLocaleString()}.\n\nPay securely here: ${payUrl}\n\n— Matt`;
}

export function getTodayRevenue(invoices: Invoice[]): number {
  const today = new Date().toDateString();
  return invoices
    .filter((inv) => inv.status === 'paid' && inv.paidAt && new Date(inv.paidAt).toDateString() === today)
    .reduce((sum, inv) => sum + inv.amount, 0);
}
