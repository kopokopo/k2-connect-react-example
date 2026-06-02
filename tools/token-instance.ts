import axios from "axios";
import k2 from "@/lib/k2-client";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getValidToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const { access_token, expires_in } = await k2.TokenService.getToken();
  cachedToken = access_token;
  tokenExpiresAt = Date.now() + (expires_in - 60) * 1000;

  return cachedToken;
}

const k2Request = axios.create({
  baseURL: process.env.K2_BASE_URL,
});

k2Request.interceptors.request.use(async (config) => {
  const token = await getValidToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default k2Request;
