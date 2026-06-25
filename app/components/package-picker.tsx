'use client';

import { cn, formatCurrency } from '@/lib/utils';
import type { PackageId } from '@/lib/types';
import { WEDDING_PACKAGES } from '@/lib/invoices';

interface PackagePickerProps {
  selectedId: PackageId;
  customAmount: string;
  onSelect: (id: PackageId) => void;
  onCustomAmountChange: (value: string) => void;
}

export function PackagePicker({
  selectedId,
  customAmount,
  onSelect,
  onCustomAmountChange,
}: PackagePickerProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Select package</p>
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {WEDDING_PACKAGES.map((pkg) => {
          const selected = selectedId === pkg.id;
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onSelect(pkg.id)}
              className={cn(
                'min-w-[148px] shrink-0 rounded-2xl border p-4 text-left transition-all',
                selected
                  ? 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20'
                  : 'border-border bg-card hover:border-primary/40'
              )}
            >
              <p className="text-sm font-semibold leading-tight">{pkg.name}</p>
              <p className="mt-2 font-body text-lg font-bold">
                {pkg.price !== null ? formatCurrency(pkg.price) : 'Custom'}
              </p>
              <p className="mt-1 line-clamp-2 font-body text-xs text-muted-foreground">
                {pkg.description}
              </p>
            </button>
          );
        })}
      </div>

      {selectedId === 'custom' && (
        <div className="space-y-2">
          <label htmlFor="custom-amount" className="text-sm font-medium">
            Custom amount
          </label>
          <input
            id="custom-amount"
            type="number"
            min="1"
            placeholder="Enter amount"
            value={customAmount}
            onChange={(e) => onCustomAmountChange(e.target.value)}
            className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-base font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      )}
    </div>
  );
}
