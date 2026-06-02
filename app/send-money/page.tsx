import { Header } from "@/components/layout/Header";
import { SendMoneyForm } from "@/components/send-money/SendMoneyForm";
import { Separator } from "@/components/ui/separator";

export default function SendMoneyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mx-auto max-w-lg space-y-6">
          <div className="space-y-1">
            <h1 className="font-bangers text-4xl tracking-widest">Send Money</h1>
            <p className="text-muted-foreground">
              Send funds to a mobile wallet, till, or paybill — ideal for refunds and
              payouts to customers.
            </p>
          </div>
          <Separator />
          <SendMoneyForm />
        </div>
      </main>
    </>
  );
}
