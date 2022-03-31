import createHmac from "create-hmac";
import { getLoginSession } from "lib/auth";
import { isProduction } from "lib/utils";
import { NextApiResponse, NextApiRequest } from "next";

const TEST_KEY = process.env.NEXT_PUBLIC_MOONPAY_TEST_KEY;
const SECRET_KEY = process.env.NEXT_PUBLIC_MOONPAY_SECRET_KEY;

export default async function moonpayUrl(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getLoginSession(req);

  if (!session) {
    res.status(400).json({ error: "Missing session" });
    return;
  }

  try {
    if (req.method === "GET") {
      const originalUrl = `https://buy-sandbox.moonpay.com?apiKey=${TEST_KEY}&currencyCode=${
        // todo: should be MATIC_POLYGON in production, but would need to turn off Test Mode on MoonPay
        isProduction ? "ETH" : "ETH"
      }&walletAddress=${session.walletAddress}&email=${encodeURIComponent(
        session.email
      )}`;

      const signature = createHmac("sha256", `${SECRET_KEY}`)
        .update(new URL(originalUrl).search)
        .digest("base64");

      const urlWithSignature = `${originalUrl}&signature=${encodeURIComponent(
        signature
      )}`;

      res.status(200).json({ urlWithSignature: urlWithSignature });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
