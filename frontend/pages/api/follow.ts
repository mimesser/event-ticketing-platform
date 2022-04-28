import { differenceInHours } from "date-fns";
import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function follow(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST" && req.method !== "DELETE") {
      res.status(400).json({ error: "Wrong method! Only POST or DELETE" });
      return;
    }

    const session = await getLoginSession(req);

    if (!session) {
      res.status(400).json({ error: "Missing session" });
      return;
    }

    if (!req.body) {
      res.status(400).json({ error: "Missing request body" });
      return;
    }

    const { follow } = JSON.parse(req.body);

    if (!follow) {
      res.status(400).json({
        error: "Missing follow in request body",
      });
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
              : user!.walletAddress;

            follow.map(async (m) => {
              const lastNotification = await prisma.notification.findFirst({
                where: {
                  userId: m,
                  followerUserId: user!.id,
                },
                orderBy: {
                  createdAt: "desc",
                },
              });

              const followedBack = await prisma.follows.findUnique({
                where: {
                  followersId_followingId: {
                    followersId: user!.id,
                    followingId: m,
                  },
                },
                select: {
                  createdAt: true,
                },
              });

              // If user follow back within 48 hours, send "followed you back" notification
              const description =
                differenceInHours(
                  new Date(),
                  new Date(followedBack?.createdAt as any)
                ) <= 48
                  ? "followed you back"
                  : "followed you";

              // If user received same notification within 24 hours, do not send notification again
              if (
                differenceInHours(
                  new Date(),
                  new Date(lastNotification?.createdAt as any)
                ) >= 24 ||
                lastNotification === null
              ) {
                await prisma.notification.create({
                  data: {
                    followerUserId: user!.id,
                    description: description,
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
