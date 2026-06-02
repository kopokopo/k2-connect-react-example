![Komiks app - K2 Connect integration](./komik.png)

# Komiks KE

Kenya's home for African comic books — a full-stack Next.js demo that integrates [K2 Connect](https://developer.kopokopo.com) (powered by Kopo Kopo) to process payments. It demonstrates STK push, payment links, send money, and real-time webhook handling.

## What It Does

The app is a fictional comic book store. The store pages are the canvas. The real point is the K2 Connect integration wired up in the background:

- **STK Push** — prompt a customer's phone to complete an M-Pesa payment instantly
- **Payment Links** — generate a shareable M-Pesa payment URL the customer pays at their convenience
- **Send Money** — disburse funds to a mobile wallet, till number, or paybill
- **Webhooks** — subscribe to K2 events and inspect received payloads in real time

Every API interaction calls the official `k2-connect-node` SDK. The frontend shows forms, results, and status checks for each flow.

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **k2-connect-node 2.0.0** — KopoKopo's official Node.js SDK
- **React 19**, **Tailwind CSS 4**, **shadcn/ui**
- **Sonner** for toast notifications, **next-themes** for dark mode

## Prerequisites

- Node.js 18+ (or Bun)
- A [KopoKopo sandbox account](https://app.sandbox.kopokopo.com)
- An ngrok (or similar) tunnel for local webhook development — K2 requires an HTTPS callback URL

## Getting Started

**1. Clone and install dependencies**

```bash
git clone <repo-url>
cd k2-connect-react
npm install
```

**2. Create your environment file**

```bash
cp .env.example .env.local
```

Then fill in the values (see Environment Variables below).

**3. Start the development server**

```bash
npm run dev
```

Open <http://localhost:3000>.

## Environment Variables

Create a `.env.local` file in the project root with the following:

```
K2_CLIENT_ID=
K2_CLIENT_SECRET=
K2_API_KEY=
K2_BASE_URL=https://sandbox.kopokopo.com
K2_TILL_NUMBER=
K2_CALLBACK_URL=
NEXT_PUBLIC_CALLBACK_URL=
```

| Variable                   | Where to get it                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| `K2_CLIENT_ID`             | KopoKopo dashboard → App credentials                                                               |
| `K2_CLIENT_SECRET`         | KopoKopo dashboard → App credentials                                                               |
| `K2_API_KEY`               | KopoKopo dashboard → App credentials (used to verify webhook signatures)                           |
| `K2_BASE_URL`              | Use `https://sandbox.kopokopo.com` for sandbox                                                     |
| `K2_TILL_NUMBER`           | Your sandbox till number                                                                           |
| `K2_CALLBACK_URL`          | Your ngrok HTTPS URL + `/api/webhooks/handler` e.g. `https://abc123.ngrok.io/api/webhooks/handler` |
| `NEXT_PUBLIC_CALLBACK_URL` | Same ngrok URL (exposed to the browser for pre-filling webhook forms)                              |

## Project Structure

```
app/
  page.tsx                   # Comic store home
  stk/page.tsx               # STK Push demo
  payment-links/page.tsx     # Payment Links demo
  send-money/page.tsx        # Send Money demo
  webhooks/page.tsx          # Webhook subscription + live event viewer

  api/
    auth/token/              # GET  — fetch K2 access token
    stk/                     # POST — initiate STK push
    stk/status/              # GET  — check STK push status
    payment-links/           # POST — create payment link
    payment-links/status/    # GET  — check payment link status
    send-money/              # POST — send money
    send-money/status/       # GET  — check send money status
    webhooks/subscribe/      # POST — subscribe to a K2 event
    webhooks/handler/        # POST — receives K2 webhook callbacks
    webhooks/events/         # GET / DELETE — read or clear stored events

components/
  store/                     # Comic grid, cards, buy dialog
  stk/                       # STK push form and status display
  payment-links/             # Payment link form and result
  send-money/                # Send money form and status display
  webhooks/                  # Subscribe form, events table, status
  layout/                    # Header, theme provider
  ui/                        # shadcn/ui primitives

lib/
  k2-client.ts               # Initializes the K2 Connect SDK singleton
  comics.ts                  # Hardcoded sample comic data
  format-phone.ts            # Normalizes Kenyan phone numbers to +254 format
  webhook-store.ts           # In-memory store for received webhook events
  api-error.ts               # Error serialization helpers

tools/
  token-instance.ts          # Caches access tokens and creates an axios instance

types/
  k2-connect-node.d.ts       # TypeScript declarations for the SDK
```

## How Each Feature Works

### STK Push

The user enters a phone number and amount. The app calls `POST /api/stk`, which calls `StkService.initiateIncomingPayment()` from the SDK. K2 sends an M-Pesa payment prompt to the customer's phone. The API returns a `location` URL you can poll with `StkService.getStatus(location)`.

Phone numbers in 07xx or 01xx format are automatically normalized to the +254 international format before the request is sent.

### Payment Links

The app calls `POST /api/payment-links`, which calls `PaymentLinkService.createPaymentLink()`. The API returns a URL the merchant can share with their customer. The customer opens the link and pays via M-Pesa at their own convenience.

### Send Money

The app calls `POST /api/send-money`, which calls `SendMoneyService.sendMoney()`. Three destination types are supported:

- **Mobile Wallet** — phone number + mobile network (Safaricom, Airtel, Telkom)
- **Till Number** — destination till account number
- **Paybill** — paybill number + account number

### Webhooks

K2 pushes event notifications to the callback URL you register. The flow has two parts:

**Subscribing** — the app calls `POST /api/webhooks/subscribe`, which calls `Webhooks.subscribe()`. You choose an event type (e.g. `buygoods_transaction_received`), provide a callback URL, and a scope (till or company) with its reference.

**Receiving** — incoming POST requests arrive at `/api/webhooks/handler`. The handler verifies the K2 HMAC-SHA256 signature using `K2_API_KEY` before accepting the payload. Verified events are stored in memory (last 100 events). The Webhooks page polls `GET /api/webhooks/events` every 5 seconds and displays results in a live table.

Supported event types:

- `buygoods_transaction_received`
- `b2b_transaction_received`
- `customer_created`
- `settlement_transfer_completed`
- `m2m_transaction_completed`

### Token Management

`tools/token-instance.ts` wraps the SDK's `TokenService`. It caches the access token in memory and refreshes it 60 seconds before expiry. An axios interceptor attaches the `Authorization: Bearer <token>` header to all outgoing requests automatically.

## Running Webhooks Locally

K2 requires an HTTPS URL for callbacks. During local development, use ngrok:

```bash
ngrok http 3000
```

Copy the `https://` forwarding URL and set it as `K2_CALLBACK_URL` and `NEXT_PUBLIC_CALLBACK_URL` in your `.env.local`. Restart the dev server after changing env variables.

## K2 Connect Node SDK

This project is a reference integration of the [k2-connect-node](https://github.com/kopokopo/k2-connect-node) package. The SDK exposes the following services, all initialized from a single client instance in `lib/k2-client.ts`:

- `TokenService` — OAuth2 access token management
- `StkService` — incoming STK push payments
- `PaymentLinkService` — payment link creation
- `SendMoneyService` — outgoing disbursements
- `Webhooks` — event subscriptions

See the [K2 Connect developer docs](https://developer.kopokopo.com) for the full API reference.

## Available Scripts

```bash
npm run dev       # development server on http://localhost:3000
npm run build     # production build
npm start         # run the production build
npm run lint      # ESLint
```
