import { getLoginSession } from "../../../lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";

export default async function follow(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { follow }: any = JSON.parse(req.body);
  const session = await getLoginSession(req);

  if (!session || !follow) {
    res.status(400).json({ error: "Missing session or follow object" });
    return;
  }

  if (
    !Array.isArray(follow) ||
    !follow.every((id: any) => typeof id === "number")
  ) {
    res
      .status(400)
      .json({ error: "Wrong type for follow, only number objects" });
    return;
  }

  try {
    const userId = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });

    if (req.method === "POST") {
      try {
        var data = follow.map((m) => ({
          followingId: userId!.id,
          followersId: m,
        }));

        await prisma.follows.createMany({
          data,
          skipDuplicates: true,
        });

        res.status(200).json({ status: "follow success" });
      } catch (e) {
        res.status(500).json({ e });
      }
    }

    if (req.method === "DELETE") {
      try {
        await prisma.follows.delete({
          where: {
            followersId_followingId: {
              followersId: follow[0],
              followingId: userId!.id,
            },
          },
        });

        res.status(200).json({ status: "unfollow success" });
      } catch (e) {
        res.status(500).json({ e });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
