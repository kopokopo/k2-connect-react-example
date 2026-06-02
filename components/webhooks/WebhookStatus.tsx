"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WebhookStatusProps {
  location?: string;
}

export function WebhookStatus({ location: initialLocation }: WebhookStatusProps) {
  const [location, setLocation] = useState(initialLocation ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  async function handleCheck(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/webhooks/status?location=${encodeURIComponent(location)}`
      );
      setResult(data);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.error ?? err.message)
        : String(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleCheck} className="space-y-3 rounded-md border p-3">
      <div className="space-y-1.5">
        <Label htmlFor="wh-status-loc">Subscription Location URL</Label>
        <Input
          id="wh-status-loc"
          placeholder="https://staging.kopokopo.com/api/v2/webhook-subscriptions/..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          readOnly={!!initialLocation}
        />
      </div>

      <Button type="submit" variant="outline" size="sm" disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
        )}
        Check Status
      </Button>

      {result && (
        <pre className="max-h-60 overflow-auto rounded bg-muted p-3 text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </form>
  );
}
