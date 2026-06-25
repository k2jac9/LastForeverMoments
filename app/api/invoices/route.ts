import { NextResponse } from 'next/server';
import { createInvoice, listInvoices } from '@/lib/invoice-store';
import type { CreateInvoiceInput } from '@/lib/types';

export async function GET() {
  return NextResponse.json(listInvoices());
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateInvoiceInput;

  if (!body.clientName?.trim() || !body.contact?.trim() || !body.amount || body.amount <= 0) {
    return NextResponse.json({ error: 'Invalid invoice data' }, { status: 400 });
  }

  const invoice = createInvoice(body);
  return NextResponse.json(invoice, { status: 201 });
}
