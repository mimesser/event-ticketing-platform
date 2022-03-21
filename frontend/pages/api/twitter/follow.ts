import { differenceInHours } from "date-fns";
import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { shortenAddress } from "lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

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
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        avatarImage: true,
        name: true,
        username: true,
        walletAddress: true,
      },
    });

    if (req.method === "POST") {
      try {
        const data = follow.map((m) => ({
          followingId: user!.id,
          followersId: m,
        }));

        await prisma.follows.createMany({
          data,
          skipDuplicates: true,
        });

        if (res.status(200)) {
          try {
            const title = user!.name
              ? user!.name
              : user!.username
              ? `@${user!.username}`
              : shortenAddress(user!.walletAddress as string);

            follow.map(async (m) => {
              const lastNotification = await prisma.notification.findFirst({
                where: {
                  userId: m,
                  title: title,
                },
                orderBy: {
                  createdAt: "desc",
                },
              });

              if (
                differenceInHours(
                  new Date(),
                  new Date(lastNotification?.createdAt as any)
                ) >= 24 ||
                lastNotification === null
              ) {
                await prisma.notification.create({
                  data: {
                    description: "followed you",
                    userId: m,
                    title: title,
                  },
                });
              }
            });
          } catch (e) {
            res.status(500).json({ e });
          }
        }

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
              followingId: user!.id,
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
