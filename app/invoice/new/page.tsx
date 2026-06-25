'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, CheckCircle2, Copy, Mic } from 'lucide-react';
import { toast } from 'sonner';
import { PackagePicker } from '@/components/package-picker';
import { SendPreviewSheet } from '@/components/send-preview-sheet';
import { useInvoices } from '@/components/invoice-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getPackageById, getPayUrl } from '@/lib/invoices';
import { formatCurrency } from '@/lib/utils';
import type { Invoice, LineItem, PackageId, SendVia } from '@/lib/types';

type Step = 'form' | 'success';

export default function NewInvoicePage() {
  const router = useRouter();
  const { refresh } = useInvoices();

  const [step, setStep] = useState<Step>('form');
  const [packageId, setPackageId] = useState<PackageId>('full-wedding');
  const [customAmount, setCustomAmount] = useState('');
  const [clientName, setClientName] = useState('');
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');
  const [sendVia, setSendVia] = useState<SendVia>('sms');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);
  const [payUrl, setPayUrl] = useState('');

  const selectedPackage = getPackageById(packageId);

  const lineItems: LineItem[] = useMemo(() => {
    if (packageId === 'custom') {
      const amount = Number(customAmount) || 0;
      return amount > 0 ? [{ description: note.trim() || 'Custom photography services', amount }] : [];
    }
    return selectedPackage?.lineItems ?? [];
  }, [packageId, customAmount, note, selectedPackage]);

  const amount = useMemo(() => {
    if (packageId === 'custom') return Number(customAmount) || 0;
    return selectedPackage?.price ?? 0;
  }, [packageId, customAmount, selectedPackage]);

  const draftInvoice: Invoice | null = useMemo(() => {
    if (!clientName.trim() || !contact.trim() || amount <= 0) return null;
    return {
      id: 'draft',
      clientName: clientName.trim(),
      contact: contact.trim(),
      packageId,
      packageName: selectedPackage?.name ?? 'Custom',
      lineItems,
      amount,
      note: note.trim() || undefined,
      status: 'sent',
      sendVia,
      createdAt: new Date().toISOString(),
    };
  }, [clientName, contact, amount, packageId, selectedPackage, lineItems, note, sendVia]);

  const canPreview = Boolean(draftInvoice);

  function handleVoiceNote() {
    type SpeechRecognitionCtor = new () => {
      lang: string;
      onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
      onerror: (() => void) | null;
      start: () => void;
    };

    const win = window as Window & { webkitSpeechRecognition?: SpeechRecognitionCtor; SpeechRecognition?: SpeechRecognitionCtor };
    const SpeechRecognitionAPI = win.webkitSpeechRecognition ?? win.SpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) setNote(transcript);
    };
    recognition.onerror = () => toast.error('Could not capture voice note');
    recognition.start();
    toast.message('Listening… speak your note');
  }

  async function handleSend() {
    if (!draftInvoice) return;
    setSending(true);

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: draftInvoice.clientName,
          contact: draftInvoice.contact,
          packageId: draftInvoice.packageId,
          packageName: draftInvoice.packageName,
          lineItems: draftInvoice.lineItems,
          amount: draftInvoice.amount,
          note: draftInvoice.note,
          sendVia,
        }),
      });

      if (!res.ok) throw new Error('Failed to create invoice');

      const invoice = (await res.json()) as Invoice;
      const url = getPayUrl(invoice.id);
      setCreatedInvoice(invoice);
      setPayUrl(url);
      setPreviewOpen(false);
      setStep('success');
      await refresh();

      toast.success(
        sendVia === 'sms'
          ? `Invoice sent via SMS to ${invoice.contact}`
          : `Invoice sent via email to ${invoice.contact}`
      );
    } catch {
      toast.error('Failed to send invoice. Try again.');
    } finally {
      setSending(false);
    }
  }

  async function copyLink() {
    if (!payUrl) return;
    await navigator.clipboard.writeText(payUrl);
    toast.success('Payment link copied');
  }

  if (step === 'success' && createdInvoice) {
    return (
      <div className="flex flex-col items-center space-y-6 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Invoice sent!</h1>
          <p className="mt-2 font-body text-muted-foreground">
            {createdInvoice.clientName} can pay now before you leave the venue.
          </p>
        </div>

        <Card className="w-full">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <p className="text-sm font-medium">Scan to pay on the spot</p>
            <div className="rounded-2xl border bg-white p-4">
              <QRCodeSVG value={payUrl} size={180} level="M" />
            </div>
            <p className="font-body text-2xl font-bold">{formatCurrency(createdInvoice.amount)}</p>
          </CardContent>
        </Card>

        <div className="flex w-full gap-2">
          <Button variant="outline" className="flex-1" onClick={() => void copyLink()}>
            <Copy className="h-4 w-4" />
            Copy link
          </Button>
          <Button className="flex-1" onClick={() => router.push(`/pay/${createdInvoice.id}`)}>
            Preview pay page
          </Button>
        </div>

        <Button variant="ghost" className="w-full" onClick={() => router.push('/')}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <header className="flex items-center gap-3 pt-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">New Invoice</h1>
          <p className="font-body text-sm text-muted-foreground">Ready in under 60 seconds</p>
        </div>
      </header>

      <PackagePicker
        selectedId={packageId}
        customAmount={customAmount}
        onSelect={setPackageId}
        onCustomAmountChange={setCustomAmount}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="client">Client name</Label>
          <Input
            id="client"
            placeholder="Sarah & James"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Phone or email</Label>
          <Input
            id="contact"
            placeholder="+1 (416) 555-0199"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="note">Note (optional)</Label>
            <Button type="button" variant="ghost" size="sm" onClick={handleVoiceNote}>
              <Mic className="h-4 w-4" />
              Voice
            </Button>
          </div>
          <Input
            id="note"
            placeholder="Added 1hr overtime"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      {amount > 0 && (
        <Card>
          <CardContent className="space-y-3 p-4">
            <p className="text-sm font-medium">Invoice summary</p>
            {lineItems.map((item) => (
              <div key={item.description} className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">{item.description}</span>
                <span>{formatCurrency(item.amount)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="font-body text-lg">{formatCurrency(amount)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-md px-4 pb-[env(safe-area-inset-bottom)]">
        <Button
          className="w-full shadow-lg"
          size="lg"
          disabled={!canPreview}
          onClick={() => setPreviewOpen(true)}
        >
          Preview & Send
        </Button>
      </div>

      <SendPreviewSheet
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        invoice={draftInvoice}
        payUrl={
          typeof window !== 'undefined'
            ? `${window.location.origin}/pay/[invoice-id]`
            : '/pay/[invoice-id]'
        }
        sendVia={sendVia}
        onSendViaChange={setSendVia}
        onConfirm={() => void handleSend()}
        sending={sending}
      />
    </div>
  );
}
