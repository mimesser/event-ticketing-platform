import createHmac from "create-hmac";
import { isProduction } from "lib/utils";

const TEST_KEY = process.env.NEXT_PUBLIC_MOONPAY_TEST_KEY;
const SECRET_KEY = process.env.NEXT_PUBLIC_MOONPAY_SECRET_KEY;

export const moonPaySrc = (walletAddress: any, email: string) => {
  const originalUrl = `https://buy-sandbox.moonpay.com?apiKey=${TEST_KEY}&currencyCode=${
    isProduction ? "MATIC" : "ETH"
  }&walletAddress=${walletAddress}&email=${encodeURIComponent(email)}`;

  const signature = createHmac("sha256", `${SECRET_KEY}`)
    .update(new URL(originalUrl).search)
    .digest("base64");

  const urlWithSignature = `${originalUrl}&signature=${encodeURIComponent(
    signature
  )}`;

  return urlWithSignature;
};
