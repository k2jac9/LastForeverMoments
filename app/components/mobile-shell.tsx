import { BottomNav } from '@/components/bottom-nav';

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className="flex-1 px-4 pb-4 pt-[env(safe-area-inset-top)]">{children}</main>
      <BottomNav />
    </div>
  );
}
