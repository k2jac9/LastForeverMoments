import { SEED_INVOICES } from './invoices';
import type { CreateInvoiceInput, Invoice } from './types';

const globalStore = globalThis as typeof globalThis & {
  __snappayInvoices?: Invoice[];
};

function getStore(): Invoice[] {
  if (!globalStore.__snappayInvoices) {
    globalStore.__snappayInvoices = [...SEED_INVOICES];
  }
  return globalStore.__snappayInvoices;
}

export function listInvoices(): Invoice[] {
  return [...getStore()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getInvoice(id: string): Invoice | undefined {
  return getStore().find((inv) => inv.id === id);
}

export function createInvoice(input: CreateInvoiceInput): Invoice {
  const invoice: Invoice = {
    id: crypto.randomUUID(),
    ...input,
    status: 'sent',
    createdAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
  };
  getStore().unshift(invoice);
  return invoice;
}

export function markInvoicePaid(id: string): Invoice | undefined {
  const store = getStore();
  const index = store.findIndex((inv) => inv.id === id);
  if (index === -1) return undefined;

  const updated: Invoice = {
    ...store[index],
    status: 'paid',
    paidAt: new Date().toISOString(),
  };
  store[index] = updated;
  return updated;
}
