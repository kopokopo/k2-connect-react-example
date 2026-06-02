export interface WebhookEvent {
  id: string;
  receivedAt: string;
  topic: string;
  eventType: string;
  status: string;
  senderPhone: string;
  payload: Record<string, unknown>;
}

const MAX_EVENTS = 100;

// Use global to survive Next.js HMR module reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __webhookEvents: WebhookEvent[] | undefined;
}
if (!global.__webhookEvents) global.__webhookEvents = [];
const events = global.__webhookEvents;

export function addWebhookEvent(payload: Record<string, unknown>): WebhookEvent {
  const attrs = ((payload?.data as Record<string, unknown>)?.attributes as Record<string, unknown>) ?? {};
  const eventObj = (attrs?.event as Record<string, unknown>) ?? {};
  const resource = (eventObj?.resource as Record<string, unknown>) ?? {};

  const topic =
    (payload?.topic as string) ||
    (eventObj?.type as string) ||
    ((payload?.data as Record<string, unknown>)?.type as string) ||
    "unknown";

  const event: WebhookEvent = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    topic,
    eventType: (eventObj?.type as string) ?? "—",
    status: (attrs?.status as string) ?? (resource?.status as string) ?? "—",
    senderPhone: (resource?.sender_phone_number as string) ?? "—",
    payload,
  };
  events.unshift(event);
  if (events.length > MAX_EVENTS) events.pop();
  return event;
}

export function getWebhookEvents(): WebhookEvent[] {
  return events;
}

export function clearWebhookEvents(): void {
  events.length = 0;
}
