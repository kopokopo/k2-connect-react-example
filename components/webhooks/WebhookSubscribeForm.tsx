"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebhookStatus } from "./WebhookStatus";

const eventTypes = [
  { value: "buygoods_transaction_received", label: "Buygoods Transaction Received" },
  { value: "b2b_transaction_received", label: "B2B Transaction Received" },
  { value: "customer_created", label: "Customer Created" },
  { value: "settlement_transfer_completed", label: "Settlement Transfer Completed" },
  { value: "m2m_transaction_completed", label: "M2M Transaction Completed" },
];

const scopes = [
  { value: "till", label: "Till" },
  { value: "company", label: "Company" },
];

export function WebhookSubscribeForm() {
  const [state, setState] = useState({
    eventType: "buygoods_transaction_received",
    url: process.env.NEXT_PUBLIC_CALLBACK_URL ?? "",
    scope: "till",
    scopeReference: "",
    loading: false,
    location: "",
  });

  const set = (patch: Partial<typeof state>) => setState((s) => ({ ...s, ...patch }));

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    set({ loading: true });
    try {
      const { data } = await axios.post("/api/webhooks/subscribe", {
        eventType: state.eventType,
        url: state.url,
        scope: state.scope,
        scopeReference: state.scopeReference || undefined,
      });
      set({ location: data.location });
      toast.success("Webhook subscribed successfully!");
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.error ?? err.message)
        : String(err);
      toast.error(msg);
    } finally {
      set({ loading: false });
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Event Type *</Label>
          <Select value={state.eventType} onValueChange={(v) => { if (v) set({ eventType: v }); }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((et) => (
                <SelectItem key={et.value} value={et.value}>
                  {et.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="wh-url">Callback URL *</Label>
          <Input
            id="wh-url"
            type="url"
            placeholder="https://your-server.com/api/webhooks/handler"
            value={state.url}
            onChange={(e) => set({ url: e.target.value })}
            required
          />
          <p className="text-xs text-muted-foreground">
            K2 requires HTTPS. For local dev run{" "}
            <code className="rounded bg-muted px-1 py-0.5">npx ngrok http 3000</code>{" "}
            and paste the HTTPS URL into <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_CALLBACK_URL</code> in{" "}
            <code className="rounded bg-muted px-1 py-0.5">.env.local</code>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Scope</Label>
            <Select value={state.scope} onValueChange={(v) => { if (v) set({ scope: v }); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scopes.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wh-scope-ref">Scope Reference</Label>
            <Input
              id="wh-scope-ref"
              placeholder="Till number"
              value={state.scopeReference}
              onChange={(e) => set({ scopeReference: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" disabled={state.loading}>
          {state.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {state.loading ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>

      {state.location && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <p className="text-sm font-medium">Subscription created</p>
          </div>
          <WebhookStatus location={state.location} />
        </div>
      )}
    </div>
  );
}
