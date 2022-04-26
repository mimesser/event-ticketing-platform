import { getLoginSession } from "../../lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { isProduction } from "lib/utils";
import createHmac from "create-hmac";

const TEST_KEY = process.env.NEXT_PUBLIC_MOONPAY_TEST_KEY;
const SECRET_KEY = process.env.NEXT_PUBLIC_MOONPAY_SECRET_KEY;

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getLoginSession(req);
    // After getting the session you may want to fetch for the user instead
    // of sending the session's payload directly

    if (!session) {
      res.status(200).json({ user: null });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        email: true,
        username: true,
        walletAddress: true,
        issuer: true,
        name: true,
        twitterUsername: true,
        showWalletAddress: true,
        avatarImage: true,
        bannerImage: true,
        nativeAssetBalance: true,
        createdAt: true,
        updatedAt: true,
        notifications: true,
        followers: true,
        following: true,
      },
    });

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

    if (user?.id) {
      Object.assign(user, { moonpayUrl: urlWithSignature });
    }

    res.status(200).json({ user: user || null });
  } catch (e) {
    console.log("error", e);
    res.status(500).send({ e });
  }
}
