import { getLoginSession } from "../../lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

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
        followers: true,
        following: true,
      },
    });

    res.status(200).json({ user: user || null });
  } catch (e) {
    res.status(500).send({ e });
  }
}
