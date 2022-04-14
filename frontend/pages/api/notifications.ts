import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { isTest } from "lib/utils";
import { NextApiResponse, NextApiRequest } from "next";

export default async function notifications(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getLoginSession(req);
  const { notifications }: any = JSON.parse(req.body);

  if (!session || !notifications) {
    res.status(400).json({ error: "Missing session or notifications object" });
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
}
