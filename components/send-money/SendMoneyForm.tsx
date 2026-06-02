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
import { SendMoneyStatus } from "./SendMoneyStatus";

type DestinationType = "mobile_wallet" | "till" | "paybill";

const networks = ["Safaricom", "Airtel", "Telkom"];

const sourceOptions = [
  { label: "Till – 909090", value: "909090" },
  { label: "Till – 505050", value: "505050" },
  { label: "Available Balance", value: "" },
];

export function SendMoneyForm() {
  const [state, setState] = useState({
    sourceIdentifier: "909090",
    destType: "mobile_wallet" as DestinationType,
    phone: "",
    network: "Safaricom",
    tillNumber: "",
    paybillNumber: "",
    accountNumber: "",
    amount: "",
    description: "",
    loading: false,
    location: "",
  });

  const set = (patch: Partial<typeof state>) => setState((s) => ({ ...s, ...patch }));

  function buildDestination() {
    const base = { amount: Number(state.amount), description: state.description || undefined };
    if (state.destType === "mobile_wallet") {
      return { type: "mobile_wallet" as const, phone_number: state.phone, network: state.network, ...base };
    }
    if (state.destType === "till") {
      return { type: "till" as const, till_number: state.tillNumber, ...base };
    }
    return {
      type: "paybill" as const,
      paybill_number: state.paybillNumber,
      paybill_account_number: state.accountNumber,
      ...base,
    };
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    set({ loading: true });
    try {
      const { data } = await axios.post("/api/send-money", {
        sourceIdentifier: state.sourceIdentifier,
        destinations: [buildDestination()],
      });
      set({ location: data.location });
      toast.success("Send money request submitted!");
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
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <p className="text-sm font-medium">Send money request submitted.</p>
        </div>
        <SendMoneyStatus location={state.location} />
        <Button variant="outline" size="sm" onClick={() => set({ location: "" })}>
          New Transfer
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Source Identifier</Label>
        <Select value={state.sourceIdentifier} onValueChange={(v) => { if (v !== null) set({ sourceIdentifier: v ?? "" }); }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sourceOptions.map((opt) => (
              <SelectItem key={opt.label} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Destination Type</Label>
        <Select value={state.destType} onValueChange={(v) => { if (v) set({ destType: v as DestinationType }); }}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mobile_wallet">Mobile Wallet</SelectItem>
            <SelectItem value="till">Till Number</SelectItem>
            <SelectItem value="paybill">Paybill</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {state.destType === "mobile_wallet" && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="sm-phone">Phone Number *</Label>
            <Input
              id="sm-phone"
              placeholder="0712345678"
              value={state.phone}
              onChange={(e) => set({ phone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Network *</Label>
            <Select value={state.network} onValueChange={(v) => { if (v) set({ network: v }); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {networks.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {state.destType === "till" && (
        <div className="space-y-1.5">
          <Label htmlFor="sm-till">Till Number *</Label>
          <Input
            id="sm-till"
            placeholder="123456"
            value={state.tillNumber}
            onChange={(e) => set({ tillNumber: e.target.value })}
            required
          />
        </div>
      )}

      {state.destType === "paybill" && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="sm-paybill">Paybill Number *</Label>
            <Input
              id="sm-paybill"
              placeholder="123456"
              value={state.paybillNumber}
              onChange={(e) => set({ paybillNumber: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sm-account">Account Number *</Label>
            <Input
              id="sm-account"
              placeholder="ACC001"
              value={state.accountNumber}
              onChange={(e) => set({ accountNumber: e.target.value })}
              required
            />
          </div>
        </>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="sm-amount">Amount (KES) *</Label>
        <Input
          id="sm-amount"
          type="number"
          min={1}
          placeholder="1000"
          value={state.amount}
          onChange={(e) => set({ amount: e.target.value })}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sm-desc">Description</Label>
        <Input
          id="sm-desc"
          placeholder="Refund for order #001"
          value={state.description}
          onChange={(e) => set({ description: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={state.loading}>
        {state.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {state.loading ? "Sending…" : "Send Money"}
      </Button>
    </form>
  );
}
