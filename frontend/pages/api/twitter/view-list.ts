import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";

export default async function viewList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id }: any = JSON.parse(req.body);

  try {
    if (req.method === "POST") {
      try {
        const user = await prisma.user.findUnique({
          where: { id: Number(id) },
          select: { id: true, followers: true, following: true },
        });

        const followersIds = user?.followers.map((m: any) => m.followingId);

        const followers = await prisma.user.findMany({
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
            walletAddress: true,
          },
        });

        const followingIds = user?.following.map((m: any) => m.followersId);

        const following = await prisma.user.findMany({
          where: {
            id: {
              in: followingIds,
            },
          },
          select: {
            id: true,
            avatarImage: true,
            name: true,
            username: true,
            walletAddress: true,
          },
        });

        res.status(200).json({ followers, following });
      } catch (e) {
        res.status(500).json({ e });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
