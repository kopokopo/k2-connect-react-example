"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentLinkResult } from "./PaymentLinkResult";

interface PaymentLinkFormProps {
  defaultAmount?: number;
  defaultNote?: string;
}

export function PaymentLinkForm({ defaultAmount, defaultNote }: PaymentLinkFormProps) {
  const [state, setState] = useState({
    amount: defaultAmount?.toString() ?? "",
    note: defaultNote ?? "",
    reference: "",
    loading: false,
    location: "",
  });

  const set = (patch: Partial<typeof state>) => setState((s) => ({ ...s, ...patch }));

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    set({ loading: true });
    try {
      const { data } = await axios.post("/api/payment-links", {
        amount: Number(state.amount),
        note: state.note || undefined,
        paymentReference: state.reference || undefined,
      });
      set({ location: data.location });
      toast.success("Payment link created!");
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.error ?? err.message)
        : String(err);
      toast.error(msg);
    } finally {
      set({ loading: false });
    }
  }

  if (state.location) {
    return <PaymentLinkResult location={state.location} onReset={() => set({ location: "" })} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="pl-amount">Amount (KES) *</Label>
        <Input
          id="pl-amount"
          type="number"
          min={1}
          placeholder="500"
          value={state.amount}
          onChange={(e) => set({ amount: e.target.value })}
          readOnly={!!defaultAmount}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pl-note">Note</Label>
        <Input
          id="pl-note"
          placeholder="Payment for comic book"
          value={state.note}
          onChange={(e) => set({ note: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pl-ref">Payment Reference</Label>
        <Input
          id="pl-ref"
          placeholder="ORDER-001"
          value={state.reference}
          onChange={(e) => set({ reference: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={state.loading}>
        {state.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {state.loading ? "Creating link…" : "Create Payment Link"}
      </Button>
    </form>
  );
}
