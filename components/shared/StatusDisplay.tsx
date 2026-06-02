"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface StatusDisplayProps {
  data: Record<string, unknown>;
}

function extractFields(data: Record<string, unknown>) {
  const inner = (data?.data as Record<string, unknown>) ?? data;
  const attrs = (inner?.attributes as Record<string, unknown>) ?? inner;
  const rows: { label: string; value: string }[] = [];

  const add = (label: string, val: unknown) => {
    if (val !== null && val !== undefined && val !== "") {
      rows.push({ label, value: String(val) });
    }
  };

  add("ID", inner?.id);
  add("Type", inner?.type);
  add("Status", attrs?.status);
  add("Initiated", attrs?.initiation_time);

  const event = attrs?.event as Record<string, unknown> | undefined;
  add("Event Type", event?.type);
  add("Amount", (attrs?.amount as Record<string, unknown>)?.value);
  add("Currency", (attrs?.amount as Record<string, unknown>)?.currency);

  const meta = attrs?.metadata as Record<string, unknown> | undefined;
  if (meta) {
    Object.entries(meta).forEach(([k, v]) => add(k, v));
  }

  return rows;
}

export function StatusDisplay({ data }: StatusDisplayProps) {
  const [showRaw, setShowRaw] = useState(false);
  const rows = extractFields(data);

  return (
    <div className="space-y-2">
      {rows.length > 0 && (
        <table className="w-full text-sm">
          <tbody>
            {rows.map(({ label, value }) => (
              <tr key={label} className="border-b border-border last:border-0">
                <td className="py-1.5 pr-4 font-medium text-muted-foreground capitalize w-1/3">
                  {label}
                </td>
                <td className="py-1.5 font-mono text-xs break-all">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-muted-foreground px-0 hover:bg-transparent"
        onClick={() => setShowRaw((v) => !v)}
      >
        {showRaw ? <ChevronUp className="mr-1 h-3 w-3" /> : <ChevronDown className="mr-1 h-3 w-3" />}
        {showRaw ? "Hide" : "View"} raw JSON
      </Button>

      {showRaw && (
        <pre className="max-h-60 overflow-auto rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
