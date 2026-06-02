"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Copy, RefreshCw, X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusDisplay } from "@/components/shared/StatusDisplay";

interface PaymentLinkResultProps {
  location: string;
  onReset?: () => void;
}

export function PaymentLinkResult({ location, onReset }: PaymentLinkResultProps) {
  const [statusLoading, setStatusLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [status, setStatus] = useState<Record<string, unknown> | null>(null);
  const [cancelled, setCancelled] = useState(false);

  function copyLocation() {
    navigator.clipboard.writeText(location);
    toast.success("Location URL copied!");
  }

  async function checkStatus() {
    setStatusLoading(true);
    try {
      const { data } = await axios.get(`/api/payment-links/status?location=${encodeURIComponent(location)}`);
      setStatus(data);
    } catch (err) {
      const msg = axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : String(err);
      toast.error(msg);
    } finally {
      setStatusLoading(false);
    }
  }

  async function cancelLink() {
    setCancelLoading(true);
    try {
      await axios.post("/api/payment-links/cancel", { location });
      setCancelled(true);
      toast.success("Payment link cancelled.");
    } catch (err) {
      const msg = axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : String(err);
      toast.error(msg);
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 p-4 flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-800 dark:text-green-300">
            {cancelled ? "Payment link cancelled." : "Payment link created!"}
          </p>
          <p className="text-sm text-green-700 dark:text-green-400">Share the location URL with your customer.</p>
        </div>
      </div>

      <div className="rounded-lg border p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location URL</p>
        <p className="break-all font-mono text-xs">{location}</p>
        <Button variant="outline" size="sm" onClick={copyLocation}>
          <Copy className="mr-2 h-3.5 w-3.5" />
          Copy URL
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={checkStatus} disabled={statusLoading}>
          {statusLoading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-2 h-3.5 w-3.5" />}
          Check Status
        </Button>

        {!cancelled && (
          <Button variant="destructive" size="sm" onClick={cancelLink} disabled={cancelLoading}>
            {cancelLoading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <X className="mr-2 h-3.5 w-3.5" />}
            Cancel Link
          </Button>
        )}

        {onReset && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Create Another
          </Button>
        )}
      </div>

      {status && <StatusDisplay data={status} />}
    </div>
  );
}
