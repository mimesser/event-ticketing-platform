import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function getFollowers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getLoginSession(req);

  if (!session) {
    res.status(400).json({ error: "Missing session" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true, followers: true, following: true },
    });

    const followersIds = user?.followers.map((m: any) => m.followingId);

    let followers = await prisma.user.findMany({
      where: {
        id: {
          in: followersIds,
        },
      },
      select: {
        id: true,
        avatarImage: true,
        name: true,
        username: true,
        email: true,
        walletAddress: true,
        showWalletAddress: true,
      },
    });

    followers.forEach((m) => {
      if (m.username && !m.showWalletAddress) {
        m.walletAddress = null;
      }
    });

    res.status(200).json({ followers });
  } catch (error) {
    res.status(500).json({ error });
  }
}
