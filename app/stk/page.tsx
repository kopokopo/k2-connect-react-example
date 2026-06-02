import { Header } from "@/components/layout/Header";
import { StkPushForm } from "@/components/stk/StkPushForm";
import { Separator } from "@/components/ui/separator";

export default function StkPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mx-auto max-w-lg space-y-6">
          <div className="space-y-1">
            <h1 className="font-bangers text-4xl tracking-widest">M-Pesa STK Push</h1>
            <p className="text-muted-foreground">
              Send an M-Pesa payment prompt directly to a customer&apos;s phone.
            </p>
          </div>
          <Separator />
          <StkPushForm />
        </div>
      </main>
    </>
  );
}
