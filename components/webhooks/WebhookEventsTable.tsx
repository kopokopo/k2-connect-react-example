"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, RefreshCw, ChevronDown, ChevronRight, Inbox, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WebhookEvent } from "@/lib/webhook-store";

const POLL_INTERVAL = 5000;

const topicStyles: Record<string, string> = {
  buygoods_transaction_received: "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  b2b_transaction_received:      "bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  customer_created:              "bg-green-100 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  settlement_transfer_completed: "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  m2m_transaction_completed:     "bg-cyan-100 text-cyan-700 border border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
};

function TopicBadge({ topic }: { topic: string }) {
  const cls = topicStyles[topic] ?? "bg-muted text-muted-foreground border border-border";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {topic}
    </span>
  );
}

export function WebhookEventsTable() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchEvents = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await axios.get<WebhookEvent[]>("/api/webhooks/events");
      setEvents(data);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const id = setInterval(() => fetchEvents(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchEvents]);

  async function clearEvents() {
    setClearing(true);
    try {
      await axios.delete("/api/webhooks/events");
      setEvents([]);
      setExpanded(new Set());
      toast.success("Events cleared.");
    } catch {
      toast.error("Failed to clear events.");
    } finally {
      setClearing(false);
    }
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Auto-refreshes every {POLL_INTERVAL / 1000} s &nbsp;·&nbsp;{" "}
          {events.length} event{events.length !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchEvents()} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-2 h-3.5 w-3.5" />}
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={clearEvents} disabled={clearing || events.length === 0}>
            {clearing ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-2 h-3.5 w-3.5" />}
            Clear
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-8" />
              <TableHead>Received At</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Sender Phone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Inbox className="h-8 w-8" />
                    <p className="text-sm">No events received yet.</p>
                    <p className="text-xs">Subscribe to a webhook and trigger a transaction.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              events.map((event, i) => (
                <>
                  <TableRow
                    key={event.id}
                    className={`cursor-pointer hover:bg-muted/50 ${i % 2 === 1 ? "bg-muted/20" : ""}`}
                    onClick={() => toggleExpand(event.id)}
                  >
                    <TableCell className="text-muted-foreground">
                      {expanded.has(event.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {new Date(event.receivedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <TopicBadge topic={event.topic} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{event.senderPhone}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                        {event.status}
                      </span>
                    </TableCell>
                  </TableRow>

                  {expanded.has(event.id) && (
                    <TableRow key={`${event.id}-payload`}>
                      <TableCell colSpan={5} className="bg-muted/30 p-0">
                        <pre className="overflow-auto p-4 text-xs max-h-72">
                          {JSON.stringify(event.payload, null, 2)}
                        </pre>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
