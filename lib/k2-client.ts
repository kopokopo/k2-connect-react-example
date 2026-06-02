import K2 from "k2-connect-node";

const k2 = K2({
  clientId: process.env.K2_CLIENT_ID!,
  clientSecret: process.env.K2_CLIENT_SECRET!,
  apiKey: process.env.K2_API_KEY!,
  baseUrl: process.env.K2_BASE_URL!,
});

export default k2;
