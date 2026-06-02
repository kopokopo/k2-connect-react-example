import { Header } from "@/components/layout/Header";
import { PaymentLinkForm } from "@/components/payment-links/PaymentLinkForm";
import { Separator } from "@/components/ui/separator";

export default function PaymentLinksPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mx-auto max-w-lg space-y-6">
          <div className="space-y-1">
            <h1 className="font-bangers text-4xl tracking-widest">Payment Links</h1>
            <p className="text-muted-foreground">
              Generate a shareable payment link for any amount. Customers pay at their
              convenience via M-Pesa.
            </p>
          </div>
          <Separator />
          <PaymentLinkForm />
        </div>
      </main>
    </>
  );
}
