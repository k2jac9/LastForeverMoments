export type InvoiceStatus = 'pending' | 'sent' | 'paid';

export type PackageId =
  | 'full-wedding'
  | 'engagement'
  | 'elopement'
  | 'second-shooter'
  | 'custom';

export interface LineItem {
  description: string;
  amount: number;
}

export interface WeddingPackage {
  id: PackageId;
  name: string;
  price: number | null;
  lineItems: LineItem[];
  description: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  contact: string;
  packageId: PackageId;
  packageName: string;
  lineItems: LineItem[];
  amount: number;
  note?: string;
  status: InvoiceStatus;
  sendVia: 'sms' | 'email';
  createdAt: string;
  sentAt?: string;
  paidAt?: string;
}

export interface CreateInvoiceInput {
  clientName: string;
  contact: string;
  packageId: PackageId;
  packageName: string;
  lineItems: LineItem[];
  amount: number;
  note?: string;
  sendVia: 'sms' | 'email';
}
