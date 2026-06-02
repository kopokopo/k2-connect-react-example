"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StkStatus } from "./StkStatus";

interface StkPushFormProps {
  defaultAmount?: number;
  comicTitle?: string;
}

export function StkPushForm({ defaultAmount, comicTitle }: StkPushFormProps) {
  const [state, setState] = useState({
    phoneNumber: "",
    amount: defaultAmount?.toString() ?? "",
    firstName: "",
    lastName: "",
    email: "",
    loading: false,
    location: "",
    submittedPhone: "",
  });

  const set = (patch: Partial<typeof state>) => setState((s) => ({ ...s, ...patch }));

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    set({ loading: true });
    try {
      const { data } = await axios.post("/api/stk", {
        phoneNumber: state.phoneNumber,
        amount: Number(state.amount),
        firstName: state.firstName || undefined,
        lastName: state.lastName || undefined,
        email: state.email || undefined,
        metadata: comicTitle ? { comic: comicTitle } : undefined,
      });
      set({ submittedPhone: state.phoneNumber, location: data.location });
      toast.success("STK Push sent! Check your phone for the M-Pesa prompt.");
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
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300">Payment request sent!</p>
            <p className="text-sm text-green-700 dark:text-green-400">
              Check {state.submittedPhone} for the M-Pesa prompt.
            </p>
          </div>
        </div>
        <StkStatus location={state.location} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="stk-phone">Phone Number *</Label>
        <Input
          id="stk-phone"
          placeholder="0712345678"
          value={state.phoneNumber}
          onChange={(e) => set({ phoneNumber: e.target.value })}
          required
        />
        <p className="text-xs text-muted-foreground">Format: 07XXXXXXXX or 2547XXXXXXXX</p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="stk-amount">Amount (KES) *</Label>
        <Input
          id="stk-amount"
          type="number"
          min={1}
          placeholder="500"
          value={state.amount}
          onChange={(e) => set({ amount: e.target.value })}
          readOnly={!!defaultAmount}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor="stk-first">First Name</Label>
          <Input id="stk-first" placeholder="John" value={state.firstName} onChange={(e) => set({ firstName: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="stk-last">Last Name</Label>
          <Input id="stk-last" placeholder="Doe" value={state.lastName} onChange={(e) => set({ lastName: e.target.value })} />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="stk-email">Email</Label>
        <Input id="stk-email" type="email" placeholder="john@example.com" value={state.email} onChange={(e) => set({ email: e.target.value })} />
      </div>

      <Button type="submit" className="w-full" disabled={state.loading}>
        {state.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {state.loading ? "Sending request…" : "Send M-Pesa STK Push"}
      </Button>
    </form>
  );
}
