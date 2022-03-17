import { getLoginSession } from "lib/auth";
import prisma from "lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";

export default async function notifications(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getLoginSession(req);

  if (!session) {
    res.status(400).json({ error: "Missing session" });
    return;
  }

  if (req.method === "DELETE") {
    const userId: any = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });

    try {
      await prisma.notification.updateMany({
        where: {
          userId: {
            equals: userId.id,
          },
        },
        data: {
          isRead: true,
        },
      });

      res.status(200).json({ status: "Mark notificatons as read success" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
