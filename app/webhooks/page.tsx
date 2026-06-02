import { Header } from "@/components/layout/Header";
import { WebhookSubscribeForm } from "@/components/webhooks/WebhookSubscribeForm";
import { WebhookStatus } from "@/components/webhooks/WebhookStatus";
import { WebhookEventsTable } from "@/components/webhooks/WebhookEventsTable";
import { Separator } from "@/components/ui/separator";

export default function WebhooksPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 space-y-10">
        <div className="space-y-1">
          <h1 className="font-bangers text-4xl tracking-widest">Webhooks</h1>
          <p className="text-muted-foreground">
            Subscribe to K2 Connect events. Incoming payloads are recorded below in real time.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="font-bangers text-2xl tracking-wide">Received Events</h2>
          <Separator />
          <WebhookEventsTable />
        </section>

        <section className="space-y-4">
          <h2 className="font-bangers text-2xl tracking-wide">Subscribe to an Event</h2>
          <Separator />
          <div className="max-w-2xl">
            <WebhookSubscribeForm />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-bangers text-2xl tracking-wide">Check Subscription Status</h2>
          <Separator />
          <div className="max-w-2xl">
            <WebhookStatus />
          </div>
        </section>
      </main>
    </>
  );
}
