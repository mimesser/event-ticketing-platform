import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { isTest } from "lib/utils";
import { NextApiResponse, NextApiRequest } from "next";

export default async function notifications(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "DELETE") {
      res.status(400).json({ error: "Wrong method! Only DELETE" });
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

    const { notifications } = JSON.parse(req.body);

    if (!notifications) {
      res
        .status(400)
        .json({ error: "Missing notifications object in request body" });
      return;
    }

    if (
      !Array.isArray(notifications) ||
      !notifications.every((id: any) => typeof id === "number")
    ) {
      res
        .status(400)
        .json({ error: "Wrong type for notifications, only number objects" });
      return;
    }

    if (req.method === "DELETE") {
      const userId: any = await prisma.user.findUnique({
        where: { email: session.email },
        select: { id: true },
      });

      try {
        await prisma.notification.updateMany({
          where: { id: { in: notifications }, userId: userId.id },

          data: {
            isRead: true,
          },
        });

        if (isTest) {
          await prisma.notification.updateMany({
            where: { id: { in: notifications }, userId: userId.id },

            data: {
              isRead: false,
            },
          });
        }

        res.status(200).json({ status: "Mark notificatons as read success" });
      } catch (error) {
        res.status(500).json({ error });
      }
    }
  } catch (e) {
    res.status(500).json({ e });
  }
}
