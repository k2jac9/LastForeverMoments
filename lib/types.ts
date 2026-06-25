export type InvoiceStatus = 'sent' | 'paid';

export type PackageId =
  | 'full-wedding'
  | 'engagement'
  | 'elopement'
  | 'second-shooter'
  | 'custom';

export type SendVia = 'sms' | 'email';

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
  sendVia: SendVia;
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
  sendVia: SendVia;
}
