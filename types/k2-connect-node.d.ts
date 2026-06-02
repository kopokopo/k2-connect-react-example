declare module "k2-connect-node" {
  interface K2Options {
    clientId: string;
    clientSecret: string;
    apiKey: string;
    baseUrl: string;
  }

  interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
  }

  interface TokenService {
    getToken(): Promise<TokenResponse>;
    revokeToken(opts: { accessToken: string }): Promise<void>;
    introspectToken(opts: { accessToken: string }): Promise<unknown>;
    infoToken(opts: { accessToken: string }): Promise<unknown>;
  }

  interface StkOpts {
    tillNumber: string;
    phoneNumber: string;
    currency: string;
    amount: number | string;
    callbackUrl: string;
    accessToken: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    paymentChannel?: string;
    metadata?: Record<string, string>;
  }

  interface StkService {
    initiateIncomingPayment(opts: StkOpts): Promise<string>;
    getStatus(opts: { location: string; accessToken: string }): Promise<unknown>;
  }

  interface MobileWalletDestination {
    type: "mobile_wallet";
    phone_number: string;
    network: string;
    amount: number;
    nickname?: string;
    description?: string;
  }

  interface TillDestination {
    type: "till";
    till_number: string;
    amount: number;
    nickname?: string;
    description?: string;
  }

  interface PaybillDestination {
    type: "paybill";
    paybill_number: string;
    paybill_account_number: string;
    amount: number;
    nickname?: string;
    description?: string;
  }

  interface BankAccountDestination {
    type: "bank_account";
    bank_branch_ref: string;
    account_name: string;
    account_number: string;
    amount: number;
    nickname?: string;
    description?: string;
  }

  type Destination =
    | MobileWalletDestination
    | TillDestination
    | PaybillDestination
    | BankAccountDestination;

  interface SendMoneyOpts {
    sourceIdentifier: string;
    currency: string;
    destinations: Destination[];
    callbackUrl: string;
    accessToken: string;
    metadata?: Record<string, string>;
  }

  interface SendMoneyService {
    sendMoney(opts: SendMoneyOpts): Promise<string>;
    getStatus(opts: { location: string; accessToken: string }): Promise<unknown>;
  }

  interface PaymentLinkOpts {
    amount: number;
    currency: string;
    tillNumber: string;
    callbackUrl: string;
    accessToken: string;
    paymentReference?: string;
    note?: string;
    metadata?: Record<string, string>;
  }

  interface PaymentLinkService {
    createPaymentLink(opts: PaymentLinkOpts): Promise<string>;
    getStatus(opts: { location: string; accessToken: string }): Promise<unknown>;
    cancelPaymentLink(opts: { location: string; accessToken: string }): Promise<unknown>;
  }

  interface WebhookSubscribeOpts {
    eventType: string;
    url: string;
    scope: string;
    scopeReference: string;
    accessToken: string;
    enableDarajaPayload?: boolean;
  }

  interface Webhooks {
    subscribe(opts: WebhookSubscribeOpts): Promise<string>;
    getStatus(opts: { location: string; accessToken: string }): Promise<unknown>;
    webhookHandler(req: unknown, res: unknown): Promise<unknown>;
  }

  interface K2Instance {
    TokenService: TokenService;
    StkService: StkService;
    SendMoneyService: SendMoneyService;
    PaymentLinkService: PaymentLinkService;
    Webhooks: Webhooks;
  }

  function K2(options: K2Options): K2Instance;
  export = K2;
}
