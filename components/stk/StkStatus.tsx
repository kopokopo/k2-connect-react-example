"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusDisplay } from "@/components/shared/StatusDisplay";

interface StkStatusProps {
  location: string;
}

export function StkStatus({ location }: StkStatusProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  async function checkStatus() {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/stk/status?location=${encodeURIComponent(location)}`);
      setResult(data);
    } catch (err) {
      const msg = axios.isAxiosError(err) ? (err.response?.data?.error ?? err.message) : String(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border p-3">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Request Location</p>
        <p className="break-all font-mono text-xs">{location}</p>
      </div>

      <Button variant="outline" size="sm" onClick={checkStatus} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-2 h-3.5 w-3.5" />}
        Check Status
      </Button>

      {result && <StatusDisplay data={result} />}
    </div>
  );
}
